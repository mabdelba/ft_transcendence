import Achievement from '../shapes/Achievement';
import Image from 'next/image';
import NoAchiev from '../../../public/noAchiev.svg';
import { useEffect, useState } from 'react';

function LatestAchiev() {
  const numberOfAchievements = 5;
  var limiter = numberOfAchievements;
  if (limiter > 6) limiter = 6;
  const [achievement, setAchievement] = useState<any>(null);

  async function getAchievements() {
    const lastAchievUrl = 'http://localhost:3000/api/atari-pong/v1/profile/last-achievement';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await fetch(lastAchievUrl, config);
    const data = await response.json();
    setAchievement(data[0].achievements);
  }
  useEffect(() => {
    getAchievements();
}, []);
const divArray = achievement?.map((achiev: any) => achiev.name) || [];
  return (
    <div className="h-full w-full flex flex-col NeonShadowBord">
      <div className="w-full h-1/4 flex justify-start pl-10 items-center text-base lg:text-3xl">
        Latest achievements
      </div>
      {limiter == 0 ? (
        <div className="w-full h-1/2 flex flex-col text-2xl justify-center items-center">
          <Image src={NoAchiev} alt="" />
          No achievements
        </div>
      ) : (
        <div className="w-full h-3/4 px-5 md:px-10 pb-10 grid grid-rows-3 grid-cols-2 md:grid-rows-2 md:grid-cols-3 gap-4">
          {divArray.map((divName: any) => (
            <div>
              <Achievement name={divName} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LatestAchiev;
