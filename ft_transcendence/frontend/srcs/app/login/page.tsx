import Link from "next/link";
import close from "../../public/close.svg"
import Image from "next/image";
import SimpleInput from "../components/inputs/simpleInput";
import seePassword from "../../public/seePassword.svg"
import SimpleButton from "../components/buttons/simpleButton";
import QuaranteDeux from "../../public/42.svg"
import blackQuarante from "../../public/black42.svg"
import google from "../../public/google.svg"



function Login(){

    return(
        <main className="flex justify-center items-center bg-[#282828] w-screen h-screen">
            <div className="px-6 py-1 flex flex-col justify-center min-w-[280px] min-h-[479px] w-full h-[65%] md:w-2/3  lg:w-1/3  bg-black NeonShadowBord">
                <div className="w-full h-[30%]">
                    <div className="flex justify-end items-center h-1/5 w-full ">
						<Link  href="/"><Image src={close} alt="close" className="w-10 h-10"/></Link>
					</div>
					<div className="w-full h-4/6 text-white text-3xl font-bold NeonShadow font-Orbitron flex justify-center items-center">
						<h1>Atari Pong</h1>
					</div>                   
                </div>
                <div className="w-full h-[30%] flex  flex-col justify-start space-y-6 px-2 ">
                    <div className="h-[30%] w-full ">
						<SimpleInput holder="Username"  type1="text" error={true} />
					</div>
					<div className="h-[30%] w-full ">
						<SimpleInput holder="Password"  type1="password" type2="text" icon={seePassword} error={true} />
					</div>
                </div>
                <div className="px-2 w-full h-[40%] space-y-10">
                    <div className="h-[25%] w-full ">
						<SimpleButton content="Register"  />
					</div>
					<div className="h-[25%] w-full flex flex-row justify-center space-x-10">
						<div className="w-1/2 h-full">
							<SimpleButton icon={QuaranteDeux} icon2={blackQuarante}/>
						</div>
						<div className="w-[50%] h-full">
						<SimpleButton icon={google} icon2={google}/>
						</div> 
					</div>
                </div>
            </div>
        </main>
    );

}


export default Login;