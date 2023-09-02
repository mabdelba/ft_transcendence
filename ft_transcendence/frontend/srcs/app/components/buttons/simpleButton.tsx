'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type ButtonProps = {
	icon?: string,
	icon2?: string,
	content?: string,
	buttonType: "button" | "reset" | "submit" | undefined,
}

function SimpleButton(props:ButtonProps){

	const [hoverBool, setHoverBool] = useState(false);
	function handleEnter(){
		setHoverBool(true);
	}
	function handleLeave(){
		setHoverBool(false);
	}
	return(
		<button type={props.buttonType} onMouseEnter={(event)=>handleEnter()}
		onMouseLeave={(event)=>handleLeave()}
		className={`Register bg-black text-white hover:bg-white  hover:text-black transition-all pl-4  xl:pl-0 text-sm md:text-lg lg:text-xl h-full w-full  font-Orbitron flex justify-center items-center`}>
			{(props.icon && props.icon2) && <Image src={!hoverBool ? props.icon: props.icon2} alt="upload icon" className=" w-9 h-8"/>}
			{props.content}
		</button>
	);
}

export default SimpleButton;