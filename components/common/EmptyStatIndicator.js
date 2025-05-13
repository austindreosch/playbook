import React from 'react';

const EmptyStatIndicator = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="h-[1px] w-[25%] bg-gray-300"></div>
      <div className="h-[1px] w-[18%] bg-gray-300 mt-[3px]"></div>
    </div>
  );
};

export default EmptyStatIndicator; 