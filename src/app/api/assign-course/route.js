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

async function getUser() {
  return await executeQuery(`SELECT * FROM CST_USER WHERE FLAG_DEL = 0`, {});
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

    if (id) {
      const users = await executeQuery(
        `SELECT * FROM CST_ROLE WHERE ROLE_ID = :id`,
        { id }
      );

      return NextResponse.json({
        success: true,
        data: {
          ...users[0],
          roleAccess: JSON.parse(users[0].roleAccess),
        },
      });
    } else {
      const course = await getCourse(courseId);
      const classData = await getClass(courseId, schId);
      const users = await getUser();
      return NextResponse.json({
        success: true,
        data: [],
        course: course?.[0],
        class: classData,
        users: users,
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
    const { roleName, roleAccess, statusId } = body;

    if (!roleName || !roleAccess || !statusId) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      "INSERT INTO CST_ROLE (ROLE_NAME, ROLE_ACCESS, STATUS_ID, FLAG_DEL) VALUES (:roleName, :roleAccess, :statusId, 0)",
      [roleName, JSON.stringify(roleAccess), statusId]
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
