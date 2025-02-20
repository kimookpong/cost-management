"use client";

// import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import HeaderBar from "./HeaderBar";
import Breadcrumb from "./Breadcrumb";
import {
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiShoppingCart,
  FiUsers,
  FiEye,
  FiSun,
  FiMoon,
} from "react-icons/fi";

export default function Dashboard({ children, breadcrumb }) {
  const { data: session } = useState();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex bg-gradient-to-br from-blue-500 to-purple-500 dark:from-gray-900 dark:to-black transition-all min-h-screen">
      <div className="flex-1 flex flex-col transition-all">
        <HeaderBar />
        <div className="flex-1 flex flex-col overflow-hidden justify-center items-center">
          <div className="flex-1 overflow-y-auto p-2 max-w-7xl w-full ">
            {breadcrumb && <Breadcrumb paths={breadcrumb} />}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
