import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const type = req.nextUrl.searchParams.get("type");
    const labId = req.nextUrl.searchParams.get("labId");
    const extraFlag = req.nextUrl.searchParams.get("extraFlag");
    const labjobId = req.nextUrl.searchParams.get("labjobId");
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
    } else if (extraFlag === "0") {
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
    } else {
      data = await executeQuery(
        `   SELECT 
    LCA.ASSET_ID, 
    ASSET.ASSET_NAME_TH,
    BRAND.BRAND_NAME,
    ASSET.AMOUNT_UNIT,
    UNIT.UNIT_NAME,
    GRP.INVGROUP_NAME,
    SUM(LCA.AMOUNT_USED) AS TOTAL_AMOUNT_USED
    FROM CST_INVASSET ASSET
    INNER JOIN CST_LABJOB_ASSET LCA ON ASSET.ASSET_ID = LCA.ASSET_ID
    INNER JOIN CST_INVBRAND BRAND ON ASSET.BRAND_ID = BRAND.BRAND_ID
    INNER JOIN CST_INVGROUP GRP ON ASSET.INVGROUP_ID = GRP.INVGROUP_ID
    INNER JOIN CST_INVUNIT UNIT ON ASSET.UNIT_ID = UNIT.UNIT_ID
    WHERE ASSET.INVTYPE_ID IN (1, 2,3)
    AND LCA.LABJOB_ID = :labjobId
    GROUP BY 
        LCA.ASSET_ID, 
        ASSET.ASSET_NAME_TH,
        BRAND.BRAND_NAME,
        ASSET.AMOUNT_UNIT,
        UNIT.UNIT_NAME,
        GRP.INVGROUP_NAME
    ORDER BY ASSET.ASSET_NAME_TH ASC`,
        { labjobId }
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

export async function POST(req) {
  try {
    const body = await req.json();
    const { labId, assetId, amount, assetRemark, userId } = body.labaset;

    const labIdNumber = parseInt(labId, 10);
    const assetIdNumber = parseInt(assetId, 10);
    const amountNumber = parseInt(amount, 10);
    const userIdNumber = parseInt(userId, 10);

    if (
      isNaN(labIdNumber) ||
      isNaN(assetIdNumber) ||
      isNaN(amountNumber) ||
      isNaN(userIdNumber)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid input data" },
        { status: 400 }
      );
    }

    console.log("Executing INSERT into CST_LABCOURSE_ASSET");

    await executeQuery(
      `INSERT INTO CST_LABCOURSE_ASSET 
        (LABASSET_ID, LAB_ID, ASSET_ID, AMOUNT, ASSET_REMARK, FLAG_DEL, USER_CREATED, DATE_CREATED) 
      VALUES 
        (CST_LABCOURSE_ASSET_SEQ.NEXTVAL, :labId, :assetId, :amount, :assetRemark, :flagDel, :userId, SYSDATE)`,
      {
        labId: labIdNumber,
        assetId: assetIdNumber,
        amount: amountNumber,
        assetRemark: assetRemark || "",
        flagDel: 0,
        userId: userIdNumber,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Lab course asset record created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting into CST_LABCOURSE_ASSET:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { labassetId, labId, assetId, amount, assetRemark, userId } =
      body.labaset;

    const labassetIdNumber = parseInt(labassetId, 10);
    const labIdNumber = parseInt(labId, 10);
    const assetIdNumber = parseInt(assetId, 10);
    const amountNumber = parseInt(amount, 10);
    const userIdNumber = parseInt(userId, 10);

    if (
      isNaN(labassetIdNumber) ||
      isNaN(labIdNumber) ||
      isNaN(assetIdNumber) ||
      isNaN(amountNumber) ||
      isNaN(userIdNumber)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid input data" },
        { status: 400 }
      );
    }

    console.log("Executing UPDATE on CST_LABCOURSE_ASSET");

    await executeQuery(
      `UPDATE CST_LABCOURSE_ASSET 
       SET 
         LAB_ID = :labId,
         ASSET_ID = :assetId,
         AMOUNT = :amount,
         ASSET_REMARK = :assetRemark,
         USER_UPDATED = :userId,
         DATE_UPDATED = SYSDATE
       WHERE LABASSET_ID = :labassetId`,
      {
        labassetId: labassetIdNumber,
        labId: labIdNumber,
        assetId: assetIdNumber,
        amount: amountNumber,
        assetRemark: assetRemark || "",
        userId: userIdNumber,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Lab course asset record updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating CST_LABCOURSE_ASSET:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error: error.message },
      { status: 500 }
    );
  }
}
