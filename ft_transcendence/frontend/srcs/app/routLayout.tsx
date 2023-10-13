import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '../redux-store/provider';
import MenuButton from './components/buttons/menuButton';
import SearchBar from './components/buttons/sideBarButton';
import SideBar from './components/shapes/sideBar';
import Logo from '../public/logo.svg'



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='w-screen h-screen'>
      <div className='h-[8%] w-full  flex'>
        <div className='w-20 def:w-[15%] h-full flex justify-center'>
          <MenuButton icon={Logo} content='Atari&nbsp;pong' path='/' />
        </div>
        <div className='h-full w-[85%]'>
          <SearchBar />
        </div>
      </div>
      <div className='h-[92%] w-full flex '>
        <div className='h-full w-20 def:w-[15%] '>
          <SideBar />
        </div>
        <div className='h-full w-[85%]' >{children}</div>
      </div>
    </main>
  );
}
