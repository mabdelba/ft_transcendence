'use client';
import Image from "next/image";
import Link from "next/link";
import SimpleButton from "../components/buttons/simpleButton";
import uploadIcon from "../../public/uploadIcon.svg";
import google from "../../public/google.svg";
import close from "../../public/close.svg";
import SimpleInput from "../components/inputs/simpleInput";
import QuaranteDeux from "../../public/42.svg";
import seePassword from "../../public/seePassword.svg";
import blackupload from "../../public/blackupload.svg";
import blackQuarante from "../../public/black42.svg"
import { useState } from "react";

function Register() {
	var Regex = /\b([a-zA-ZÀ-ÿ][-a-zA-ZÀ-ÿ. ']+[ ]*)+/;
	var EmRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	var PassRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

	const [firstname, setFirstName] = useState('');
	const [lastname, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [vpassword, setVerif] = useState('');
	const [ferror, setFerror] = useState(true);
	const [lerror, setLerror] = useState(true);
	const [eerror, setEerror] = useState(true);
	const [uerror, setUerror] = useState(true);
	const [perror, setPerror] = useState(true);
	const [verror, setVerror] = useState(true);
	// const [valid, setValid] = useState(false);
	
	const Data = {firstname, lastname, username, email, password};

	const handleSubmit = (event: any) => {
		
		event.preventDefault();
		if(Data.firstname == "")
			return(setFerror(false));
		if(Data.lastname == "")
			return(setLerror(false));
		if(Data.username == "")
			return(setUerror(false));
		if(Data.email == "")
			return(setEerror(false));
		if(Data.password == "")
			return(setPerror(false));
		if(!ferror || !lerror || !uerror || !eerror || !perror || !verror)
			return;
		console.log(Data);
	}

	const handleBlur = () => {

		const regFirstName = Regex.test(Data.firstname);
		if (!regFirstName && Data.firstname != '')
			setFerror(false);
		else
			setFerror(true);
		if(Data.username != "")
			setUerror(true);
		const regLastName = Regex.test(Data.lastname);
		if (!regLastName && Data.lastname != '')
			setLerror(false);
		else
			setLerror(true);
		const regEmail = EmRegex.test(Data.email);
		if (!regEmail && Data.email != '')
			setEerror(false);
		else
			setEerror(true);
		if(!PassRegex.test(Data.password) && Data.password != '')
			setPerror(false);
		else
			setPerror(true);
		if(vpassword !== password )
			setVerror(false);
		else
			setVerror(true);
	}

	return (
		<main className="flex justify-center items-center bg-[#282828] w-screen h-screen">
			<div className="px-2 py-1 flex flex-col justify-center min-w-[280px] min-h-[479px] w-full h-[90%] md:w-2/3  lg:w-1/3  lg:h-[80%] bg-black NeonShadowBord">
				<div className="h-1/6 w-full  flex flex-col">
					<div className="flex justify-end items-center h-1/5 w-full ">
						<Link  href="/"><Image src={close} alt="close" className="w-10 h-10"/></Link>
					</div>
					<div className="w-full h-4/6 text-white text-3xl font-bold NeonShadow font-Orbitron flex justify-center items-center">
						<h1>Atari Pong</h1>
					</div>
				</div>
				<form onSubmit={handleSubmit} className=" w-full h-5/6 flex  flex-col space-y-3 px-2">
					<div className="h-[10%] w-full flex flex-row justify-center space-x-2">
						<div onBlur={handleBlur} className="w-1/2 h-full">
							<SimpleInput holder="First Name"  type1="text" SetValue={setFirstName} error={ferror}/>
						</div>
						<div onBlur={handleBlur} className="w-[50%] h-full">
							<SimpleInput  holder="Last Name"  type1="text" SetValue={setLastName} error={lerror}/>
						</div>
					</div>
					<div onBlur={handleBlur} className="h-[10%] w-full ">
						<SimpleInput holder="Username" type1="text" SetValue={setUsername} error={uerror}/>
					</div>
					<div onBlur={handleBlur} className="h-[10%] w-full ">
						<SimpleInput holder="Mail@example.com"  type1="email"  SetValue={setEmail} error={eerror}/>
					</div>
					<div onBlur={handleBlur} className="h-[10%] w-full ">
						<SimpleInput holder="Password"  type1="password" type2="text" icon={seePassword} error={perror} SetValue={setPassword}/>
					</div>
					<div onBlur={handleBlur} className="h-[10%] w-full ">
						<SimpleInput holder="Verify Password" type1="password" type2="text" icon={seePassword} error={verror} SetValue={setVerif}/>
					</div>
					<div  className="h-[10%] w-full ">
						<SimpleButton buttonType="button" content="Upload avatar" icon={uploadIcon} icon2={blackupload}/>
					</div>
					<div className="h-[10%] w-full ">
						<SimpleButton buttonType="submit" content="Register"  />
					</div>
					<div className="h-[10%] w-full flex flex-row justify-center space-x-2">
						<div className="w-1/2 h-full">
							<SimpleButton buttonType="button" icon={QuaranteDeux} icon2={blackQuarante}/>
						</div>
						<div className="w-[50%] h-full">
						<SimpleButton  buttonType="button" icon={google} icon2={google}/>
						</div> 
					</div>

				</form>

			</div>
		</main>
	);
}

export default Register;
