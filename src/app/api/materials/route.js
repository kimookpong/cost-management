import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (id) {
      const units = await executeQuery(
        `SELECT * FROM cst_invunit WHERE flag_del = 0 AND UNIT_ID = :id`,
        { id }
      );
      return NextResponse.json({ success: true, data: units });
    } else {
      const units = await executeQuery(
        `SELECT u.*,
       CASE 
           WHEN EXISTS (SELECT 1 FROM CST_INVASSET i WHERE i.UNIT_ID = u.UNIT_ID)              
       THEN 1 ELSE 0 END AS used
        FROM cst_invunit u
        WHERE u.flag_del = 0 ORDER BY u.UNIT_ID DESC`
      );
      return NextResponse.json({ success: true, data: units });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { unitName, status } = await req.json();

    if (!unitName || !status) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      "INSERT INTO cst_invunit (UNIT_NAME, STATUS, FLAG_DEL) VALUES ( :unitName, :status, 0)",
      { unitName, status }
    );

    return NextResponse.json(
      { success: true, message: "Unit added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database Error:", error);
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
    const { unitName, status } = body;

    if (!id || !unitName || !status) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      `UPDATE cst_invunit 
       SET UNIT_NAME = :unitName, STATUS = :status 
       WHERE UNIT_ID = :id`,
      { unitName, status, id }
    );

    return NextResponse.json({
      success: true,
      message: "Unit updated successfully",
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
    await executeQuery(
      `UPDATE cst_invunit SET FLAG_DEL = 1 WHERE UNIT_ID = :id`,
      { id }
    );
    return NextResponse.json({
      success: true,
      message: "Unit deleted successfully",
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
