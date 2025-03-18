"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Content from "@/components/Content";
import { confirmDialog, toastDialog } from "@/lib/stdLib";
import { useSession } from "next-auth/react";
// import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

/**
 * @typedef {Object} InventoryItem
 * @property {number} id
 * @property {string} name
 * @property {number} quantity
 */

export default function Page() {
  const { data: session } = useSession();
  const userCreated = session?.user.person_id;
  // console.log(user);
  const searchParams = useSearchParams();
  const labId = searchParams.get("labId");
  const labjobId = searchParams.get("labjobId");
  // const isNew = labjobId;
  const isNew = labjobId === "new";
  // console.log("isNew", isNew);
  const [loading, setLoading] = useState(!isNew);
  const breadcrumb = [{ name: "เตรียมปฏิบัติการ", link: "/prepare-lab" }];

  const router = useRouter();
  const [formData, setFormData] = useState({
    labjobTitle: "", // ชื่อใบงานเตรียมปฏิบัติการ
    personId: "", // หัวหน้าบทปฏิบัติการ
    userCreated: userCreated,
  });

  // ฟังก์ชันจัดการค่าที่เปลี่ยนในฟอร์ม
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ฟังก์ชันบันทึกข้อมูล (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;     
      const updatedFormData = { ...formData, labId, userCreated };     
      if (labjobId !== "new") {
        // อัปเดตข้อมูลถ้ามี labjobId      
        response = await axios.put(
          `/api/labjob?labjobId=${labjobId}`,
          updatedFormData
        );      
       
      } else {
        // สร้างข้อมูลใหม่      
        response = await axios.post("/api/labjob", updatedFormData);
      }

      if (response.data.success) {
        toastDialog("บันทึกข้อมูลเรียบร้อย!", "success");
        router.push("/prepare-lab/new?labId=" + labId); // กลับไปหน้าหลัก
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };
  useEffect(() => {
    if (!isNew) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/labjob?labjobId=${labjobId}`);
          const data = response.data;
          if (data.success) {
            const labjob = data.data[0];
            setFormData({
              labjobTitle: labjob.labjobTitle || "",
              personId: labjob.personId || "",
              userCreated: labjob.userCreated || "",
            });
          } else {
            console.error("Error fetching labjob data:", data.error);
            alert("ไม่สามารถโหลดข้อมูลได้");
          }
        } catch (err) {
          console.error("Error fetching labjob data:", err);
          alert("ไม่สามารถโหลดข้อมูลได้");
        } finally {
          setLoading(false); // Ensures that loading is set to false no matter what
        }
      };
      fetchData();
    }
  }, [isNew]); // Trigger effect when isNew changes

  return (
    <Content breadcrumb={breadcrumb} title="เตรียมปฏิบัติการ">
      <div className="relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <div className="p-4 border-b border-gray-200 items-center">
          <input type="hidden" name="labjobId" value="" />
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
          <form onSubmit={handleSubmit}>
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
                name="labjobTitle"
                value={formData.labjobTitle}
                onChange={handleChange}
                className="border border-gray-500 p-2 rounded-lg w-full"
                required
              />
            </div>
            <div className="flex gap-2 justify-end items-center p-4 border-gray-200">
              <label className="text-lg text-gray-900 font-medium w-60">
                หัวหน้าบทปฏิบัติการ
              </label>
              <select
                name="personId"
                value={formData.personId} // เชื่อมโยงกับ formData.personId
                onChange={handleChange} // ให้ฟังก์ชัน handleChange อัปเดตค่าของ formData
                className="border border-gray-500 p-2 rounded-lg w-full"
                required>
                <option value="">-เลือก-</option>
                <option value="6300000261">ญาปกา สัมพันธมาศ</option>
                <option value="6300000263">สุภาพร ทองจันทร์</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => router.push("/prepare-lab/new?labId=" + labId)}
                className="cursor-pointer p-2 text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                ยกเลิก
              </button>
              <button
                type="submit"
                className="cursor-pointer p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isNew ? "บันทึก" : "บันทึก"}
              </button>
            </div>
          </form>
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
