"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Content from "@/components/Content";
import axios from "axios";
import Swal from "sweetalert2";

export default function AssetForm() {
  const breadcrumb = [{ name: "จัดการครุภัณฑ์", link: "/assetss" }];
  const router = useRouter();
  const { id } = useParams(); // Get the id from the URL parameters
  const isNew = id === "new"; // Determine if this is a new asset or an existing one
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryAndGrade, setShowCategoryAndGrade] = useState(false);
  const [options, setOptions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [type, setTypes] = useState([]);
  const [group, setGroups] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      assetNameTh: "",
      assetNameEng: "",
      amountUnit: "",
      version: "",
      brandId: "",
      catNo: "",
      grade: "",
      unitId: "",
      unitPrice: "",
      packPrice: "",
      invgroupId: "",
      invtypeId: "",
      status: "1",
    },
  });

  const typeassetValue = watch("invtypeId");

  useEffect(() => {
    console.log("typeassetValue changed:", typeassetValue);
    if (typeassetValue === "2" || typeassetValue === "3") {
      setShowCategoryAndGrade(true);
    } else {
      setShowCategoryAndGrade(false);
    }
  }, [typeassetValue]);

  useEffect(() => {
    setShowCategoryAndGrade(typeassetValue === "2" || typeassetValue === "3");
  }, [typeassetValue]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [materialsRes, brandsRes, typesRes, groupsRes] =
          await Promise.all([
            axios.get("/api/materials"),
            axios.get("/api/brand"),
            axios.get("/api/invtype"),
            axios.get("/api/invgroup"),
          ]);

        setOptions(materialsRes.data.data || []);
        setBrands(brandsRes.data.data || []);
        setTypes(typesRes.data.data || []);
        setGroups(groupsRes.data.data || []);
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const onSubmit = async (values) => {
    try {
      if (isNew) {
        await axios.post(`/api/assetss`, values);
        await Swal.fire({
          title: "เพิ่มข้อมูลใหม่เรียบร้อย!",
          icon: "success",
          timer: 1000,
        }).then(() => {
          router.push("/assetss"); // ไปที่หน้า assetss หลังจาก Swal ปิด
        });
      } else {
        await axios.put(`/api/assetss?id=${id}`, values);
        await Swal.fire({
          title: "แก้ไขข้อมูลเรียบร้อย!",
          icon: "success",
          timer: 1000,
        }).then(() => {
          router.push("/assetss"); // ไปที่หน้า assetss หลังจาก Swal ปิด
        });
      }
      router.back();
    } catch (error) {
      console.error("Error saving asset:", error);
      Swal.fire({ title: "เกิดข้อผิดพลาด", icon: "error" });
    }
  };

  return (
    <Content breadcrumb={breadcrumb}>
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 text-2xl">
              {isNew ? "เพิ่มข้อมูลครุภัณฑ์" : "แก้ไขข้อมูลครุภัณฑ์"}
            </h3>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="form-control max-w-6xl mx-auto space-y-4 p-2">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Asset Names */}
              <div className="form-control">
                <label className={className.label}>
                  ชื่อครุภัณฑ์ (ภาษาไทย) *
                </label>
                <input
                  type="text"
                  {...register("assetNameTh", {
                    required: "ระบุข้อมูลนี้",
                  })}
                  className={className.input}
                />
                {errors.assetNameTh && (
                  <label className={className.label}>
                    <span className="label-text-alt text-error">
                      {errors.assetNameTh.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className={className.label}>
                  ชื่อครุภัณฑ์ (English)
                </label>
                <input
                  type="text"
                  {...register("assetNameEng", {
                    required: "ระบุข้อมูลนี้",
                  })}
                  className={className.input}
                />
                {errors.assetNameEng && (
                  <label className={className.label}>
                    <span className="label-text-alt text-error">
                      {errors.assetNameEng.message}
                    </span>
                  </label>
                )}
              </div>

              {/* หน่วยนับ และ ยี่ห้อ */}
              <div className="grid grid-cols-3 gap-2">
                {/* Type and Category */}
                <div className="form-control">
                  <label className={className.label}>ประเภทครุภัณฑ์ *</label>
                  <select
                    {...register("invtypeId", {
                      required: "ระบุข้อมูลนี้",
                    })}
                    className={className.select}>
                    <option value="">- เลือก -</option>
                    {type.map((types) => (
                      <option key={types.invtypeId} value={types.invtypeId}>
                        {types["invtype Name"]}
                      </option>
                    ))}
                  </select>
                  {errors.invtypeId && (
                    <label className={className.label}>
                      <span className="label-text-alt text-error">
                        {errors.invtypeId.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className={className.label}>หน่วยนับ *</label>
                  <select
                    {...register("unitId", {
                      required: "ระบุข้อมูลนี้",
                    })}
                    className="w-50 px-1 py-2 border-2 rounded-md shadow-sm dark:bg-gray-800 dark:border-white text-black focus:outline-indigo-600">
                    <option value="">- เลือก -</option>
                    {options.map((option) => (
                      <option key={option.unitId} value={option.unitId}>
                        {option.unitName}
                      </option>
                    ))}
                  </select>
                  {errors.unitId && (
                    <label className={className.label}>
                      <span className="label-text-alt text-error">
                        {errors.unitId.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className={className.label}>ยี่ห้อ *</label>
                  <select
                    {...register("brandId", {
                      required: "ระบุข้อมูลนี้",
                    })}
                    className="w-50 px-1 py-2 border-2 rounded-md shadow-sm dark:bg-gray-800 dark:border-white text-black focus:outline-indigo-600">
                    <option value="">- เลือก -</option>
                    {brands.map((brand) => (
                      <option key={brand.brandId} value={brand.brandId}>
                        {brand.brandName}
                      </option>
                    ))}
                  </select>
                  {errors.brandId && (
                    <label className={className.label}>
                      <span className="label-text-alt text-error">
                        {errors.brandId.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Amount and Version */}
                <div className="form-control">
                  <label className={className.label}>ขนาด/ขนาดบรรจุ *</label>
                  <input
                    type="text"
                    {...register("amountUnit", {
                      required: "ระบุข้อมูลนี้",
                    })}
                    className={className.input}
                    placeholder="ขนาด/ขนาดบรรจุ"
                  />
                  {errors.amountUnit && (
                    <label className={className.label}>
                      <span className="label-text-alt text-error">
                        {errors.amountUnit.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className={className.label}>รุ่น *</label>
                  <input
                    type="text"
                    {...register("version")}
                    className={className.input}
                    placeholder="รุ่น"
                  />
                  {errors.version && (
                    <label className={className.label}>
                      <span className="label-text-alt text-error">
                        {errors.version.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {showCategoryAndGrade && (
                <>
                  <div className="form-control">
                    <label className={className.label}>Category No. *</label>
                    <input
                      type="text"
                      {...register("catNo", {
                        required: "ระบุข้อมูลนี้",
                      })}
                      className={className.input}
                      placeholder="Category Number"
                    />
                    {errors.catNo && (
                      <label className={className.label}>
                        <span className="label-text-alt text-error">
                          {errors.catNo.message}
                        </span>
                      </label>
                    )}
                  </div>
                  <div className="form-control">
                    <label className={className.label}>Grade *</label>
                    <input
                      type="text"
                      {...register("grade", {
                        required: "ระบุข้อมูลนี้",
                      })}
                      className={className.input}
                      placeholder="Grade"
                    />
                    {errors.grade && (
                      <label className={className.label}>
                        <span className="label-text-alt text-error">
                          {errors.grade.message}
                        </span>
                      </label>
                    )}
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                {/* Pricing */}
                <div className="form-control">
                  <label className={className.label}>
                    ราคาต่อหน่วย (บาท) *
                  </label>
                  <input
                    type="text"
                    {...register("unitPrice", {
                      required: "ระบุข้อมูลนี้",
                      pattern: {
                        value: /^\d*\.?\d*$/,
                        message: "Please enter a valid number",
                      },
                    })}
                    className={className.input}
                    placeholder="0.00"
                  />
                  {errors.unitPrice && (
                    <label className={className.label}>
                      <span className="label-text-alt text-error">
                        {errors.unitPrice.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className={className.label}>ราคาต่อแพ็ค (บาท) *</label>
                  <input
                    type="text"
                    {...register("packPrice", {
                      required: "ระบุข้อมูลนี้",
                      pattern: {
                        value: /^\d*\.?\d*$/,
                        message: "Please enter a valid number",
                      },
                    })}
                    className={className.input}
                    placeholder="0.00"
                  />
                  {errors.packPrice && (
                    <label className={className.label}>
                      <span className="label-text-alt text-error">
                        {errors.packPrice.message}
                      </span>
                    </label>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Responsible Person */}
                <div className="form-control">
                  <label className={className.label}>ผู้รับผิดชอบ *</label>
                  <select
                    {...register("invgroupId", {
                      required: "ระบุข้อมูลนี้",
                    })}
                    className={className.select}>
                    <option value="">- เลือก -</option>
                    {group.map((groups) => (
                      <option key={groups.invgroupId} value={groups.invgroupId}>
                        {groups.invgroupName}
                      </option>
                    ))}
                  </select>
                  {errors.invgroupId && (
                    <label className={className.label}>
                      <span className="label-text-alt text-error">
                        {errors.invgroupId.message}
                      </span>
                    </label>
                  )}
                </div>

                {/* Status */}
                <div className="form-control">
                  <label className={className.label}>สถานะ *</label>
                  <select
                    {...register("status", {
                      required: "ระบุข้อมูลนี้",
                    })}
                    className={className.select}>
                    <option value="1">ใช้งาน</option>
                    <option value="0">ไม่ใช้งาน</option>
                  </select>
                  {errors.status && (
                    <label className={className.label}>
                      <span className="label-text-alt text-error">
                        {errors.status.message}
                      </span>
                    </label>
                  )}
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
                {isNew ? "บันทึก" : "บันทึกข้อมูล"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Content>
  );
}

const className = {
  label: "mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300",
  input:
    "block w-full px-3 py-1.5 border-2 rounded-md shadow-sm dark:bg-gray-800 dark:border-white text-black focus:outline-indigo-600",
  select:
    "block w-50 px-1 py-2 border-2 rounded-md shadow-sm dark:bg-gray-800 dark:border-white text-black focus:outline-indigo-600",
};
