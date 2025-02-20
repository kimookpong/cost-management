"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
} from "react-icons/fi";

const notificationTypes = {
  success: {
    icon: <FiCheckCircle className="text-green-500" />,
    bg: "bg-green-100 dark:bg-green-800",
    text: "text-green-700 dark:text-green-300",
  },
  error: {
    icon: <FiXCircle className="text-red-500" />,
    bg: "bg-red-100 dark:bg-red-800",
    text: "text-red-700 dark:text-red-300",
  },
  warning: {
    icon: <FiAlertTriangle className="text-yellow-500" />,
    bg: "bg-yellow-100 dark:bg-yellow-800",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  info: {
    icon: <FiInfo className="text-blue-500" />,
    bg: "bg-blue-100 dark:bg-blue-800",
    text: "text-blue-700 dark:text-blue-300",
  },
};

export default function NotificationBox({
  type = "info",
  message,
  duration = 3000,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-5 right-5 flex items-center p-4 rounded-lg shadow-lg ${notificationTypes[type].bg} ${notificationTypes[type].text} backdrop-blur-md bg-opacity-80 dark:bg-opacity-70`}
        >
          <div className="flex items-center space-x-3">
            {notificationTypes[type].icon}
            <span className="font-medium">{message}</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition"
          >
            <FiX />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
