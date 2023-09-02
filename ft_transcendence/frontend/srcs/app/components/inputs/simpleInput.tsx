'use client';
import { use, useState, MouseEvent } from "react";
import seePassword from "../../../public/seePassword.svg";
import Image from "next/image";

type InputProps = {
  holder: string,
  type1: string,
  type2?: string,
  icon?: string,
  SetValue: Function,
  error: boolean,
};

function SimpleInput(props: InputProps) {
  
  const [showpassword, setShowPassword] = useState(false);
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setShowPassword(!showpassword);
  }
  // const [val, setVal] = useState('');
  // console.log(val);

  return (
    <div className="space-y-44 h-full w-full">
      <div className={`w-full h-full flex justify-center  items-center ${props.error ? "NeonShadowBord" : "NeonShadowBordRed"} bg-[#272727] pr-2`}>
        <div className="flex justify-center items-center bg-transparent font-Orbitron text-sm md:text-lg lg:text-xl h-full w-full">
          <input
            placeholder={props.holder}
            className="h-full w-full pl-3 bg-transparent text-white outline-none placeholder-[#484848]"
            type={!showpassword ? props.type1 : props.type2}
            onChange={(event) => props.SetValue(event.target.value)}
            // required
          />
        </div>
          {props.icon && 
          <button onClick={(event)=>handleClick(event)} className="right-5 flex w-15 h-10 justify-center items-center p-2">
            <Image src={props.icon} alt="eye" />
          </button>}
      </div>
    </div>
  );
}

export default SimpleInput;
