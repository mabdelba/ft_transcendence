'use client';
import MenuButton from "../buttons/menuButton";
import SearchBar from "../shapes/searchBar";
import SideBar from "../shapes/sideBar";
import Logo from "../../../public/logo.svg"
import dynamic from "next/dynamic";
import BurgButton from "../shapes/burgButton";
import Link from "next/link";
import { useEffect, useState } from "react";
import alien from "../../../public/alien.svg"
import Image from "next/image";



function OptionBar( {children, flag, userName}: {children : React.ReactNode, flag: number, userName: string}){

    const [showSideBar, setShowSideBar] = useState(false);
    const [showPdp, setShowPdp] = useState(true);

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
    return(
        <main className='w-screen h-screen flex NeonShadow min-h-[600px] min-w-[280px] overflow-y-hidden'>
          <div className={`h-full ${showSideBar ? '' : 'hidden'}  sm:block  w-20 xl:w-60  border-r-[3px] lineshad bg-opacity-10 bg-blue-500`}>
            <div className="h-14 xl:h-16 ">
              <MenuButton />
            </div>
            <div className="h-[90%] ">
              <SideBar flag={flag}  />
            </div>
          </div>
          <div className="w-full ">
            <div className="h-14 xl:h-16  border-b-[3px] lineshad bg-opacity-10 bg-blue-500 flex justify-between">
              <BurgButton setFlag={setShowSideBar} val={showSideBar} />
              {
                !showSideBar &&
                <SearchBar />
              }
              <Link 
              onMouseEnter={() => {setHoverBool(true)}}
              onMouseLeave={() => {setHoverBool(false)}}
              href={`/profil/${userName}`} className="flex flex-row space-x-2 items-center min-w-[40px] w-auto justify-center  font-Orbitron font-light hover:text-lime-300 hover:font-extrabold text-xs md:text-base 2xl:text-lg pr-6">
                <span>{userName}</span>
                {
                  showPdp &&
                    <Image  alt="image" src={alien}  className={`w-10 h-10 lineshad  ${!hoverBool ? 'border-[2px]' : 'border-lime-300 border-[4px]' }  rounded-full`}/>
                }

              </Link>
            </div>
            <div className="h-[94%] w-full overflow-auto">
              {children}
            </div>
          </div>
      </main>
    );
}

export default OptionBar;