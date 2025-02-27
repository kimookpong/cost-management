import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

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

async function getUser() {
  return await executeQuery(
    `SELECT ADMIN.PERSON_ID, 
      PERSON.TITLE_NAME || PERSON.FIRST_NAME || ' ' || PERSON.LAST_NAME AS FULLNAME,
      ROLE.ROLE_NAME
    FROM CST_USER ADMIN
    INNER JOIN PBL_VPER_PERSON PERSON 
      ON ADMIN.PERSON_ID = PERSON.PERSON_ID
    INNER JOIN CST_ROLE ROLE 
      ON ADMIN.ROLE = ROLE.ROLE_ID
    WHERE ADMIN.FLAG_DEL = 0
    ORDER BY PERSON.FIRST_NAME ASC`
  );
}

async function getClass(courseId, schId) {
  return await executeQuery(
    `SELECT CLASS.CLASSID, CLASS.ACADYEAR, CLASS.SEMESTER, CLASS.SECTION, CLASS.TOTALSEAT, CLASS.CLASSNOTE
    FROM PBL_AVSREGCLASS_V CLASS 
    INNER JOIN CST_SCHYEAR SCH ON SCH.SCH_ID = :schId
      AND SCH.STATUS = 1
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

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const courseId = req.nextUrl.searchParams.get("courseId");
    const schId = req.nextUrl.searchParams.get("schId");

    const users = await getUser();
    const labgroup = await getLabgroup();

    if (id) {
      const data = await executeQuery(
        `SELECT * FROM CST_ROLE WHERE ROLE_ID = :id`,
        { id }
      );

      return NextResponse.json({
        success: true,
        data: {
          ...users[0],
          roleAccess: JSON.parse(data[0].roleAccess),
        },
      });
    } else if (!courseId) {
      const data = await executeQuery(
        `SELECT * FROM CST_LABCOURSE WHERE FLAG_DEL = 0`
      );
      return NextResponse.json({
        success: true,
        data: data,
      });
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

export async function POST(req) {
  try {
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
      userCreated,
    } = body;

    if (
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
      !userCreated
    ) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      `INSERT INTO CST_LABCOURSE
        (ACADYEAR, COURSEID, HOUR, LABGROUP_ID, LABGROUP_NUM, LABROOM, SCH_ID, SECTION, SEMESTER, PERSON_ID, DATE_CREATED, USER_CREATED)
      VALUES
        (:acadyear, :courseid, :hour, :labgroupId, :labgroupNum, :labroom, :schId, :section, :semester, :personId, SYSDATE, :userCreated)`,
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
        userCreated,
      }
    );
    return NextResponse.json(
      { success: true, message: "User added successfully" },
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
    const { roleName, roleAccess, statusId } = body;

    if (!id || !roleName || !roleAccess || !statusId) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      `UPDATE CST_ROLE 
       SET ROLE_NAME = :roleName, ROLE_ACCESS = :roleAccess, STATUS_ID = :statusId 
       WHERE ROLE_ID = :id`,
      [roleName, JSON.stringify(roleAccess), statusId, id]
    );

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
    const users = await executeQuery(
      `UPDATE CST_ROLE SET FLAG_DEL = 1 WHERE ROLE_ID = :id`,
      { id }
    );
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
