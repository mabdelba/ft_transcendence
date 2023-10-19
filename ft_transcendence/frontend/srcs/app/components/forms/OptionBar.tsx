'use client';
import MenuButton from "../buttons/menuButton";
import SearchBar from "../shapes/searchBar";
import SideBar from "../shapes/sideBar";
import Logo from "../../../public/logo.svg"
import dynamic from "next/dynamic";
import BurgButton from "../shapes/burgButton";
import Link from "next/link";
import { useState } from "react";



function OptionBar( {children, flag, userName}: {children : React.ReactNode, flag: number, userName: string}){

    const [showSideBar, setShowSideBar] = useState(false);
    return(
        <main className='w-screen h-screen flex NeonShadow min-h-[600px] min-w-[280px] '>
          <div className={`h-full ${showSideBar ? '' : 'hidden'}  sm:block  w-20 xl:w-60  border-r-[3px] lineshad bg-opacity-10 bg-blue-500`}>
            <div className="h-14 xl:h-16 ">
              <MenuButton />
            </div>
            <div className="h-[90%] ">
              <SideBar flag={0}  />
            </div>
          </div>
          <div className="w-full ">
            <div className="h-14 xl:h-16  border-b-[3px] lineshad bg-opacity-10 bg-blue-500 flex justify-between">
              <BurgButton setFlag={setShowSideBar} val={showSideBar} />
              {
                // !showSideBar &&
                <SearchBar />
              }
              <Link href={`/profil/${userName}`} className="flex items-center justify-center font-Orbitron font-light hover:text-lime-300 hover:font-extrabold text-xs md:text-base 2xl:text-lg pr-6">{userName}</Link>
            </div>
            <div className="h-auto ">
              {children}
            </div>
          </div>
      </main>
    );
}

export default OptionBar;