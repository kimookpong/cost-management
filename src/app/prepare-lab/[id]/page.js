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
    nameH: "ญาปกา สัมพันธมาศ",
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
    nameH: "สุภาพร ทองจันทร์",
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
    router.push("/prepare-lab/worksheet");
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
  const meta = [
    {
      key: "nameSub",
      content: "ใบงานเตรียมปฏิบัติการ",
    },
    {
      key: "nameH",
      content: " หัวหน้าบทปฏิบัติการ",
      width: "200",
      className: "text-center",
      render: (item) => {
        return <span className="item-center">{item.nameH}</span>;
      },
    },

    {
      key: "plabId",
      content: "จัดการใบเตรียมปฏิบัติการ",
      width: "200",
      className: "text-center",
      render: (item) => (
        <div className="cursor-pointer items-center justify-center flex gap-1">
          <button
            className="cursor-pointer p-2 text-white text-sm bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed justify-center"
            onClick={() => _onPressAdd(item.plabId)}>
            <FiEdit className="w-4 h-4" />
            แก้ไข
          </button>
          <button
            className="cursor-pointer p-2 text-white text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed justify-center"
            onClick={() => _onPressAdd(item.plabId)}>
            <FiTrash2 className="w-4 h-4" />
            ลบ
          </button>
        </div>
      ),
    },
  ];
  return (
    <Content breadcrumb={breadcrumb} title="เตรียมปฏิบัติการ">
      <div className="relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <div className="p-4 border-b border-gray-200 items-center">
          <div className="flex gap-1 justify-center items-center p-4">
            <h3 className="font-semibold text-2xl">ใบเตรียมปฏิบัติการ</h3>
          </div>
          <div className="flex gap-1 justify-center items-center p-1 border-b border-gray-200">
            <p className="text-xl text-gray-500">
              BlO61-192 Basic Medical Biochemistry Laboratory
            </p>
          </div>
          <div className="flex gap-1 justify-left items-left p-1 border-b font-semibold">
            <h3 className="text-xl text-gray-900 p-2 boder">รายละเอียดวิชา</h3>
          </div>
          <div className="flex gap-1 justify-left items-left p-1 border-gray-200 ">
            <p className="text-lg text-gray-900 p-2 font-medium">
              จำนวน Section ที่เปิดให้บริการ
            </p>
          </div>
          <div className="flex gap-1 justify-left items-left  ps-16 border-gray-200">
            <p className="text-lg text-gray-700">
              1 Section จำนวน 2 ห้องปฏิบัติการ
            </p>
          </div>
          <div className="flex gap-1 justify-left items-left p-1 border-gray-200">
            <p className="text-lg text-gray-900 p-2 font-medium">
              วันและเวลาเรียน
            </p>
          </div>
          <div className="flex gap-1 justify-left items-left  ps-16 border-gray-200 ">
            <p className="text-lg text-gray-700 ">
              วันพฤหัสบดี เวลา 03.00 - 16.00 น. จำนวน 2 ห้องปฏิบัติการ(เคมี 3-4)
            </p>
          </div>
          <div className="flex gap-1 justify-left items-left pt-6 border-b font-semibold">
            <h3 className="text-xl text-gray-900 p-2 boder">
              รายการเตรียมปฏิบัติการ
            </h3>
          </div>
          <div className="p-2 mr-4 flex justify-end items-center">
            <button
              className="cursor-pointer p-3 text-white text-sm bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              onClick={_onPressAdd}>
              <FiPlus className="w-4 h-4" />
              เพิ่มใบงานเตรียมปฏิบัติการ
            </button>
          </div>
        </div>
        <div className="p-2 overflow-auto responsive">
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
