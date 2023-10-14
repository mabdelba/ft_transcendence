'use client';
import React from 'react';
import { Disclosure } from "@headlessui/react";
import Image from 'next/image';
import Dashboard from '../../../public/dashboard2.svg';
import Achievements from '../../../public/achievements.svg';
import Friends from '../../../public/friends.svg';
import History from '../../../public/history.svg';
import Messages from '../../../public/messages.svg';
import Settings from '../../../public/settings.svg';
import SideBarButton from '../buttons/sideBarButton';
import SimpleButton from '../buttons/simpleButton';
import logOut from "../../../public/log-out.svg";
import logOutblack from "../../../public/log-out2.svg"
import { useRouter } from 'next/navigation';

function SideBar({flag}: {flag: number}) {
	const router = useRouter();
	function handleLogOutClick() {
		localStorage.removeItem('jwtToken');
		router.push('/');
	}
  return (
	<Disclosure as='nav' className='w-full h-full -green-500'>
	{/* <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
		Dashboard
	</Disclosure.Button> */}
	<div className='flex h-full w-full NeonShadow  justify-center'>
		<div className='pt-8 w-full -red-600 flex flex-col justify-between pb-4'>
			<SideBarButton icon={Dashboard} content='Dashboard' path='/dashboard' drp={flag == 0 ? true : false} />
			<SideBarButton icon={Achievements} content="Achievements" path='/achievements' drp={flag == 1 ? true : false }/>
			<SideBarButton icon={Friends} content='Friends' path='/friends' drp={flag == 2 ? true : false } />
			<SideBarButton icon={Messages} content='Messages' path='/messages' drp={flag == 3 ? true : false }/>
			<SideBarButton icon={History} content='History' path='/history' drp={flag == 4 ? true : false }/>
			<SideBarButton icon={Settings} content='Settings' path='/settings' drp={flag == 5 ? true : false } />
			<div className='w-full h-20 mt-auto flex justify-center' onClick={handleLogOutClick}>
				<div className='w-[80%]'><SimpleButton flag={true} buttonType='button' icon={logOut} icon2={logOutblack} content=' Log-out'  /></div>
			</div>
		</div>
		<div className='border-r-[3px] h-auto lineshad'></div>
	</div>
	</Disclosure>
  );
}

export default SideBar;