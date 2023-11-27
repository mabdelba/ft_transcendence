'use client';
import Image from 'next/image';
import SimpleButton from '../buttons/simpleButton';
import google from '../../../public/google.svg';
import close from '../../../public/close.svg';
import SimpleInput from '../inputs/simpleInput';
import QuaranteDeux from '../../../public/42.svg';
import blackQuarante from '../../../public/black42.svg';
import seePassword from '../../../public/seePassword.svg';
import hidePass from '../../../public/hidepass.svg';
import { useContext, useEffect, useState } from 'react';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { SocketContext } from '../../../context/context';

type closeFunc = {
  handler: any;
  rout: any;
  setOpenTwoFact: any;
  setJwtToken: any;
  setLoginTwo: any
};

function Login(props: closeFunc) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [Uerror, setUerror] = useState(false);
  const [Perror, setPerror] = useState(false);
  const {socket} = useContext(SocketContext);
  // const [jwtTokenState, setjwtTokenState] = useState<any>('');
  const Data = { username, password };

  const regex = /^.+$/;


  const check2fa = () => {
    ;
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    props.setLoginTwo(username);
    if (!Uerror || !Perror) {
      toast.error('Please fill out all fields with compatible format!');
      return;
    }

    const login = Data.username;
    const password = Data.password;

    const logData = { login, password };
    console.log("haaaa za: ", logData)
    const apiUrl = 'http://e3r8p14.1337.ma:3000/api/atari-pong/v1/auth/login';
    axios
      .post(apiUrl, logData)
      .then((response) => {

        // console.log('response: ', response);
        if (response.data.twoFaActive == true)
        {
          props.setOpenTwoFact(true);
          props.setJwtToken(response.data.token)
          // check2fa();
        }
        else
        {
          toast.success('You have successfully logged in!');
          const jwtToken = response.data.token;
          localStorage.setItem('jwtToken', jwtToken);
          socket.emit('online', {token: jwtToken});
          props.rout.push('/dashboard');
        }
      })
      .catch((error) => {
        toast.error('Incorrect username or password!')})   ;
  };

  useEffect(()=> {

    const keyDownHandler = (e: any)=> {
      // console.log('user pressed: ', e.key);
      if(e.key === 'Enter'){
        e.preventDefault();
        handleSubmit(e);
      }
    }
    document.addEventListener('keydown', keyDownHandler);
    return ()=> document.removeEventListener('keydown', keyDownHandler)
  })

  const handleFtClick = (event: any) => {
    event.preventDefault();
    const ftApiUrl =
'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ae7399cd8ce3177bfd638813299cc7a0d4908431f7959eda3bd395b0790adc64&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fcallback&response_type=code'
    const newWind = window.open(ftApiUrl);
    const handleWindowMessage = (event: any) => {
      if (event.origin === 'http://e3r8p14.1337.ma:4000') {
        const code = event.data.code;

        if (code) {
          window.removeEventListener('message', handleWindowMessage);
          if (newWind) newWind.close();
          const apiUrl = 'http://e3r8p14.1337.ma:3000/api/atari-pong/v1/auth/ft-redirect?code=' + code;
          axios
            .get(apiUrl)
            .then((response) => {
              toast.success('You have successfully logged in!', {
                position: 'top-center',
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
              });
              const jwtToken = response.data.token;
              axios.get('http://e3r8p14.1337.ma:3000/api/atari-pong/v1/auth/ft-avatar', {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                },
              });
              localStorage.setItem('jwtToken', jwtToken);
              socket.emit('online', {token: jwtToken});
              props.rout.push('/dashboard');
            })
            .catch((error) => {
              toast.error('User not connected with 42 account', {
                position: 'top-center',
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
              });
              // console.log('Error', error);
            });
        }
      }
    };
    window.addEventListener('message', handleWindowMessage);
  };

  return (
    <>
      <div className="w-full h-[30%]">
        <div className="flex justify-end items-center h-1/5 w-full ">
          <button type="button" onClick={props.handler}>
            <Image src={close} alt="close" className="w-10 h-10" />
          </button>
        </div>
        <div className="w-full h-4/6 text-white text-3xl font-bold NeonShadow font-Orbitron flex justify-center items-center">
          <h1>Atari Pong</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="w-full h-[70%]">
        <div className="w-full h-[42.85%] flex  flex-col justify-start space-y-6 px-2 ">
          <div className="h-[30%] w-full ">
            <SimpleInput
              holder="Username"
              type1="text"
              SetValue={setUsername}
              setError={setUerror}
              regex={regex}
              val={Data.username}
              isVerif={false}
            />
          </div>
          <div  className="h-[30%] w-full ">
            <SimpleInput
              SetValue={setPassword}
              holder="Password"
              type1="password"
              type2="text"
              icon={seePassword}
              icon2={hidePass}
              setError={setPerror}
              regex={regex}
              val={Data.password}
              isVerif={false}
            />
          </div>
        </div>
        <div className="px-2 w-full h-[57.15%] space-y-10">
          <div className="h-[25%] w-full ">
            <SimpleButton  content="Log-in" buttonType="submit" />
          </div>
          <div  className="h-[25%] w-full flex flex-row justify-center space-x-10">
              <SimpleButton icon={QuaranteDeux} icon2={blackQuarante} buttonType="button" handleClick={handleFtClick} />
            {/* <div className="w-[50%] h-full">
              <SimpleButton icon={google} icon2={google} buttonType="button" />
            </div> */}
          </div>
        </div>
      </form>
    </>
  );
}

export default Login;
