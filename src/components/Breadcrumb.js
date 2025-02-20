// Breadcrumb.js
import Link from "next/link";
import { FiHome } from "react-icons/fi";

export default function Breadcrumb({ paths }) {
  return (
    // <div className="flex text-sm text-gray-900 dark:text-gray-100 mb-2 bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg px-4 py-2">
    <div className="breadcrumbs text-sm text-white">
      <ul>
        <li>
          <Link href="/">
            <FiHome className="mr-1 mb-0.5" />
            หน้าหลัก
          </Link>
        </li>
        {paths.map((path, index) => (
          <li key={index}>
            {path.link ? (
              <Link href={path.link}>{path.name}</Link>
            ) : (
              <span>{path.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
    // </div>
  );
}
