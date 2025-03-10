"use client";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default function ExportButton({ tableId, fileName }) {
  const exportToExcel = () => {
    const table = document.getElementById(tableId);
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${fileName}.xlsx`);
  };

  return (
    <button
      onClick={exportToExcel}
      className="p-2 bg-green-300 text-white rounded-lg hover:bg-green-700 transition-all duration-200">
      Export to Excel
    </button>
  );
}
