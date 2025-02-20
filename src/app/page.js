"use client";

import Content from "@/components/Content";
import { FiShoppingCart, FiUsers, FiEye } from "react-icons/fi";

export default function Dashboard() {
  return (
    <Content>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Sales",
            value: "7,455",
            icon: <FiShoppingCart className="text-blue-500" />,
          },
          {
            title: "New Users",
            value: "5,186",
            icon: <FiUsers className="text-green-500" />,
          },
          {
            title: "Page Views",
            value: "10,690k",
            icon: <FiEye className="text-purple-500" />,
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-6 flex items-center space-x-4 transition-transform transform hover:scale-105"
          >
            <div className="text-4xl">{stat.icon}</div>
            <div>
              <h3 className="text-gray-800 dark:text-gray-300">{stat.title}</h3>
              <p className="text-2xl font-semibold text-black dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="collapse bg-gray-100 dark:bg-gray-800 mt-2">
        <input type="radio" name="my-accordion-1" defaultChecked />
        <div className="collapse-title text-xl font-medium text-gray-800 dark:text-gray-300">
          Click to open this one and close others
        </div>
        <div className="collapse-content">
          <p>hello</p>
        </div>
      </div>
      <div className="collapse bg-gray-100 dark:bg-gray-800 mt-2">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title text-xl font-medium">
          Click to open this one and close others
        </div>
        <div className="collapse-content">
          <p>hello</p>
        </div>
      </div>
      <div className="collapse bg-gray-100 dark:bg-gray-800 mt-2">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title text-xl font-medium">
          Click to open this one and close others
        </div>
        <div className="collapse-content">
          <p>hello</p>
        </div>
      </div>
    </Content>
  );
}
