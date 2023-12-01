'use client';
import React, { Children, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';

type ButtonProps = {
  icon?: string;
  icon2?: string;
  content?: string;
  path?: any;
  drp: boolean;
};

function SearchBar(props: ButtonProps) {
  const [hoverBool, setHoverBool] = useState(false);

  function handleEnter() {
    setHoverBool(true);
  }
  function handleLeave() {
    setHoverBool(false);
  }

  return (
    <Link
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      href={props.path}
      className={` flex flex-col   w-full h-full transition duration-300 ${
        props.drp ? 'bg-black lineshad bg-opacity-25' : ''
      } font-Orbitron min-h-[74px] justify-center hover:text-lime-300 hover:font-extrabold`}
    >
      <div className="flex flex-col justify-end parent">
        <div className=" flex">
          <div className="min-w-[76px] min-h-[74px] flex items-center">
            {props.icon && props.icon2 && (
              <Image className="m-auto" src={!hoverBool ? props.icon : props.icon2} alt="icon" />
            )}
          </div>
          <div className="my-auto text-[14.5px] pr-6 NeonShadow xl:block hidden ">
            {props.content}
          </div>
        </div>
        {/* <div className={`border-b-[3px] ${props.drp ? '' : 'hide'}  w-[85%]`}></div> */}
      </div>
    </Link>
  );
}

export default SearchBar;
