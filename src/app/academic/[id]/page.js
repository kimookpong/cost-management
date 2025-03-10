"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Content from "@/components/Content";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import dynamic from "next/dynamic";

const UserAutocomplete = dynamic(
  () => import("@/components/UserAutocomplete"), //
  {
    ssr: false,
  }
);

export default function Detail() {
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);

  const validationSchema = Yup.object({
    acadyear: Yup.number().required("กรอกข้อมูลนี้"),
    semester: Yup.number().required("กรอกข้อมูลนี้"),
    status: Yup.number().required("เลือกข้อมูลนี้"),
  });

  const formik = useFormik({
    initialValues: {
      schId: "",
      acadyear: "",
      semester: "",
      status: "1",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isNew) {
          await axios.post(`/api/academic`, values);
          await Swal.fire({
            title: "เพิ่มข้อมูลใหม่เรียบร้อย!",
            icon: "success",
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          await axios.put(`/api/academic?id=${id}`, values);
          await Swal.fire({
            title: "แก้ไขข้อมูลเรียบร้อย!",
            icon: "success",
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1000,
          });
        }
        router.back();
      } catch (error) {
        console.error("Error saving academic:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    },
  });

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/academic?id=${id}`);
          const data = response.data;
          if (data.success) {
            const sch = data.data[0];
            formik.setValues({
              schId: sch.schId || "",
              acadyear: Number(sch.acadyear) || "",
              semester: Number(sch.semester) || "",
              // status: Number(sch.status) || "1",
              status: sch.status?.toString() || "1",
            });
            setLoading(false);
          } else {
            console.error("Error fetching sch data:", data.error);
            alert("ไม่สามารถโหลดข้อมูลได้");
          }
        } catch (err) {
          console.error("Error fetching sch data:", err);
          alert("ไม่สามารถโหลดข้อมูลได้");
        }
      };
      fetchData();
    }
  }, [id]);

  const breadcrumb = [
    { name: "กำหนดค่าเริ่มต้น", link: "/matter" },
    { name: "ปีการศึกษา", link: "/academic" },
    { name: isNew ? "เพิ่มข้อมูลปีการศึกษา" : "แก้ไขข้อมูลปีการศึกษา" },
  ];

  return (
    <Content
      breadcrumb={breadcrumb}
      title={isNew ? "เพิ่มข้อมูลปีการศึกษา" : "แก้ไขข้อมูลปีการศึกษา"}>
      <div className="relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 pr-60 pl-60">
        <div className="isolate bg-white px-6 py-24 sm:py-10 lg:px-8">
          <div className="flex  border-b border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-3xl font-semibold tracking-tight text-gray-700 sm:text-3xl ">
              {isNew ? "ข้อมูลปีการศึกษา" : "แก้ไขปีการศึกษา"}
            </h3>
          </div>

          {loading ? (
            <div className="p-6 text-center">กำลังโหลดข้อมูล...</div>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="p-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                {/* <div className="space-y-12"> */}
                <div className="sm:col-span-6">
                  <label className={className.label}>ปีการศึกษา</label>
                  <div className="mt-1 grid grid-cols-1 ">
                    <input
                      type="number"
                      name="acadyear"
                      pattern="[0-9]*"
                      value={formik.values.acadyear}
                      onChange={formik.handleChange}
                      className={className.input}
                    />
                    {formik.touched.acadyear && formik.errors.acadyear && (
                      <p className="mt-2 text-sm text-red-500">
                        {formik.errors.acadyear}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-6">
                  <label className={className.label}>ภาคเรียนที่</label>
                  <div className="mt-1 grid grid-cols-1 ">
                    <select
                      name="semester"
                      value={formik.values.semester}
                      onChange={formik.handleChange}
                      className="block w-64 px-4 py-2 border-2 rounded-md shadow-sm dark:bg-gray-800 dark:border-white dark:text-white focus:outline-indigo-600 input-info">
                      <option value="1">ภาคเรียนที่ 1</option>
                      <option value="2">ภาคเรียนที่ 2</option>
                      <option value="3">ภาคเรียนที่ 3</option>
                    </select>
                    {formik.touched.semester && formik.errors.semester && (
                      <p className="mt-2 text-sm text-red-500">
                        {formik.errors.semester}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className={className.label}>สถานะ</label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      name="status"
                      value={formik.values.status}
                      onChange={formik.handleChange}
                      className={className.select}>
                      <option value="1">ใช้งาน</option>
                      <option value="0">ไม่ใช้งาน</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  className="cursor-pointer p-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => router.back()}>
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="cursor-pointer p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isNew ? "บันทึก" : "บันทึก"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Content>
  );
}

const className = {
  label:
    "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300block text-sm/6 font-semibold text-gray-900",
  input:
    "block w-full px-3 py-1.5 border-2 rounded-md shadow-sm dark:bg-gray-800 dark:border-white dark:text-white focus:outline-indigo-600 input-info",
  select:
    "block w-32 px-4 py-2 border-2 rounded-md shadow-sm dark:bg-gray-800 dark:border-white dark:text-white focus:outline-indigo-600 input-info",
};
