'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Logo from "../../../public/logo.svg"

function MenuButton() {

  return (
    <Link
      href='/'
      className={`flex  w-full h-full justify-center items-center text-white  transition-all duration-500  font-Orbitron`}
    >
      <div className='flex '>
          <Image src={Logo} alt="logo" className='w-auto h-auto '/>
      </div>
      <div className='NeonShadow font-bold text-xl hidden xl:block pr-3'>
        Atari Pong
      </div>
    </Link>
  );
}

export default MenuButton;