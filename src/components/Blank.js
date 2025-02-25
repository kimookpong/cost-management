"use client";

export default function Blank({ children }) {
  return (
    <div className="flex bg-gradient-to-br from-blue-500 to-purple-500 dark:from-gray-900 dark:to-black transition-all min-h-screen">
      <div className="flex-1 flex flex-col transition-all">
        <div className="flex-1 flex flex-col overflow-hidden justify-center items-center">
          <div className="flex-1 overflow-y-auto max-w-7xl w-full ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
