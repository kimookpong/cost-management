import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (id) {
      const brand = await executeQuery(
        `SELECT * FROM cst_invbrand WHERE flag_del = 0 AND BRAND_ID = :id`,
        { id }
      );
      return NextResponse.json({ success: true, data: brand });
    } else {
      const brand = await executeQuery(
        `SELECT * FROM DBACST.cst_invbrand WHERE flag_del = 0`
      );
      return NextResponse.json({ success: true, data: brand });
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
    const { brandName, status } = await req.json();

    if (!brandName || !status) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      "INSERT INTO cst_invbrand (BRAND_NAME, STATUS, FLAG_DEL) VALUES ( :brandName, :status, 0)",
      { brandName, status }
    );

    return NextResponse.json(
      { success: true, message: "Brand added successfully" },
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
    const id = req.nextUrl.searchParams.get("id");
    const body = await req.json();
    const { brandName, status } = body;

    if (!id || !brandName || !status) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await executeQuery(
      `UPDATE cst_invbrand 
       SET BRAND_NAME = :brandName, STATUS = :status 
       WHERE BRAND_ID = :id`,
      { brandName, status, id }
    );

    return NextResponse.json({
      success: true,
      message: "Brand updated successfully",
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    await executeQuery(
      `UPDATE cst_invbrand SET FLAG_DEL = 1 WHERE BRAND_ID = :id`,
      { id }
    );
    return NextResponse.json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
