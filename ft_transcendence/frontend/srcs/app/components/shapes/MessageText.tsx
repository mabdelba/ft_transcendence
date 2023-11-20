'use client';
import React, { useContext }  from "react";
import { context } from "../../../context/context";

type Props ={

    sender: string;
    message: string;
    selected : number;

}

function MessageText(props: Props){

    const {user} = useContext(context);
    return (<div className={`h-full w-full py-1 px-5   xl:py-2 xl:px-10 flex flex-col space-y-1 ${props.sender == user.login ? 'items-end border-[#1EBBFF] md:pl-5 pl-10 ' : 'items-start border-[#FF0742] md:pr-5 pr-10'}`}>
        {props.selected == 1 && props.sender != user.login && <div className=" text-[8px] sm:text-xs md:text-sm xl:text-lg">{props.sender}</div>}
        <span className={`border-[2px] break-all lg:border-[3px] max-w-[28vh] sm:max-w-[50vh] lg:max-w-[67vh] ${props.sender ==user.login ? 'blueShadowBord rounded-bl-2xl text-white' : 'rShadowBord rounded-br-2xl text-zinc-300 '} antialiased  border-inherit text-[8px] sm:text-xs md:text-sm xl:text-base p-2  sm:p-4 `}>
           {props.message}
        </span>
    </div>)
}


export default MessageText;


// , hicham el guerroum etait arrivé à Athene farouchement deteminé à faire oublier ses mesaventures d'Atlanta et 
//            de Sydnee où pour divers raisons il n'avait pas pû decrocher leur olympiques.