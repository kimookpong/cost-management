import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

export async function GET(req) {
  try {
    const data = await executeQuery(
      `SELECT USR.PERSON_ID,
      PERSON.TITLE_NAME || PERSON.FIRST_NAME || ' ' || PERSON.LAST_NAME AS FULLNAME,
      PERSON.POSITION_TH_NAME AS POSITION
      FROM CST_USER USR
      INNER JOIN PBL_VPER_PERSON PERSON
        ON USR.PERSON_ID = PERSON.PERSON_ID
      WHERE USR.FLAG_DEL = 0
      `,
      {}
    );
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
