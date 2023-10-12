'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type ButtonProps = {
  icon?: string;
  content?: string;
  path?: any;
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
      className={`flex  text-white min-w-max transition-all duration-500 md:text-lg lg:text-xl font-Orbitron md:px-8 md:min-w-[295px]`}
    >
      <div className='m-auto '>
        {props.icon && (
          <Image src={props.icon} alt="logo" />
        )}
      </div>
      <div className='p-4 m-auto NeonShadow font-bold text-2xl hidden md:block'>
        {props.content}
      </div>
    </Link>
  );
}

export default MenuButton;