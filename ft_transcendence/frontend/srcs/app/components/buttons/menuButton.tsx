'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type ButtonProps = {
  icon?: string;
  content?: string;
  path: any;
};

function MenuButton(props: ButtonProps) {
  const [hoverBool, setHoverBool] = useState(false);
  function handleEnter() {
    setHoverBool(true);
  }
  function handleLeave() {
    setHoverBool(false);
  }
  return (
    
    <Link
      href={props.path}
      onMouseEnter={(event) => handleEnter()}
      onMouseLeave={(event) => handleLeave()}
      className={`flex border-r-[3px]  w-full h-full justify-center items-center text-white  transition-all duration-500 md:text-lg lg:text-xl font-Orbitron md:px-8  2xl-2`}
    >
      <div className='flex w-auto'>
        {props.icon && (
          <Image src={props.icon} alt="logo" className='m-auto '/>
        )}
      </div>
      <div className=' NeonShadow font-bold text-base  2xl:text-2xl hidden size0:block'>
        {props.content}
      </div>
    </Link>
  );
}

export default MenuButton;