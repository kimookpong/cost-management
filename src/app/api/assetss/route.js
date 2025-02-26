import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (id) {
      const asset = await executeQuery(
        `SELECT s.*,u.unit_name,b.brand_name,g.INVGROUP_NAME,t."INVTYPE _NAME" FROM cst_invasset s 
            inner join cst_invunit u on s.unit_id = u.unit_id
            inner JOIN cst_invbrand b on s.brand_id = b.brand_id
            INNER JOIN cst_invgroup g on s.invgroup_id = g.invgroup_id
            INNER JOIN cst_invtype t on s.invtype_id = t.invtype_id
            WHERE s.flag_del = 0 AND ASSET_ID = :id`,
        { id }
      );
      return NextResponse.json({ success: true, data: asset });
    } else {
      const asset = await executeQuery(
        `SELECT s.*,u.unit_name,b.brand_name,g.INVGROUP_NAME,t."INVTYPE _NAME" FROM cst_invasset s 
            inner join cst_invunit u on s.unit_id = u.unit_id
            inner JOIN cst_invbrand b on s.brand_id = b.brand_id
            INNER JOIN cst_invgroup g on s.invgroup_id = g.invgroup_id
            INNER JOIN cst_invtype t on s.invtype_id = t.invtype_id
            WHERE s.flag_del = 0`
      );
      return NextResponse.json({ success: true, data: asset });
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
    const {
      assetNameTh,
      assetNameEng,
      amountUnit,
      version,
      brandId,
      catNo,
      grade,
      unitId,
      unitPrice,
      packPrice,
      invgroupId,
      invtypeId,
      status,
    } = await req.json();

    // แปลงค่าที่ควรเป็นตัวเลข
    const parsedBrandId = Number(brandId);
    const parsedUnitId = Number(unitId);
    const parsedUnitPrice = Number(unitPrice);
    const parsedPackPrice = Number(packPrice);
    const parsedInvgroupId = Number(invgroupId);
    const parsedInvtypeId = Number(invtypeId);
    const parsedStatus = String(status); // CHAR(1 BYTE) ต้องใช้ String ('1')

    // ตรวจสอบค่าที่จำเป็น
    if (
      !assetNameTh ||
      !assetNameEng ||
      !amountUnit ||
      !version ||
      isNaN(parsedBrandId) ||
      !catNo ||
      !grade ||
      isNaN(parsedUnitId) ||
      isNaN(parsedUnitPrice) ||
      isNaN(parsedPackPrice) ||
      isNaN(parsedInvgroupId) ||
      isNaN(parsedInvtypeId) ||
      !parsedStatus
    ) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    // ดำเนินการเพิ่มข้อมูลลงฐานข้อมูล
    await executeQuery(
      `INSERT INTO cst_invasset 
      (ASSET_NAME_TH, ASSET_NAME_ENG, AMOUNT_UNIT, VERSION, BRAND_ID, CAT_NO, GRADE, UNIT_ID, UNIT_PRICE, PACK_PRICE, INVGROUP_ID, INVTYPE_ID, STATUS, FLAG_DEL) 
      VALUES 
      (:assetNameTh, :assetNameEng, :amountUnit, :version, :brandId, :catNo, :grade, :unitId, :unitPrice, :packPrice, :invgroupId, :invtypeId, :status, '0')`,
      {
        assetNameTh,
        assetNameEng,
        amountUnit,
        version,
        brandId: parsedBrandId,
        catNo,
        grade,
        unitId: parsedUnitId,
        unitPrice: parsedUnitPrice,
        packPrice: parsedPackPrice,
        invgroupId: parsedInvgroupId,
        invtypeId: parsedInvtypeId,
        status: parsedStatus,
      }
    );

    return NextResponse.json(
      { success: true, message: "Asset added successfully" },
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
    const {
      assetId, // ต้องมี assetId เพื่อระบุแถวที่ต้องการอัปเดต
      assetNameTh,
      assetNameEng,
      amountUnit,
      version,
      brandId,
      catNo,
      grade,
      unitId,
      unitPrice,
      packPrice,
      invgroupId,
      invtypeId,
      status,
    } = await req.json();

    // ตรวจสอบว่า assetId มีค่าหรือไม่
    if (!assetId) {
      return NextResponse.json(
        { success: false, message: "Missing assetId" },
        { status: 400 }
      );
    }

    // แปลงค่าที่ควรเป็นตัวเลข
    const parsedAssetId = Number(assetId);
    const parsedBrandId = Number(brandId);
    const parsedUnitId = Number(unitId);
    const parsedUnitPrice = Number(unitPrice);
    const parsedPackPrice = Number(packPrice);
    const parsedInvgroupId = Number(invgroupId);
    const parsedInvtypeId = Number(invtypeId);
    const parsedStatus = String(status); // CHAR(1 BYTE) ต้องเป็น String ('1' หรือ '0')

    // ตรวจสอบค่าที่จำเป็น
    if (
      isNaN(parsedAssetId) ||
      !assetNameTh ||
      !assetNameEng ||
      !amountUnit ||
      !version ||
      isNaN(parsedBrandId) ||
      !catNo ||
      !grade ||
      isNaN(parsedUnitId) ||
      isNaN(parsedUnitPrice) ||
      isNaN(parsedPackPrice) ||
      isNaN(parsedInvgroupId) ||
      isNaN(parsedInvtypeId) ||
      !parsedStatus
    ) {
      return NextResponse.json(
        { success: false, message: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    // คำสั่ง SQL สำหรับอัปเดตข้อมูล
    await executeQuery(
      `UPDATE cst_invasset SET 
        ASSET_NAME_TH = :assetNameTh,
        ASSET_NAME_ENG = :assetNameEng,
        AMOUNT_UNIT = :amountUnit,
        VERSION = :version,
        BRAND_ID = :brandId,
        CAT_NO = :catNo,
        GRADE = :grade,
        UNIT_ID = :unitId,
        UNIT_PRICE = :unitPrice,
        PACK_PRICE = :packPrice,
        INVGROUP_ID = :invgroupId,
        INVTYPE_ID = :invtypeId,
        STATUS = :status
      WHERE ASSET_ID = :assetId`,
      {
        assetId: parsedAssetId,
        assetNameTh,
        assetNameEng,
        amountUnit,
        version,
        brandId: parsedBrandId,
        catNo,
        grade,
        unitId: parsedUnitId,
        unitPrice: parsedUnitPrice,
        packPrice: parsedPackPrice,
        invgroupId: parsedInvgroupId,
        invtypeId: parsedInvtypeId,
        status: parsedStatus,
      }
    );

    return NextResponse.json(
      { success: true, message: "Asset updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
