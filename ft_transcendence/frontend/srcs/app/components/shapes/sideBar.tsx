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
import limeDashboard from "../../../public/limeDashboard.svg"
import limeAchiev from "../../../public/limeAchivements.svg"
import limeFriends from "../../../public/limeFriends.svg"
import limeMessages from "../../../public/limeMessages.svg"
import limeHistory from "../../../public/limeHistory.svg"
import limeSettings from "../../../public/limeSetting.svg"
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { context } from '../../../context/context';

function SideBar({flag}: {flag: number}) {
	const {socket} = useContext(context);
	const router = useRouter();
	function handleLogOutClick() {
		localStorage.removeItem('jwtToken');
		socket.disconnect();
		router.push('/');
	}
  return (
	<Disclosure as='nav' className='w-full h-full -green-500'>
	
		<div className='flex h-full w-full NeonShadow flex-col justify-between pb-2 '>
			<div className='pt-4 xl:pt-8 w-full  -red-600 flex flex-col  pb-4 '>
				<SideBarButton icon2={limeDashboard} icon={Dashboard} content='Dashboard' path='/dashboard' drp={flag == 0 ? true : false} />
				<SideBarButton icon2={limeAchiev} icon={Achievements} content="Achievements" path='/achievements' drp={flag == 1 ? true : false }/>
				<SideBarButton icon2={limeFriends} icon={Friends} content='Friends' path='/friends' drp={flag == 2 ? true : false } />
				<SideBarButton icon2={limeMessages} icon={Messages} content='Messages' path='/messages' drp={flag == 3 ? true : false }/>
				<SideBarButton icon2={limeHistory} icon={History} content='History' path='/history' drp={flag == 4 ? true : false }/>
				<SideBarButton icon2={limeSettings} icon={Settings} content='Settings' path='/settings' drp={flag == 5 ? true : false } />
			</div>
			<div className='w-full h-[60px] mt-auto flex justify-center ' >
				<div className='w-[80%]'><SimpleButton flag={true} buttonType='button' icon={logOut} icon2={logOutblack} content='Log-out' handleClick={handleLogOutClick} /></div>
			</div>
		</div>
	</Disclosure>
  );
}

export default SideBar;