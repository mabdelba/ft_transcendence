'use client';
import Profil from '../components/forms/Profil';
import LastMatch from '../components/forms/LastMatch';
import NewGame from '../components/forms/NewGame';
import LatestAchiev from '../components/forms/LatestAchiev';
import alien from "../../public/alien.svg";
import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  let [user, setUser] = useState<any>(null);
  function getProfile()
  {
    const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.get(apiUrl, config).then((response) => {
      setUser(response.data);
    });
  }
  useEffect(() => {
    getProfile();
  }, []);
  if (!user)
  {
    user = {
      firstName: 'Loading...',
      lastName: '',
      login: 'Loading...',
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
    <main className="h-auto w-auto md:w-screen md:h-screen font-Orbitron NeonShadow min-h-[480px] min-w-[280px]">
      <div className="w-full h-[8%] pl-6 md:pl-12 font-semibold flex justify-start items-center NeonShadow text-base xl:text-3xl">
        Hello {user.firstName}!
      </div>
      <div className=" w-full md:h-[84%] h-auto flex flex-col md:flex-row justify-center items-center px-2 md:px-12 space-y-6 md:space-y-0 md:space-x-6 xl:space-x-12 ">
        <div className="md:h-full h-auto w-full md:w-[60%]  space-y-6 xl:space-y-12 flex flex-col -red-600">
          <div className="w-full md:h-[60%] h-auto">
            <Profil
              login={user.login}
            />
          </div>
          <div className="w-full md:h-[40%] h-40">
            <LastMatch matchPlayed={ user.numberOfGamesPlayed} login={user.login}/>
          </div>
        </div>
        <div className="md:h-full h-auto w-full md:w-[40%] space-y-6  xl:space-y-12 flex flex-col -yellow-300">
          <div className="w-full md:h-[40%] h-40">
            <NewGame />
          </div>
          <div className="w-full md:h-[60%] h-auto">
            <LatestAchiev login={user.login}/>
          </div>
        </div>
      </div>
      <div className="w-full h-[8%]"></div>
    </main>
  );
}

export default Dashboard;
