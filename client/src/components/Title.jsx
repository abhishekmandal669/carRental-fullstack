import React from 'react';

const Title = ({ Title, subTitle, align = "center" }) => {
  return (
    <div className={`flex flex-col justify-center items-center text-center ${
      align === "left" ? "md:items-start md:text-left" : ""
    }`}>
      <h1 className='font-semibold text-4xl md:text-[40px]'>{Title}</h1>
      <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-2xl'>{subTitle}</p>
    </div>
  );
};

export default Title;
