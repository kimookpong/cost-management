import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    const data = await executeQuery(
      `SELECT ASSET.ASSET_ID, 
      ASSET.ASSET_NAME_TH,
      BRAND.BRAND_NAME,
      ASSET.AMOUNT_UNIT,
      UNIT.UNIT_NAME,
      GRP.INVGROUP_NAME
      FROM CST_INVASSET ASSET
      INNER JOIN CST_INVBRAND BRAND
        ON ASSET.BRAND_ID = BRAND.BRAND_ID
      INNER JOIN CST_INVGROUP GRP 
        ON ASSET.INVGROUP_ID = GRP.INVGROUP_ID
      INNER JOIN CST_INVUNIT UNIT 
        ON ASSET.UNIT_ID = UNIT.UNIT_ID
      WHERE INVTYPE_ID = :type
      ORDER BY ASSET.ASSET_NAME_TH ASC`,
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
