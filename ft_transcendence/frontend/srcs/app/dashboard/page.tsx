'use client';
import Profil from '../components/forms/Profil';
import LastMatch from '../components/forms/LastMatch';
import NewGame from '../components/forms/NewGame';
import LatestAchiev from '../components/forms/LatestAchiev';
import alien from '../../public/alien.svg';
import { use, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';
import OptionBar from '../components/forms/OptionBar';
import Login from '../components/forms/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { context, SocketContext } from '../../context/context';
import { User } from '../../context/context';
import { useQuery } from 'react-query';
import { log } from 'console';
import InviteToast from '../components/shapes/invitetoast';

const fetchDashboard = async () => {
  const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
  const token = localStorage.getItem('jwtToken');
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const res = await fetch(apiUrl, config);
  return res.json();
};

function Dashboard() {
  const { setUser: setUser__, user } = useContext(context);
  const router = useRouter();
  const { socket } = useContext(SocketContext);

  const [myLogin, setMyLogin] = useState('');

  const { data, status } = useQuery('dashboard', fetchDashboard);

  async function getProfile() {
    if (data) {
      const user_ = await axios.post(
        'http://localhost:3000/api/atari-pong/v1/user/avatar',
        { userLogin: data.login },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
          responseType: 'blob',
        },
      );
      const imageBlob = URL.createObjectURL(user_.data) as string;
      const user: User = data;
      user.avatar = imageBlob;
      console.log('user state ======== ', user.state)
      if (user.state === 0 && socket) {
        socket.emit('online', { token: localStorage.getItem('jwtToken'), test: 'dashboard' });
        user.state = 1;
        socket.on('inviteToGame', () => {
          console.log('inviteToGame');
          toast(<InviteToast/>,{
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            theme: 'dark',
          });
        });
        socket.on('cancelNotification', () => {
          console.log('cancelNotification=======')
          toast.dismiss();
        });
      }
      setUser__(user);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) router.push('/');
    else {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const exp = decodedToken.exp;
      const current_time = Date.now() / 1000;
      if (exp < current_time) {
        localStorage.removeItem('jwtToken');
        router.push('/');
      } else if (user.id === undefined) getProfile();
    }
  }, [status]);


  return (
    <OptionBar flag={0}>
      {status == 'loading' && (
        <div className=" flex flex-col space-y-2 w-full h-[80%] items-center justify-center">
          <h1>Loading</h1>
          <div className="spinner"></div>
        </div>
      )}
      {
		status == "success" &&
		<main className="h-auto w-auto md:w-full md:h-full font-Orbitron NeonShadow min-h-[480px] min-w-[280px] ">
        <div className="w-full h-[8%] pl-6 md:pl-12 font-semibold flex justify-start items-center NeonShadow text-base xl:text-3xl">
          Hello {user.firstName}!
        </div>
        <div className=" w-full md:h-[84%] h-auto flex flex-col md:flex-row justify-center items-center px-2 md:px-12 space-y-6 md:space-y-0 md:space-x-6 xl:space-x-12 ">
          <div className="md:h-full h-auto w-full md:w-[60%]  space-y-6 xl:space-y-12 flex flex-col -red-600">
            <div className="w-full md:h-[60%] h-52">
              <Profil router={router} />
            </div>
            <div className="w-full md:h-[40%] h-40">
              <LastMatch
                matchPlayed={user.numberOfGamesPlayed || 0}
                login={user.login || ''}
                router={router}
              />
            </div>
          </div>
          <div className="md:h-full h-auto w-full md:w-[40%] space-y-6  xl:space-y-12 flex flex-col -yellow-300">
            <div className="w-full md:h-[40%] h-40">
              <NewGame />
            </div>
            <div className="w-full md:h-[60%] h-auto">
              <LatestAchiev login={user.login || ''} router={router} />
            </div>
          </div>
        </div>
        <div className="w-full h-[8%]"></div>
      </main>}
    </OptionBar>
  );
}

export default Dashboard;
