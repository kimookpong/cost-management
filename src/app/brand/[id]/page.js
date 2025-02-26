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
    brandName: Yup.string().required("กรุณากรอกชื่อยี่ห้อ"),
    status: Yup.string().required("กรุณาเลือกสถานะ"),
  });

  const formik = useFormik({
    initialValues: {
      brandId: "",
      brandName: "",
      status: "1",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isNew) {
          await axios.post(`/api/brand`, values);
          await Swal.fire({
            title: "เพิ่มข้อมูลใหม่เรียบร้อย!",
            icon: "success",
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          await axios.put(`/api/brand?id=${id}`, values);
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
        console.error("Error saving user:", error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    },
  });

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/brand?id=${id}`);
          const data = response.data;
          if (data.success) {
            const unit = data.data[0];
            formik.setValues({
              brandId: unit.brandId || "",
              brandName: unit.brandName?.toString() || "",
              status: unit.status?.toString() || "1",
            });
            setLoading(false);
          } else {
            console.error("Error fetching unit data:", data.error);
            alert("ไม่สามารถโหลดข้อมูลได้");
          }
        } catch (err) {
          console.error("Error fetching unit data:", err);
          alert("ไม่สามารถโหลดข้อมูลได้");
        }
      };
      fetchData();
    }
  }, [id]);

  const breadcrumb = [
    { name: "จัดการข้อมูลยี่ห้อ", link: "/brand" },
    { name: isNew ? "เพิ่มใหม่ข้อมูลยี่ห้อ" : "แก้ไขข้อมูลยี่ห้อ" },
  ];

  return (
    <Content breadcrumb={breadcrumb}>
      <div className="relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-md rounded-xl p-5 ">
        <div className="isolate bg-white px-6 py-24 sm:py-10 lg:px-8">
          <div className="flex items-center justify-center border-b border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-3xl font-semibold tracking-tight text-gray-700 sm:text-3xl text-center">
              {isNew ? "ข้อมูลยี่ห้อ" : "แก้ไขข้อมูล"}
            </h3>
          </div>

          {loading ? (
            <div className="p-6 text-center">กำลังโหลดข้อมูล...</div>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <div className="p-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                {/* <div className="space-y-12"> */}
                <div className="sm:col-span-6">
                  <label className={className.label}>ชื่อยี่ห้อ</label>
                  <div className="mt-1 grid grid-cols-1 ">
                    <input
                      type="text"
                      name="brandName"
                      value={formik.values.brandName}
                      onChange={formik.handleChange}
                      className={className.input}
                    />
                    {formik.touched.brandName && formik.errors.brandName && (
                      <p className="mt-2 text-sm text-red-500">
                        {formik.errors.brandName}
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
                  {isNew ? "เพิ่มยี่ห้อ" : "บันทึกข้อมูล"}
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
    "block w-full px-4 py-2 border-2 rounded-md shadow-sm dark:bg-gray-800 dark:border-white dark:text-white focus:outline-indigo-600 input-info",
};
