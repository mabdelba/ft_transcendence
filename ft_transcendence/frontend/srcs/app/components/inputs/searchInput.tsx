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
	<div className='min-h-full w-full'>
		<div className='flex'>
			<div className='w-0 border-r-[3px] lineshad'>
			</div>
			<Image className='' src={props.icon} alt="logo" />
			<div className='w-[100%]'>
				<input
				placeholder={props.holder}
				className="pl-2  font-Gemunu_Libre md:text-lg lg:text-2xl h-full w-full bg-transparent text-white outline-none placeholder-[rgba(255, 255, 255, 0.50);] focus:bg-[#222222] transition-all duration-500"
				type="text"
				/>
			</div>
		</div>
		<div className='border-b-[3px] w-[100%] lineshad'></div>
	</div>
  );
};

export default SearchInput;
