import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";


export async function GET(req) {
    try {
        const schId = req.nextUrl.searchParams.get("schId");
        if (!schId) {
            return NextResponse.json(
                { success: false, message: "Missing schId parameter" },
                { status: 400 }
            );
        }
        const data = await executeQuery(

            `SELECT   COUNT(E.STUDENTID) AS COUNTSTD  ,  S.PROGRAMID  
            FROM CST_LABCOURSE  A  INNER JOIN PBL_AVSREGENROLLSUMMARY_V  E  ON  A.COURSEID=E.COURSEID  AND A.ACADYEAR=E.ACADYEAR  AND A.SEMESTER = E.SEMESTER
            INNER JOIN PBL_STUDENTMASTER_V S  ON E.STUDENTID=S.STUDENTID 
            WHERE LAB_ID = :schId GROUP BY   S.PROGRAMID`,
                        { schId }
        );
        return NextResponse.json({
            success: true,
            data: data,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Database Error", error },
            { status: 500 }
        );
    }
}