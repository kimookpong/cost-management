import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

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

export async function GET(req) {
  try {
    const data = await executeQuery(
      `SELECT USR.PERSON_ID,
      PERSON.TITLE_NAME || PERSON.FIRST_NAME || ' ' || PERSON.LAST_NAME AS FULLNAME,
      PERSON.POSITION_TH_NAME AS POSITION
      FROM CST_USER USR
      INNER JOIN PBL_VPER_PERSON PERSON
        ON USR.PERSON_ID = PERSON.PERSON_ID
      WHERE USR.FLAG_DEL = 0
      `,
      {}
    );
    return NextResponse.json({ success: true, data: data });
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
    const { labId, personId, roleId, userId } = body;

    const labcourseUserId = await executeQuery(
      `SELECT CST_LABCOURSE_USER_SEQ.NEXTVAL AS ID FROM DUAL`
    );

    const data = await executeQuery(
      `INSERT INTO CST_LABCOURSE_USER (LABCOURSE_USER_ID, LAB_ID, PERSON_ID, ROLE_ID, DATE_CREATED, USER_CREATED)
      VALUES (:labcourseUserId,:labId, :personId, :roleId, SYSDATE, :userCreated)`,
      {
        labcourseUserId: labcourseUserId[0].id,
        labId,
        personId,
        roleId,
        userCreated: userId,
      }
    );
    return NextResponse.json({
      success: true,
      data: data,
      labcourseUserId: labcourseUserId[0].id,
      courseUser: await courseUser(labId),
    });
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
    const { personId, roleId, userId, labId } = body;

    const data = await executeQuery(
      `UPDATE CST_LABCOURSE_USER SET PERSON_ID = :personId, ROLE_ID = :roleId, DATE_UPDATED = SYSDATE,USER_UPDATED = :userId WHERE LABCOURSE_USER_ID = :id`,
      {
        id,
        personId,
        roleId,
        userId,
      }
    );
    return NextResponse.json({
      success: true,
      data: data,
      courseUser: await courseUser(labId),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const labId = req.nextUrl.searchParams.get("labId");

    const data = await executeQuery(
      `UPDATE CST_LABCOURSE_USER SET FLAG_DEL = 1 WHERE LABCOURSE_USER_ID = :id`,
      { id }
    );
    return NextResponse.json({
      success: true,
      data: data,
      courseUser: await courseUser(labId),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
