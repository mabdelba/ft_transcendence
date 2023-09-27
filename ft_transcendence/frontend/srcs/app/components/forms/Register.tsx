'use client';
import Image from 'next/image';
import SimpleButton from '../buttons/simpleButton';
import uploadIcon from '../../../public/uploadIcon.svg';
import google from '../../../public/google.svg';
import close from '../../../public/close.svg';
import SimpleInput from '../inputs/simpleInput';
import QuaranteDeux from '../../../public/42.svg';
import seePassword from '../../../public/seePassword.svg';
import hidePass from '../../../public/hidepass.svg';
import blackupload from '../../../public/blackupload.svg';
import blackQuarante from '../../../public/black42.svg';
import { useState, MouseEvent } from 'react';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

type closeFunc = {
  handler: any;
  rout: any;
};

function Register(props: closeFunc) {
  const Regex = /\b([a-zA-ZÀ-ÿ][-a-zA-ZÀ-ÿ. ']+[ ]*)+/;
  const EmRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const PassRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const UserRegex = /^[^\s]+$/;

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [vpassword, setVerif] = useState('');
  const [ferror, setFerror] = useState(false);
  const [lerror, setLerror] = useState(false);
  const [eerror, setEerror] = useState(false);
  const [uerror, setUerror] = useState(false);
  const [perror, setPerror] = useState(false);
  const [verror, setVerror] = useState(false);
  // const [valid, setValid] = useState(false);

  const Data = { firstname, lastname, username, email, password, vpassword };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!ferror || !lerror || !uerror || !eerror || !perror || !verror) {
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

    console.log(Data);

    const apiUrl = 'http://localhost:3000/api/atari-pong/v1/auth/register';
    const login = Data.username;
    const firstName = Data.firstname;
    const lastName = Data.lastname;
    const avatar = '';
    const email = Data.email;
    const password = Data.password;

    const requestData = {
      login,
      firstName,
      lastName,
      email,
      password,
      avatar,
    };
    axios
      .post(apiUrl, requestData)
      .then((response) => {
        toast.success('Congratulations! You have successfully registered!', {
          position: 'top-center',
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        console.log('Response from loclahost:3000', response.data);
      })
      .catch((error) => {
        toast.error('This user is already registred!', {
          position: 'top-center',
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        console.log('Error', error);
      });
  };

  const handleFtClick = (event: any) => {
    event.preventDefault();
    const ftApiUrl =
      'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ae7399cd8ce3177bfd638813299cc7a0d4908431f7959eda3bd395b0790adc64&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fcallback&response_type=code';

    const newWind = window.open(ftApiUrl);
    const handleWindowMessage = (event: any) => {
      if (event.origin === 'http://localhost:4000') {
        const code = event.data.code;

        if (code) {
          window.removeEventListener('message', handleWindowMessage);
          if (newWind) newWind.close();
          const apiUrl = 'http://localhost:3000/api/atari-pong/v1/auth/ft-redirect?code=' + code;
          axios
            .get(apiUrl)
            .then((response) => {
              console.log('Response from 42 api: ', response.data);
              toast.success('You have successfully registred!', {
                position: 'top-center',
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
              });
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
              console.log('Error', error);
            });
        }
      }
    };
    window.addEventListener('message', handleWindowMessage);
  };
  return (
    <div className="flex flex-col w-full h-full">
      <div className="h-1/6 w-full  flex flex-col">
        <div className="flex justify-end items-center h-1/5 w-full ">
          <button type="button" onClick={props.handler}>
            <Image src={close} alt="close" className="w-10 h-10" />
          </button>
        </div>
        <div className="w-full h-4/6 text-white text-3xl font-bold NeonShadow font-Orbitron flex justify-center items-center">
          <h1>Atari Pong</h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className=" w-full h-5/6 flex  flex-col space-y-3 px-2">
        <div className="h-[10%] w-full flex flex-row justify-center space-x-2">
          <div className="w-1/2 h-full">
            <SimpleInput
              holder="First Name"
              type1="text"
              SetValue={setFirstName}
              setError={setFerror}
              regex={Regex}
              val={Data.firstname}
              isVerif={false}
            />
          </div>
          <div className="w-[50%] h-full">
            <SimpleInput
              holder="Last Name"
              type1="text"
              SetValue={setLastName}
              setError={setLerror}
              regex={Regex}
              val={Data.lastname}
              isVerif={false}
            />
          </div>
        </div>
        <div className="h-[10%] w-full ">
          <SimpleInput
            holder="Username"
            type1="text"
            SetValue={setUsername}
            setError={setUerror}
            regex={UserRegex}
            val={Data.username}
            isVerif={false}
          />
        </div>
        <div className="h-[10%] w-full ">
          <SimpleInput
            holder="Mail@example.com"
            type1="email"
            SetValue={setEmail}
            setError={setEerror}
            regex={EmRegex}
            val={Data.email}
            isVerif={false}
          />
        </div>
        <div className="h-[10%] w-full ">
          <SimpleInput
            holder="Password"
            type1="password"
            type2="text"
            icon={seePassword}
            icon2={hidePass}
            SetValue={setPassword}
            setError={setPerror}
            regex={PassRegex}
            val={Data.password}
            isVerif={false}
          />
        </div>
        <div className="h-[10%] w-full ">
          <SimpleInput
            holder="Verify Password"
            type1="password"
            type2="text"
            icon={seePassword}
            icon2={hidePass}
            SetValue={setVerif}
            setError={setVerror}
            val={Data.vpassword}
            isVerif={true}
            pass={Data.password}
          />
        </div>
        <div className="h-[10%] w-full ">
          <SimpleButton
            buttonType="button"
            content="Upload avatar"
            icon={uploadIcon}
            icon2={blackupload}
          />
        </div>
        <div className="h-[10%] w-full ">
          <SimpleButton buttonType="submit" content="Register" />
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
        <div className="h-[10%] w-full flex flex-row justify-center space-x-2">
          <div className="w-1/2 h-full" onClick={handleFtClick}>
            <SimpleButton buttonType="button" icon={QuaranteDeux} icon2={blackQuarante} />
          </div>
          <div className="w-[50%] h-full">
            <SimpleButton buttonType="button" icon={google} icon2={google} />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
