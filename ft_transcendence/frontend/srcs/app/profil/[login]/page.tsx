'use client';
import { StaticImageData } from 'next/image';
import alien from '../../../public/alien.svg';
import LastMatch from '../../components/forms/LastMatch';
import LatestAchiev from '../../components/forms/LatestAchiev';
import Profil from '../../components/forms/Profil';
import AddFriend from '../../components/forms/AddFriend';
import { use, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import io, { Socket } from 'socket.io-client';
import axios from 'axios';
import { error } from 'console';
import Pdp from '../../components/shapes/Pdp';
import { Alatsi } from 'next/font/google';
import { useRouter } from 'next/navigation';
import OptionBar from '../../components/forms/OptionBar';
import { context, User, SocketContext } from '../../../context/context';
import { useContext } from 'react';
import InviteToast from '../../components/shapes/invitetoast';

type newType = {
  params: { login: string };
};

function UserProfil(props: newType) {
  const { user, setUser } = useContext(context);
  const { socket } = useContext(SocketContext);

  const router = useRouter();
  const [numberofMatchPlayed, setNumberOfMatchPlayed] = useState(0);

  // useEffect(() => {
  //   const url = 'http://localhost:3000/api/atari-pong/v1/user/me';
  //   const token = localStorage.getItem('jwtToken');
  //   const config = {
  //     headers: { Authorization: `Bearer ${token}` },
  //   };
  //   axios.post(url, { userLogin: props.params.login }, config)
  //   .catch((err) => {
  //     router.push('/dashboard');
  //   });
  // });
  
  useEffect(() => {
    if (!user.login) {
      const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .get(apiUrl, config)
        .then((response: any) => {
          const _user = response.data;
          socket?.emit('online', { token: localStorage.getItem('jwtToken') });
          _user.state = 1;
          socket?.on('inviteToGame', (data: { senderId: string; login: string }) => {
    
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

            toast.dismiss();
          });
          setUser(_user);
        })
        .catch(() => {
          router.push('/dashboard');
        });
    }
  });

  const [otherProfileAvatar, setOtherProfileAvatar] = useState(alien);
  const getState = () => {
    const url = 'http://localhost:3000/api/atari-pong/v1/user/check-relation';
    const token = localStorage.getItem('jwtToken');
    const conf = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .post(url, { userLogin: props.params.login }, conf)
      .then((response: any) => {
        if (response.data == -1) setCase(1);
        else setCase(response.data);
      })
      .catch((error: any) => {
   
      });
  };
  useEffect(() => {
    if ((user.socket as Socket)?.connected) {
      (user.socket as Socket)?.disconnect();
      const _user: User = user;
      _user.socket = null;
      setUser(_user);
    }
  });
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
      } else getState();
    }
  }, []);
  const [Case, setCase] = useState(-2);

  return (
    <OptionBar flag={-1}>
      <main className="h-auto w-full md:h-full font-Orbitron NeonShadow min-h-[480px] min-w-[280px]">
        {Case == 5 || Case == 4 ? (
          <div className="w-full h-full flex justify-center items-center ">
            <div className="h-1/2 md:h-1/3 w-[95%] lg:w-1/3 NeonShadowBord flex flex-row justify-evenly items-center">
              <div className="-red-500">
                <Pdp name={'unavailable'} color={false} image={alien} myProfile={true} />
              </div>
              <div className="-green-500 text-xs md:text-base 2xl:text-2xl ">
                This user is not available
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full h-[8%] pl-6 md:pl-12 font-semibold flex justify-start items-center NeonShadow text-base xl:text-3xl">
              {props.params.login}'s profile:
            </div>
            <div className=" w-full md:h-[84%] h-auto flex flex-col md:flex-row justify-center items-center px-2 md:px-12 space-y-6 md:space-y-0 md:space-x-6 xl:space-x-12 ">
              <div className="md:h-full h-auto w-full md:w-[60%]  space-y-6 xl:space-y-12 flex flex-col -red-600">
                <div className="w-full md:h-[60%] h-52">
                  <Profil
                    login={props.params.login}
                    myProfil={true}
                    router={router}
                    setUserAvatar={setOtherProfileAvatar}
                    setNumberOfMatch={setNumberOfMatchPlayed}
                  />
                </div>
                <div className="w-full md:h-[40%] h-40">
                  <LastMatch
                    matchPlayed={numberofMatchPlayed}
                    myProfile={true}
                    pdp={otherProfileAvatar}
                    login={props.params.login}
                    router={router}
                  />
                </div>
              </div>
              <div className="md:h-full h-auto w-full md:w-[40%] space-y-6  xl:space-y-12 flex flex-col -yellow-300">
                <div className="w-full md:h-[40%] h-40">
                  <AddFriend
                    state={Case}
                    login={props.params.login}
                    setState={setCase}
                    router={router}
                  />
                </div>
                <div className="w-full md:h-[60%] h-auto">
                  <LatestAchiev login={props.params.login} router={router} myProfile={true} />
                </div>
              </div>
            </div>
            <div className="w-full h-[8%]"></div>
          </>
        )}
      </main>
    </OptionBar>
  );
}

export default UserProfil;
