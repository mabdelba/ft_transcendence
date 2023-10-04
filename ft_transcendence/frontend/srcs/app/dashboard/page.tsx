'use client';
import Profil from '../components/forms/Profil';
import LastMatch from '../components/forms/LastMatch';
import NewGame from '../components/forms/NewGame';
import LatestAchiev from '../components/forms/LatestAchiev';
import { useAppSelector, useAppDispatch } from '../../redux-store/hooks';
import { fetchProfile, profileSelector, userOnline } from '../../redux-store/profile/profileSlice';
import { profileAvatar, avatarSelector } from '../../redux-store/profile/avatarSlice';
import { useEffect } from 'react';

function Dashboard() {
  const dispatch = useAppDispatch();
  const selectedProfile = useAppSelector(profileSelector);
  const selectedAvatar = useAppSelector(avatarSelector);
  const avatar = selectedAvatar.url;
  const { firstName, lastName, login, numberOfGamesPlayed, level, numberOfGamesWon, state } =
    selectedProfile.profile;

  useEffect(() => {
    dispatch(userOnline());
    dispatch(fetchProfile());
    dispatch(profileAvatar());
  }, [state]);

  let winPercent = 50;
  if (numberOfGamesPlayed != 0)
    winPercent = Math.floor((numberOfGamesWon * 100) / numberOfGamesPlayed);
  const lev = Math.floor(level);
  const percentage = Math.floor((level - lev) * 100);

  return (
    <main className="h-auto w-auto md:w-screen md:h-screen font-Orbitron NeonShadow min-h-[480px] min-w-[280px]">
      <div className="w-full h-[8%] pl-6 md:pl-12 font-semibold flex justify-start items-center NeonShadow text-base xl:text-3xl">
        Hello {firstName}!
      </div>
      <div className=" w-full md:h-[84%] h-auto flex flex-col md:flex-row justify-center items-center px-2 md:px-12 space-y-6 md:space-y-0 md:space-x-6 xl:space-x-12 ">
        <div className="md:h-full h-auto w-full md:w-[60%]  space-y-6 xl:space-y-12 flex flex-col -red-600">
          <div className="w-full md:h-[60%] h-auto">
            <Profil
              avatar={avatar}
              firstname={firstName}
              lastname={lastName}
              login={login}
              matchPlayed={numberOfGamesPlayed}
              winPercent={winPercent}
              level={lev}
              percentage={percentage}
              state={state}
            />
          </div>
          <div className="w-full md:h-[40%] h-40">
            <LastMatch matchPlayed={numberOfGamesPlayed} />
          </div>
        </div>
        <div className="md:h-full h-auto w-full md:w-[40%] space-y-6  xl:space-y-12 flex flex-col -yellow-300">
          <div className="w-full md:h-[40%] h-40">
            <NewGame />
          </div>
          <div className="w-full md:h-[60%] h-auto">
            <LatestAchiev />
          </div>
        </div>
      </div>
      <div className="w-full h-[8%]"></div>
    </main>
  );
}

export default Dashboard;
