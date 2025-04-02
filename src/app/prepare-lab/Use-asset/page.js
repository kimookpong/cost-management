"use client";

import { use, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiChevronLeft,
} from "react-icons/fi";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Content from "@/components/Content";
import { useFormik } from "formik";
import * as Yup from "yup";
import { confirmDialog, toastDialog } from "@/lib/stdLib";
import TableList from "@/components/TableList";

export default function Detail() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get("id");
  const labjobId = searchParams.get("labjobId");
  const labId = parseInt(idParam, 10);
  const isNew = labId === "new";
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");
  const [invent, setInvent] = useState([]);
  const [user, setUser] = useState([]);
  const [labasset, setLabasset] = useState({
    type1: [],
    type2: [],
    type3: [],
  });
  const [uselabasset, setUseLabasset] = useState({
    type1: [],
    type2: [],
    type3: [],
  });

  const [courseUser, setCourseUser] = useState([]);
  const [loadingInvent, setLoadingInvent] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [inventFormModal, setInventFormModal] = useState(false);
  const [userFormModal, setUserFormModal] = useState(false);

  const [data, setData] = useState({
    course: null,
    class: [],
    users: [],
    labgroup: [],
  });

  const [assetInfo, setAssetInfo] = useState(null);

  const tabs = [
    { id: "tab1", label: "ครุภัณฑ์" },
    { id: "tab2", label: "วัสดุไม่สิ้นเปลือง" },
    { id: "tab3", label: "วัสดุสิ้นเปลือง" },
  ];

  const formik = useFormik({
    initialValues: {},
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.uselabasset = uselabasset;
      try {
        if (isNew) {
          console.log("values01", values);
          await axios.post(`/api/use-asset`, values);
          toastDialog("บันทึกข้อมูลเรียบร้อย!", "success");
          // นำทางไปยังหน้าใหม่แล้วรีเฟรช
          await router.push(
            "/prepare-lab/Use-asset?id=" +
              searchParams.get("id") +
              "&labjobId=" +
              searchParams.get("labjobId")
          );
          window.location.reload(); // รีโหลดหน้าใหม่
        } else {
          console.log("values02", values, "labId", labId, "labjobId", labjobId);
          const res = await axios.put(
            `/api/use-asset?id=${labId}&labjobId=${labjobId}`,
            values
          );
          console.log("res", res);
          toastDialog("บันทึกข้อมูลเรียบร้อย!", "success");
          // ✅ Reload the data after update
          const response = await axios.get(
            `/api/use-asset?id=${labId}&labjobId=${labjobId}`
          );
          const data = response.data;
          if (data.success) {
            setUseLabasset({
              type1:
                data.uselabasset
                  ?.filter((item) => item.type === 1)
                  .map((item) => ({
                    ...item,
                    userId: parseInt(session.user.person_id, 10) || 0,
                  })) || [],
              type2:
                data.uselabasset
                  ?.filter((item) => item.type === 2)
                  .map((item) => ({
                    ...item,
                    userId: parseInt(session.user.person_id, 10) || 0,
                  })) || [],
              type3:
                data.uselabasset
                  ?.filter((item) => item.type === 3)
                  .map((item) => ({
                    ...item,
                    userId: parseInt(session.user.person_id, 10) || 0,
                  })) || [],
            });
          }

          // ✅ Navigate to another page and reload if needed
          await router.push(
            `/prepare-lab/Use-asset?id=${searchParams.get(
              "id"
            )}&labjobId=${searchParams.get("labjobId")}`
          );
        }
      } catch (error) {
        console.error("Error occurred:", error);
        toastDialog("เกิดข้อผิดพลาด! กรุณาลองใหม่", "error");
      }
    },
  });

  const validationInventForm = Yup.object({
    assetId: Yup.string().required("กรุณาเลือกข้อมูล"),
    amountUsed: Yup.number()
      .required("กรุณากรอกข้อมูล")
      .min(1, "จำนวนต้องไม่น้อยกว่า 1"),
    assetUsedRemark: Yup.string()
      .nullable()
      .max(100, "ข้อความต้องไม่เกิน 100 ตัวอักษร"),
  });

  const inventForm = useFormik({
    initialValues: {
      id: "",
      labjobAssetId: "",
      labjobId: "",
      assetId: "",
      amountUsed: 0,
      assetUsedRemark: "",
      type: "",
      assetextraFlag: 0,
      userId: session?.user.person_id,
    },
    validationSchema: validationInventForm,
    onSubmit: async (values) => {
      // ตรงนี้เปลี่ยนจาก onSubmit: async (values) => เป็น onSubmit: async (values) =>
      values.assetNameTh = invent.find(
        (inv) => inv.assetId === parseInt(values.assetId) // ตรงนี้เปลี่ยนจาก assetId เป็น assetId
      )?.assetNameTh;
      values.brandName = invent.find(
        (inv) => inv.assetId === parseInt(values.assetId)
      )?.brandName;
      values.amountUnit = invent.find(
        (inv) => inv.assetId === parseInt(values.assetId)
      )?.amountUnit;
      values.unitName = invent.find(
        (inv) => inv.assetId === parseInt(values.assetId)
      )?.unitName;
      values.invgroupName = invent.find(
        (inv) => inv.assetId === parseInt(values.assetId)
      )?.invgroupName;

      if (values.type === 1) {
        if (values.labjobAssetId) {
          setUseLabasset((prevLabasset) => ({
            ...prevLabasset,
            type1: prevLabasset.type1.map((item) =>
              item.labjobAssetId === values.labjobAssetId ? values : item
            ),
          }));
        } else {
          values.labjobAssetId = "";

          setUseLabasset((prevLabasset) => ({
            ...prevLabasset,
            type1: [...(prevLabasset.type1 || []), values],
          }));
        }
      } else if (values.type === 2) {
        if (values.labjobAssetId) {
          setUseLabasset((prevLabasset) => ({
            ...prevLabasset,
            type2: prevLabasset.type2.map((item) =>
              item.labjobAssetId === values.labjobAssetId ? values : item
            ),
          }));
        } else {
          values.labjobAssetId = "";
          setUseLabasset((prevLabasset) => ({
            ...prevLabasset,
            type2: [...(prevLabasset.type2 || []), values],
          }));
        }
      } else if (values.type === 3) {
        if (values.labjobAssetId) {
          setUseLabasset((prevLabasset) => ({
            ...prevLabasset,
            type3: prevLabasset.type3.map((item) =>
              item.labjobAssetId === values.labjobAssetId ? values : item
            ),
          }));
        } else {
          values.labjobAssetId = "";
          setUseLabasset((prevLabasset) => ({
            ...prevLabasset,
            type3: [...(prevLabasset.type3 || []), values],
          }));
        }
      }

      setInventFormModal(false);
      inventForm.resetForm();
    },
  });

  useEffect(() => {
    if (inventForm.values.assetId) {
      setAssetInfo(
        invent.find(
          (inv) => inv.assetId === parseInt(inventForm.values.assetId)
        )
      );
    } else {
      setAssetInfo(null);
    }
  }, [inventForm.values.assetId]);
  useEffect(
    () => {
      if (!isNew) {
        setLoading(true);
        const fetchData = async () => {
          try {
            const response = await axios.get(
              `/api/use-asset?id=${labId}&labjobId=${searchParams.get(
                "labjobId"
              )}`
            );
            const data = response.data;
            if (data.success) {
              setData({
                course: data.course,
              });
              setLabasset({
                type1: data.labasset?.filter((item) => item.type === 1) || [],
                type2: data.labasset?.filter((item) => item.type === 2) || [],
                type3: data.labasset?.filter((item) => item.type === 3) || [],
              });

              setUseLabasset({
                type1:
                  data.uselabasset
                    ?.filter((item) => item.type === 1)
                    .map((item) => ({
                      ...item,
                      userId: parseInt(session.user.person_id, 10) || 0,
                    })) || [],
                type2:
                  data.uselabasset
                    ?.filter((item) => item.type === 2)
                    .map((item) => ({
                      ...item,
                      userId: parseInt(session.user.person_id, 10) || 0,
                    })) || [],
                type3:
                  data.uselabasset
                    ?.filter((item) => item.type === 3)
                    .map((item) => ({
                      ...item,
                      userId: parseInt(session.user.person_id, 10) || 0,
                    })) || [],
              });

              // setCourseUser(data.courseUser);

              setLoading(false);
            }
          } catch (err) {
            console.error("❌ Error fetching data:", err);
            toastDialog("ไม่สามารถโหลดข้อมูลได้!", "error", 2000);
          }
        };
        fetchData();
      } else {
        setLoading(true);
        const fetchData = async () => {
          try {
            const response = await axios.get(`/api/assign-course`, {
              params: {
                courseId: searchParams.get("courseId"),
                schId: searchParams.get("schId"),
              },
            });
            const data = response.data;

            if (data.success) {
              setData({
                course: data.course,
                class: data.class,
                users: data.users,
                labgroup: data.labgroup,
              });
              formik.setValues({
                courseid: data.course?.courseid,
                labgroupId: "",
                schId: searchParams.get("schId"),
                acadyear: data.class?.[0]?.acadyear,
                semester: data.class?.[0]?.semester,
                section: data.class?.length,
                labroom: "",
                hour: "",
                labgroupNum: "",
                personId: "",
                userId: session?.user.person_id,
              });

              setLoading(false);
            }
          } catch (err) {
            console.error("❌ Error fetching data:", err);
            toastDialog("ไม่สามารถโหลดข้อมูลได้!", "error", 2000);
          }
        };
        fetchData();
      }
    },
    [labId],
    [searchParams.get("labjobId")]
  );

  const breadcrumb = [
    // { name: "แผนการให้บริการห้องปฎิบัติการ" },
    { name: "ใบงานปฏิบัติการตามรายวิชา", link: "/prepare-lab" },
    { name: isNew ? "เพิ่มใหม่" : "เพิ่มข้อมูล" },
  ];

  const _callInvent = async (type, labId, extraFlag) => {
    setLoadingInvent(true);
    try {
      const response = await axios.get(`/api/use-asset/plnasset`, {
        params: {
          type: type,
          labId: labId,
          labjobId: searchParams.get("labjobId"),
          extraFlag: extraFlag,
        },
      });
      const data = response.data;

      if (data.success) {
        setInvent(data.data);
      }
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      toastDialog("ไม่สามารถโหลดข้อมูลได้!", "error", 2000);
    } finally {
      setLoadingInvent(false);
    }
  };

  const _onPressAddInvent = async (type, labjobId, labId, extraFlag) => {
    setInventFormModal(true);
    inventForm.setValues({
      labjobAssetId: "",
      assetId: "",
      labjobId: labjobId,
      amountUsed: "",
      assetUsedRemark: "",
      flagDel: 0,
      type: type,
      assetextraFlag: extraFlag,
      userId: session?.user.person_id,
    });
    await _callInvent(type, labId, extraFlag);
  };

  const _onPressEditInvent = async (id, type) => {
    setInventFormModal(true);
    let asset;
    if (type === 1) {
      asset = uselabasset.type1.find((item) => item.labjobAssetId === id);
    } else if (type === 2) {
      asset = uselabasset.type2.find((item) => item.labjobAssetId === id);
    } else if (type === 3) {
      asset = uselabasset.type3.find((item) => item.labjobAssetId === id);
    }

    inventForm.setValues({
      labjobAssetId: asset.labjobAssetId,
      assetId: asset.assetId,
      // labjobId: labjobId,
      amountUsed: asset.amountUsed,
      assetUsedRemark: asset.assetUsedRemark ? asset.assetUsedRemark : "",
      flagDel: 0,
      type: type,
      assetextraFlag: asset.assetextraFlag,
      userId: session?.user.person_id,
    });
    // await _callInvent(type);
    await _callInvent(type, labId, asset.assetextraFlag);
  };

  const _onPressDeleteInvent = async (id, type) => {
    const result = await confirmDialog(
      "คุณแน่ใจหรือไม่?",
      "คุณต้องการลบข้อมูลนี้จริงหรือไม่?"
    );

    if (result.isConfirmed) {
      if (type === 1) {
        setUseLabasset((prevLabasset) => ({
          // ตรงนี้เปลี่ยนจาก type1 เป็น type
          ...prevLabasset, // ตรงนี้เปลี่ยนจาก type1 เป็น type
          type1: prevLabasset.type1.filter((item) => item.labjobAssetId !== id),
        }));
      } else if (type === 2) {
        setUseLabasset((prevLabasset) => ({
          ...prevLabasset,
          type2: prevLabasset.type1.filter((item) => item.labjobAssetId !== id),
        }));
      } else if (type === 3) {
        setUseLabasset((prevLabasset) => ({
          ...prevLabasset,
          type3: prevLabasset.type1.filter((item) => item.labjobAssetId !== id),
        }));
      }
      try {
        await axios.delete(
          `/api/use-asset?id=${id}&userId=${session?.user.person_id}`
        );
        toastDialog("ลบข้อมูลเรียบร้อย!", "success");
        const response = await axios.get(
          `/api/use-asset?id=${labId}&labjobId=${labjobId}`
        );
        const data = response.data;
        if (data.success) {
          setUseLabasset({
            type1:
              data.uselabasset
                ?.filter((item) => item.type === 1)
                .map((item) => ({
                  ...item,
                  userId: parseInt(session.user.person_id, 10) || 0,
                })) || [],
            type2:
              data.uselabasset
                ?.filter((item) => item.type === 2)
                .map((item) => ({
                  ...item,
                  userId: parseInt(session.user.person_id, 10) || 0,
                })) || [],
            type3:
              data.uselabasset
                ?.filter((item) => item.type === 3)
                .map((item) => ({
                  ...item,
                  userId: parseInt(session.user.person_id, 10) || 0,
                })) || [],
          });
        }

        // ✅ Navigate to another page and reload if needed
        await router.push(
          `/prepare-lab/Use-asset?id=${searchParams.get(
            "id"
          )}&labjobId=${searchParams.get("labjobId")}`
        );
      } catch (error) {
        console.error("Error deleting brand:", error);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
    }
  };

  const _onCloseInventForm = (status) => {
    setInventFormModal(status);
    inventForm.resetForm();
  };

  return (
    <Content
      breadcrumb={breadcrumb}
      title=" การใช้ทรัพยากร : ตามใบงานปฏิบัติการ">
      <div className="relative flex flex-col w-full text-gray-900 dark:text-gray-300 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold">
            {isNew ? "การใช้ทรัพยากร" : "การใช้ทรัพยากร"} :{" "}
            {data.course?.coursename} ({data.course?.coursecode})
          </h3>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            กำลังโหลดข้อมูล...
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <div className="w-full">
              <div className="flex px-4 mt-2">
                {tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex justify-center font-semibold items-center space-x-2 p-4 transition text-lg border-blue-600 dark:border-blue-300 border-2 ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-0 rounded-t-lg dark:text-blue-300"
                        : "text-gray-500 border-x-0 border-t-0 dark:text-white"
                    }`}>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div>
                {activeTab === "tab1" && (
                  <div className="p-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                    {[
                      {
                        type: 1,
                        name: "แผนครุภัณฑ์",
                        asset: labasset.type1,
                      },
                    ].map((type) => (
                      <div className="sm:col-span-12" key={type.type}>
                        <div className="p-4 border relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-rose-50 dark:bg-gray-800shadow-md rounded-xl">
                          <div className="pb-4 border-gray-200 flex justify-between items-center">
                            <div className="font-xl font-semibold inline">
                              <span className="pe-2">{type.name}</span>
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                {type.asset.length} รายการ
                              </span>
                            </div>
                            <button
                              type="button"
                              className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() =>
                                _onPressAddInvent(type.type, labjobId, labId, 1)
                              }>
                              <FiPlus className="w-4 h-4" />
                              พัสดุเพิ่มเติม
                            </button>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg">
                            <TableList
                              exports={false}
                              meta={[
                                {
                                  content: "รายการ",
                                  key: "assetNameTh",
                                  render: (item) => (
                                    <div>
                                      <div> {item.assetNameTh}</div>
                                      <div className="flex gap-2 text-gray-500 dark:text-gray-400 ">
                                        <div className="text-sm">
                                          ยี่ห้อ : {item.brandName || "-"}
                                        </div>
                                        <div className="text-sm">
                                          ขนาด : {item.amountUnit || "-"}
                                        </div>
                                        <div className="text-sm">
                                          ห้องปฎิบัติการ :{" "}
                                          {item.invgroupName || "-"}
                                        </div>
                                      </div>
                                      <div className="text-sm">
                                        Remark : {item.assetRemark || "-"}
                                      </div>
                                    </div>
                                  ),
                                },
                                {
                                  content: "จำนวน",
                                  width: 100,
                                  className: "text-center",
                                  key: "amount",
                                  render: (item) => (
                                    <div>{item.amount.toLocaleString()}</div>
                                  ),
                                },
                                {
                                  content: "หน่วย",
                                  width: 100,
                                  key: "unitName",
                                },
                              ]}
                              data={labasset.type1}
                              loading={loading}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="sm:col-span-12">
                      <div className="p-4 border relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-indigo-50 dark:bg-gray-800shadow-md rounded-xl">
                        <div className="pb-4 border-gray-200 flex justify-between items-center">
                          <div className="font-xl font-semibold inline ">
                            <span className="pe-2">
                              บันทึกข้อมูลการใช้ทรัพยากร
                            </span>
                          </div>
                          <button
                            type="button"
                            className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed justify-end hover:scale-105"
                            onClick={() =>
                              _onPressAddInvent(1, labjobId, labId)
                            }>
                            <FiPlus className="w-4 h-4" />
                            เพิ่มใหม่
                          </button>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg">
                          <TableList
                            exports={false}
                            meta={[
                              {
                                content: "รายการ",
                                key: "assetNameTh",
                                render: (item) => (
                                  <div>
                                    <div>
                                      {item.assetNameTh}{" "}
                                      {item.assetextraFlag === "1" ? (
                                        <span style={{ color: "red" }}>
                                          (เพิ่มเติม)
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>

                                    <div className="flex gap-2 text-gray-500 dark:text-gray-400 ">
                                      <div className="text-sm">
                                        ยี่ห้อ : {item.brandName || "-"}
                                      </div>
                                      <div className="text-sm">
                                        ขนาด : {item.amountUnit || "-"}
                                      </div>
                                      <div className="text-sm">
                                        ห้องปฎิบัติการ :{" "}
                                        {item.invgroupName || "-"}
                                      </div>
                                    </div>
                                    <div className="text-sm">
                                      Remark : {item.assetUsedRemark || "-"}
                                    </div>
                                  </div>
                                ),
                              },
                              {
                                content: "จำนวน",
                                width: 100,
                                className: "text-center",
                                key: "amountUsed",
                                render: (item) => {
                                  return (
                                    <div>
                                      {item.amountUsed
                                        ? item.amountUsed.toLocaleString()
                                        : "-"}
                                    </div>
                                  );
                                },
                              },

                              {
                                content: "หน่วย",
                                width: 100,
                                key: "unitName",
                              },
                              {
                                key: "labjobAssetId",
                                content: "Action",
                                width: "100",
                                sort: false,
                                render: (item) => (
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => {
                                        return _onPressEditInvent(
                                          item.labjobAssetId,
                                          item.type
                                        );
                                      }}>
                                      <FiEdit className="w-4 h-4" />
                                      แก้ไข
                                    </button>
                                    <button
                                      type="button"
                                      className="cursor-pointer p-2 text-white text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => {
                                        return _onPressDeleteInvent(
                                          item.labjobAssetId,
                                          item.type
                                        );
                                      }}>
                                      <FiTrash2 className="w-4 h-4" />
                                      ลบ
                                    </button>
                                  </div>
                                ),
                              },
                            ]}
                            data={uselabasset.type1}
                            loading={loading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "tab2" && (
                  <div className="p-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                    {[
                      {
                        type: 2,
                        name: "แผนวัสดุไม่สิ้นเปลือง",
                        asset: labasset.type2,
                      },
                    ].map((type) => (
                      <div className="sm:col-span-12" key={type.type}>
                        <div className="p-4 border relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-rose-50 dark:bg-gray-800 shadow-md rounded-xl">
                          <div className="pb-4 border-gray-200 flex justify-between items-center">
                            <div className="font-xl font-semibold inline">
                              <span className="pe-2">{type.name}</span>
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                {type.asset.length} รายการ
                              </span>
                            </div>
                            <button
                              type="button"
                              className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() =>
                                _onPressAddInvent(type.type, labjobId, labId, 1)
                              }>
                              <FiPlus className="w-4 h-4" />
                              พัสดุเพิ่มเติม
                            </button>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg">
                            <TableList
                              exports={false}
                              meta={[
                                {
                                  content: "รายการ",
                                  key: "assetNameTh",
                                  render: (item) => (
                                    <div>
                                      <div> {item.assetNameTh}</div>
                                      <div className="flex gap-2 text-gray-500 dark:text-gray-400">
                                        <div className="text-sm">
                                          ยี่ห้อ : {item.brandName || "-"}
                                        </div>
                                        <div className="text-sm">
                                          ขนาด : {item.amountUnit || "-"}
                                        </div>
                                        <div className="text-sm">
                                          ห้องปฎิบัติการ :{" "}
                                          {item.invgroupName || "-"}
                                        </div>
                                      </div>
                                      <div className="text-sm">
                                        Remark : {item.assetRemark || "-"}
                                      </div>
                                    </div>
                                  ),
                                },
                                {
                                  content: "จำนวน",
                                  width: 100,
                                  className: "text-center",
                                  key: "amount",
                                  render: (item) => (
                                    <div>{item.amount.toLocaleString()}</div>
                                  ),
                                },
                                {
                                  content: "หน่วย",
                                  width: 100,
                                  key: "unitName",
                                },
                              ]}
                              data={type.asset}
                              loading={loading}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="sm:col-span-12">
                      <div className="p-4 border relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-indigo-50 dark:bg-gray-800shadow-md rounded-xl">
                        <div className="pb-4 border-gray-200 flex justify-between items-center">
                          <div className="font-xl font-semibold inline ">
                            <span className="pe-2">
                              บันทึกข้อมูลการใช้ทรัพยากร
                            </span>
                          </div>
                          <button
                            type="button"
                            className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed justify-end hover:scale-105"
                            onClick={() =>
                              _onPressAddInvent(2, labjobId, labId)
                            }>
                            <FiPlus className="w-4 h-4" />
                            เพิ่มใหม่
                          </button>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg">
                          <TableList
                            exports={false}
                            meta={[
                              {
                                content: "รายการ",
                                key: "assetNameTh",
                                render: (item) => (
                                  <div>
                                    <div>
                                      {item.assetNameTh}{" "}
                                      {item.assetextraFlag === "1" ? (
                                        <span style={{ color: "red" }}>
                                          (เพิ่มเติม)
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="flex gap-2 text-gray-500 dark:text-gray-400 ">
                                      <div className="text-sm">
                                        ยี่ห้อ : {item.brandName || "-"}
                                      </div>
                                      <div className="text-sm">
                                        ขนาด : {item.amountUnit || "-"}
                                      </div>
                                      <div className="text-sm">
                                        ห้องปฎิบัติการ :{" "}
                                        {item.invgroupName || "-"}
                                      </div>
                                    </div>
                                    <div className="text-sm">
                                      Remark : {item.assetUsedRemark || "-"}
                                    </div>
                                  </div>
                                ),
                              },
                              {
                                content: "จำนวน",
                                width: 100,
                                className: "text-center",
                                key: "amountUsed",
                                render: (item) => (
                                  <div>
                                    {item.amountUsed
                                      ? item.amountUsed.toLocaleString()
                                      : "-"}
                                  </div>
                                ),
                              },
                              {
                                content: "หน่วย",
                                width: 100,
                                key: "unitName",
                              },
                              {
                                key: "labjobAssetId",
                                content: "Action",
                                width: "100",
                                sort: false,
                                render: (item) => (
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => {
                                        return _onPressEditInvent(
                                          item.labjobAssetId,
                                          item.type
                                        );
                                      }}>
                                      <FiEdit className="w-4 h-4" />
                                      แก้ไข
                                    </button>
                                    <button
                                      type="button"
                                      className="cursor-pointer p-2 text-white text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => {
                                        return _onPressDeleteInvent(
                                          item.labjobAssetId,
                                          item.type
                                        );
                                      }}>
                                      <FiTrash2 className="w-4 h-4" />
                                      ลบ
                                    </button>
                                  </div>
                                ),
                              },
                            ]}
                            data={uselabasset.type2}
                            loading={loading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "tab3" && (
                  <div className="p-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                    {[
                      {
                        type: 3,
                        name: "แผนวัสดุสิ้นเปลือง",
                        asset: labasset.type3,
                      },
                    ].map((type) => (
                      <div className="sm:col-span-12" key={type.type}>
                        <div className="p-4 border relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-rose-50 dark:bg-gray-800 shadow-md rounded-xl">
                          <div className="pb-4 border-gray-200 flex justify-between items-center">
                            <div className="font-xl font-semibold inline">
                              <span className="pe-2">{type.name}</span>
                              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                                {type.asset.length} รายการ
                              </span>
                            </div>
                            <button
                              type="button"
                              className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() =>
                                _onPressAddInvent(type.type, labjobId, labId, 1)
                              }>
                              <FiPlus className="w-4 h-4" />
                              พัสดุเพิ่มเติม
                            </button>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg">
                            <TableList
                              exports={false}
                              meta={[
                                {
                                  content: "รายการ",
                                  key: "assetNameTh",
                                  render: (item) => (
                                    <div>
                                      <div> {item.assetNameTh}</div>
                                      <div className="flex gap-2 text-gray-500 dark:text-gray-400 ">
                                        <div className="text-sm">
                                          ยี่ห้อ : {item.brandName || "-"}
                                        </div>
                                        <div className="text-sm">
                                          ขนาด : {item.amountUnit || "-"}
                                        </div>
                                        <div className="text-sm">
                                          ห้องปฎิบัติการ :{" "}
                                          {item.invgroupName || "-"}
                                        </div>
                                      </div>
                                      <div className="text-sm">
                                        Remark : {item.assetRemark || "-"}
                                      </div>
                                    </div>
                                  ),
                                },
                                {
                                  content: "จำนวน",
                                  width: 100,
                                  className: "text-center",
                                  key: "amount",
                                  render: (item) => (
                                    <div>
                                      {item.amount
                                        ? item.amount.toLocaleString()
                                        : "-"}
                                    </div>
                                  ),
                                },
                                {
                                  content: "หน่วย",
                                  width: 100,
                                  key: "unitName",
                                },
                              ]}
                              data={labasset.type3}
                              loading={loading}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="sm:col-span-12">
                      <div className="p-4 border relative flex flex-col w-full text-gray-700 dark:text-gray-100 bg-indigo-50 dark:bg-gray-800shadow-md rounded-xl">
                        <div className="pb-4 border-gray-200 flex justify-between items-center">
                          <div className="font-xl font-semibold inline ">
                            <span className="pe-2">
                              บันทึกข้อมูลการใช้ทรัพยากร
                            </span>
                          </div>
                          <button
                            type="button"
                            className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed justify-end hover:scale-105"
                            onClick={() =>
                              _onPressAddInvent(3, labjobId, labId)
                            }>
                            <FiPlus className="w-4 h-4" />
                            เพิ่มใหม่
                          </button>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg">
                          <TableList
                            exports={false}
                            meta={[
                              {
                                content: "รายการ",
                                key: "assetNameTh",
                                render: (item) => (
                                  <div>
                                    <div>
                                      {item.assetNameTh}{" "}
                                      {item.assetextraFlag === "1" ? (
                                        <span style={{ color: "red" }}>
                                          (เพิ่มเติม)
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="flex gap-2 text-gray-500 dark:text-gray-400 ">
                                      <div className="text-sm">
                                        ยี่ห้อ : {item.brandName || "-"}
                                      </div>
                                      <div className="text-sm">
                                        ขนาด : {item.amountUnit || "-"}
                                      </div>
                                      <div className="text-sm">
                                        ห้องปฎิบัติการ :{" "}
                                        {item.invgroupName || "-"}
                                      </div>
                                    </div>
                                    <div className="text-sm">
                                      Remark : {item.assetUsedRemark || "-"}
                                    </div>
                                  </div>
                                ),
                              },
                              {
                                content: "จำนวน",
                                width: 100,
                                className: "text-center",
                                key: "amountUsed",
                                render: (item) => {
                                  return (
                                    <div>
                                      {item.amountUsed
                                        ? item.amountUsed.toLocaleString()
                                        : "-"}
                                    </div>
                                  );
                                },
                              },

                              {
                                content: "หน่วย",
                                width: 100,
                                key: "unitName",
                              },
                              {
                                key: "labjobAssetId",
                                content: "Action",
                                width: "100",
                                sort: false,
                                render: (item) => (
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      className="cursor-pointer p-2 text-white text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => {
                                        return _onPressEditInvent(
                                          item.labjobAssetId,
                                          item.type
                                        );
                                      }}>
                                      <FiEdit className="w-4 h-4" />
                                      แก้ไข
                                    </button>
                                    <button
                                      type="button"
                                      className="cursor-pointer p-2 text-white text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                      onClick={() => {
                                        return _onPressDeleteInvent(
                                          item.labjobAssetId,
                                          item.type
                                        );
                                      }}>
                                      <FiTrash2 className="w-4 h-4" />
                                      ลบ
                                    </button>
                                  </div>
                                ),
                              },
                            ]}
                            data={uselabasset.type3}
                            loading={loading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex justify-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                className="cursor-pointer p-3 text-white text-sm bg-gray-600 hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                onClick={() => router.back()}>
                <FiChevronLeft className="w-4 h-4" />
                ย้อนกลับ
              </button>
              <button
                type="submit"
                className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                บันทึกข้อมูล
              </button>
            </div>
          </form>
        )}
      </div>

      <Dialog
        open={inventFormModal}
        onClose={_onCloseInventForm}
        className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 text-gray-900 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:max-w-2xl data-closed:sm:translate-y-0 data-closed:sm:scale-95">
              {loadingInvent ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  กำลังโหลดข้อมูล...
                </div>
              ) : (
                <form onSubmit={inventForm.handleSubmit}>
                  <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                      <div className="sm:col-span-12">
                        <label className={className.label}>
                          วัสดุที่เลือกใช้
                        </label>
                        <select
                          name="assetId"
                          value={inventForm.values.assetId}
                          onChange={(e) => {
                            inventForm.setFieldValue(
                              "assetId",
                              Number(e.target.value)
                            );
                          }}
                          className={`${className.select} ${
                            inventForm.touched.assetId &&
                            inventForm.errors.assetId
                              ? "border-red-500"
                              : ""
                          }`}>
                          <option value="" disabled>
                            เลือกวัสดุที่เลือกใช้
                          </option>
                          {invent.map((inv) => (
                            <option key={inv.assetId} value={inv.assetId}>
                              {inv.assetNameTh} {inv.amountUnit} ({inv.unitName}
                              )
                            </option>
                          ))}
                        </select>

                        {inventForm.touched.assetId &&
                          inventForm.errors.assetId && (
                            <p className="mt-1 text-sm text-red-500">
                              {inventForm.errors.assetId}
                            </p>
                          )}
                      </div>
                      {assetInfo && (
                        <div className="sm:col-span-12">
                          <div className="border rounded-lg border-blue-600 dark:border-blue-300">
                            <div className="p-4 border-b border-blue-600 dark:border-blue-300">
                              <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                                {assetInfo?.assetNameTh}
                              </h3>
                            </div>
                            <div className="p-4">
                              <div className="text-gray-500 dark:text-gray-400">
                                <div className="text-sm">
                                  ยี่ห้อ : {assetInfo?.brandName || "-"}
                                </div>
                                <div className="text-sm">
                                  ขนาด : {assetInfo?.amountUnit || "-"}
                                </div>
                                <div className="text-sm">
                                  ห้องปฎิบัติการ :{" "}
                                  {assetInfo?.invgroupName || "-"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="sm:col-span-9">
                        <label className={className.label}>จำนวนที่ใช้</label>
                        <input
                          type="number"
                          name="amountUsed"
                          value={inventForm.values.amountUsed || ""}
                          onChange={(e) =>
                            inventForm.setFieldValue(
                              "amountUsed",
                              e.target.value ? parseInt(e.target.value, 10) : ""
                            )
                          }
                          className={`${className.input} ${
                            inventForm.touched.amountUsed &&
                            inventForm.errors.amountUsed
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {inventForm.touched.amountUsed &&
                          inventForm.errors.amountUsed && (
                            <p className="mt-1 text-sm text-red-500">
                              {inventForm.errors.amountUsed}
                            </p>
                          )}
                      </div>
                      <div className="sm:col-span-3">
                        <label className={className.label}>หน่วย</label>
                        <input
                          value={assetInfo?.unitName || "-"}
                          disabled
                          className={className.input}
                        />
                      </div>
                      <div className="sm:col-span-12">
                        <label className={className.label}>Remark</label>
                        <input
                          type="text"
                          name="assetUsedRemark"
                          value={inventForm.values.assetUsedRemark ?? ""}
                          onChange={inventForm.handleChange}
                          className={`${className.input} ${
                            inventForm.touched.assetUsedRemark &&
                            inventForm.errors.assetUsedRemark
                              ? "border-red-500"
                              : ""
                          }`}
                        />

                        {inventForm.touched.assetUsedRemark &&
                          inventForm.errors.assetUsedRemark && (
                            <p className="mt-1 text-sm text-red-500">
                              {inventForm.errors.assetUsedRemark}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto">
                      ยืนยัน
                    </button>
                    <button
                      type="button"
                      data-autofocus
                      onClick={() => _onCloseInventForm(false)}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto">
                      ยกเลิก
                    </button>
                  </div>
                </form>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Content>
  );
}

const className = {
  label:
    "mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300 dark:text-gray-300",
  input:
    "block bg-white text-gray-900 dark:text-white w-full px-3 py-1.5 border rounded-md shadow-sm dark:bg-gray-800",
  select:
    "block bg-white text-gray-900 dark:text-white w-full px-4 py-2 border rounded-md dark:bg-gray-800",
};
