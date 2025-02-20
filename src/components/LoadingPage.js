import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-40 z-50">
      <span className="loading loading-spinner loading-lg text-green-600"></span>
      {/* <span className="loading loading-infinity loading-lg text-green-600"></span>
      <span className="loading loading-ring loading-lg text-green-600"></span> */}
    </div>
  );
};

export default Loading;
