'use client';
import React, { Children } from 'react';
import { Disclosure } from "@headlessui/react";
import Image from 'next/image';
import Link from 'next/link';

type ButtonProps = {
	icon?: string;
	content?: string;
	path?: any;
	drp: boolean;
  };

function SearchBar(props: ButtonProps) {

	
  return (
	<Link href={props.path} className=' flex flex-col  w-full   pl-0 2xl:pl-8 font-Orbitron min-h-[74px] justify-center '>
		<div className='flex flex-col justify-end parent'>
			<div className=' flex'>
				<div className='min-w-[76px] min-h-[74px] flex items-center'>
					{props.icon && <Image className='h-auto w-auto m-auto ' src={props.icon} alt='icon' />}
				</div>
				<div className='my-auto text-[9px] base:text-xs 2xl:text-lg NeonShadow size0:block hidden' >
					{props.content}
				</div>
			</div>
			<div className={`border-b-[3px] ${props.drp ? '' : 'hide'}  w-[85%]`}></div>
		</div>

	</Link>
  );
}

export default SearchBar;