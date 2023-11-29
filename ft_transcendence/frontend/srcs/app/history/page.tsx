'use client';
import Pdp from '../components/shapes/Pdp';
import alien from '../../public/alien.svg';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';
import OptionBar from '../components/forms/OptionBar';
import { User, context, SocketContext } from '../../context/context';
import { useQuery } from 'react-query';
import InviteToast from '../components/shapes/invitetoast';
import { toast } from 'react-toastify';

const fetchHistory = async () => {
  const res = await fetch('http://localhost:3000/api/atari-pong/v1/history', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
    },
  });
  return res.json();
};

function History() {
  const { user, setUser } = useContext(context);
  const { socket } = useContext(SocketContext);

  const [matches, setMatches] = useState([]);

  const { data, status } = useQuery('history', fetchHistory);

  useEffect(() => {
    if (!user.login) {
      const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios.get(apiUrl, config).then((response: any) => {
        const _user = response.data;
        socket?.on('inviteToGame', (data: { senderId: string; login: string }) => {
          console.log('inviteToGame');
          toast(<InviteToast senderId={data.senderId} login={data.login} />, {
            position: 'top-center',
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            theme: 'dark',
          });
        });
        socket?.on('cancelNotification', () => {
          console.log('cancelNotification=======');
          toast.dismiss();
        });
        setUser(_user);
      });
    }
  });

  async function getMatches() {
    if (data) {
      // var i = 0;
      //     data.forEach((obj: any) => {

      //       getImageByLogin(obj.other).then((imageBlog) => {

      //         obj.avatar = imageBlog;
      //       });
      // });

      setMatches(data);
      console.log('data********: ', data);
      const _user: User = user;
      _user.history = data;
      setUser(_user);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token || token == undefined) router.push('/');
    else {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const exp = decodedToken.exp;
      const current_time = Date.now() / 1000;
      if (exp < current_time) {
        localStorage.removeItem('jwtToken');
        router.push('/');
      } else if (!user.history) getMatches();
      else setMatches(user.history);
      if (!user.state && socket) {
        socket.emit('online', { token: localStorage.getItem('jwtToken') });
        const _user: User = user;
        _user.state = 1;
        setUser(_user);
      }
    }
  }, [status]);

  // const getImageByLogin = async (login: string): Promise<string | null> => {
  //   return new Promise<string | null>(async (resolve) => {
  //     if (login != '') {
  //       await axios
  //         .post(
  //           'http://localhost:3000/api/atari-pong/v1/user/avatar',
  //           { userLogin: login },
  //           {
  //             headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
  //             responseType: 'blob',
  //           },
  //         )
  //         .then((response) => {
  //           const imageBlob = URL.createObjectURL(response.data) as string;
  //           if (imageBlob) resolve(imageBlob);
  //           else resolve(alien);
  //         })
  //         .catch(() => {
  //           // resolve(alien);
  //         });
  //     }
  //   });
  // };

  const matchPlayed = matches.length;
  let play = false;
  if (matchPlayed != 0) play = true;
  const [userName, setUserName] = useState('');
  const router = useRouter();

  return (
    <OptionBar flag={4}>
      <main className="w-full h-full  flex flex-col font-Orbitron min-h-[480px] min-w-[280px]">
        <div className="w-[95%] h-10 md:h-24 pl-6 md:pl-12 NeonShadow flex justify-start items-center text-base xl:text-3xl -yellow-300">
          History
        </div>
        {status == 'loading' && (
          <div className=" flex flex-col space-y-2 w-full h-[80%] items-center justify-center">
            <h1>Loading</h1>
            <div className="spinner"></div>
          </div>
        )}
        {status == 'success' && (
          <div className=" w-full h-full flex items-start justify-center overflow-y-auto mb-8">
            <div className="w-[95%] h-auto NeonShadowBord ">
              {!play ? (
                <div className="w-full h-80 flex justify-center items-center text-base lg:text-3xl">
                  No matches played yet
                </div>
              ) : (
                matches.map((obj: any) => (
                  <div key={obj.id} className="w-full  p-2 md:p-9 flex flex-row  ">
                    <div className="h-full w-[10%] md:w-[18%] "></div>
                    <div className="w-[15%] h-[67%] flex flex-col justify-start items-end">
                      <Pdp name={obj.me} color={true} router={router} image={user.avatarUrl} />
                    </div>
                    <div className="w-[50%] md:w-[34%]  NeonShadow text-sm lg:text-3xl flex flex-col justify-around items-center">
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
                      <Pdp
                        name={obj.other}
                        color={false}
                        router={router}
                        myProfile={true}
                        image={obj.otherAvatar || alien}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </OptionBar>
  );
}

export default History;
