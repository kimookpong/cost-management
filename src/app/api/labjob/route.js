import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const labjobId = req.nextUrl.searchParams.get("labjobId");
    const labId = req.nextUrl.searchParams.get("labId");

    console.log("🔍 GET API - labjobId:", labjobId);
    console.log("🔍 GET API - labId:", labId);

    let query = `
      SELECT L.*, P.TITLE_NAME || P.FIRST_NAME || ' ' || P.LAST_NAME AS FULLNAME 
      FROM CST_LABJOB L
      INNER JOIN PBL_VPER_PERSON P 
      ON L.PERSON_ID = P.PERSON_ID
      WHERE L.FLAG_DEL = 0
    `;

    let params = {};

    // ✅ ตรวจสอบว่ามีค่า labjobId หรือไม่
    if (labjobId) {
      query += " AND L.LABJOB_ID = :labjobId";
      params.labjobId = labjobId;
    }

    // ✅ ตรวจสอบว่ามีค่า labId หรือไม่
    if (labId) {
      query += " AND L.LAB_ID = :labId";
      params.labId = labId;
    }
    console.log("SQL Query:", query);
    console.log("Parameters:", params);
    const data = await executeQuery(query, params);

    // ดึงข้อมูล labjoblist
    const labjoblist = await executeQuery(
      `SELECT L.*, P.TITLE_NAME || P.FIRST_NAME || ' ' || P.LAST_NAME AS FULLNAME 
       FROM CST_LABJOB L
       INNER JOIN PBL_VPER_PERSON P 
       ON L.PERSON_ID = P.PERSON_ID
       WHERE L.FLAG_DEL = 0 AND L.LAB_ID = :labId`,
      { labId }
    );

    // ดึงข้อมูล datacoursa
    const datacoursa = await executeQuery(
      `SELECT 
        l.LAB_ID,
        l.courseid,
        course.courseid,
        course.courseunicode,
        course.courseunit,
        course.coursename,
        course.coursenameeng,
        l.labroom,
        l.section,
        l.hour
      FROM cst_labcourse l
      INNER JOIN PBL_AVSREGCOURSE_V COURSE ON COURSE.COURSEID = l.COURSEID
      INNER JOIN CST_SCHYEAR SCH ON SCH.SCH_ID = l.SCH_ID
      WHERE l.FLAG_DEL = 0 AND l.LAB_ID = :labId`,
      { labId }
    );

    return NextResponse.json(
      {
        success: true,
        data: data,
        labjoblist: labjoblist,
        datacoursa: datacoursa,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
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
    const { labId, personId, labjobTitle, userCreated } = body; // Use .json() for body parsing in Next.js API routes
    if (!labId || !personId || !labjobTitle || !userCreated) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }
    // Fixed the SQL query syntax error
    await executeQuery(
      `INSERT INTO CST_LABJOB (LAB_ID, PERSON_ID, LABJOB_TITLE, USER_CREATED, DATE_CREATED) 
      VALUES (:labId, :personId, :labjobTitle, :userCreated, CURRENT_TIMESTAMP)`, // Removed extra commas
      [labId, personId, labjobTitle, userCreated] // Assuming this is the user creating the record
    );
    return NextResponse.json(
      { success: true, message: "User added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const labjobId = req.nextUrl.searchParams.get("labjobId");
    console.log("labjobIdAPI", labjobId);
    const body = await req.json();
    const { labId, personId, labjobTitle, userCreated } = body; // Use .json() for body parsing in Next.js API routes
    if (!labId || !personId || !labjobTitle || !userCreated) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }
    // Update the labjob record
    const response = await executeQuery(
      `UPDATE CST_LABJOB 
  SET LAB_ID = :labId,PERSON_ID = :personId, LABJOB_TITLE = :labjobTitle, 
  USER_UPDATED = :userCreated, DATE_UPDATED = CURRENT_TIMESTAMP 
  WHERE LABJOB_ID = :labjobId`,
      {
        labjobId,
        labId,
        personId,
        labjobTitle,
        userCreated,
      }
    ).catch((error) => {
      console.error("Database query error:", error.message || error); // Log the error from the database
      throw new Error("Database query failed");
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    const labjobId = req.nextUrl.searchParams.get("id");
    const response = await executeQuery(
      `UPDATE CST_LABJOB SET FLAG_DEL = 1 WHERE LABJOB_ID = :labjobId`,
      { labjobId }
    );
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
// Compare this snippet from src/app/api/user/route.js:
