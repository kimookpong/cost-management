import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (id) {
      const brand = await executeQuery(
        `SELECT * FROM cst_schyear WHERE flag_del = 0 AND SCH_ID = :id`,
        { id }
      );
      return NextResponse.json({ success: true, data: brand });
    } else {
      const brand = await executeQuery(
        `SELECT * FROM cst_schyear WHERE flag_del = 0`
      );
      return NextResponse.json({ success: true, data: brand });
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
    const { acadyear, semester, status } = await req.json();

    if (!acadyear || !status || !semester) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      "INSERT INTO cst_schyear (ACADYEAR,SEMESTER, STATUS, FLAG_DEL) VALUES (:acadyear,:semester, :status, '0')",
      { acadyear, semester, status }
    );

    return NextResponse.json(
      { success: true, message: "schyear added successfully" },
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
    const { acadyear, semester, status } = body;

    if (!id || !acadyear || !semester || !status) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      `UPDATE cst_schyear 
       SET ACADYEAR = :acadyear,SEMESTER = :semester ,STATUS = :status 
       WHERE SCH_ID = :id`,
      { acadyear, semester, status, id }
    );

    return NextResponse.json({
      success: true,
      message: "schyear successfully",
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
      `UPDATE cst_schyear SET FLAG_DEL = 1 WHERE SCH_ID = :id`,
      { id }
    );
    return NextResponse.json({
      success: true,
      message: "schyear deleted successfully",
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
