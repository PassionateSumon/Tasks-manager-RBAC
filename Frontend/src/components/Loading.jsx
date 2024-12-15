import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-[#1E1B29]">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-[#E6E1FF] border-solid rounded-full animate-spin border-t-[#F54298]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#E6E1FF] text-xs font-semibold">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default Loading;
