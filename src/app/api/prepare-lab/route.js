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
    L.LAB_ID,
    L.COURSEID,
    COURSE.COURSEID,
    COURSE.COURSEUNICODE,
    COURSE.COURSEUNIT,
    COURSE.COURSENAME,
    COURSE.COURSENAMEENG,
    SUM(REG.TOTALSEAT) AS TOTALSEAT,
    SUM(REG.ENROLLSEAT) AS ENROLLSEAT,
    L.LABROOM,
    L.SECTION,
    L.HOUR
FROM CST_LABCOURSE L
INNER JOIN PBL_AVSREGCOURSE_V COURSE ON COURSE.COURSEID = L.COURSEID
INNER JOIN CST_SCHYEAR SCH ON SCH.SCH_ID = L.SCH_ID
INNER JOIN PBL_AVSREGCLASS_V REG 
    ON REG.COURSEID = COURSE.COURSEID 
    AND SCH.ACADYEAR = REG.ACADYEAR
    AND SCH.SEMESTER = REG.SEMESTER
WHERE L.FLAG_DEL = 0
AND L.SCH_ID = :schId 
GROUP BY 
    L.LAB_ID,
    L.COURSEID,
    COURSE.COURSEID,
    COURSE.COURSEUNICODE,
    COURSE.COURSEUNIT,
    COURSE.COURSENAME,
    COURSE.COURSENAMEENG,
    L.LABROOM,
    L.SECTION,
    L.HOUR
HAVING SUM(REG.TOTALSEAT) > 0`,
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
