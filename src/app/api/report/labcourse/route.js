import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/oracle";

async function getReg(courseId, semester, acadyear) {
  return await executeQuery(
    `SELECT *
    FROM PBL_AVSREGCLASS_V 
    WHERE COURSEID = :courseId
    AND SEMESTER = :semester
    AND ACADYEAR = :acadyear
    ORDER BY ACADYEAR DESC, SEMESTER DESC`,
    { courseId, semester, acadyear }
  );
}

async function getUser(labId) {
  return await executeQuery(
    `SELECT PERSON.TITLE_NAME || PERSON.FIRST_NAME || ' ' || PERSON.LAST_NAME AS FULLNAME,
    LAB.ROLE_ID,
    ROLE.LABCOURSE_ROLE_NAME
    FROM CST_LABCOURSE_USER LAB
    LEFT JOIN PBL_VPER_PERSON PERSON 
        ON LAB.PERSON_ID = PERSON.PERSON_ID
    INNER JOIN CST_LABCOURSE_ROLE ROLE
        ON LAB.ROLE_ID = ROLE.LABCOURSE_ROLE_ID
    WHERE LAB.LAB_ID = :labId
    AND LAB.FLAG_DEL = 0`,
    { labId }
  );
}

async function getAsset(labId) {
  return await executeQuery(
    `SELECT ASSET.ASSET_ID,
    ASSETINV.ASSET_NAME_TH,
    ASSETINV.ASSET_NAME_ENG,
    BRAND.BRAND_NAME,
    ASSET.AMOUNT,
    ASSETINV.UNIT_PRICE,
    ASSETINV.PACK_PRICE,
    ASSET.ASSET_REMARK
    FROM CST_LABCOURSE_ASSET ASSET
    INNER JOIN CST_INVASSET ASSETINV
        ON ASSET.ASSET_ID = ASSETINV.ASSET_ID
    INNER JOIN CST_INVBRAND BRAND
        ON ASSETINV.BRAND_ID = BRAND.BRAND_ID
    WHERE ASSET.LAB_ID = :labId
    AND ASSET.FLAG_DEL = 0`,
    { labId }
  );
}

async function getLabjob(labId) {
  let labjob = await executeQuery(
    `SELECT JOB.LABJOB_ID, JOB.LABJOB_TITLE,
      PERSON.TITLE_NAME || PERSON.FIRST_NAME || ' ' || PERSON.LAST_NAME AS FULLNAME
      FROM CST_LABJOB JOB
      LEFT JOIN PBL_VPER_PERSON PERSON 
        ON JOB.PERSON_ID = PERSON.PERSON_ID
      WHERE JOB.LAB_ID = :labId
      AND JOB.FLAG_DEL = 0`,
    { labId }
  );

  labjob = await Promise.all(
    labjob.map(async (item) => {
      return { ...item, asset: await getLabjobAsset(item.labjobId) };
    })
  );

  return labjob;
}

async function getLabjobAsset(labjobId) {
  return await executeQuery(
    `SELECT ASSET.ASSET_ID,
    ASSETINV.ASSET_NAME_TH,
    ASSETINV.ASSET_NAME_ENG,
    BRAND.BRAND_NAME,
    ASSET.AMOUNT_USED,
    ASSETINV.UNIT_PRICE,
    ASSETINV.PACK_PRICE,
    ASSET.ASSET_USED_REMARK
    FROM CST_LABJOB_ASSET ASSET
    INNER JOIN CST_INVASSET ASSETINV
        ON ASSET.ASSET_ID = ASSETINV.ASSET_ID
    INNER JOIN CST_INVBRAND BRAND
        ON ASSETINV.BRAND_ID = BRAND.BRAND_ID
    WHERE ASSET.LABJOB_ID = :labjobId
    AND ASSET.FLAG_DEL = 0`,
    { labjobId }
  );
}

export async function GET(req) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }
    const data = await executeQuery(
      `SELECT LAB.LAB_ID, 
      LAB.COURSEID, 
      LAB.LABGROUP_ID,
      LAB.PERSON_ID,

      COURSE.COURSECODE AS COURSECODE, 
      COURSE.COURSENAME AS COURSENAME,
      FAC.FACULTYNAME, 
      LABGROUP.LABGROUP_NAME,
      PERSON.TITLE_NAME || PERSON.FIRST_NAME || ' ' || PERSON.LAST_NAME AS FULLNAME, 
      LAB.ACADYEAR,
      LAB.SEMESTER,
      LAB.SECTION,
      LAB.LABROOM,
      LAB.HOUR,
      LAB.LABGROUP_NUM

      FROM CST_LABCOURSE LAB
      INNER JOIN PBL_AVSREGCOURSE_V COURSE
        ON COURSE.COURSEID = LAB.COURSEID
      LEFT JOIN PBL_FACULTY_V FAC 
        ON COURSE.FACULTYID = FAC.FACULTYID
      LEFT JOIN CST_LABGROUP LABGROUP
        ON LAB.LABGROUP_ID = LABGROUP.LABGROUP_ID
      LEFT JOIN PBL_VPER_PERSON PERSON 
        ON LAB.PERSON_ID = PERSON.PERSON_ID
      WHERE LAB.LAB_ID = :id`,
      { id }
    );
    return NextResponse.json({
      success: true,
      data: data,
      reg:
        data.length > 0 &&
        (await getReg(data[0].courseid, data[0].semester, data[0].acadyear)),
      user: await getUser(id),
      asset: await getAsset(id),
      labjob: await getLabjob(id),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error", error },
      { status: 500 }
    );
  }
}
