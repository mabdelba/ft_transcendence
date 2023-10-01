import alien from "../../../public/alien.svg"
import Image from "next/image";
import { useEffect, useState } from "react";

type newType ={

    matchPlayed: number;
}

function LastMatch(props : newType){
    const [matchData, setMatchData] = useState<any>(null);
    async function getMatch(){
        const lastMatchUrl = 'http://localhost:3000/api/atari-pong/v1/profile/last-match-played';
        const token = localStorage.getItem('jwtToken');
        const config = {
        headers: { Authorization: `Bearer ${token}` },
        };
        const response = await fetch(lastMatchUrl, config);
        const data = await response.json();
        setMatchData(data);
    }
    useEffect(() => {
        getMatch();
    }, []);
    const myLogin = matchData ? matchData.me : 'ahel-bah';
    const oppLogin = matchData ? matchData.other : 'ahel-bah';
    var myRes = matchData ? matchData.myScore : 0;
    var oppRes = matchData ? matchData.otherScore : 0;
    var expression = "You Won!";
    if(oppRes == myRes)
        expression = "Draw!";
    else if(oppRes > myRes)
        expression = "You Lost!";
    var play = false;
    if(props.matchPlayed == 0)
        play = true;

    return(
        <div className="w-full h-full  flex flex-col NeonShadowBord">
            <div className="w-full h-[35%] flex justify-start items-center pl-10 text-sm lg:text-2xl">
                <h1>Last match stats</h1>
            </div>
            {
                play ?
                <div className="w-full h-[45%] flex justify-center items-center text-base lg:text-3xl">
                    No matches played yet
                </div> :
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
            }
        </div>
    );
}

export default LastMatch;