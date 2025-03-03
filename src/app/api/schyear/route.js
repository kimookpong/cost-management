import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const currentSemester = await executeQuery(
      `SELECT SCH_ID 
      FROM CST_SCHYEAR 
      WHERE FLAG_DEL = 0 
      AND STATUS = 1
      ORDER BY ACADYEAR DESC, SEMESTER DESC`
    );
    return NextResponse.json({
      success: true,
      data: currentSemester[0].schId,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
