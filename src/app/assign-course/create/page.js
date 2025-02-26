"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { FiPlus, FiEdit, FiTrash2, FiCheckCircle } from "react-icons/fi";

import Content from "@/components/Content";
import TableList from "@/components/TableList";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { navigation } from "@/lib/params";
import * as Yup from "yup";

export default function Detail() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [facultyId, setFacultyId] = useState("");
  const [schId, setSchId] = useState("");
  const [data, setData] = useState({
    course: [],
    faculty: [],
    term: [],
  });

  const validationSchema = Yup.object({
    roleName: Yup.string().required("กรุณากรอกชื่อสิทธิ"),
    roleAccess: Yup.array().min(1, "กรุณาเลือกอย่างน้อย 1 การอนุญาติเข้าถึง"),
    statusId: Yup.string().required("กรุณาเลือกสถานะ"),
  });

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/course`, {
          params: { facultyId, schId },
        });
        const data = response.data;
        if (data.success) {
          setData({
            course: data.data,
            faculty: data.faculty,
            term: data.term,
          });
          console.log("🔹 ข้อมูลที่ได้:", data);

          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Error fetching user data:", err);
        alert("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      }
    };
    fetchData();
  }, [facultyId, schId]);

  const breadcrumb = [
    { name: "จัดการสิทธิการใช้งาน", link: "" },
    { name: isNew ? "เพิ่มใหม่" : "แก้ไข" },
  ];

  const meta = [
    {
      key: "coursecode",
      content: "รหัสรายวิชา",
    },
    {
      key: "coursename",
      content: "ชื่อรายวิชา",
    },
    {
      key: "section",
      content: "จำนวน Section",
    },
    {
      key: "totalseat",
      content: "จำนวน Seat",
    },
    {
      key: "courseid",
      sort: false,
      content: "เลือกรายวิชา",
      render: (item) => (
        <div className="flex gap-1">
          <button
            className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              router.push("/assign-course/new?courseid=" + item.courseid)
            }
          >
            <FiCheckCircle className="w-4 h-4" />
            เลือก
          </button>
        </div>
      ),
    },
  ];

  return (
    <Content breadcrumb={breadcrumb}>
      <div className="relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold">
            {isNew ? "เพิ่มสิทธิใหม่" : "แก้ไขข้อมูลสิทธิ"}
          </h3>
        </div>
        <div className="p-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <label className={className.label}>สำนักวิชา</label>
            <select
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
              className={className.select}
            >
              <option value="" disabled>
                เลือกสำนักวิชา
              </option>
              {data.faculty.map((item) => (
                <option key={item.facultyid} value={item.facultyid}>
                  {item.facultyname}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-6">
            <label className={className.label}>เทอมการศึกษา</label>
            <select
              value={schId}
              onChange={(e) => setSchId(e.target.value)}
              className={className.select}
            >
              <option value="" disabled>
                เลือกเทอมการศึกษา
              </option>
              {data.term.map((item) => (
                <option key={item.schId} value={item.schId}>
                  เทอม {item.semester}/{item.acadyear}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-12">
            <TableList meta={meta} data={data.course} loading={loading} />
          </div>
        </div>
      </div>
    </Content>
  );
}

const className = {
  label: "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300",
  input:
    "block w-full px-3 py-1.5 border rounded-md shadow-sm dark:bg-gray-800",
  select: "block w-full px-4 py-2 border rounded-md dark:bg-gray-800",
};
