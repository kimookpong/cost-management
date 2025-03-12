"use client";
import Content from "@/components/Content";
import Image from "next/image";
import Link from "next/link";
import { FiBox } from "react-icons/fi";
export default function MatterPage() {
  const breadcrumb = [{ name: "กำหนดค่าเริ่มต้น", link: "/matter" }];
  return (
    <Content breadcrumb={breadcrumb} title="กำหนดค่าเริ่มต้น">
      <div className="relative flex flex-col h-screen text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <div className="flex flex-col items-start h-screen p-9">
          <div className="p-4">
            <div className="flex items-center justify-end space-x-2">
              <FiBox className="text-xl" />
              <h2 className="text-2xl font-semibold text-right">
                กำหนดค่าเริ่มต้น
              </h2>
            </div>
            <div className="divider divider-secondary absolute left-2 right-2 "></div>
          </div>
          <div className="flex flex-row justify-center gap-4 p-4 items-start">
            {[
              { src: "/brand.png", title: "ยี่ห้อ", href: "/brand" },
              { src: "/unit.png", title: "หน่วยนับ", href: "/materials" },
              // { src: "/m4.png", title: "ปีการศึกษา", href: "/academic" },
            ].map((item, index) => (
              <Link key={index} href={item.href} passHref>
                <div className="card-body p-4 bg-white flex flex-col items-center rounded-lg shadow-lg cursor-pointer">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={150}
                    height={150}
                  />
                  <h1 className="text-xl font-semibold text-primary">
                    {item.title}
                  </h1>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Content>
  );
}
