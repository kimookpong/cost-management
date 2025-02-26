import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

async function getSemester() {
  return await executeQuery(
    `SELECT SCH_ID, ACADYEAR, SEMESTER 
    FROM CST_SCHYEAR 
    WHERE FLAG_DEL = 0 
      AND STATUS = 1
    ORDER BY ACADYEAR DESC, SEMESTER DESC`
  );
}

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const term = req.nextUrl.searchParams.get("term");

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
      const termList = await getSemester();
      let data = [];
      if (term) {
        data = await executeQuery(`SELECT * FROM CST_ROLE WHERE FLAG_DEL = 0`);
      }
      return NextResponse.json({ success: true, data: data, term: termList });
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
