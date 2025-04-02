import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    const labId = req.nextUrl.searchParams.get("labId");
    const extraFlag = req.nextUrl.searchParams.get("extraFlag");
    console.log("type: ", type);
    console.log("extraFlag: ", extraFlag);

    let data;

    if (extraFlag === "1") {
      data = await executeQuery(
        `SELECT ASSET.ASSET_ID, 
        ASSET.ASSET_NAME_TH,
        BRAND.BRAND_NAME,
        ASSET.AMOUNT_UNIT,
        UNIT.UNIT_NAME
        FROM CST_INVASSET ASSET
        INNER JOIN CST_INVBRAND BRAND
          ON ASSET.BRAND_ID = BRAND.BRAND_ID
        INNER JOIN CST_INVUNIT UNIT 
          ON ASSET.UNIT_ID = UNIT.UNIT_ID
        WHERE ASSET.FLAG_DEL = 0
        AND INVTYPE_ID = :type
        ORDER BY ASSET.ASSET_NAME_TH ASC`,
        { type }
      );
    } else {
      data = await executeQuery(
        `SELECT LCA.ASSET_ID, 
        ASSET.ASSET_NAME_TH,
        BRAND.BRAND_NAME,
        ASSET.AMOUNT_UNIT,
        UNIT.UNIT_NAME,
        GRP.INVGROUP_NAME
        FROM CST_INVASSET ASSET
        INNER JOIN CST_LABCOURSE_ASSET LCA
          ON ASSET.ASSET_ID = LCA.ASSET_ID
        INNER JOIN CST_INVBRAND BRAND
          ON ASSET.BRAND_ID = BRAND.BRAND_ID
        INNER JOIN CST_INVGROUP GRP 
          ON ASSET.INVGROUP_ID = GRP.INVGROUP_ID
        INNER JOIN CST_INVUNIT UNIT 
          ON ASSET.UNIT_ID = UNIT.UNIT_ID
        WHERE INVTYPE_ID = :type
        AND LCA.LAB_ID = :labId
        ORDER BY ASSET.ASSET_NAME_TH ASC`,
        { type, labId }
      );
    }

    if (!data) {
      data = []; // Fallback to empty array if no data is returned
    }

    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
