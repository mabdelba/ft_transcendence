import Link from "next/link";
import Image from "next/image";
import close from "../../public/close.svg";
import SimpleButton from "../components/buttons/simpleButton";
import SimpleInput from "../components/inputs/simpleInput";

function TwoFactor(){

	return(
		<main className="flex justify-center items-center w-full h-screen">
			<div className="px-2 py-1 flex flex-col min-w-[280px] min-h-[479px] w-full h-[50%]  md:w-2/3 size0:w-2/3 size1:w-1/3  lg:h-[50%] bg-black NeonShadowBord">
				<div className="h-1/5 flex justify-end items-start w-full ">
					<Link  href="/"><Image src={close} alt="close" className="w-10 h-10"/></Link>
				</div>
				<div className="h-3/5 w-full  flex flex-col items-center ">
					<div className="h-1/3 w-full  flex justify-center items-center text-sm md:text-lg lg:text-3xl">
						<h1 className="NeonShadow text-white font-Orbitron font-bold">Two-factor  authentication</h1>
					</div>
					<div className="px-4 h-1/3 w-full  flex flex-row space-x-6">
						<div className="w-1/2 h-full  flex flex-row  items-center space-x-2 ">
							<div className="h-4/5">
								<SimpleInput holder=''  type1="text" error={true} />
							</div>
							<div className="h-4/5">
								<SimpleInput holder=''  type1="text" error={true} />
							</div>
							<div className="h-4/5">
								<SimpleInput holder=''  type1="text"  error={true} />
							</div>
						</div>
						<div className="w-1/2 h-full  flex flex-row  items-center space-x-2 ">
							<div className="h-4/5">
								<SimpleInput holder=''  type1="text" error={true} />
							</div>
							<div className="h-4/5">
								<SimpleInput holder=''  type1="text" error={true} />
							</div>
							<div className="h-4/5">
								<SimpleInput holder=''  type1="text"  error={true} />
							</div>                           
						</div>
					</div>
					<div className="px-2 h-1/3 w-full  flex items-end justify-center">
						<div className="h-2/3 w-full">
							<SimpleButton content="Continue"  />
						</div>
					</div>
				</div>
				<div className="h-1/5 "></div>
			</div>
		</main>
	);

}

export default TwoFactor;