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

function SideBar() {
  return (
	<Disclosure as='nav' className='fixed hidden md:block w-[298px]'>
	{/* <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
		Dashboard
	</Disclosure.Button> */}
	<div className='flex h-[100vh] NeonShadow'>
		<div className='pt-8'>
			<SideBarButton icon={Dashboard} content='Dashboard' path='/dashboard' />
			<SideBarButton icon={Achievements} content="Achievements" path='/achievements' />
			<SideBarButton icon={Friends} content='Friends' path='/friends' />
			<SideBarButton icon={Messages} content='Messages' path='/messages' />
			<SideBarButton icon={History} content='History' path='/history' />
			<SideBarButton icon={Settings} content='Settings' path='/settings' />
		</div>
		<div className='border-r-[3px] lineshad'></div>
	</div>
	</Disclosure>
  );
}

export default SideBar;