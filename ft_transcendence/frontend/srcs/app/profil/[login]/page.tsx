'use client';
import { StaticImageData } from "next/image";
import alien from "../../../public/alien.svg"
import LastMatch from "../../components/forms/LastMatch";
import LatestAchiev from "../../components/forms/LatestAchiev";
import Profil from "../../components/forms/Profil";
import AddFriend from "../../components/forms/AddFriend";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

type newType = {

	params: {login: string}
}

function UserProfil(props: newType){

	const firstName = "Mohamed";
	const lastName = "Abdelbar";
	const login = "mabdelba";

	const [Case, setCase] = useState(1);
	return(
		<main className="h-auto w-auto md:w-screen md:h-screen font-Orbitron NeonShadow min-h-[480px] min-w-[280px]">
		<div className="w-full h-[8%] pl-6 md:pl-12 font-semibold flex justify-start items-center NeonShadow text-base xl:text-3xl">
		  {props.params.login}'s profile:
		</div>
		<div className=" w-full md:h-[84%] h-auto flex flex-col md:flex-row justify-center items-center px-2 md:px-12 space-y-6 md:space-y-0 md:space-x-6 xl:space-x-12 ">
		  <div className="md:h-full h-auto w-full md:w-[60%]  space-y-6 xl:space-y-12 flex flex-col -red-600">
			<div className="w-full md:h-[60%] h-auto">
			  <Profil
				avatar={alien}
				firstname={firstName}
				lastname={lastName}
				login={props.params.login}
				matchPlayed={12}
				winPercent={50}
				level={3}
				percentage={40}
				state={1}
			  />
			</div>
			<div className="w-full md:h-[40%] h-40">
			  <LastMatch matchPlayed={12} />
			</div>
		  </div>
		  <div className="md:h-full h-auto w-full md:w-[40%] space-y-6  xl:space-y-12 flex flex-col -yellow-300">
			<div className="w-full md:h-[40%] h-40">
			  <AddFriend state={Case} login={props.params.login} setState={setCase} />
			</div>
			<div className="w-full md:h-[60%] h-auto">
			  <LatestAchiev />
			</div>
		  </div>
		</div>
		<div className="w-full h-[8%]"></div>
		<ToastContainer
					position="top-center"
					autoClose={4000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="dark"
		/>
	  </main>
	);
}

export default UserProfil;