'use client';
import React, { useContext }  from "react";
import { context } from "../../../context/context";

type Props ={

    sender: string;
    message: string;

}

function MessageText(props: Props){

    const {user} = useContext(context);
    return (<div className={`h-full w-full py-10 px-10 flex ${props.sender == user.login ? 'justify-end border-[#1EBBFF] ' : 'justify-start border-[#FF0742]'}`}>

        <span className={`border-[3px] w-1/2  ${props.sender ==user.login ? 'blueShadowBord' : 'rShadowBord'}  border-inherit text-lg py-4 px-4`}>
           {props.message}, , hicham el guerroum etait arrivé à Athene farouchement deteminé à faire oublier ses mesaventures d'Atlanta et 
           de Sydnee où pour divers raisons il n'avait pas pû decrocher leur olympiques.
        </span>
    </div>)
}


export default MessageText;