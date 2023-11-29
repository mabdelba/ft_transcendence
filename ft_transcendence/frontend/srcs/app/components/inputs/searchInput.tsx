'use client';
import { use, useState, MouseEvent } from 'react';
import Image from 'next/image';
import { types } from 'util';

type InputProps = {
  holder: string;
  icon: string;
};

function SearchInput(props: InputProps) {
  return (
    <div className="min-h-full w-full h-full">
      <div className="flex h-[97%] w-full">
        <Image className="" src={props.icon} alt="logo" />
        <div className="w-[100%]">
          <input
            placeholder={props.holder}
            className="pl-2  md:text-lg lg:text-xl h-full w-full bg-transparent text-white outline-none placeholder-[rgba(255, 255, 255, 0.50);] text-sm focus:bg-opacity-5 transition-all duration-500"
            type="text"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchInput;
