'use client';
import React, { useContext }  from "react";
import { context } from "../../../context/context";

type Props ={

    sender: string;
    message: string;

}

function MessageText(props: Props){

    const {user} = useContext(context);
    return (<div className={`h-full w-full py-1 px-5   xl:py-2 xl:px-10 flex ${props.sender == user.login ? 'justify-end border-[#1EBBFF] md:pl-5 pl-10 ' : 'justify-start border-[#FF0742] md:pr-5 pr-10'}`}>

        <span className={`border-[2px] break-all lg:border-[3px] max-w-[28vh] sm:max-w-[50vh] lg:max-w-[67vh] ${props.sender ==user.login ? 'blueShadowBord rounded-bl-2xl' : 'rShadowBord rounded-br-2xl '}  border-inherit text-[8px] sm:text-xs md:text-sm xl:text-lg p-2  sm:p-4 `}>
           {props.message}
        </span>
    </div>)
}


export default MessageText;


// , hicham el guerroum etait arrivé à Athene farouchement deteminé à faire oublier ses mesaventures d'Atlanta et 
//            de Sydnee où pour divers raisons il n'avait pas pû decrocher leur olympiques.