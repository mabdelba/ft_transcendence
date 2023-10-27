'use client';
import { use, useState, MouseEvent } from 'react';
import Image from 'next/image';
import {BsKeyboardFill , BsFillSendFill} from 'react-icons/bs'

type InputProps = {

  SetValue: Function;
  value: string;
  handleClick: any;
};

function SendMessage(props: InputProps) {


  return (
    <form className="space-y-44 h-full w-full">
      <div
        className={`w-full h-full  flex justify-center  items-center  bg-transparent px-7`}
      >
        <div className='mr-4'><BsKeyboardFill size="25"/></div>
        <div className="flex justify-center items-center bg-transparent font-Orbitron text-sm md:text-lg lg:text-xl h-full w-full">
          <input
            placeholder="Type message . . ."
            className="h-full w-full pl-3 bg-transparent text-white outline-none placeholder-[#484848]"
            type="text"
            onChange={(event) => props.SetValue(event.target.value)}
            value={props.value}
          />
        </div>
          <button
            onClick={props.handleClick}
            type='submit'
    
            className="right-5 flex w-15 h-10 justify-center items-center p-2 hover:text-[#FF184F] text-xl 2xl:text-2xl hover:text-3xl transition-all duration-500"
          >
            <BsFillSendFill  />
          </button>
      </div>
    </form>
  );
}

export default SendMessage;
