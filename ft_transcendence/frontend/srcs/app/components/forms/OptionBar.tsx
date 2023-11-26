'use client';
import MenuButton from "../buttons/menuButton";
import SearchBar from "../shapes/searchBar";
import SideBar from "../shapes/sideBar";
import Logo from "../../../public/logo.svg"
import dynamic from "next/dynamic";
import BurgButton from "../shapes/burgButton";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import alien from "../../../public/alien.svg"
import Image from "next/image";
import { context } from "../../../context/context";
import Pdp from "../shapes/Pdp";
import ResultElements from "../shapes/resultElements"

interface UserData {
  name: string;
  type: number;
  isMember: boolean;
  id: number;
  login: string;
}

function OptionBar( {children, flag}: {children : React.ReactNode, flag: number}){

    const [showSideBar, setShowSideBar] = useState(false);
    const [showPdp, setShowPdp] = useState(true);
    const {user} = useContext(context);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 640)
        {
          setShowSideBar(false);
          setShowPdp(true);
        }
        else
          setShowPdp(false);
      }
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      }
    }, [])

    const [hoverBool, setHoverBool] = useState(false);
    const [usersResults, setUsersResults] = useState<UserData[]>([]);
    const [channelsResults, setChannelsResults] = useState<UserData[]>([]);
    const [hideResults, setHideResults] = useState(false);

    return(
        <main className='w-screen h-screen flex  min-h-[600px] min-w-[280px] overflow-y-hidden'>
          <div onClick={() => setHideResults(true)} className={`h-full ${showSideBar ? '' : 'hidden'}  sm:block  w-20 xl:w-60  border-r-[3px] lineshad bg-opacity-10 bg-blue-500`}>
            <div className="h-14 xl:h-16 ">
              <MenuButton />
            </div>
            <div className="h-[90%] ">
              <SideBar flag={flag}  />
            </div>
          </div>
          <div className="w-full ">
            <div onClick={() => setHideResults(false)} className="h-14 xl:h-16  border-b-[3px] lineshad bg-opacity-10 bg-blue-500 flex justify-between">
              <BurgButton setFlag={setShowSideBar} val={showSideBar} />
              {
                !showSideBar &&
                <SearchBar setUsersResults={setUsersResults}  setChannelsResults={setChannelsResults} setShowResults={setShowResults} />
              }
              <Link 
              onMouseEnter={() => {setHoverBool(true)}}
              onMouseLeave={() => {setHoverBool(false)}}
              href={`/profil/${user.login}`} className="flex flex-row space-x-2 items-center min-w-[40px] w-auto justify-center  font-Orbitron font-light hover:text-lime-300 hover:font-extrabold text-xs md:text-base 2xl:text-lg pr-6">
                <span className="NeonShadow">{user.login}</span>
                {
                  showPdp &&
                    <Image width="50" height="50"  alt="image" src={user.avatarUrl || alien}  className={`w-10 h-10 lineshad  ${!hoverBool ? 'border-[2px]' : 'border-lime-300 border-[4px]' }  rounded-full` }/>
                }

              </Link>
            </div>
            {
              ((usersResults && usersResults.length > 0)
              || ( channelsResults && channelsResults.length > 0 && !channelsResults.every((channel) => channel.isMember === true)))
              && hideResults === false
              && <ResultElements users={usersResults} channels={channelsResults} setChannels={setChannelsResults}  />
            }
            <div className="h-[94%] w-full overflow-auto" onClick={() => setHideResults(true)}>
              {children}
            </div>
          </div>
      </main>
    );
}

export default OptionBar;