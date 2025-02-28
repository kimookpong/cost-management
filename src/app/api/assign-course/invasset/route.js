import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    const data = await executeQuery(
      `SELECT ASSET_ID, ASSET_NAME_TH FROM CST_INVASSET WHERE INVTYPE_ID = :type ORDER BY ASSET_NAME_TH ASC`,
      { type }
    );
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
