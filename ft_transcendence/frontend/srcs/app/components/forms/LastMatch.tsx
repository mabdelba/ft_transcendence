import alien from "../../../public/alien.svg"
import Image from "next/image";
function LastMatch(){

    return(
        <div className="w-full h-full flex flex-col NeonShadowBord">
            <div className="w-full h-[35%] flex justify-start items-center pl-4 lg:pl-10 text-sm lg:text-2xl">
                <h1>Last match stats</h1>
            </div>
            <div className="w-full h-[65%]  flex flex-row ">
                <div className="w-[33%] h-full flex flex-col justify-start items-end " >
                    <div className="w-[50%] h-[45%] mr-5 NeonShadowBord flex justify-center items-center">
                        <Image src={alien} alt="alien"/>
                    </div>
                    <div className="w-[69%] h-[30%] flex justify-center items-center blueShadow text-2xl text-[#00B2FF]">
                        ahel-bah
                    </div>
                </div>
                <div className="w-[34%] h-[55%]  NeonShadow text-2xl flex flex-col justify-around items-center">
                    <div>10 - 3</div>
                    <div>You Won!</div>
                </div>
                <div className="w-[33%] h-full flex flex-col justify-start items-start" >
                    <div className="w-[50%] h-[45%] ml-5 NeonShadowBord flex justify-center items-center">
                        <Image src={alien} alt="alien"/>
                    </div>
                    <div className="w-[69%] h-[30%]  flex justify-center items-center redShadow text-2xl text-[#FF0742]">
                        ktbatou
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LastMatch;