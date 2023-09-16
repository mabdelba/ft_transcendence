'use client';
import Image from 'next/image';
import SimpleButton from '../buttons/simpleButton';
import google from '../../../public/google.svg';
import close from '../../../public/close.svg';
import SimpleInput from '../inputs/simpleInput';
import QuaranteDeux from '../../../public/42.svg';
import seePassword from '../../../public/seePassword.svg';
import blackQuarante from '../../../public/black42.svg';
import { useState } from 'react';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type closeFunc = {
  handler: any;
};
function Login(props: closeFunc) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [Uerror, setUerror] = useState(false);
  const [Perror, setPerror] = useState(false);
  const Data = { username, password };

  var regex = /^.+$/;

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (!Uerror || !Perror) {
      toast.error('Please fill out all fields with compatible format!', {
        position: 'top-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }
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

    console.log(Data);
  };

  return (
    // <div className="w-full h-full">
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
          <div className="h-[30%] w-full ">
            <SimpleInput
              SetValue={setPassword}
              holder="Password"
              type1="password"
              type2="text"
              icon={seePassword}
              setError={setPerror}
              regex={regex}
              val={Data.password}
              isVerif={false}
            />
          </div>
        </div>
        <div className="px-2 w-full h-[57.15%] space-y-10">
          <div className="h-[25%] w-full ">
            <SimpleButton content="Log-in" buttonType="submit" />
            <ToastContainer
              position="top-center"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </div>
          <div className="h-[25%] w-full flex flex-row justify-center space-x-10">
            <div className="w-1/2 h-full">
              <SimpleButton icon={QuaranteDeux} icon2={blackQuarante} buttonType="button" />
            </div>
            <div className="w-[50%] h-full">
              <SimpleButton icon={google} icon2={google} buttonType="button" />
            </div>
          </div>
        </div>
      </form>
    </>
    // </div>
  );
}

export default Login;
