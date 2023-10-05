import { data } from 'autoprefixer';
import alien from '../../../public/alien.svg';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Pdp from '../shapes/Pdp';

type newType = {
  matchPlayed: number;
};

function LastMatch(props: newType) {
  const [matchData, setMatchData] = useState<any>(null);
  async function getMatch() {
    const lastMatchUrl = 'http://localhost:3000/api/atari-pong/v1/profile/last-match-played';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await fetch(lastMatchUrl, config);
    const data = await response.json();
    setMatchData(data);
  }
  useEffect(() => {
    getMatch();
  }, []);
  const myLogin = matchData ? matchData.me : '';
  const oppLogin = matchData ? matchData.other : '';
  const myRes = matchData ? matchData.myScore : 0;
  const oppRes = matchData ? matchData.otherScore : 0;
  let expression = 'You Won!';
  if (oppRes == myRes) expression = 'Draw!';
  else if (oppRes > myRes) expression = 'You Lost!';
  let play = false;
  if (props.matchPlayed == 0) play = true;

  return (
    <div className="w-full h-full  flex flex-col NeonShadowBord">
      <div className="w-full h-[35%] flex justify-start items-center pl-10 text-sm lg:text-2xl">
        <h1>Last match stats</h1>
      </div>
      {play ? (
        <div className="w-full h-[45%] flex justify-center items-center text-base lg:text-3xl">
          No matches played yet
        </div>
      ) : (
        <div className="w-full h-[65%]  flex flex-row ">
          <div className="h-full w-[18%]"></div>
          <div className="w-[15%] h-[67%] flex flex-col justify-start items-end ">
            <Pdp name={myLogin} color={true} image={alien} />
          </div>
          <div className="w-[34%] h-[55%]  NeonShadow text-sm lg:text-3xl flex flex-col justify-around items-center">
            <div>
              {myRes} - {oppRes}
            </div>
            <div>{expression}</div>
          </div>
          <div className="w-[15%] h-[67%] flex  justify-start items-start">
            <Pdp name={oppLogin} color={false} image={alien} />
          </div>
        </div>
      )}
    </div>
  );
}

export default LastMatch;
