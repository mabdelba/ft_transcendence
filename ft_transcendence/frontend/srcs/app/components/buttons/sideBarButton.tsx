'use client';
import React from 'react';
import { Disclosure } from "@headlessui/react";
import Image from 'next/image';
import Link from 'next/link';

type ButtonProps = {
	icon?: string;
	content?: string;
	path?: any;
  };

function SearchBar(props: ButtonProps) {

	
  return (
	<Link href={props.path} className='flex flex-col w-[295px] pl-8 font-Orbitron min-h-[74px] m-auto justify-center '>
		<div className='flex flex-col justify-end parent'>
			<div className=' flex'>
				<div className='min-w-[76px] min-h-[74px] flex items-center'>
					{props.icon && <Image className='m-auto' src={props.icon} alt='icon' />}
				</div>
				<div className='my-auto pr-[20px] NeonShadow'>
					{props.content}
				</div>
			</div>
			<div className='border-b-[3px] hide w-[85%]'></div>
		</div>

	</Link>
  );
}

export default SearchBar;