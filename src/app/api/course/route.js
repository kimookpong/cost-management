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

async function getFaculty() {
  return await executeQuery(
    `SELECT FACULTYID, FACULTYNAME 
    FROM PBL_FACULTY_V 
    WHERE FACULTYID NOT IN (0,98,99)
    ORDER BY SEQUENCE ASC`
  );
}

export async function GET(req) {
  try {
    const data = await executeQuery(
      `SELECT REG.ACADYEAR, REG.SEMESTER, REG.COURSEID, COURSE.COURSECODE, COURSE.COURSENAME, 
          COUNT(REG.SECTION) AS SECTION, SUM(REG.TOTALSEAT) AS TOTALSEAT,
          COURSE.COURSEUNIT,
          CASE 
            WHEN COURSE.PERIOD1 > 0 AND COURSE.PERIOD2 > 0 THEN '3'
            WHEN COURSE.PERIOD2 > 0  THEN '2'
            WHEN COURSE.PERIOD1 > 0  THEN '1' 
            ELSE '0' 
          END AS TYPE
      FROM PBL_AVSREGCLASS_V REG
      INNER JOIN PBL_AVSREGCOURSE_V COURSE 
          ON COURSE.COURSEID = REG.COURSEID
          AND COURSE.FACULTYID = :facultyId
      INNER JOIN CST_SCHYEAR SCH ON SCH.SCH_ID = :schId
          AND SCH.FLAG_DEL = 0
      WHERE REG.ACADYEAR = SCH.ACADYEAR 
          AND REG.SEMESTER = SCH.SEMESTER
      GROUP BY REG.ACADYEAR, 
        REG.SEMESTER, 
        REG.COURSEID, 
        COURSE.COURSECODE, 
        COURSE.COURSENAME, 
        COURSE.COURSEUNIT,
        COURSE.PERIOD1,
        COURSE.PERIOD2
      HAVING SUM(REG.TOTALSEAT) > 0
      ORDER BY COURSEID ASC`,
      {
        facultyId: req.nextUrl.searchParams.get("facultyId"),
        schId: req.nextUrl.searchParams.get("schId"),
      }
    );

    const faculty = await getFaculty();
    const term = await getSemester();
    return NextResponse.json({
      success: true,
      data: data,
      faculty: faculty,
      term: term,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
