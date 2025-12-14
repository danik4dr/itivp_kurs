import React from "react";

export default function Layout({ children }) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[1200px] px-6 py-4">
        {children}
      </div>
    </div>
  );
}
