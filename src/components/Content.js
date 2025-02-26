"use client";

import HeaderBar from "./HeaderBar";
import Breadcrumb from "./Breadcrumb";
import Loading from "./LoadingPage";

export default function Dashboard({
  children,
  breadcrumb,
  LoadingPage = false,
}) {
  return (
    <div className="flex bg-gradient-to-br from-blue-500 to-purple-500 dark:from-gray-900 dark:to-black transition-all min-h-screen">
      <div className="flex-1 flex flex-col transition-all">
        <HeaderBar />
        <div className="flex-1 flex flex-col overflow-hidden justify-center items-center">
          <div className="flex-1 overflow-y-auto p-4 w-full ">
            {breadcrumb && <Breadcrumb paths={breadcrumb} />}
            {LoadingPage ? <Loading /> : children}
            {/* {children} */}
          </div>
        </div>
      </div>
    </div>
  );
}
