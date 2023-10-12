'use client';
import Pdp from '../components/shapes/Pdp';
import alien from '../../public/alien.svg';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

function History() {
  function setOnline() {
    io('http://localhost:3000', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('jwtToken'),
      },
    });
  }
  useEffect(() => {
    if (!localStorage.getItem('jwtToken')) router.push('/');
    setOnline();
  }, []);
  const [matches, setMatches] = useState([]);
  async function getMatches() {
    const res = await axios.get('http://localhost:3000/api/atari-pong/v1/history', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    });
    setMatches(res.data);
  }
  useEffect(() => {
    if (!localStorage.getItem('jwtToken')) router.push('/');
    else getMatches();
  }, []);

  let matchPlayed = Array.length;
  let play = false;
  if (matchPlayed != 0) play = true;
  const [userName, setUserName] = useState('');
  const router = useRouter();

  return (
    <main className="w-screen h-auto  flex flex-col font-Orbitron min-h-[480px] min-w-[280px]">
      <div className="w-[95%] h-10 md:h-24 pl-6 md:pl-12 NeonShadow flex justify-start items-center text-base xl:text-3xl -yellow-300">
        History
      </div>
      <div className="h-auto w-full flex items-start justify-center">
        <div className="w-[95%] h-auto NeonShadowBord ">
          {!play ? (
            <div className="w-full h-80 flex justify-center items-center text-base lg:text-3xl">
              No matches played yet
            </div>
          ) : (
            matches.map((obj: any) => (
              <div key={obj.id} className="w-full h-auto p-2 md:p-9 flex flex-row  ">
                <div className="h-full w-[10%] md:w-[18%] "></div>
                <div className="w-[15%] h-[67%] flex flex-col justify-start items-end">
                  <Pdp name={obj.me} color={true} image={alien} router={router} />
                </div>
                <div className="w-[50%] md:w-[34%] h-auto  NeonShadow text-sm lg:text-3xl flex flex-col justify-around items-center">
                  <div>
                    {obj.myScore} - {obj.otherScore}
                  </div>
                  <div>
                    {obj.otherScore < obj.myScore
                      ? 'You Won!'
                      : obj.otherScore > obj.myScore
                      ? 'You Lost!'
                      : 'Draw!'}
                  </div>
                </div>
                <div className="w-[15%] h-[67%] flex  justify-start items-start">
                  <Pdp name={obj.other} color={false} image={alien} router={router} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default History;

function userRouter() {
  throw new Error('Function not implemented.');
}
