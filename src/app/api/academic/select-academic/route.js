import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function PUT(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const body = await req.json();
    const { status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      `UPDATE cst_schyear
     SET STATUS = 0, DATE_UPDATED = SYSDATE
     WHERE SCH_ID != :id`,
      { id }
    );

    await executeQuery(
      `UPDATE cst_schyear
     SET STATUS = :status, DATE_UPDATED = SYSDATE
     WHERE SCH_ID = :id`,
      { status, id }
    );

    return NextResponse.json({
      success: true,
      message: { id, status },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
