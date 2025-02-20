import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    const query = `
    SELECT PERSON_ID,
           TITLE_NAME || FIRST_NAME || ' ' || LAST_NAME AS FULLNAME,
           POSITION_TH_NAME AS POSITION,
           DIVISION_TH_NAME AS DIVISION
    FROM PBL_VPER_PERSON
    WHERE (LOWER(FIRST_NAME) LIKE :q 
       OR LOWER(LAST_NAME) LIKE :q 
       OR PERSON_ID LIKE :q)
    AND ROWNUM <= 10
  `;
    const users = await executeQuery(query, { q: `%${q.toLowerCase()}%` });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
