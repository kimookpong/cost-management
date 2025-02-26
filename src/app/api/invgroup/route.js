import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (id) {
      const units = await executeQuery(
        `SELECT * FROM cst_invgroup WHERE flag_del = 0 AND INVGROUP_ID = :id`,
        { id }
      );
      return NextResponse.json({ success: true, data: units });
    } else {
      const units = await executeQuery(
        `SELECT * FROM cst_invgroup WHERE flag_del = 0`
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
