// Breadcrumb.js
import Link from "next/link";
import { FiHome } from "react-icons/fi";

export default function Breadcrumb({ paths }) {
  return (
    <nav className="flex text-sm text-gray-900 dark:text-gray-100 mb-2 bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg px-4 py-2">
      <span key="main" className="flex items-center">
        <Link href="/">
          <FiHome className="mr-1" />
        </Link>
      </span>
      {paths.map((path, index) => (
        <span key={index} className="flex items-center">
          <span className="mx-2">/</span>
          {path.link ? (
            <Link href={path.link}>{path.name}</Link>
          ) : (
            <span>{path.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
