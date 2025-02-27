"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Content from "@/components/Content";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toastDialog } from "@/lib/stdLib";

export default function Detail() {
  const searchParams = useSearchParams();
  const { id } = useParams();
  const router = useRouter();
  const isNew = id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [activeTab, setActiveTab] = useState("tab1");

  const [data, setData] = useState({
    course: null,
    class: [],
    users: [],
  });

  const tabs = [
    { id: "tab1", label: "รายละเอียดวิชา" },
    { id: "tab2", label: "ผู้รับผิดชอบ" },
    { id: "tab3", label: "ทรัพยากรตามรายวิชา" },
  ];

  const validationSchema = Yup.object({
    personId: Yup.string().required("กรุณาเลือกข้อมูล"),
    labroom: Yup.number()
      .required("กรุณากรอกข้อมูล")
      .min(1, "จำนวนต้องไม่น้อยกว่า 1"),
    labgroupNum: Yup.number()
      .required("กรุณากรอกข้อมูล")
      .min(1, "จำนวนต้องไม่น้อยกว่า 1"),
    hour: Yup.number()
      .required("กรุณากรอกข้อมูล")
      .min(1, "จำนวนต้องไม่น้อยกว่า 1"),
  });

  const formik = useFormik({
    initialValues: {
      courseid: "",
      labgroupId: "",
      schId: "1",
      acadyear: "",
      semester: "",
      section: "",
      labroom: "",
      hour: "",
      labgroupNum: "",
      personId: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log("🔹 ส่งข้อมูล:", values);
      // try {
      //   if (isNew) {
      //     await axios.post(`/api/user-role`, values);
      //   } else {
      //     await axios.put(`/api/user-role?id=${id}`, values);
      //   }
      //   toastDialog("บันทึกข้อมูลเรียบร้อย!", "success");
      //   router.back();
      // } catch (error) {
      //   toastDialog("เกิดข้อผิดพลาดในการบันทึกข้อมูล!", "error", 2000);
      //   console.error("❌ Error saving data:", error);
      // }
    },
  });

  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/user-role?id=${id}`);
          const data = response.data;
          if (data.success) {
            const user = data.data;
            formik.setValues({
              personId: user.personId || "",
              roleAccess: user.roleAccess || [],
              statusId: user.statusId?.toString() || "1",
            });

            setLoading(false);
          }
        } catch (err) {
          console.error("❌ Error fetching data:", err);
          toastDialog("ไม่สามารถโหลดข้อมูลได้!", "error", 2000);
        }
      };
      fetchData();
    } else {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/assign-course`, {
            params: {
              courseId: searchParams.get("courseId"),
              schId: searchParams.get("schId"),
            },
          });
          const data = response.data;
          if (data.success) {
            setData({
              course: data.course,
              class: data.class,
              users: data.users,
            });
            formik.setValues({
              courseid: data.course?.courseid,
              labgroupId: "",
              schId: searchParams.get("schId"),
              acadyear: "",
              semester: "",
              section: "",
              labroom: "",
              hour: "",
              labgroupNum: "",
              personId: "",
            });

            setLoading(false);
          }
        } catch (err) {
          console.error("❌ Error fetching data:", err);
          toastDialog("ไม่สามารถโหลดข้อมูลได้!", "error", 2000);
        }
      };
      fetchData();
    }
  }, [id]);

  const breadcrumb = [
    { name: "แผนการให้บริการห้องปฎิบัติการ" },
    { name: "กำหนดรายวิชา", link: "/assign-course" },
    { name: isNew ? "เพิ่มใหม่" : "แก้ไขข้อมูล" },
  ];

  return (
    <Content
      breadcrumb={breadcrumb}
      title=" แผนการให้บริการห้องปฎิบัติการ : กำหนดรายวิชา"
    >
      <div className="relative flex flex-col w-full text-gray-900 dark:text-gray-300 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold">
            {isNew ? "เพิ่มใหม่" : "แก้ไขข้อมูล"}
          </h3>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            กำลังโหลดข้อมูล...
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <div className="w-full">
              <div className="flex border-b px-4">
                {tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex justify-center items-center space-x-2 p-4 transition ${
                      activeTab === tab.id
                        ? "text-blue-600 font-semibold border-b-2 border-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-300"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div>
                {activeTab === "tab1" && (
                  <div className="p-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                    <div className="sm:col-span-12">
                      <h3 className="font-xl font-semibold">
                        {data.course?.coursename} ({data.course?.coursecode})
                      </h3>
                      <p className="mt-4">
                        สำนักวิชา : {data.course?.coursename}
                      </p>
                      <p className="mt-1">
                        รายละเอียด : {data.course?.description1}
                      </p>
                    </div>
                    <div className="sm:col-span-6">
                      <label className={className.label}>
                        ผู้รับผิดชอบหลัก
                      </label>
                      <select
                        name="statusId"
                        value={formik.values.personId}
                        onChange={formik.handleChange}
                        className={`${className.select} ${
                          formik.touched.labroom && formik.errors.labroom
                            ? "border-red-500"
                            : ""
                        }`}
                      >
                        <option value="" disabled>
                          เลือกผู้รับผิดชอบหลัก
                        </option>
                        {data.users.map((user) => (
                          <option key={user.personId} value={user.personId}>
                            {user.userId} {user.personId}
                          </option>
                        ))}
                      </select>
                      {formik.touched.personId && formik.errors.personId && (
                        <p className="mt-1 text-sm text-red-500">
                          {formik.errors.personId}
                        </p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className={className.label}>
                        จำนวนห้อง LAB ที่เปิดบริการ
                      </label>
                      <input
                        type="number"
                        name="labroom"
                        value={formik.values.labroom}
                        onChange={formik.handleChange}
                        className={`${className.input} ${
                          formik.touched.labroom && formik.errors.labroom
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {formik.touched.labroom && formik.errors.labroom && (
                        <p className="mt-1 text-sm text-red-500">
                          {formik.errors.labroom}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className={className.label}>
                        จำนวนกลุ่มต่อห้อง
                      </label>
                      <input
                        type="number"
                        name="labgroupNum"
                        value={formik.values.labgroupNum}
                        onChange={formik.handleChange}
                        className={`${className.input} ${
                          formik.touched.labgroupNum &&
                          formik.errors.labgroupNum
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {formik.touched.labgroupNum &&
                        formik.errors.labgroupNum && (
                          <p className="mt-1 text-sm text-red-500">
                            {formik.errors.labgroupNum}
                          </p>
                        )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className={className.label}>
                        จำนวนชั่วโมงเรียน
                      </label>
                      <input
                        type="number"
                        name="hour"
                        value={formik.values.hour}
                        onChange={formik.handleChange}
                        className={`${className.input} ${
                          formik.touched.hour && formik.errors.hour
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {formik.touched.hour && formik.errors.hour && (
                        <p className="mt-1 text-sm text-red-500">
                          {formik.errors.hour}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === "tab2" && (
                  <div className="p-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                    <p>เนื้อหาแท็บที่ 2</p>
                  </div>
                )}
                {activeTab === "tab3" && (
                  <div className="p-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                    <p>เนื้อหาแท็บที่ 3</p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                className="p-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg"
                onClick={() => router.back()}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </form>
        )}
      </div>
    </Content>
  );
}

const className = {
  label:
    "mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300 dark:text-gray-300",
  input:
    "block w-full px-3 py-1.5 border rounded-md shadow-sm dark:bg-gray-800",
  select: "block w-full px-4 py-2 border rounded-md dark:bg-gray-800",
};
