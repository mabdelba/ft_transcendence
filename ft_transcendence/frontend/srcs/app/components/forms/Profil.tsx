'use client';
import alien from '../../../public/alien.svg';
import Image from 'next/image';
import Percent from '../shapes/Percent';
import online from '../../../public/online.svg';
import offline from '../../../public/offline.svg';
import ingame from '../../../public/ingame.svg';
import { useContext, useEffect, useState } from 'react';
import Pdp from '../shapes/Pdp';
import axios from 'axios';
import { User, context } from '../../../context/context';

type profileProp = {
  login?: string;
  myProfil?: boolean;
  router: any;
  setUserAvatar?: Function | undefined;
  setNumberOfMatch?: Function | undefined;
};

interface dataType {
  lev: number | undefined;
  winPercent: number | undefined;
  percentage: number | undefined;
  percentageChar: string | undefined;

  win: string | undefined;
  lose: string | undefined;
  state: string | undefined;
  stateImage: string;
}

function Profil(props: profileProp) {
  const { user } = useContext(context);
  const [userAvatar, setUserAvatar] = useState(alien);

  const [profile, setProfile] = useState<any>(undefined);
  const [statistics, setStaistics] = useState<any>();

  async function getProfile() {
    if (props.login && !profile) {
      const url = 'http://localhost:3000/api/atari-pong/v1/user/me';
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      try {
        const user_ = await axios.post(url, { userLogin: props.login }, config);
        setProfile(user_.data);
        {
          props.setNumberOfMatch && props.setNumberOfMatch(user_.data.numberOfGamesPlayed);
        }
        console.log('haaaa lkhraaa', user_.data);
        setUserAvatar(user_.data.avatarUrl);
        props.setUserAvatar && props.setUserAvatar(user_.data.avatarUrl);
        const stats: dataType = {
          lev: 0,
          winPercent: 50,
          percentage: 0,
          percentageChar: '0%',
          win: '50%',
          lose: '50%',
          state: 'Offline',
          stateImage: offline,
        };
        if (user_.data?.numberOfGamesPlayed != 0)
          stats.winPercent = Math.floor(
            (user_.data?.numberOfGamesWon! * 100) / user_.data?.numberOfGamesPlayed!,
          );
        console.log('blackhole; ', user_.data);
        stats.lev = Math.floor(user_.data.level!);
        stats.percentage = Math.floor((user_.data?.level! - stats.lev) * 100);
        stats.percentageChar = `${stats.percentage}%`;
        stats.win = `${stats.winPercent}%`;
        stats.lose = `${100 - stats.winPercent!}%`;
        switch (user_.data?.state) {
          case 0:
            stats.state = 'Offline';
            stats.stateImage = 'bg-[#ff0742]';
            break;
          case 1:
            stats.state = 'Online';
            stats.stateImage = 'bg-[#1ebbff]';
            break;
          case 2:
            stats.state = 'In Game';
            stats.stateImage = 'bg-orange-500';
            break;
          default:
            stats.state = 'Offline';
            stats.stateImage = 'bg-red-300';
            break;
        }
        console.log('hello', stats);
        setStaistics(stats);
      } catch (err) {
        props.router.push('/dashboard');
      }
    }
  }
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) props.router.push('/');
    else {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const exp = decodedToken.exp;
      const current_time = Date.now() / 1000;
      if (exp < current_time) {
        localStorage.removeItem('jwtToken');
        props.router.push('/');
      } else if (props.myProfil) getProfile();
      else if (!profile && !props.myProfil) {
        setProfile(user);
        const stats: dataType = {
          lev: 0,
          winPercent: 50,
          percentage: 0,
          percentageChar: '0%',
          win: '50%',
          lose: '50%',
          state: 'Offline',
          stateImage: offline,
        };
        if (user?.numberOfGamesPlayed != 0)
          stats.winPercent = Math.floor(
            (user?.numberOfGamesWon! * 100) / user?.numberOfGamesPlayed!,
          );
        console.log('blackhole; ', user);
        stats.lev = Math.floor(user.level!);
        stats.percentage = Math.floor((user?.level! - stats.lev) * 100);
        stats.percentageChar = `${stats.percentage}%`;
        stats.win = `${stats.winPercent}%`;
        stats.lose = `${100 - stats.winPercent!}%`;
        switch (user?.state) {
          case 0:
            stats.state = 'Offline';
            stats.stateImage = 'bg-[#ff0742]';
            break;
          case 1:
            stats.state = 'Online';
            stats.stateImage = 'bg-[#1ebbff]';
            break;
          case 2:
            stats.state = 'In Game';
            stats.stateImage = 'bg-orange-300';
            break;
          default:
            stats.state = 'Offline';
            stats.stateImage = 'bg-red-300';
            break;
        }
        console.log('hello', stats);
        setStaistics(stats);
      }
    }
  }, [props.login, profile, user]);

  return (
    <div className="h-full w-full flex flex-col  justify-center items-center NeonShadowBord ">
      {!profile && (
        <div className=" flex flex-col space-y-2 w-full h-[80%] items-center justify-center">
          <h1>Loading</h1>
          <div className="spinner"></div>
        </div>
      )}
      {profile && (
        <>
          <div className="h-1/2 w-full flex flex-row  items-center lg:space-x-2 2xl:space-x-0">
            <div className="w-[10%]  xl:w-[12.5%] h-[50%] "></div>
            <div className="w-[15%] xl:w-[12.5%] h-[60%] flex justify-end items-center ">
              <Pdp
                name={profile.login}
                color={false}
                router={props.router}
                flag={true}
                image={!props.myProfil ? user.avatarUrl : userAvatar}
              />
            </div>
            <div className="w-[75%] h-[40%] flex flex-col justify-center items-start px-2 text-[8px] md:text-sm xl:text-lg">
              <div className="h-1/3 w-full -slate-700 flex items-end">
                {profile.firstName} {profile.lastName} - {profile.login}
              </div>
              <div className="h-1/3 w-full -green-500 flex flex-row items-center pt-1.5">
                LvL {statistics.lev} - {statistics.percentage}% -
                {/* <Image src={statistics.stateImage} alt="online" className="h-[95%] ml-2 mr-1" /> */}
                <div className={`border-2 rounded-full w-2 h-2 md:h-5 md:w-5 ml-2 mr-1 p-[1px]  `}>
                  <div className={`h-full w-full rounded-full ${statistics.stateImage}`}></div>
                </div>
                {statistics.state}
              </div>
              <div className="h-1/3 w-full -pink-500 pt-1.5">
                <Percent width1={statistics.percentageChar} firstColor="bg-white" bord={true} />
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
                  <div>{statistics.winPercent}%</div>
                  <div>{100 - statistics.winPercent}%</div>
                </div>
                <Percent
                  bord={false}
                  width1={statistics.win}
                  firstColor="bg-[#00B2FF]"
                  width2={statistics.lose}
                  secondColor="bg-[#FF0742]"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Profil;
