"use client";
import Content from "@/components/Content";
import Image from "next/image";
import Link from "next/link";

export default function MatterPage() {
  const breadcrumb = [{ name: "ข้อมูลครุภัณฑ์", link: "/matter" }];
  return (
    <Content breadcrumb={breadcrumb}>
      <div className="relative flex flex-col h-screen text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 shadow-md rounded-xl">
        <div className="flex flex-col items-center h-screen p-9">
          <div>
            <h2 className="text-2xl font-semibold text-right">
              ข้อมูลครุภัณฑ์
            </h2>
            <div className="divider divider-secondary"></div>
          </div>
          <div className="flex flex-row justify-center gap-4 p-4">
            {[
              { src: "/material.png", title: "ครุภัณฑ์", href: "/assetss" },
              { src: "/brand.png", title: "ยี่ห้อ", href: "/brand" },
              { src: "/unit.png", title: "หน่วยนับ", href: "/materials" },
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
