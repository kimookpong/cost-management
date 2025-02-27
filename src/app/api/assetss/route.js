import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.nextUrl); // ✅ ใช้ req.nextUrl ให้ถูกต้อง
    const idType = searchParams.get("idType");
    const id = searchParams.get("id");

    console.log("idType:", idType, "id:", id);

    let sql = `SELECT s.*,u.unit_name,b.brand_name,g.INVGROUP_NAME,t."INVTYPE _NAME" FROM cst_invasset s 
            inner join cst_invunit u on s.unit_id = u.unit_id
            inner JOIN cst_invbrand b on s.brand_id = b.brand_id
            INNER JOIN cst_invgroup g on s.invgroup_id = g.invgroup_id
            INNER JOIN cst_invtype t on s.invtype_id = t.invtype_id
            WHERE s.flag_del = 0`;

    let params = [];

    if (id) {
      sql += ` AND s.ASSET_ID = ?`; // ถ้าใช้ PostgreSQL ให้ใช้ `$1`
      params.push(id);
    } else if (idType === "1") {
      sql += ` AND s.INVTYPE_ID = 1`; // ถ้าใช้ PostgreSQL ให้ใช้ `$1`
    } else if (idType === "2") {
      sql += ` AND s.INVTYPE_ID = 2`; // ถ้าใช้ PostgreSQL ให้ใช้ `$1`
    } else if (idType === "3") {
      sql += ` AND s.INVTYPE_ID = 3`; // ถ้าใช้ PostgreSQL ให้ใช้ `$1`
    }
    const assets = await executeQuery(sql, params);

    return NextResponse.json({ success: true, data: assets });
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
      isNaN(parsedBrandId) ||
      isNaN(parsedUnitId) || // ต้องเป็นตัวเลข ถ้าไม่ใช่ให้ return 400 Bad Request กลับไป
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
