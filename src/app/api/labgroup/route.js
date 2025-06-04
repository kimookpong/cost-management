import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (id) {
      const labGroups = await executeQuery(
        `SELECT * FROM cst_labgroup WHERE flag_del = 0 AND LABGROUP_ID = :id`,
        { id }
      );
      return NextResponse.json({ success: true, data: labGroups });
    } else {
      const labGroups = await executeQuery(
        `SELECT * FROM cst_labgroup WHERE flag_del = 0`
      );
      return NextResponse.json({ success: true, data: labGroups });
    }
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}