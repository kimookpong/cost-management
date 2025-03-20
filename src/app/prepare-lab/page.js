"use client";
import { useRouter, useSearchParams } from "next/navigation";
//import { useForm, Controller } from "react-hook-form";
//import Select from "react-select";
import { useState, useEffect } from "react";
import axios from "axios";
import Content from "@/components/Content";
import { FiEdit } from "react-icons/fi";
import TableList from "@/components/TableList";
export default function Page() {
  const breadcrumb = [{ name: "เตรียมปฏิบัติการ", link: "/prepare-lab" }];
  const searchParams = useSearchParams();
  const router = useRouter();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schYears, setSchYears] = useState([]);
  const [lab, setLab] = useState([]);
  const initialSchId = searchParams.get("schId") || ""; // Get schId from URL
  const [schId, setSchId] = useState(initialSchId);

  const _onPressAdd = (labId) => {
    router.push(`/prepare-lab/new?labId=${labId}`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const schYearRes = await axios.get("/api/academic");
        console.log("Academic Data:", schYearRes.data); // Debugging
        const fetchedSchYears = schYearRes.data.data || [];
        setSchYears(fetchedSchYears);
        // Set the initial schId where status is 1
        if (!schId) {
          const defaultSchId = fetchedSchYears.find(
            (item) => item.status === 1
          )?.schId;
          if (defaultSchId) {
            setSchId(defaultSchId);
          }
        }

        const response = await axios.get(`/api/prepare-lab`, {
          params: { schId },
        });
        const data = response.data;
        console.log("lab", data);
        if (response.data.success) {
          setLab(response.data.data || []); // Access `data.data`
        } else {
          setLab([]); // Ensure it's always an array
        }
      } catch (err) {
        console.error(
          "Error fetching lab data:",
          err.response?.data || err.message
        );
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [schId]);

  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  // Define the meta variable if needed

  const meta = [
    {
      key: "courseunicode",
      content: "รหัสวิชา",
      className: "text-center",
      width: "150",
      render: (item) => {
        return (
          <>
            <div className="item-center">
              <span>{item.courseunicode}</span>
            </div>
            <div className="item-center">
              <span>{item.courseunit}</span>
            </div>
          </>
        );
      },
    },
    ,
    {
      key: "coursename",
      content: "รายวิชา",
      render: (item) => {
        return (
          <>
            <div className="item-center">
              <span> {item.coursename}</span>
            </div>
            <div className="item-center">
              <span>({item.coursenameeng})</span>
            </div>
          </>
        );
      },
    },
    {
      key: "enrollseat",
      content: "เปิดลงทะเบียน/จำนวนนักศึกษา",
      width: "200",
      className: "text-center",
      render: (item) => {
        return (
          <span className="item-center">
            {item.totalseat} / {item.enrollseat}
          </span>
        );
      },
    },
    {
      key: "labroom",
      content: " จำนวนห้อง LAB ที่เปิด",
      width: "200",
      className: "text-center",
      render: (item) => {
        return <span className="item-center">{item.labroom}</span>;
      },
    },
    {
      key: "section",
      content: " จำนวนกลุ่ม (กลุ่ม)",
      width: "200",
      className: "text-center",
    },
    {
      key: "hour",
      content: " จำนวนชม.ที่เรียนต่อสัปดาห์",
      width: "200",
      className: "text-center",
    },
    {
      key: "labId",
      content: "จัดการใบเตรียมปฏิบัติการ",
      width: "200",
      className: "text-center",
      render: (item) => (
        <div className="cursor-pointer items-center justify-center flex gap-1">
          <button
            className="cursor-pointer p-2 text-white text-sm bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed justify-center"
            onClick={() => _onPressAdd(item.labId)}>
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

          <div className=" gap-1  justify-end">
            <div className="flex gap-2 justify-end items-center">
              <label className="block text-lg font-medium text-gray-900 dark:text-gray-300 dark:text-gray-300 w-full">
                ปีการศึกษา
              </label>
              <select
                name="schId"
                className="border border-gray-500 p-2 rounded-lg w-full"
                value={schId}
                onChange={(e) => setSchId(e.target.value)}>
                {schYears.map((item) => (
                  <option key={item.schId} value={item.schId}>
                    {item.acadyear} / {item.semester}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="p-4 overflow-auto">
          {error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <TableList meta={meta} data={lab} loading={loading} />
          )}
        </div>
      </div>
    </Content>
  );
}
const className = {
  label:
    "block text-sm font-medium text-gray-900 dark:text-gray-300 dark:text-gray-300",
  input:
    "block w-full px-3 py-1.5 border rounded-md shadow-sm dark:bg-gray-800",
  select: "block px-4 py-2 border rounded-md dark:bg-gray-800",
};
