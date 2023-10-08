'use client';
import alien from '../../../public/alien.svg';
import Image from 'next/image';
import Percent from '../shapes/Percent';
import online from '../../../public/online.svg';
import offline from '../../../public/offline.svg';
import ingame from '../../../public/ingame.svg';
import { useEffect, useState } from 'react';
import Pdp from '../shapes/Pdp';
import axios from 'axios';

type profileProp = {
  login: string;
};

function Profil(props: profileProp) {
  let [profile, setProfile] = useState<any>(null);
  const [userAvatar, setUserAvatar] = useState(alien);
  async function getUserAvatar(login: string) {
    if (login !== '') {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
        responseType: 'blob',
        body: { userLogin: login },
      };
      const user = await axios.post(
        'http://localhost:3000/api/atari-pong/v1/user/avatar',
        { userLogin: login },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
          responseType: 'blob',
        },
      );
      const imageBlob = URL.createObjectURL(user.data) as string;
      setUserAvatar(imageBlob);
    }
  }
  useEffect(() => {
    getUserAvatar(props.login);
  }, [props.login]);
  async function getProfile() {
    if (props.login) {
      const url = 'http://localhost:3000/api/atari-pong/v1/user/me';
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const user = await axios.post(url, { userLogin: props.login }, config);
      setProfile(user.data);
    }
  }
  useEffect(() => {
    getProfile();
  }, [props.login]);
  let winPercent = 50;
  let percentage = 0;
  let percentageChar = '0%';
  let win = '50%';
  let lose = '50%';
  let state;
  let stateImage;

  if (!profile) {
    profile = {
      firstName: 'Loading',
      lastName: 'Loading',
      login: '',
      level: 0,
      matchPlayed: 0,
      winPercent: 50,
      numberOfGamesPlayed: 0,
      numberOfGamesWon: 0,
      state: 0,
    };
  }
  if (profile.numberOfGamesPlayed != 0)
    winPercent = Math.floor((profile.numberOfGamesWon * 100) / profile.numberOfGamesPlayed);
  const lev = Math.floor(profile.level);
  percentage = Math.floor((profile.level - lev) * 100);
  percentageChar = `${percentage}%`;
  win = `${winPercent}%`;
  lose = `${100 - winPercent}%`;
  switch (profile.state) {
    case 0:
      state = 'Offline';
      stateImage = offline;
      break;
    case 1:
      state = 'Online';
      stateImage = online;
      break;
    case 2:
      state = 'In Game';
      stateImage = ingame;
      break;
    default:
      state = 'Offline';
      stateImage = offline;
      break;
  }
  return (
    <div className="h-full w-full flex flex-col  justify-center items-center NeonShadowBord">
      <div className="h-1/2 w-full flex flex-row items-center ">
        <div className="w-[7%]  xl:w-[12.5%] h-[50%]  "></div>
        <div className="w-[18%] lg:pr-4 xl:pr-0 xl:w-[12.5%] h-[50%] flex justify-center items-center ">
          <Pdp name={''} color={false} image={userAvatar} />
        </div>
        <div className="w-[75%] h-[40%] flex flex-col justify-center items-start px-2 text-xs md:text-sm xl:text-lg">
          <div className="h-1/3 w-full -slate-700">
            {profile.firstName} {profile.lastName} - {profile.login}
          </div>
          <div className="h-1/3 w-full -green-500 flex flex-row items-center pt-1.5">
            LvL {lev} - {percentage}% -
            <Image src={stateImage} alt="online" className="h-[95%] ml-2 mr-1" />
            {state}
          </div>
          <div className="h-1/3 w-full -pink-500 pt-1.5">
            <Percent width1={percentageChar} firstColor="bg-white" bord={true} />
          </div>
        </div>
      </div>
      <div className="h-1/2 w-full flex flex-row text-xs  lg:text-xl">
        <div className="h-full w-1/2 flex flex-col items-center justify-center">
          <div className="h-1/2 w-full flex justify-center items-center">
            <h1>Matches Played</h1>
          </div>
          <div className="h-1/2 w-full flex justify-center items-start text-base lg:text-2xl">
            <h1>{profile.numberOfGamesPlayed}</h1>
          </div>
        </div>
        <div className="h-full w-1/2 flex flex-col items-center">
          <div className="h-1/2 w-full flex justify-center items-center -green-500">
            <h1>Win To Lose Ratio</h1>
          </div>
          <div className="h-1/2 w-[80%] flex flex-col justify-start items-center -blue-600">
            <div className="w-[90%] flex flex-row justify-between items-start text-sm">
              <div>{winPercent}%</div>
              <div>{100 - winPercent}%</div>
            </div>
            <Percent
              bord={false}
              width1={win}
              firstColor="bg-[#00B2FF]"
              width2={lose}
              secondColor="bg-[#FF0742]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profil;
