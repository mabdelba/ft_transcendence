'use client';
import Profil from '../components/forms/Profil';
import LastMatch from '../components/forms/LastMatch';
import NewGame from '../components/forms/NewGame';
import LatestAchiev from '../components/forms/LatestAchiev';
import alien from '../../public/alien.svg';
import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import SearchBar from '../components/shapes/searchBar';
import SideBar from '../components/shapes/sideBar';
import MenuButton from '../components/buttons/menuButton';
import Logo from '../../public/logo.svg';

function Dashboard() {
  let [user, setUser] = useState<any>(null);
  function getProfile() {
    const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.get(apiUrl, config).then((response) => {
      setUser(response.data);
    });
    io('http://localhost:3000', {
      transports: ['websocket'],
      auth: {
        token: token,
      },});
  }
  useEffect(() => {
    getProfile();
  }, []);
  if (!user) {
    user = {
      firstName: 'Loading...',
      lastName: 'Loading...',
      login: '',
      level: 0,
      matchPlayed: 0,
      winPercent: 50,
      numberOfGamesPlayed: 0,
      numberOfGamesWon: 0,
      state: 0,
      avatar: alien,
    };
  }

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
        <div className='h-full w-[85%]' >
          <main className="h-auto w-auto md:w-full md:h-full font-Orbitron NeonShadow min-h-[480px] min-w-[280px]">
            <div className="w-full h-[8%] pl-6 md:pl-12 font-semibold flex justify-start items-center NeonShadow text-base xl:text-3xl">
              Hello {user.firstName}!
            </div>
            <div className=" w-full md:h-[84%] h-auto flex flex-col md:flex-row justify-center items-center px-2 md:px-12 space-y-6 md:space-y-0 md:space-x-6 xl:space-x-12 ">
              <div className="md:h-full h-auto w-full md:w-[60%]  space-y-6 xl:space-y-12 flex flex-col -red-600">
                <div className="w-full md:h-[60%] h-auto">
                  <Profil login={user.login} />
                </div>
                <div className="w-full md:h-[40%] h-40">
                  <LastMatch matchPlayed={user.numberOfGamesPlayed} login={user.login} />
                </div>
              </div>
              <div className="md:h-full h-auto w-full md:w-[40%] space-y-6  xl:space-y-12 flex flex-col -yellow-300">
                <div className="w-full md:h-[40%] h-40">
                  <NewGame />
                </div>
                <div className="w-full md:h-[60%] h-auto">
                  <LatestAchiev login={user.login} />
                </div>
              </div>
            </div>
            <div className="w-full h-[8%]"></div>
          </main>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
