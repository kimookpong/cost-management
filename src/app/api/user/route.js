import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

async function labgroup() {
  return await executeQuery(
    `SELECT USR.PERSON_ID,ROLE_ID,
    PERSON.TITLE_NAME || PERSON.FIRST_NAME || ' ' || PERSON.LAST_NAME AS FULLNAME
    FROM CST_LABCOURSE_USER USR
    INNER JOIN PBL_VPER_PERSON PERSON
      ON USR.PERSON_ID = PERSON.PERSON_ID
    WHERE USR.FLAG_DEL = 0
    AND USR.LAB_ID = :id
    ORDER BY USR.ROLE_ID ASC`,
    {}
  );
}

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const roles = await executeQuery(
      `SELECT ROLE_ID,ROLE_NAME FROM CST_ROLE WHERE FLAG_DEL = 0`
    );

    const labgroup = await executeQuery(
      `SELECT LABGROUP_ID,LABGROUP_NAME FROM CST_LABGROUP WHERE FLAG_DEL = 0`
    );
    if (id == "new") {
      return NextResponse.json({
        success: true,
        role: roles,
        labgroup: labgroup,
      });
    } else if (id) {
      const users = await executeQuery(
        `SELECT * FROM CST_USER WHERE USER_ID = :id`,
        { id }
      );
      return NextResponse.json({
        success: true,
        data: users,
        role: roles,
        labgroup: labgroup,
      });
    } else {
      const users = await executeQuery(
        `SELECT U.USER_ID,
          U.ROLE,
          R.ROLE_NAME,
          U.STATUS_ID,
          P.PERSON_ID,
          P.TITLE_NAME || P.FIRST_NAME || ' ' || P.LAST_NAME AS FULLNAME,
          P.DIVISION_TH_NAME,
          P.POSITION_TH_NAME,
          L.LABGROUP_ID,
          L.LABGROUP_NAME
        FROM CST_USER U
        INNER JOIN PBL_VPER_PERSON P 
          ON U.PERSON_ID = P.PERSON_ID
        INNER JOIN CST_ROLE R
          ON U.ROLE = R.ROLE_ID
        LEFT JOIN CST_LABGROUP L
          ON U.LABGROUP_ID = L.LABGROUP_ID
        WHERE U.FLAG_DEL = 0`
      );
      return NextResponse.json({ success: true, data: users });
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
    const { personId, role, statusId, labgroupId } = body;

    if (!personId || !role || !statusId) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      "INSERT INTO CST_USER (PERSON_ID, ROLE, STATUS_ID, FLAG_DEL, LABGROUP_ID) VALUES (:personId, :role, :statusId, 0, :labgroupId)",
      [personId, role, statusId, labgroupId]
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
    const { personId, role, statusId, labgroupId } = body;

    if (!id || !personId || !role || !statusId) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      `UPDATE CST_USER 
       SET PERSON_ID = :personId, ROLE = :role, STATUS_ID = :statusId, LABGROUP_ID = :labgroupId
       WHERE USER_ID = :id`,
      { personId, role, statusId, labgroupId, id }
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
      `UPDATE CST_USER SET FLAG_DEL = 1 WHERE USER_ID = :id`,
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
