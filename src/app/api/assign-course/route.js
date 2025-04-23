import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

async function getSemester() {
  return await executeQuery(
    `SELECT SCH_ID, ACADYEAR, SEMESTER 
    FROM CST_SCHYEAR 
    WHERE FLAG_DEL = 0 
    ORDER BY ACADYEAR DESC, SEMESTER DESC`
  );
}

async function getCourse(courseId) {
  return await executeQuery(
    `SELECT COURSE.COURSEID,COURSE.FACULTYID, FAC.FACULTYNAME, COURSE.COURSECODE, COURSE.COURSENAME, COURSE.DESCRIPTION1
    FROM PBL_AVSREGCOURSE_V COURSE 
    INNER JOIN PBL_FACULTY_V FAC ON COURSE.FACULTYID = FAC.FACULTYID
    WHERE COURSE.COURSEID = :courseId`,
    {
      courseId,
    }
  );
}

async function getLabgroup() {
  return await executeQuery(
    `SELECT LABGROUP_ID, LABGROUP_NAME
    FROM CST_LABGROUP 
    WHERE FLAG_DEL = 0
    ORDER BY LABGROUP_NAME ASC`
  );
}

async function courseUser(id) {
  return await executeQuery(
    `SELECT USR.LABCOURSE_USER_ID,USR.PERSON_ID,USR.ROLE_ID,
    PERSON.TITLE_NAME || PERSON.FIRST_NAME || ' ' || PERSON.LAST_NAME AS FULLNAME
    FROM CST_LABCOURSE_USER USR
    INNER JOIN PBL_VPER_PERSON PERSON
      ON USR.PERSON_ID = PERSON.PERSON_ID
    WHERE USR.FLAG_DEL = 0
    AND USR.LAB_ID = :id
    ORDER BY USR.ROLE_ID ASC`,
    { id }
  );
}

async function getUser() {
  return await executeQuery(
    `SELECT ADMIN.PERSON_ID, 
      PERSON.TITLE_NAME || PERSON.FIRST_NAME || ' ' || PERSON.LAST_NAME AS FULLNAME,
      ROLE.ROLE_NAME,
      ADMIN.LABGROUP_ID,
      LABGROUP.LABGROUP_NAME
    FROM CST_USER ADMIN
    INNER JOIN PBL_VPER_PERSON PERSON 
      ON ADMIN.PERSON_ID = PERSON.PERSON_ID
    INNER JOIN CST_ROLE ROLE 
      ON ADMIN.ROLE = ROLE.ROLE_ID
    INNER JOIN CST_LABGROUP LABGROUP
      ON ADMIN.LABGROUP_ID = LABGROUP.LABGROUP_ID
    WHERE ADMIN.FLAG_DEL = 0
    ORDER BY PERSON.FIRST_NAME ASC`
  );
}

async function getClass(courseId, schId) {
  return await executeQuery(
    `SELECT CLASS.CLASSID, CLASS.ACADYEAR, CLASS.SEMESTER, CLASS.SECTION, CLASS.TOTALSEAT, CLASS.CLASSNOTE
    FROM PBL_AVSREGCLASS_V CLASS 
    INNER JOIN CST_SCHYEAR SCH ON SCH.SCH_ID = :schId
      AND SCH.FLAG_DEL = 0
      AND CLASS.ACADYEAR = SCH.ACADYEAR
      AND CLASS.SEMESTER = SCH.SEMESTER
    WHERE CLASS.COURSEID = :courseId
    ORDER BY CLASS.SECTION ASC`,
    {
      courseId,
      schId,
    }
  );
}

const saveCourseUser = async (courseUser, id) => {
  if (courseUser) {
    await executeQuery(`DELETE FROM CST_LABCOURSE_USER WHERE LAB_ID = :id`, {
      id,
    });

    courseUser.map(async (user) => {
      await executeQuery(
        `INSERT INTO CST_LABCOURSE_USER (LAB_ID, PERSON_ID, ROLE_ID, DATE_CREATED, USER_CREATED)
        VALUES (:id, :personId, :roleId, SYSDATE, :userCreated)`,
        {
          id,
          personId: user.personId,
          roleId: user.roleId,
          userCreated: user.userId,
        }
      );
    });
  }
};

const saveLabasset = async (labasset, id) => {
  if (labasset) {
    await executeQuery(`DELETE FROM CST_LABCOURSE_ASSET WHERE LAB_ID = :id`, {
      id,
    });

    labasset.type1.map(async (asset) => {
      await executeQuery(
        `INSERT INTO CST_LABCOURSE_ASSET (LAB_ID, ASSET_ID, AMOUNT,ASSET_REMARK, DATE_CREATED, USER_CREATED)
        VALUES (:id, :assetId, :amount,:assetRemark, SYSDATE, :userCreated)`,
        {
          id,
          assetId: asset.assetId,
          amount: asset.amount,
          assetRemark: asset.assetRemark,
          userCreated: asset.userId,
        }
      );
    });

    labasset.type2.map(async (asset) => {
      await executeQuery(
        `INSERT INTO CST_LABCOURSE_ASSET (LAB_ID, ASSET_ID, AMOUNT,ASSET_REMARK, DATE_CREATED, USER_CREATED)
        VALUES (:id, :assetId, :amount,:assetRemark, SYSDATE, :userCreated)`,
        {
          id,
          assetId: asset.assetId,
          amount: asset.amount,
          assetRemark: asset.assetRemark,
          userCreated: asset.userId,
        }
      );
    });

    labasset.type3.map(async (asset) => {
      await executeQuery(
        `INSERT INTO CST_LABCOURSE_ASSET (LAB_ID, ASSET_ID, AMOUNT,ASSET_REMARK, DATE_CREATED, USER_CREATED)
        VALUES (:id, :assetId, :amount,:assetRemark, SYSDATE, :userCreated)`,
        {
          id,
          assetId: asset.assetId,
          amount: asset.amount,
          assetRemark: asset.assetRemark,
          userCreated: asset.userId,
        }
      );
    });
  }
};

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const courseId = req.nextUrl.searchParams.get("courseId");
    const schId = req.nextUrl.searchParams.get("schId");
    const labgroupId = req.nextUrl.searchParams.get("labgroupId");

    const users = await getUser();
    const labgroup = await getLabgroup();

    if (id) {
      const data = await executeQuery(
        `SELECT * FROM CST_LABCOURSE WHERE LAB_ID = :id`,
        { id }
      );

      const labasset = await executeQuery(
        `SELECT ASSET.LABASSET_ID,ASSET.ASSET_ID, ASSET.AMOUNT, ASSET.ASSET_REMARK, 
        INV.ASSET_NAME_TH,
        BRAND.BRAND_NAME,
        INV.AMOUNT_UNIT,
        UNIT.UNIT_NAME,
        GRP.INVGROUP_NAME,
        INV.INVTYPE_ID AS TYPE
        FROM CST_LABCOURSE_ASSET ASSET
        INNER JOIN CST_INVASSET INV
          ON ASSET.ASSET_ID = INV.ASSET_ID
        INNER JOIN CST_INVGROUP GRP 
          ON INV.INVGROUP_ID = GRP.INVGROUP_ID
        INNER JOIN CST_INVUNIT UNIT 
          ON INV.UNIT_ID = UNIT.UNIT_ID
        INNER JOIN CST_INVBRAND BRAND
          ON INV.BRAND_ID = BRAND.BRAND_ID
        WHERE ASSET.LAB_ID = :id`,
        { id }
      );

      const course = await getCourse(data[0].courseid);
      const classData = await getClass(data[0].courseid, data[0].schId);

      return NextResponse.json({
        success: true,
        data: data[0],
        course: course?.[0],
        class: classData,
        users: users,
        labgroup: labgroup,
        labasset: labasset,
        courseUser: await courseUser(id),
      });
    } else if (!courseId) {
      if (!schId) {
        const data = await executeQuery(
          `SELECT LAB.LAB_ID, 
          MAX(FAC.FACULTYNAME) AS FACULTYNAME, 
          MAX(LAB.ACADYEAR) AS ACADYEAR,
          MAX(LABGROUP.LABGROUP_NAME) AS LABGROUP_NAME,
          MAX(LAB.SEMESTER) AS SEMESTER, 
          MAX(COURSE.COURSECODE) AS COURSECODE, 
          MAX(COURSE.COURSENAME) AS COURSENAME, 
          MAX(LAB.PERSON_ID) AS PERSON_ID, 
          MAX(PERSON.TITLE_NAME || PERSON.FIRST_NAME || ' ' || PERSON.LAST_NAME) AS FULLNAME, 
          MAX(LAB.LABROOM) AS LABROOM,
          COUNT(REG.CLASSID) AS SECTION,
          SUM(REG.TOTALSEAT) AS TOTALSEAT,
          SUM(REG.ENROLLSEAT) AS ENROLLSEAT
        FROM CST_LABCOURSE LAB 
        INNER JOIN PBL_AVSREGCOURSE_V COURSE
            ON COURSE.COURSEID = LAB.COURSEID
        LEFT JOIN PBL_AVSREGCLASS_V REG
            ON REG.COURSEID = LAB.COURSEID
        LEFT JOIN CST_LABGROUP LABGROUP
            ON LAB.LABGROUP_ID = LABGROUP.LABGROUP_ID
        LEFT JOIN PBL_VPER_PERSON PERSON 
            ON LAB.PERSON_ID = PERSON.PERSON_ID
        LEFT JOIN PBL_FACULTY_V FAC 
            ON COURSE.FACULTYID = FAC.FACULTYID
        WHERE LAB.FLAG_DEL = 0
        GROUP BY LAB.LAB_ID
        ORDER BY MAX(LAB.ACADYEAR) DESC, MAX(LAB.SEMESTER) DESC`
        );
        const semester = await getSemester();
        const labgroup = await getLabgroup();
        return NextResponse.json({
          success: true,
          data: data,
          semester: semester,
          labgroup: labgroup,
        });
      } else {
        let data;
        if (labgroupId) {
          data = await executeQuery(
            `SELECT LAB.LAB_ID, 
          MAX(FAC.FACULTYNAME) AS FACULTYNAME, 
          MAX(LAB.ACADYEAR) AS ACADYEAR,
          MAX(LABGROUP.LABGROUP_NAME) AS LABGROUP_NAME,
          MAX(LAB.SEMESTER) AS SEMESTER, 
          MAX(COURSE.COURSECODE) AS COURSECODE, 
          MAX(COURSE.COURSENAME) AS COURSENAME, 
          MAX(LAB.PERSON_ID) AS PERSON_ID, 
          MAX(PERSON.TITLE_NAME || PERSON.FIRST_NAME || ' ' || PERSON.LAST_NAME) AS FULLNAME, 
          MAX(LAB.LABROOM) AS LABROOM,
          COUNT(REG.CLASSID) AS SECTION,
          SUM(REG.TOTALSEAT) AS TOTALSEAT,
          SUM(REG.ENROLLSEAT) AS ENROLLSEAT
        FROM CST_LABCOURSE LAB 
        INNER JOIN PBL_AVSREGCOURSE_V COURSE
            ON COURSE.COURSEID = LAB.COURSEID
        LEFT JOIN PBL_AVSREGCLASS_V REG
            ON REG.COURSEID = LAB.COURSEID
        LEFT JOIN CST_LABGROUP LABGROUP
            ON LAB.LABGROUP_ID = LABGROUP.LABGROUP_ID
        LEFT JOIN PBL_VPER_PERSON PERSON 
            ON LAB.PERSON_ID = PERSON.PERSON_ID
        LEFT JOIN PBL_FACULTY_V FAC 
            ON COURSE.FACULTYID = FAC.FACULTYID
        INNER JOIN CST_SCHYEAR SCH 
            ON SCH.SCH_ID = :schId
            AND SCH.SEMESTER = LAB.SEMESTER
            AND SCH.ACADYEAR = LAB.ACADYEAR
        WHERE LAB.FLAG_DEL = 0 AND LAB.LABGROUP_ID = :labgroupId
        GROUP BY LAB.LAB_ID
        ORDER BY MAX(LAB.ACADYEAR) DESC, MAX(LAB.SEMESTER) DESC`,
            {
              schId,
              labgroupId,
            }
          );
        } else {
          data = await executeQuery(
            `SELECT LAB.LAB_ID, 
          MAX(FAC.FACULTYNAME) AS FACULTYNAME, 
          MAX(LAB.ACADYEAR) AS ACADYEAR,
          MAX(LABGROUP.LABGROUP_NAME) AS LABGROUP_NAME,
          MAX(LAB.SEMESTER) AS SEMESTER, 
          MAX(COURSE.COURSECODE) AS COURSECODE, 
          MAX(COURSE.COURSENAME) AS COURSENAME, 
          MAX(LAB.PERSON_ID) AS PERSON_ID, 
          MAX(PERSON.TITLE_NAME || PERSON.FIRST_NAME || ' ' || PERSON.LAST_NAME) AS FULLNAME, 
          MAX(LAB.LABROOM) AS LABROOM,
          COUNT(REG.CLASSID) AS SECTION,
          SUM(REG.TOTALSEAT) AS TOTALSEAT,
          SUM(REG.ENROLLSEAT) AS ENROLLSEAT
        FROM CST_LABCOURSE LAB 
        INNER JOIN PBL_AVSREGCOURSE_V COURSE
            ON COURSE.COURSEID = LAB.COURSEID
        LEFT JOIN PBL_AVSREGCLASS_V REG
            ON REG.COURSEID = LAB.COURSEID
        LEFT JOIN CST_LABGROUP LABGROUP
            ON LAB.LABGROUP_ID = LABGROUP.LABGROUP_ID
        LEFT JOIN PBL_VPER_PERSON PERSON 
            ON LAB.PERSON_ID = PERSON.PERSON_ID
        LEFT JOIN PBL_FACULTY_V FAC 
            ON COURSE.FACULTYID = FAC.FACULTYID
        LEFT JOIN CST_SCHYEAR SCH 
            ON SCH.SCH_ID = :schId
            AND SCH.SEMESTER = LAB.SEMESTER
            AND SCH.ACADYEAR = LAB.ACADYEAR
        WHERE LAB.FLAG_DEL = 0
        GROUP BY LAB.LAB_ID
        ORDER BY MAX(LAB.ACADYEAR) DESC, MAX(LAB.SEMESTER) DESC`,
            {
              schId,
            }
          );
        }

        const semester = await getSemester();
        const labgroup = await getLabgroup();
        return NextResponse.json({
          success: true,
          data: data,
          semester: semester,
          labgroup: labgroup,
        });
      }
    } else {
      const course = await getCourse(courseId);
      const classData = await getClass(courseId, schId);

      return NextResponse.json({
        success: true,
        data: [],
        course: course?.[0],
        class: classData,
        users: users,
        labgroup: labgroup,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const {
//       acadyear,
//       courseid,
//       hour,
//       labgroupId,
//       labgroupNum,
//       labroom,
//       personId,
//       schId,
//       section,
//       semester,
//       userId,
//       labasset,
//       courseUser,
//     } = body;

//     if (
//       !acadyear ||
//       !courseid ||
//       !hour ||
//       !labgroupId ||
//       !labgroupNum ||
//       !labroom ||
//       !personId ||
//       !schId ||
//       !section ||
//       !semester ||
//       !userId
//     ) {
//       return NextResponse.json(
//         { success: false, message: "Missing fields" },
//         { status: 400 }
//       );
//     }

//     const labId = await executeQuery(
//       `SELECT CST_LABCOURSE_SEQ.NEXTVAL AS ID FROM DUAL`
//     );

//     await executeQuery(
//       `INSERT INTO CST_LABCOURSE
//         (LAB_ID, ACADYEAR, COURSEID, HOUR, LABGROUP_ID, LABGROUP_NUM, LABROOM, SCH_ID, SECTION, SEMESTER, PERSON_ID, DATE_CREATED, USER_CREATED, DATE_UPDATED, USER_UPDATED)
//       VALUES
//         (:labId, :acadyear, :courseid, :hour, :labgroupId, :labgroupNum, :labroom, :schId, :section, :semester, :personId, SYSDATE, :userCreated, SYSDATE, :userUpdated)`,
//       {
//         labId: labId[0].id,
//         acadyear,
//         courseid,
//         hour,
//         labgroupId: parseInt(labgroupId),
//         labgroupNum,
//         labroom,
//         schId,
//         section,
//         semester,
//         personId,
//         userCreated: userId,
//         userUpdated: userId,
//       }
//     );

//     await saveLabasset(labasset, labId[0].id);
//     await saveCourseUser(courseUser, labId[0].id);
//     return NextResponse.json(
//       { success: true, message: "User added successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: "Database Error", error },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req) {
  try {
    const body = await req.json();
    const { courseid, schId, userId, acadyear, semester, section } = body;

    if (!courseid || !schId || !userId || !acadyear || !semester || !section) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const labId = await executeQuery(
      `SELECT CST_LABCOURSE_SEQ.NEXTVAL AS ID FROM DUAL`
    );

    await executeQuery(
      `INSERT INTO CST_LABCOURSE
        (LAB_ID, COURSEID, SCH_ID, ACADYEAR, SEMESTER,SECTION, DATE_CREATED, USER_CREATED, DATE_UPDATED, USER_UPDATED)
      VALUES
        (:labId, :courseid, :schId,:acadyear,:semester,:section,  SYSDATE, :userCreated, SYSDATE, :userUpdated)`,
      {
        labId: labId[0].id,
        courseid,
        schId,
        acadyear,
        semester,
        section,
        userCreated: userId,
        userUpdated: userId,
      }
    );
    return NextResponse.json(
      { success: true, message: "User added successfully", labId: labId[0].id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const body = await req.json();
    const {
      acadyear,
      courseid,
      hour,
      labgroupId,
      labgroupNum,
      labroom,
      personId,
      schId,
      section,
      semester,
      userId,
      labasset,
      courseUser,
    } = body;

    if (
      !id ||
      !acadyear ||
      !courseid ||
      !hour ||
      !labgroupId ||
      !labgroupNum ||
      !labroom ||
      !personId ||
      !schId ||
      !section ||
      !semester ||
      !userId
    ) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      `UPDATE CST_LABCOURSE 
       SET ACADYEAR = :acadyear, COURSEID = :courseid, HOUR = :hour, LABGROUP_ID = :labgroupId, LABGROUP_NUM = :labgroupNum, LABROOM = :labroom, SCH_ID = :schId, SECTION = :section, SEMESTER = :semester, PERSON_ID = :personId, DATE_UPDATED = SYSDATE, USER_UPDATED = :userUpdated
       WHERE LAB_ID = :id`,
      {
        acadyear,
        courseid,
        hour,
        labgroupId: parseInt(labgroupId),
        labgroupNum,
        labroom,
        schId,
        section,
        semester,
        personId,
        userUpdated: userId,
        id,
      }
    );

    // await saveLabasset(labasset, id);
    // await saveCourseUser(courseUser, id);

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const body = await req.json();

    const data = await executeQuery(
      `UPDATE CST_LABCOURSE SET FLAG_DEL = 1 WHERE LAB_ID = :id`,
      { id }
    );
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
