"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useFormik } from "formik";
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
        });
        router.push("/assetss");
      } else {
        await axios.put(`/api/assetss?id=${id}`, values);
        await Swal.fire({
          title: "แก้ไขข้อมูลเรียบร้อย!",
          icon: "success",
          timer: 1000,
        });
        router.push("/assetss");
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
            <h3 className="font-semibold text-gray-700">
              {isNew ? "เพิ่มข้อมูลครุภัณฑ์" : "แก้ไขข้อมูลครุภัณฑ์"}
            </h3>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="form-control max-w-2xl mx-auto space-y-4 p-2">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Asset Names */}
              <div className="form-control">
                <label className={className.label}>
                  ชื่อครุภัณฑ์ (ภาษาไทย)
                </label>
                <input
                  // name="assetNameTh"//
                  type="text"
                  {...register("assetNameTh", {
                    required: "Thai name is required",
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
                    required: "English name is required",
                  })}
                  className={className.input}
                  placeholder="ชื่อครุภัณฑ์"
                />
                {errors.assetNameEng && (
                  <label className={className.label}>
                    <span className="label-text-alt text-error">
                      {errors.assetNameEng.message}
                    </span>
                  </label>
                )}
              </div>

              {/* Dynamic Select */}
              <div className="form-control">
                <label className={className.label}>หน่วยนับ</label>
                <select {...register("unitId")} className={className.select}>
                  <option value="">- เลือก -</option>
                  {options.map((option) => (
                    <option key={option.unitId} value={option.unitId}>
                      {option.unitName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Select */}
              <div className="form-control">
                <label className={className.label}>ยี่ห้อ</label>
                <select {...register("brandId")} className={className.select}>
                  <option value="">- เลือก -</option>
                  {brands.map((brand) => (
                    <option key={brand.brandId} value={brand.brandId}>
                      {brand.brandName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount and Version */}
              <div className="form-control">
                <label className={className.label}>ขนาด/ขนาดบรรจุ</label>
                <input
                  type="text"
                  {...register("amountUnit")}
                  className={className.input}
                  placeholder="ขนาด/ขนาดบรรจุ"
                />
              </div>

              <div className="form-control">
                <label className={className.label}>รุ่น</label>
                <input
                  type="text"
                  {...register("version")}
                  className={className.input}
                  placeholder="รุ่น"
                />
              </div>

              {/* Type and Category */}
              <div className="form-control">
                <label className={className.label}>ประเภทครุภัณฑ์</label>
                <select {...register("invtypeId")} className={className.select}>
                  <option value="">- เลือก -</option>
                  {type.map((types) => (
                    <option key={types.invtypeId} value={types.invtypeId}>
                      {types["invtype Name"]}
                    </option>
                  ))}
                </select>
              </div>

              {showCategoryAndGrade && (
                <>
                  <div className="form-control">
                    <label className={className.label}>Category No.</label>
                    <input
                      type="text"
                      {...register("catNo")}
                      className={className.input}
                      placeholder="Category Number"
                    />
                  </div>
                  <div className="form-control">
                    <label className={className.label}>Grade</label>
                    <input
                      type="text"
                      {...register("grade")}
                      className={className.input}
                      placeholder="Grade"
                    />
                  </div>
                </>
              )}

              {/* Pricing */}
              <div className="form-control">
                <label className={className.label}>ราคาต่อหน่วย (บาท)</label>
                <input
                  type="text"
                  {...register("unitPrice", {
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
                <label className={className.label}>ราคาต่อแพ็ค (บาท)</label>
                <input
                  type="text"
                  {...register("packPrice", {
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

              {/* Responsible Person */}
              <div className="form-control">
                <label className={className.label}>ผู้รับผิดชอบ</label>
                <select
                  {...register("invgroupId")}
                  className={className.select}>
                  <option value="">- เลือก -</option>
                  {group.map((groups) => (
                    <option key={groups.invgroupId} value={groups.invgroupId}>
                      {groups.invgroupName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="form-control">
                <label className={className.label}>สถานะ</label>
                <select {...register("status")} className={className.select}>
                  <option value="1">ใช้งาน</option>
                  <option value="0">ไม่ใช้งาน</option>
                </select>
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
    "block w-full px-4 py-2 border-2 rounded-md shadow-sm dark:bg-gray-800 dark:border-white text-black focus:outline-indigo-600",
};
