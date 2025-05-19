"use client"; // ✅ ต้องเพิ่ม

import { useSession, signOut } from "next-auth/react";
import Content from "@/components/Content";
import { useState } from "react";
import { useEffect } from "react";
// import React, { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileText, Users, Beaker, TrendingUp } from "lucide-react";
const tabs1 = [
  "ภาพรวม",
  "บทปฏิบัติการ",
  "อุปกรณ์",
  "หัวหน้าบทปฏิบัติการ",
  "คณะ",
  "หลักสูตร",
];
export default function Dashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("แนวโน้ม");
  const [dataFaculty, setFaculty] = useState(null);
  const [dataReg, setReg] = useState(null);
  const [dataLabjob, setLabjob] = useState(null);
  const [dataCourse, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = 22;
  const [activeTab1, setActiveTab1] = useState("ภาพรวม");
  const chartData = [
    { month: "ม.ค", value: 25000 },
    { month: "ก.พ", value: 32000 },
    { month: "มี.ค", value: 28000 },
    { month: "เม.ย", value: 35000 },
    { month: "พ.ค", value: 40000 },
    { month: "มิ.ย", value: 38000 },
  ];

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/report/labcourse?id=${id}`);
      if (res.ok) {
        const json = await res.json();
        setFaculty(json.faculty);
        setData(json.data);
        setReg(json.reg);
        setLabjob(json.labjob);
        console.log("json", json);
      } else {
        console.error("Failed to fetch data");
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  return (
    <Content>
      {/* <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-white dark:text-gray-300">
          Dashboard
        </h1>
        <main>
          <h1>Welcome, {session.user.name}</h1>
          <button onClick={() => signOut()}>Logout</button>
        </main>
      </div> */}
      <div className="min-h-screen bg-purple-50">
        <header className="bg-black text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              <div>
                <h1 className="text-xl font-bold">
                  รายงานต้นทุนห้องปฏิบัติการ
                </h1>
                <p className="text-sm text-gray-300">
                  ระบบบริหารและจัดสรรงบประมาณห้องปฏิบัติการ
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span>
                  รหัสวิชา:{" "}
                  {dataCourse && dataCourse.length > 0
                    ? dataCourse[0].coursecode
                    : "กำลังโหลด..."}
                  -{" "}
                  {dataCourse && dataCourse.length > 0
                    ? dataCourse[0].coursename
                    : "กำลังโหลด..."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  คณะ:{" "}
                  {dataCourse && dataCourse.length > 0
                    ? dataCourse[0].facultyname
                    : "กำลังโหลด..."}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  ปีการศึกษา:{" "}
                  {dataCourse && dataCourse.length > 0
                    ? dataCourse[0].acadyear
                    : "กำลังโหลด..."}
                  {" / "}
                  {dataCourse && dataCourse.length > 0
                    ? dataCourse[0].semester
                    : "กำลังโหลด..."}
                </span>
              </div>
            </div>
          </div>
        </header>
        <div
          role="tablist"
          aria-orientation="horizontal"
          className="tabs tabs-boxed h-10 items-center justify-center rounded-lg text-muted-foreground grid grid-cols-12 mb-2 bg-white shadow-md"
          tabIndex={0}>
          {tabs1.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab1 === tab}
              aria-controls={`tab-content-${tab}`}
              data-state={activeTab1 === tab ? "active" : "inactive"}
              onClick={() => setActiveTab1(tab)}
              className={`tab tab-boxed col-span-2 text-center  rounded-lg transition-all duration-200 
            ${activeTab1 === tab ? "tab-active !bg-gray-200" : ""}
          `}>
              {tab}
            </button>
          ))}
        </div>
        <div>
          {/* Tab Panels */}
          {tabs1.map((tab) => {
            const isActive = activeTab1 === tab;
            const panelId = `tab-content-${tab.replace(/\s+/g, "-")}`;
            const tabId = `tab-${tab.replace(/\s+/g, "-")}`;
            return (
              <div
                key={tab}
                id={panelId}
                role="tabpanel"
                aria-labelledby={tabId}
                hidden={!isActive}
                className="p-2 border rounded-md bg-white">
                {isActive && activeTab1 === "ภาพรวม" && (
                  <main className="container mx-auto py-6 px-4">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {/* Card 1 */}
                      <div className="card bg-red-50 p-4 border shadow border-red-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-red-100 p-2 rounded-full">
                            <FileText className="h-5 w-5 text-red-500" />
                          </div>
                          <span className="text-red-500 font-medium">
                            ต้นทุนรวม
                          </span>
                        </div>
                        <h2 className="text-black text-2xl font-bold">
                          3,053,449.27 บาท
                        </h2>
                        <p className="text-sm text-gray-500">
                          ต้นทุนทั้งหมดของห้องปฏิบัติการ
                        </p>
                      </div>

                      {/* Card 2 */}
                      <div className="card p-4 bg-blue-50 border shadow border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Users className="h-5 w-5 text-blue-500" />
                          </div>
                          <span className="text-blue-500 font-medium">
                            นักศึกษา
                          </span>
                        </div>
                        <h2 className="text-black text-2xl font-bold">
                          280 คน
                        </h2>
                        <p className="text-sm text-gray-500">
                          จำนวนนักศึกษาที่ลงทะเบียน
                        </p>
                      </div>

                      {/* Card 3 */}
                      <div className="card p-4 bg-amber-50 border shadow border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-amber-100 p-2 rounded-full">
                            <Beaker className="h-5 w-5 text-amber-500" />
                          </div>
                          <span className="text-amber-500 font-medium">
                            บทปฏิบัติการ
                          </span>
                        </div>
                        <h2 className="text-black text-2xl font-bold">
                          7 รายการ
                        </h2>
                        <p className="text-sm text-gray-500">
                          จำนวนบทปฏิบัติการทั้งหมด
                        </p>
                      </div>

                      {/* Card 4 */}
                      <div className="card p-4 bg-green-50 border shadow border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-green-100 p-2 rounded-full">
                            <TrendingUp className="h-5 w-5 text-green-500" />
                          </div>
                          <span className="text-green-500 font-medium">
                            ต้นทุนต่อนักศึกษา
                          </span>
                        </div>
                        <h2 className="text-black text-2xl font-bold">
                          10,905.176 บาท
                        </h2>
                        <p className="text-sm text-gray-500">
                          ต้นทุนต่อหัวต่อนักศึกษา
                        </p>
                      </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="card grid grid-cols-1 lg:grid-cols-2 gap-6 ">
                      {/* Cost Analysis Chart */}
                      <div className="p-6 burder shadow border-black-900 rounded-lg">
                        <h2 className="text-black text-2xl font-bold mb-1">
                          การวิเคราะห์ต้นทุน
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                          การเปรียบเทียบสถานะต้นทุนในมุมมองต่างๆ
                        </p>

                        <div className="w-full">
                          <div className="tabs tabs-boxed w-full grid grid-cols-3">
                            <button
                              className={`tab ${
                                activeTab === "แนวโน้ม"
                                  ? "tab-active !bg-gray-200"
                                  : ""
                              }`}
                              onClick={() => setActiveTab("แนวโน้ม")}>
                              แนวโน้ม
                            </button>
                            <button
                              className={`tab ${
                                activeTab === "งบปฏิบัติการ"
                                  ? "tab-active !bg-gray-200"
                                  : ""
                              }`}
                              onClick={() => setActiveTab("งบปฏิบัติการ")}>
                              งบปฏิบัติการ
                            </button>
                            <button
                              className={`tab ${
                                activeTab === "หลักสูตร"
                                  ? "tab-active !bg-gray-200"
                                  : ""
                              }`}
                              onClick={() => setActiveTab("หลักสูตร")}>
                              หลักสูตร
                            </button>
                          </div>

                          {/* Tab Content */}
                          <div className="pt-4">
                            {activeTab === "แนวโน้ม" && (
                              <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={chartData}>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      vertical={false}
                                    />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                      type="monotone"
                                      dataKey="value"
                                      stroke="#10b981"
                                      strokeWidth={2}
                                      dot={{
                                        r: 4,
                                        fill: "#10b981",
                                        stroke: "#10b981",
                                      }}
                                      activeDot={{ r: 6 }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            )}

                            {activeTab === "งบปฏิบัติการ" && (
                              <div className="h-[250px] flex items-center justify-center">
                                <p className="text-gray-500">
                                  ข้อมูลงบปฏิบัติการ
                                </p>
                              </div>
                            )}

                            {activeTab === "หลักสูตร" && (
                              <div className="h-[250px] flex items-center justify-center">
                                <p className="text-gray-500">ข้อมูลหลักสูตร</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Lab Information */}
                      <div className="grid gap-6 ">
                        <div className="card p-6 burder shadow border-black-900 rounded-lg">
                          <h2 className="text-black text-2xl font-bold mb-1">
                            ข้อมูลพื้นฐานของรายวิชา
                          </h2>
                          <p className="text-sm text-gray-500 mb-4">
                            รายละเอียดเกี่ยวกับรายวิชาห้องปฏิบัติการ
                          </p>

                          <div className="grid grid-cols-2 gap-y-3 text-sm">
                            <div className="text-gray-500 text-base">
                              รหัสวิชา:
                            </div>
                            <div className="text-black font-medium text-base">
                              {" "}
                              {dataCourse && dataCourse.length > 0
                                ? dataCourse[0].coursecode
                                : "กำลังโหลด..."}
                              -{" "}
                            </div>

                            <div className="text-gray-500 text-base">
                              ชื่อวิชา:
                            </div>
                            <div className="text-black font-medium text-base">
                              {" "}
                              {dataCourse && dataCourse.length > 0
                                ? dataCourse[0].coursename
                                : "กำลังโหลด..."}{" "}
                            </div>

                            <div className="text-gray-500 text-base">คณะ:</div>
                            <div className="text-black font-medium text-base">
                              {" "}
                              {dataCourse && dataCourse.length > 0
                                ? dataCourse[0].facultyname
                                : "กำลังโหลด..."}{" "}
                            </div>

                            <div className="text-gray-500 text-base">
                              ปีการศึกษา:
                            </div>
                            <div className="text-black font-medium text-base">
                              {" "}
                              {dataCourse && dataCourse.length > 0
                                ? dataCourse[0].acadyear
                                : "กำลังโหลด..."}
                              {" / "}
                              {dataCourse && dataCourse.length > 0
                                ? dataCourse[0].semester
                                : "กำลังโหลด..."}
                            </div>

                            <div className="text-gray-500 text-base">
                              กลุ่มปฏิบัติการ:
                            </div>
                            <div className="text-black font-medium text-base">
                              {" "}
                              {dataCourse && dataCourse.length > 0
                                ? dataCourse[0].labgroupName
                                : "กำลังโหลด..."}{" "}
                            </div>

                            <div className="text-gray-500 text-base">
                              จำนวนกลุ่ม:
                            </div>
                            <div className="text-black font-medium text-base">
                              {" "}
                              {dataCourse && dataCourse.length > 0
                                ? dataCourse[0].labgroupNum
                                : "กำลังโหลด..."}{" "}
                            </div>
                          </div>
                        </div>

                        <div className="card p-6 burder shadow border-black-900 rounded-lg">
                          <h2 className="text-black text-2xl font-bold mb-1">
                            ข้อมูลการลงทะเบียน
                          </h2>
                          <p className="text-sm text-gray-500 mb-4">
                            จำนวนนักศึกษาที่ลงทะเบียนในแต่ละ section
                          </p>
                          {Array.isArray(dataReg) ? (
                            <>
                              {dataReg.map((cls, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="grid gap-y-2 text-sm">
                                    <div className="text-base flex justify-between py-1">
                                      <div className="text-gray-500">
                                        Section {cls.section}:
                                      </div>
                                      <div className="text-black font-medium">
                                        {cls.enrollseat} คน / {cls.totalseat}{" "}
                                        ที่นั่ง
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* รวมจำนวนและอัตราการเต็มรวม */}
                              <div className="grid gap-y-1 text-sm mb-4 mt-2">
                                <div className="flex justify-between py-1 font-medium">
                                  <div className="text-gray-500 text-base">
                                    จำนวนนักศึกษาทั้งหมด:
                                  </div>
                                  <div className="text-black text-base">
                                    {dataReg.reduce(
                                      (sum, cls) => sum + (cls.enrollseat || 0),
                                      0
                                    )}{" "}
                                    คน
                                  </div>
                                </div>
                                <div className="flex justify-between py-1 font-medium">
                                  <div className="text-gray-500 text-base">
                                    อัตราการเต็มรวม:
                                  </div>
                                  <div className="text-black text-base">
                                    {(() => {
                                      const totalEnroll = dataReg.reduce(
                                        (sum, cls) =>
                                          sum + (cls.enrollseat || 0),
                                        0
                                      );
                                      const totalSeat = dataReg.reduce(
                                        (sum, cls) =>
                                          sum + (cls.totalseat || 0),
                                        0
                                      );
                                      return totalSeat > 0
                                        ? (
                                            (totalEnroll / totalSeat) *
                                            100
                                          ).toFixed(2)
                                        : "0.00";
                                    })()}
                                    %
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div>กำลังโหลดข้อมูล...</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Top Lab Costs */}
                    <div className="card mt-6 p-6 burder shadow border-black-900 rounded-lg">
                      <h2 className="text-black text-2xl font-bold mb-1">
                        ต้นทุนงบปฏิบัติการสูงสุด
                      </h2>
                      <p className="text-sm text-gray-500 mb-4">
                        ข้อมูลต้นทุนของบทปฏิบัติ
                      </p>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 font-medium text-gray-500">
                                บทปฏิบัติการ
                              </th>
                              <th className="text-left py-3 font-medium text-gray-500">
                                หัวหน้างบปฏิบัติการ
                              </th>
                              <th className="text-right py-3 font-medium text-gray-500">
                                ต้นทุนรวม (บาท)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(dataLabjob) &&
                            dataLabjob.length > 0 ? (
                              dataLabjob.map((job, index) => (
                                <tr key={index} className="border-b">
                                  <td className="text-black py-3">
                                    {job.labjobTitle}
                                  </td>
                                  <td className="py-3 text-black">
                                    {job.fullname}
                                  </td>
                                  <td className="py-3 text-right text-black">
                                    {(() => {
                                      const total = job.asset.reduce(
                                        (sum, item) => {
                                          const amount = parseFloat(
                                            item.amountUsed || 0
                                          );
                                          const price = parseFloat(
                                            item.unitPrice || 0
                                          );
                                          return sum + amount * price;
                                        },
                                        0
                                      );

                                      return (
                                        <>
                                          {/* {job.asset.map((item, i) => (
                                        <div key={i}>
                                          {item.assetNameTh} ({item.amountUsed} ชิ้น)
                                        </div>
                                      ))} */}
                                          <div className="mt-2 font-medium text-black-600">
                                            {total.toLocaleString(undefined, {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })}
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="py-3 text-center text-gray-400">
                                  ไม่พบข้อมูลการทดลอง
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </main>
                )}
                {isActive && activeTab1 === "บทปฏิบัติการ" && (
                  <main className="container mx-auto py-6 px-4">
                    {/* Top Lab Costs */}
                    <div className="card mt-6 p-6 burder shadow border-black-900 rounded-lg">
                      <h2 className="text-black text-2xl font-bold mb-1">
                        ต้นทุนงบปฏิบัติการสูงสุด
                      </h2>
                      <p className="text-sm text-gray-500 mb-4">
                        ข้อมูลต้นทุนของบทปฏิบัติ
                      </p>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 font-medium text-gray-500">
                                บทปฏิบัติการ
                              </th>
                              <th className="text-left py-3 font-medium text-gray-500">
                                หัวหน้างบปฏิบัติการ
                              </th>
                              <th className="text-right py-3 font-medium text-gray-500">
                                ต้นทุนรวม (บาท)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(dataLabjob) &&
                            dataLabjob.length > 0 ? (
                              dataLabjob.map((job, index) => (
                                <tr key={index} className="border-b">
                                  <td className="text-black py-3">
                                    {job.labjobTitle}
                                  </td>
                                  <td className="py-3 text-black">
                                    {job.fullname}
                                  </td>
                                  <td className="py-3 text-right text-black">
                                    {(() => {
                                      const total = job.asset.reduce(
                                        (sum, item) => {
                                          const amount = parseFloat(
                                            item.amountUsed || 0
                                          );
                                          const price = parseFloat(
                                            item.unitPrice || 0
                                          );
                                          return sum + amount * price;
                                        },
                                        0
                                      );

                                      return (
                                        <>
                                          {/* {job.asset.map((item, i) => (
                                        <div key={i}>
                                          {item.assetNameTh} ({item.amountUsed} ชิ้น)
                                        </div>
                                      ))} */}
                                          <div className="mt-2 font-medium text-black-600">
                                            {total.toLocaleString(undefined, {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            })}
                                          </div>
                                        </>
                                      );
                                    })()}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={3}
                                  className="py-3 text-center text-gray-400">
                                  ไม่พบข้อมูลการทดลอง
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </main>
                )}
              </div>
            );
          })}
        </div>
        );
      </div>
    </Content>
  );
}
