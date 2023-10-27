'use client';
import { useContext, useEffect, useState } from "react";
import OptionBar from "../components/forms/OptionBar";
import ListBox from "../components/buttons/ListBox";
import { context } from "../../context/context";
import BurgButton from "../components/shapes/burgButton";
import MyMenu from "../components/buttons/DropBox";
import alien from "../../public/alien.svg";
import Image from "next/image";
import group from "../../public/friends.svg"




const friendList = ['forlan', 'maradona', 'costa', 'milito']
const Groups = ['#Group one', 'Group two', '&Group three']

function Messages(){

    const [showSideBar, setShowSideBar] = useState(false);
    const [selected, setSelected] = useState(0);
    const {user} = useContext(context);
    const [showArray, setShowArray] = useState<any>([]);
    const [roomSelected, setRoomSelected] = useState(friendList[0]);

    // const [friendList, setFriendList] = useState(user.friendList);
  

    useEffect(()=> {
        selected == 0 ? (setShowArray(friendList), setRoomSelected(friendList[0]) ):
        selected == 1 ? (setShowArray(Groups), setRoomSelected(Groups[0])) :
        setShowArray([]);

    }, [selected])
    return (<OptionBar flag={3}> 
        <main className="w-full h-full   flex flex-col items-center  font-Orbitron min-h-[550px]  min-w-[280px] pb-2 px-6  md:px-12 ">
            <div className="w-full h-[8%]  NeonShadow flex justify-start items-center text-base xl:text-3xl ">
				Messages
			</div>
            <div className="w-full  h-auto md:h-[88%] NeonShadowBord flex flex-row items-center overflow-y-auto ">
                <div className={`h-full ${showSideBar ? '' : 'hidden'}  sm:block  w-20 md:w-60 2xl:w-96  border-r-[3px] lineshad flex flex-col`}>
                    <div className="h-16  2xl:h-20  border-b-[3px] lineshad bg-[#36494e] bg-opacity-70">
                        <ListBox setSelected={setSelected} />
                    </div>
                    <div className="h-auto w-full grid grid-cols-1">
                    {
                        showArray.map((obj:string) => (
                        <button 
                        onClick={()=> {
                            setRoomSelected(obj);
                        }}
                        key={obj} className={`h-14  2xl:h-[70px] border-b-[1px]  border-opacity-70 text-xs 2xl:text-base flex flex-row justify-center md:justify-start space-x-3 md:pl-3 2xl:pl-5 items-center transition-all duration-200   ${roomSelected == obj ? ' text-[#FF184F] hover:bg-white redShadow font-bold' : 'hover:text-black hover:bg-white'}    `}>
                            <Image src={selected == 0?  alien : group} alt="image" className={`rounded-full border-2 2xl:border-[3px] w-10 h-10  2xl:w-12 2xl:h-12 ${roomSelected != obj? 'border-[#00B2FF]' : 'border-[#FF184F] '} bg-black`} />
                            <h1 className="hidden md:block ">{obj}</h1>
                        </button>
                    ))
                    }
                    </div>

                </div>
                <div className="h-full w-full flex flex-col justify-between">
                    <div className="h-16  2xl:h-20  border-b-[3px] lineshad flex flex-row justify-between items-center bg-[#36494e] bg-opacity-70">
                        <div><BurgButton setFlag={setShowSideBar} val={showSideBar} /></div>
                        <span>{roomSelected}</span>
                        <MyMenu  slected={selected}/>
                        {/* <button>hello</button> */}
                    </div>
                
                    <div className="h-16  2xl:h-20  border-t-[3px] lineshad">
                        
                    </div>
                
                </div>
                
            </div>
        </main>
    </OptionBar>) 
   
}

export default Messages;