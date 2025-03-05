"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import Content from "@/components/Content";
import TableList from "@/components/TableList";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import { textAlign } from "@mui/system";

export default function List() {
  const breadcrumb = [
    { name: "กำหนดค่าเริ่มต้น", link: "/matter" },
    { name: "หน่วยนับ", link: "/materials" },
  ];
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const _onPressAdd = () => {
    router.push("/materials/new");
  };
  const _onPressEdit = (id) => {
    router.push(`/materials/${id}`);
  };
  const _onPressDelete = async (id) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบข้อมูล ?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      background: "#1f2937",
      color: "#fff",
    });

    if (result.isConfirmed) {
      await axios.delete(`/api/materials?id=${id}`);
      await Swal.fire({
        title: "ลบข้อมูลเรียบร้อย!",
        icon: "success",
        showCancelButton: false,
        showConfirmButton: false,
        timer: 1000,
      });
      window.location.reload();
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/api/materials`);
        const data = response.data;
        if (data.success) {
          setEmployees(data.data);
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
  }, []);

  const meta = [
    {
      key: "unitName",
      content: "ชื่อหน่วยนับ",
    },
    {
      key: "status",
      content: "สถานะ",
      className: "text-center",
      width: "100",
      render: (item) => {
        return (
          <div className="flex  items-center">
            <span
              className={`px-2 py-1 text-sm font-medium rounded-full  ${
                item.status === "1"
                  ? "bg-green-500 text-white "
                  : "bg-red-500 text-white "
              }`}>
              {item.status === "1" ? "ใช้งาน" : "ไม่ใช้งาน"}
            </span>
          </div>
        );
      },
    },
    {
      key: "unitId",
      content: "Action",
      width: "100",
      render: (item) => (
        <div className="flex gap-1">
          <button
            className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              return _onPressEdit(item.unitId);
            }}>
            <FiEdit className="w-4 h-4" />
            แก้ไข
          </button>
          <button
            className="cursor-pointer p-2 text-white text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => _onPressDelete(item.unitId)}
            disabled={item.used === 1}>
            <FiTrash2 className="w-4 h-4" />
            ลบ
          </button>
        </div>
      ),
    },
  ];

  return (
    <Content breadcrumb={breadcrumb} title="หน่วยนับ">
      <div className="relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <div className="p-4 border-b border-gray-200  flex justify-between items-center">
          <Link href="/matter">
            <label className="swap text-6xl">
              {/* <div className="swap-off">🥶</div> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-8">
                <path
                  fillRule="evenodd"
                  d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </Link>
          <div className="flex gap-2 items-center p-4">
            <h3 className="text-2xl font-semibold ">หน่วยนับ</h3>
          </div>
          <div className="flex gap-1 ml-auto">
            <button
              className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              onClick={_onPressAdd}>
              <FiPlus className="w-4 h-4" />
              เพิ่มใหม่
            </button>
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
