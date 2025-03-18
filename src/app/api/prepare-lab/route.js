import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

async function getSemester() {
  return await executeQuery(
    `SELECT SCH_ID, ACADYEAR, SEMESTER 
    FROM CST_SCHYEAR 
    WHERE FLAG_DEL = 0
    ORDER BY ACADYEAR DESC, SEMESTER DESC`
  );
}
export async function GET(req) {
  try {
    const data = await executeQuery(
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
  WHERE l.FLAG_DEL = 0
  AND l.SCH_ID = :schId`,
      { schId: req.nextUrl.searchParams.get("schId") } // Correct JSON object structure
    );

    // const faculty = await getFaculty();
    // const avs = await getAvs();
    const term = await getSemester();
    return NextResponse.json({
      success: true,
      data: data,
      term: term,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
