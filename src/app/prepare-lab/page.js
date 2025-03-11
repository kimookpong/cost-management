"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Content from "@/components/Content";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import TableList from "@/components/TableList";

const data = [
  {
    plabId: 1,
    brandName: "BIO61-192",
    status: "1",
    brandId: 1,
    used: 0,
    nameSub: "Basic Medical Biochemistry Laboratory",
    numLab: 1,
    num: 20,
    numStu: 30,
  },
  {
    plabId: 2,
    brandName: "BIO62-192",
    status: "1",
    brandId: 1,
    used: 0,
    nameSub: "Basic Medical Biochemistry Laboratory 2",
    numLab: 10,
    num: 10,
    numStu: 30,
  },
];
export default function Page() {
  const breadcrumb = [{ name: "เตรียมปฏิบัติการ", link: "/prepare-lab" }];
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(0);

  const _onPressAdd = () => {
    router.push("/prepare-lab/new");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // ใช้ข้อมูลจำลองโดยตรง
        setEmployees(data);
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [reload]);
  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  // Define the meta variable if needed

  const meta = [
    {
      key: "brandName",
      content: "รหัสวิชา",
    },
    {
      key: "nameSub",
      content: "รายวิชา",
    },
    {
      key: "numLab",
      content: " จำนวนห้อง LAB ที่เปิด",
      width: "200",
      className: "text-center",
      render: (item) => {
        return <span className="item-center">{item.numLab}</span>;
      },
    },
    {
      key: "num",
      content: " จำนวนกลุ่ม (กลุ่ม)",
      width: "200",
      className: "text-center",
    },
    {
      key: "numStu",
      content: " จำนวนนักศึกษาทั้งหมด (คน)",
      width: "200",
      className: "text-center",
    },
    {
      key: "plabId",
      content: "จัดการใบเตรียมปฏิบัติการ",
      width: "200",
      className: "text-center",
      render: (item) => (
        <div className="cursor-pointer items-center justify-center flex gap-1">
          <button
            className="cursor-pointer p-2 text-white text-sm bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed justify-center"
            onClick={() => _onPressAdd(item.plabId)}>
            <FiEdit className="w-4 h-4" />
            จัดการ
          </button>
        </div>
      ),
    },
  ];

  return (
    <Content breadcrumb={breadcrumb} title="เตรียมปฏิบัติการ">
      <div className="relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="font-semibold">เตรียมปฏิบัติการ</h3>
          </div>

          <div className="flex gap-1">
            {/* <button
              className="cursor-pointer p-3 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 justify-center"
              onClick={_onPressAdd}>
              <FiPlus className="w-4 h-4" />
              เพิ่มใหม่
            </button> */}
          </div>
        </div>
        <div className="p-4 overflow-auto">
          {error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <TableList meta={meta} data={employees} loading={loading} />
          )}
        </div>
      </div>
    </Content>
  );
}
