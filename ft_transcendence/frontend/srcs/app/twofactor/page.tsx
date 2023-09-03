'use client';
import Link from "next/link";
import Image from "next/image";
import close from "../../public/close.svg";
import SimpleButton from "../components/buttons/simpleButton";
import SimpleInput from "../components/inputs/simpleInput";
import { useState } from "react";

function TwoFactor(){

	const [fir, setFir] = useState(0);
	const [sec, setSec] = useState(0);
	const [thi, setThi] = useState(0);
	const [forth, setForth] = useState(0);
	const [fiv, setFiv] = useState(0);
	const [six, setSix] = useState(0);
	const [change, setChange] = useState(false);
	const [error, setError]= useState(true);
	const CodeObj = {fir, sec, thi, forth, fiv, six};

	const handlSubmit = (event: any)=>{

		event.preventDefault();
		if(!change)
			return
		if(change && (CodeObj.fir < 0 || CodeObj.fir > 9 || CodeObj.sec < 0 || CodeObj.sec > 9 || CodeObj.thi < 0 || CodeObj.thi > 9
			|| CodeObj.forth < 0 || CodeObj.forth > 9 || CodeObj.fiv < 0 || CodeObj.fiv > 9 || CodeObj.six < 0 || CodeObj.six > 9))
			return setError(false);
		else
			setError(true);
		console.log(CodeObj);
	}

	const handleBlur = () => {

		if(!change)
			return;
		if((CodeObj.fir < 0 || CodeObj.fir > 9 || CodeObj.sec < 0 || CodeObj.sec > 9 || CodeObj.thi < 0 || CodeObj.thi > 9
			|| CodeObj.forth < 0 || CodeObj.forth > 9 || CodeObj.fiv < 0 || CodeObj.fiv > 9 || CodeObj.six < 0 || CodeObj.six > 9))
			setError(false);
		else
			setError(true);
	}

	const checkChange = (event: any)=>{

		event.preventDefault();
		setChange(true);
	}
	return(
		<main className="flex justify-center items-center w-full h-screen">
			<div className="px-2 py-1 flex flex-col min-w-[280px] min-h-[479px] w-full h-[50%]  md:w-2/3 size0:w-2/3 size1:w-1/3  lg:h-[50%] bg-black NeonShadowBord">
				<div className="h-1/5 flex justify-end items-start w-full ">
					<Link  href="/"><Image src={close} alt="close" className="w-10 h-10"/></Link>
				</div>
				<form onSubmit={handlSubmit} onChange={checkChange} className="h-3/5 w-full  flex flex-col items-center ">
					<div className="h-1/3 w-full  flex justify-center items-center text-sm md:text-lg lg:text-3xl">
						<h1 className="NeonShadow text-white font-Orbitron font-bold">Two-factor  authentication</h1>
					</div>
					<div onBlur={handleBlur} className="px-4 h-1/3 w-full  flex flex-row space-x-6">
						<div className="w-1/2 h-full  flex flex-row  items-center space-x-2 ">
							<div className="h-4/5">
								<SimpleInput holder=''  type1="number" error={error} SetValue={setFir}/>
							</div>
							<div className="h-4/5">
								<SimpleInput holder=''  type1="number" error={error} SetValue={setSec}/>
							</div>
							<div className="h-4/5">
								<SimpleInput holder=''  type1="number"  error={error} SetValue={setThi}/>
							</div>
						</div>
						<div className="w-1/2 h-full  flex flex-row  items-center space-x-2 ">
							<div className="h-4/5">
								<SimpleInput holder=''  type1="number" error={error} SetValue={setForth} />
							</div>
							<div className="h-4/5">
								<SimpleInput holder=''  type1="number" error={error} SetValue={setFiv}/>
							</div>
							<div className="h-4/5">
								<SimpleInput holder=''  type1="number"  error={error} SetValue={setSix}/>
							</div>                           
						</div>
					</div>
					<div className="px-2 h-1/3 w-full  flex items-end justify-center">
						<div className="h-2/3 w-full">
							<SimpleButton content="Continue"  buttonType="submit"/>
						</div>
					</div>
				</form>
				<div className="h-1/5 "></div>
			</div>
		</main>
	);

}

export default TwoFactor;