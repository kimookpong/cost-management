import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("body", body);
    const { labjobId, brokenAmount, assetId, userId, labId } = body.assetBroken;

    // แปลงค่าที่จำเป็นเป็นตัวเลข
    const labjobIdNumber = parseInt(labjobId, 10);
    const assetIdNumber = parseInt(assetId, 10);
    const brokenAmountNumber = parseInt(brokenAmount, 10);
    const userIdNumber = parseInt(userId, 10);
    const labIdNumber = parseInt(labId, 10);

    // ตรวจสอบค่าที่ต้องเป็นตัวเลข
    if (
      isNaN(labjobIdNumber) ||
      isNaN(assetIdNumber) ||
      isNaN(brokenAmountNumber) ||
      isNaN(userIdNumber)
    ) {
      throw new Error("One or more input values are invalid numbers.");
    }

    // Log คำสั่ง SQL สำหรับ debug
    console.log("Executing INSERT into CST_ASSET_ASSET_BROKEN");

    // Execute query
    await executeQuery(
      `INSERT INTO CST_ASSET_BROKEN (
        ASSET_BROKEN_ID,
        LABJOB_ID,
        BROKEN_AMOUNT,
        ASSET_ID,
        FLAG_DEL,
        USER_CREATED,
        DATE_CREATED,
        LAB_ID
      ) VALUES (
        CST_ASSET_BROKEN_SEQ.NEXTVAL,
        :labjobId,
        :brokenAmount,
        :assetId,
        :flagDel,
        :userId,
        SYSDATE,
        :labId
      )`,
      {
        labjobId: labjobIdNumber,
        brokenAmount: brokenAmountNumber,
        assetId: assetIdNumber,
        flagDel: "0",
        userId: userIdNumber,
        labId: labIdNumber,
      }
    );

    return NextResponse.json(
      { success: true, message: "Asset broken record inserted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting asset broken record:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    const userId = req.nextUrl.searchParams.get("userId");

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing ID" },
        { status: 400 }
      );
    }

    // Log คำสั่ง SQL สำหรับ debug
    console.log("Executing UPDATE on CST_ASSET_BROKEN");

    // Execute query
    await executeQuery(
      `UPDATE CST_ASSET_BROKEN SET FLAG_DEL = 1, USER_UPDATED = :userId WHERE ASSET_BROKEN_ID = :assetBrokenId`,
      {
        assetBrokenId: Number(id),
        userId: Number(userId),
      }
    );

    return NextResponse.json(
      { success: true, message: "Asset broken record deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting asset broken record:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error: error.message },
      { status: 500 }
    );
  }
}
