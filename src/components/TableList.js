import React, { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";

const TableList = ({ data, meta, loading }) => {
  const [dataDisplay, setDataDisplay] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "", order: "" });
  const itemsPerPage = 20;
  const totalPages =
    data.length > 0 ? Math.ceil(data.length / itemsPerPage) : 1;

  useEffect(() => {
    let filteredData = data;

    if (search.trim() !== "") {
      filteredData = data.filter((item) =>
        meta.some((m) => item[m.key] && item[m.key].toString().includes(search))
      );
    }

    if (sort.key !== "") {
      filteredData = filteredData.sort((a, b) => {
        if (sort.order === "asc") {
          return a[sort.key] > b[sort.key] ? 1 : -1;
        } else {
          return a[sort.key] < b[sort.key] ? 1 : -1;
        }
      });
    }
    if (filteredData.length === 0) {
      setCurrentPage(1);
    }

    setDataDisplay(
      filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    );
  }, [data, currentPage, search, meta, sort]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          รายการทั้งหมด {data.length} รายการ
        </p>

        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="ค้นหา..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 h-10 pl-3 py-2 text-sm border border-gray-300 rounded shadow-sm focus:outline-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          {search ? (
            <FiXCircle
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5 cursor-pointer"
              onClick={() => setSearch("")}
            />
          ) : (
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-5 h-5 " />
          )}
        </div>
      </div>

      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr className="border-y border-gray-200 dark:border-gray-700">
            <th
              width="40"
              className="border text-sm border-gray-200 dark:border-gray-700 px-1 py-3 text-center font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <p className="flex items-center justify-center opacity-70">#</p>
            </th>
            {meta.map((m, index) => (
              <th
                key={`header-${index}`}
                width={m.width || ""}
                className="border text-sm border-gray-200 dark:border-gray-700 px-1 py-3 text-center font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {m.sort === false ? (
                  <p className="flex items-center justify-center gap-1 opacity-70">
                    {m.content}
                  </p>
                ) : (
                  <p
                    className="flex items-center justify-center gap-1 opacity-70 cursor-pointer hover:opacity-100 dark:hover:text-white "
                    onClick={() => {
                      if (sort.key === m.key) {
                        setSort((prev) => ({
                          key: prev.key,
                          order: prev.order === "asc" ? "desc" : "asc",
                        }));
                      } else {
                        setSort({ key: m.key, order: "asc" });
                      }
                    }}
                  >
                    {m.content}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                      ></path>
                    </svg>
                  </p>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(5)].map((_, index) => (
              <tr
                key={`loading-${index}`}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="p-3 text-center">
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-4 w-8 mx-auto rounded-md"></div>
                </td>

                {meta.map((_, i) => (
                  <td key={`loading-cell-${index}-${i}`} className="p-3">
                    <div className="animate-pulse bg-gray-300 dark:bg-gray-700 h-4 w-full rounded-md"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : dataDisplay.length > 0 ? (
            dataDisplay.map((item, index) => {
              const currentRow = (currentPage - 1) * itemsPerPage + index + 1;
              return (
                <tr
                  key={item.id || currentRow}
                  className="border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <td className="border border-gray-200 dark:border-gray-700 p-2 text-center text-gray-900 dark:text-gray-300">
                    {currentRow}
                  </td>
                  {meta.map((m, i) => (
                    <td
                      key={`row-${currentRow}-col-${i}`}
                      className={[
                        "border border-gray-200 dark:border-gray-700 p-2 text-gray-900 dark:text-gray-300",
                        m.className || "",
                      ].join(" ")}
                    >
                      {m.render ? m.render(item) : item[m.key] || "-"}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr className="border border-gray-200 dark:border-gray-700">
              <td colSpan={meta.length + 1} className="p-4 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-12 h-12 mb-2 text-gray-300 dark:text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M12 2a10 10 0 11-10 10A10 10 0 0112 2z"
                    />
                  </svg>

                  <p className="text-lg font-medium text-gray-300 dark:text-gray-500">
                    ไม่มีข้อมูล
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {data.length > itemsPerPage && (
        <div className="flex items-center justify-between py-3">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            หน้า {currentPage} / {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 rounded-md disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-600 rounded-md disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableList;
