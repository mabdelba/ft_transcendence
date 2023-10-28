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
import SendMessage from "../components/inputs/SendMessage";




const friendList = ['waelhamd', 'abdelbar', 'mohamed', 'wassim']
const Groups = ['#Group one', 'Group two', '&Group three']



function Messages(){

    const [showSideBar, setShowSideBar] = useState(false);
    const [selected, setSelected] = useState(0);
    const {user} = useContext(context);
    const [showArray, setShowArray] = useState<any>([]);
    const [roomSelected, setRoomSelected] = useState(friendList[0]);
    const [message, setMessage] = useState('');


    const handleSend = (e:any) => {

        e.preventDefault();
        // alert(`message to ${roomSelected} : ${message}`);
        setMessage('');
    }

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
                    <div className="h-auto w-full grid grid-cols-1 pt-2 2xl:pt-4">
                    {
                        showArray.map((obj:string) => (
                        <button 
                        onClick={()=> {
                            setRoomSelected(obj);
                        }}
                        key={obj} className={`h-14  2xl:h-[68px] truncate ${roomSelected == obj ? 'border-none' : ''} border-none hover:border-none md:border-b-[2px]  md:border-double  border-opacity-70 text-xs 2xl:text-base flex flex-row justify-center md:justify-start space-x-3 2xl:space-x-6 md:pl-5 2xl:pl-7 items-center transition-all duration-500 tracking-wide  ${roomSelected == obj ? ' text-[#FF184F] shadow-md shadow-[#FF184F] drop-shadow-md border-[#FF184F]   font-bold  underline-offset-8 ' : 'hover:bg-slate-400 hover:text-black hover:border-[#00B2FF] hover:blueShadow'}    `}>
                            <Image src={ (selected == 0?  (user.avatar || alien) : group)} alt="image" width="50" height="50" className={`rounded-full border-2 2xl:border-[3px] w-10 h-10  2xl:w-12 2xl:h-12 border-inherit bg-slate-800`} />
                            <span className="hidden  text-left pt-1 md:flex flex-col 2xl:-space-y-1">
                                <h1>{obj}</h1>
                                <h6 className="text-[7px] 2xl:text-[10px] antialiased  truncate w-1/3 2xl:w-1/2 font-normal tracking-normal text-[#484848]">hello, I am Steve from Oracle agency, we are looking for employees.</h6>
                            </span>
                        </button>
                    ))
                    }
                    </div>

                </div>
                <div className="h-full w-full flex flex-col justify-between">
                    <div className="h-16  2xl:h-20   border-b-[3px] lineshad flex flex-row justify-between items-center bg-[#36494e] bg-opacity-70">
                        <div><BurgButton setFlag={setShowSideBar} val={showSideBar} /></div>
                        <span className="text-base lg:text-lg">{roomSelected}</span>
                        <MyMenu  slected={selected}/>
                    </div>
                    <>
                        
                    </>
                    <div className="h-16  2xl:h-20  border-t-[3px] lineshad">
                        <SendMessage  SetValue={setMessage} handleClick={handleSend} value={message} />
                    </div>
                
                </div>
                
            </div>
        </main>
    </OptionBar>) 
   
}

export default Messages;