'use client';
import Avatar from '../../../public/avatar.svg';
import Image  from 'next/image';
import Percent from '../shapes/Percent';
import online from '../../../public/online.svg';
import offline from '../../../public/offline.svg';
import { useState } from 'react';

type profileProp = {

	avatar: string;
	firstname: string;
	lastname: string;
	login: string;
	online: boolean;
	level: number;
	percentage: number;
	matchPlayed: number;
	winPercent: number;             
};

function Profil(props: profileProp) {


	const percentage = `${props.percentage}%`;
	const win = `${props.winPercent}%`;
	const lose = `${100 - props.winPercent}%`;
	

	return (

		<div className="h-full w-full flex flex-col  justify-center items-center bg-black NeonShadowBord">
			<div className='h-1/2 w-full flex flex-row items-center '>
				<div className='w-1/4 h-[50%] flex justify-end  '>
					<Image src={props.avatar} alt='avatar' className=''/>
				</div>
				<div className='w-3/4 h-[40%] flex flex-col justify-center items-start px-2 text-xs md:text-sm xl:text-lg'>
					<div className='h-1/3 w-full -slate-700'>
						{props.firstname} {props.lastname} - {props.login}
					</div>
					<div className='h-1/3 w-full -green-500 flex flex-row items-center pt-1.5'>
						LvL {props.level} - {props.percentage}%		-	 
						<Image src={props.online? online : offline} alt="online" className='h-[95%] ml-2'/>
						 {props.online ? 'Online' : 'Offline'}
					</div>
					<div className='h-1/3 w-full -pink-500 pt-1.5'>
						<Percent  width1={percentage} firstColor='bg-white' bord={true}/>
					</div>
				</div>
			</div>
			<div className='h-1/2 w-full flex flex-row text-xs  lg:text-xl'>
				<div className='h-full w-1/2 flex flex-col items-center justify-center'>
					<div className='h-1/2 w-full flex justify-center items-center'><h1>Matches Played</h1></div>
					<div className='h-1/2 w-full flex justify-center items-start text-base lg:text-2xl'><h1>{props.matchPlayed}</h1></div>
				</div>
				<div className='h-full w-1/2 flex flex-col items-center'>
					<div className='h-1/2 w-full flex justify-center items-center -green-500'>
						<h1>Win To Lose Ratio</h1>
					</div>
					<div className='h-1/2 w-[80%] flex flex-col justify-start items-center -blue-600'>
						<div className='w-[90%] flex flex-row justify-between items-start text-sm'>
							<div>{props.winPercent}%</div>
							<div>{100 - props.winPercent}%</div>
						</div>
						<Percent bord={false} width1={win} firstColor='bg-[#00B2FF]' width2={lose} secondColor='bg-[#FF0742]'/>
					</div>					
				</div>
			</div>
		</div>
	);
}

export default Profil;
