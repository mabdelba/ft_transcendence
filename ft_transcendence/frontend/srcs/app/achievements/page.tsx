'use client';
import axios from 'axios';
import DiscloComp from '../components/shapes/DiscloComp';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
// import OptionBar from '../components/forms/OptionBar'
import dynamic from 'next/dynamic';


const OptionBar = dynamic(() => import('../components/forms/OptionBar'), {ssr: false});

function Achievements() {
	const [acquired, setAcquired] = useState<any>(null); //
	const [unacquired, setUnacquired] = useState<any>(null); //
	async function getAchievements() {
		const acq = await axios.get(
			'http://localhost:3000/api/atari-pong/v1/achievements/all-acquired',
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),
				},
			},
		);
		const unacq = await axios.get(
			'http://localhost:3000/api/atari-pong/v1/achievements/all-unacquired',
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('jwtToken'),
				},
			},
		);
		setAcquired(acq.data.achievements);
		setUnacquired(unacq.data);
	}
	useEffect(() => {
		getAchievements();
	}, []);

	function setOnline() {
		io('http://localhost:3000', {
			transports: ['websocket'],
			auth: {
				token: localStorage.getItem('jwtToken'),
			},
		});
	}
	useEffect(() => {
		setOnline();
	}, []);
	return (
		// <OptionBar flag={1}>
				<main className="w-screen h-auto md:h-screen flex flex-col font-Orbitron min-h-[480px] min-w-[280px] ">
					<div className="w-full h-12 md:h-[10%] pl-6 md:pl-12 NeonShadow flex justify-start items-center text-base xl:text-3xl -yellow-300">
						All achievements
					</div>
					<div className="w-full h-auto flex flex-col px-2  md:px-12 space-y-8 md:space-y-12">
						<div className="w-full  h-auto ">
							<DiscloComp
								title="Acquired achievements"
								divArray={acquired}
								textColor="text-white NeonShadow"
								Color={true}
								hoverColor="hover:text-[#00B2FF] hover:blueShadow"
								isFriend={false}
								image=""
							/>
						</div>
						<div className="w-full h-auto ">
							<DiscloComp
								title="Unacquired achievements"
								divArray={unacquired}
								textColor="white NeonShadow"
								Color={false}
								hoverColor="hover:text-[#FF0742] hover:redShadow"
								isFriend={false}
								image=""
							/>
						</div>
					</div>
			</main>
		// </OptionBar>
	);
}

export default Achievements;
