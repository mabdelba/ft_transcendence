import Achievement from '../shapes/Achievement';
import Image from 'next/image';
import NoAchiev from '../../../public/noAchiev.svg';
import { useEffect, useState } from 'react';
import axios from 'axios';

type newType = {
  login: string;
  router: any;
};

function LatestAchiev(props: newType) {
  let limiter = 1;
  const [achievement, setAchievement] = useState<any>(null);

  async function getAchievements() {
    const lastAchievUrl = 'http://localhost:3000/api/atari-pong/v1/profile/last-achievement';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(lastAchievUrl, { userLogin: props.login }, config)
      .then((res) => {
        setAchievement(res.data[0]);
      })
      .catch((err) => {
        props.router.push('/');
      });
  }
  useEffect(() => {
    if (!localStorage.getItem('jwtToken')) props.router.push('/');
    else getAchievements();
  }, [props.login]);
  const divArray = achievement?.achievements?.map((achiev: any) => achiev.name) || [];
  if (divArray[0] == null) limiter = 0;
  return (
    <div className="h-full w-full flex flex-col NeonShadowBord">
      <div className="w-full h-1/4 flex xl:justify-start justify-center xl:pl-10 items-center text-base xl:text-3xl">
        Latest achievements
      </div>
      {limiter == 0 ? (
        <div className="w-full h-1/2 flex flex-col text-2xl justify-center items-center">
          <Image src={NoAchiev} alt="Achievement" />
          No achievements
        </div>
      ) : (
        <div className="w-full h-3/4 px-1 xl:px-10 pb-10 grid grid-rows-2 grid-cols-3  gap-1 2xl:gap-4">
          {divArray.map((divName: any) => (
            <div key={divName}>
              <Achievement name={divName} color={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LatestAchiev;
