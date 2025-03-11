"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Content from "@/components/Content";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import TableList from "@/components/TableList";
import Tabs from "@/components/Tabs";
// import AddItemForm from "@/components/AddItemForm";
// import { , FiEdit ,} from "react-feather";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
// import Button from "@/components/Button";
/**
 * @typedef {Object} InventoryItem
 * @property {number} id
 * @property {string} name
 * @property {number} quantity
 */
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
  const [items, setItems] = useState([
    {
      id: 1,
      name: "เครื่องตั้ง 2 ตำแหน่ง พร้อมแปรรูปสาร",
      quantity: "2 เครื่อง",
      status: "แก้ไข ลบ",
    },
    {
      id: 2,
      name: "เครื่องกาพพร้อมแผ่นให้ความร้อน Heidolph",
      quantity: "1 ชุด",
      status: "แก้ไข ลบ",
    },
  ]); // สร้างตัวแปร items และ setItems ขึ้นมาเพื่อเก็บข้อมูล
  const breadcrumb = [
    {
      name: "เตรียมปฏิบัติการ",
      link: "/prepare-lab",
    },
    { name: "ใบเตรียมปฏิบัติการ", link: "/prepare-lab" },
  ];
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
              ข้อมูลใบเตรียมปฏิบัติการ
            </h3>
          </div>
          <div className="flex gap-2 justify-end items-center p-4 border-gray-200">
            <label className="text-lg text-gray-900 font-medium w-60">
              ชื่อใบงานเตรียมปฎิบัติการ
            </label>
            <input
              type="text"
              className="border border-gray-500 p-2 rounded-lg w-full"
            />
          </div>
          <div className="flex gap-2 justify-end items-center p-4 border-gray-200">
            <label className="text-lg text-gray-900 font-medium w-60">
              หัวหน้าบทปฏิบัติการ
            </label>
            <select className="border border-gray-500 p-2 rounded-lg w-full">
              <option value="1">ญาปกา สัมพันธมาศ</option>
              <option value="2">สุภาพร ทองจันทร์</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end items-center p-4 border-gray-200">
            <label className="text-lg text-gray-900 font-medium w-60">
              รายละเอียด
            </label>
            <textarea
              type="text"
              className="border border-gray-500 p-2 rounded-lg w-full"
            />
          </div>

          <div className="flex gap-1 justify-left items-left pt-6 border-b font-semibold">
            <h3 className="text-xl text-gray-900 p-2 boder">
              ข้อมูลวัสดุครุภัณฑ์ที่ต้องจัดเตรียม
            </h3>
          </div>
          <div className="flex gap-1 justify-end items-center p-4 border-gray-200">
            <button className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105">
              <FiPlus className="w-4 h-4" />
              เพิ่มวัสดุครุภัณฑ์
            </button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <div className="container mx-auto p-4">
              <Tabs />
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
}
