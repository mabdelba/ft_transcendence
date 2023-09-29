import alien from "../../../public/alien.svg"
import Image from "next/image";
function LastMatch(){

    const myLogin = 'ahel-bah';
    const oppLogin = 'ktbatou';
    var myRes = 12;
    var oppRes = 18;
    var expression = "You Won!";
    if(oppRes == myRes)
        expression = "Draw!";
    else if(oppRes > myRes)
        expression = "You Lost!";

    return(
        <div className="w-full h-full  flex flex-col NeonShadowBord">
            <div className="w-full h-[35%] flex justify-start items-center pl-10 text-sm lg:text-2xl">
                <h1>Last match stats</h1>
            </div>
            <div className="w-full h-[65%]  flex flex-row ">
                <div className="w-[33%] h-full flex flex-col justify-start items-end " >
                    <div className="w-[50%] h-[45%] mr-5 NeonShadowBord flex justify-center items-center">
                        <Image src={alien} alt="alien"/>
                    </div>
                    <div className="w-[69%] h-[30%] flex justify-center items-center blueShadow text-xs lg:text-2xl text-[#00B2FF]">
                        {myLogin}
                    </div>
                </div>
                <div className="w-[34%] h-[55%]  NeonShadow text-sm lg:text-3xl flex flex-col justify-around items-center">
                    <div>{myRes} - {oppRes}</div>
                    <div>{expression}</div>
                </div>
                <div className="w-[33%] h-full flex flex-col justify-start items-start" >
                    <div className="w-[50%] h-[45%] ml-5 NeonShadowBord flex justify-center items-center">
                        <Image src={alien} alt="alien"/>
                    </div>
                    <div className="w-[69%] h-[30%]  flex justify-center items-center redShadow text-xs lg:text-2xl text-[#FF0742]">
                        {oppLogin}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LastMatch;