import React from "react";

const Button = ({ children }, props) => {
  return (
    <button
      {...props}
      className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
};

export default Button;
