"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiPlus, FiEdit, FiTrash2, FiCheckCircle } from "react-icons/fi";
import Content from "@/components/Content";
import TableList from "@/components/TableList";
import axios from "axios";
import { navigation } from "@/lib/params";
import { confirmDialog, toastDialog } from "@/lib/stdLib";

export default function List() {
  const searchParams = useSearchParams();
  const breadcrumb = [
    { name: "รายงาน" },
    {
      name: "รายงานแผนการให้บริการห้องปฎิบัติการ",
      link: "/report/assign-course",
    },
  ];
  const router = useRouter();
  const [data, setData] = useState({ data: [], semester: [] });
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schId, setSchId] = useState(searchParams.get("schId") || "");

  const _onPressDetail = (id) => {
    router.push(`/report/assign-course/${id}`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (schId === "") {
          const schyearRes = await axios.get(`/api/schyear`);
          const schyear = schyearRes.data;
          if (schyear.success) {
            setSchId(schyear.data);
          }
        }

        const response = await axios.get(`/api/assign-course`, {
          params: { schId },
        });
        const data = response.data;
        if (data.success) {
          setData({ data: data.data, semester: data.semester });
        } else {
          setError("ไม่สามารถโหลดข้อมูลพนักงานได้");
        }
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [reload, schId]);

  const meta = [
    {
      key: "acadyear",
      content: "ปีการศึกษา",
      width: "120",
      render: (item) => (
        <div>
          เทอม {item.semester}/{item.acadyear}
        </div>
      ),
    },
    {
      key: "coursecode",
      content: "รหัสวิชา",
      width: "700",
    },
    {
      key: "coursename",
      content: "ชื่อวิชา",
      width: "100",
    },
    {
      key: "facultyname",
      content: "สำนักวิชา",
    },
    {
      key: "coursecode",
      content: "รหัสวิชา",
      width: "100",
    },
    {
      key: "coursename",
      content: "ชื่อวิชา",
      width: "100",
    },
    {
      key: "facultyname",
      content: "สำนักวิชา",
      width: "100",
    },
    {
      key: "labroom",
      content: "จำนวนห้อง",
      width: "110",
      className: "text-center",
    },

    {
      key: "fullname",
      content: "ผู้รับผิดชอบหลัก",
      width: "100",
    },

    {
      key: "section",
      content: "จำนวนกลุ่มเรียน",
      className: "text-center",
      width: "100",
    },

    {
      key: "totalseat",
      content: "จำนวน นศ. ที่เปิด",
      className: "text-center",
      width: "100",
    },
    {
      key: "enrollseat",
      content: "จำนวน นศ. ที่ลงทะเบียน",
      className: "text-center",
      width: "100",
    },

    {
      key: "labId",
      content: "Action",
      width: "100",
      nowrap: true,
      sort: false,
      render: (item) => (
        <div className="flex gap-1">
          <button
            className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              return _onPressDetail(item.labId);
            }}
          >
            <FiEdit className="w-4 h-4" />
            รายละเอียด
          </button>
        </div>
      ),
    },
  ];

  return (
    <Content
      breadcrumb={breadcrumb}
      title="รายงานแผนการให้บริการห้องปฎิบัติการ"
    >
      <div className="relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <div className="p-4 border-b border-gray-200  flex justify-between items-center">
          <div>
            <h3 className="font-semibold ">กำหนดรายวิชา</h3>
          </div>
          <div className="flex gap-1">
            <select
              value={schId}
              onChange={(e) => {
                setSchId(e.target.value);
                router.push(`/report/assign-course?schId=${e.target.value}`);
              }}
              className="block px-4 py-2 border rounded-md dark:bg-gray-800"
            >
              <option value="">แสดงทุกเทอมการศึกษา</option>
              {data.semester.map((item) => (
                <option key={item.schId} value={item.schId}>
                  เทอม {item.semester}/{item.acadyear}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 overflow-auto">
          {error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <TableList meta={meta} data={data.data} loading={loading} />
          )}
        </div>
      </div>
    </Content>
  );
}

const className = {
  label:
    "mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300 dark:text-gray-300",
  input:
    "block w-full px-3 py-1.5 border rounded-md shadow-sm dark:bg-gray-800",
  select: "block px-4 py-2 border rounded-md dark:bg-gray-800",
};
