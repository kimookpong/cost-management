"use client";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { FiFileText, FiPrinter, FiMoreVertical } from "react-icons/fi";
import ReactDOMServer from "react-dom/server";

const stripHtmlTags = (htmlString) => {
  return htmlString
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/\n/g, ", ")
    .trim();
};

export default function TableListExport({ fileName, data, meta }) {
  const exportToExcel = () => {
    const worksheetData = [
      ["#", ...meta.map((col) => (col.export !== false ? col.content : ""))], // Header
      ...data.map((row, index) => [
        index + 1,
        ...meta.map((col) => {
          if (col.export === false) {
            return "";
          }

          if (col.render) {
            const rendered = col.render(row);
            if (typeof rendered === "string") return rendered;
            if (React.isValidElement(rendered)) {
              return stripHtmlTags(
                ReactDOMServer.renderToStaticMarkup(rendered)
              );
            } else return rendered?.props?.children || "-";
          }
          return row[col.key] || "";
        }),
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(fileData, `${fileName}.xlsx`);
  };

  const print = () => {
    let tableHTML = `<table>
      <thead>
        <tr>
          <th>#</th>
          ${meta
            .map((col) =>
              col.export !== false ? `<th>${col.content}</th>` : ""
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (row, index) => `
              <tr>
                <td>${index + 1}</td>
                ${meta
                  .map((col) => {
                    if (col.export === false) {
                      return "";
                    }
                    let value = row[col.key] || "";
                    if (col.render) {
                      const rendered = col.render(row);
                      if (typeof rendered === "string") value = rendered;
                      if (React.isValidElement(rendered)) {
                        value = ReactDOMServer.renderToStaticMarkup(rendered);
                      } else value = rendered?.props?.children || "-";
                    }
                    return `<td>${value}</td>`;
                  })
                  .join("")}
              </tr>`
          )
          .join("")}
      </tbody>
    </table>`;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
           <style>
            @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
            * { color: #000 !important;}
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid black; padding: 10px; text-align: left; }
            th { background-color: #f4f4f4; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            tr:hover { background-color: #ddd; }
            @media print {
              body { margin: 0; padding: 0; }
              table { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${tableHTML}
          <script>
            window.onload = function() {
              window.print();
            };
            window.onafterprint = function() { window.close(); };
          <\/script>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div className="flex gap-2">
      {/* <button
        onClick={exportToExcel}
        className="p-1 border border-green-700 text-green-700 rounded shadow-sm hover:text-green-800 transition-all duration-200 flex items-center gap-1"
      >
        <FiMoreVertical size={18} />
      </button> */}

      <button
        onClick={exportToExcel}
        className="p-1 border border-green-700 text-green-700 rounded shadow-sm hover:text-green-800 transition-all duration-200 flex items-center gap-1"
      >
        <FiFileText size={18} />
        Excel
      </button>

      <button
        onClick={print}
        className="p-1 border border-blue-600 text-blue-600 rounded shadow-sm hover:text-blue-700 transition-all duration-200 flex items-center gap-1"
      >
        <FiPrinter size={18} />
        Print
      </button>
    </div>
  );
}
