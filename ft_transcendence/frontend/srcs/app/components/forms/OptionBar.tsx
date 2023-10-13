'use client';
import MenuButton from "../buttons/menuButton";
import SearchBar from "../shapes/searchBar";
import SideBar from "../shapes/sideBar";
import Logo from "../../../public/logo.svg"
import dynamic from "next/dynamic";



function OptionBar( {children, flag}: {children : React.ReactNode, flag: number}){

    return(
        <main className='w-screen h-screen '>
        <div className='h-[8%] w-full  flex'>
          <div className='w-20 def:w-[15%] h-full flex justify-center'>
            <MenuButton icon={Logo} content='Atari&nbsp;pong' path='/' />
          </div>
          <div className='h-full w-[85%] '>
            <SearchBar />
          </div>
        </div>
        <div className='h-[92%] w-full flex '>
          <div className='h-full w-20 def:w-[15%] '>
            <SideBar flag={flag} />
          </div>
          <div className='h-full w-[85%]' >{children}</div>
        </div>
      </main>
    );
}

export default OptionBar;