'use client';
import Link from 'next/link';
import close from '../../public/close.svg';
import Image from 'next/image';
import SimpleInput from '../components/inputs/simpleInput';
import seePassword from '../../public/seePassword.svg';
import SimpleButton from '../components/buttons/simpleButton';
import QuaranteDeux from '../../public/42.svg';
import blackQuarante from '../../public/black42.svg';
import google from '../../public/google.svg';
import { useState } from 'react';
import { data } from 'autoprefixer';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [Uerror, setUerror] = useState(true);
  const [Perror, setPerror] = useState(true);
  const Data = { username, password };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (Data.username == '') return setUerror(false);
    else setUerror(true);
    if (Data.password == '') return setPerror(false);
    else setPerror(true);
    console.log(Data);
  };

  return (
    <main className="flex justify-center items-center bg-[#282828] w-screen h-screen">
      <div className="px-6 py-1 flex flex-col justify-center min-w-[280px] min-h-[479px] w-full h-[65%] md:w-2/3  lg:w-1/3  bg-black NeonShadowBord">
        <div className="w-full h-[30%]">
          <div className="flex justify-end items-center h-1/5 w-full ">
            <Link href="/">
              <Image src={close} alt="close" className="w-10 h-10" />
            </Link>
          </div>
          <div className="w-full h-4/6 text-white text-3xl font-bold NeonShadow font-Orbitron flex justify-center items-center">
            <h1>Atari Pong</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-full h-[70%]">
          <div className="w-full h-[42.85%] flex  flex-col justify-start space-y-6 px-2 ">
            <div className="h-[30%] w-full ">
              <SimpleInput holder="Username" type1="text" error={Uerror} SetValue={setUsername} />
            </div>
            <div className="h-[30%] w-full ">
              <SimpleInput
                SetValue={setPassword}
                holder="Password"
                type1="password"
                type2="text"
                icon={seePassword}
                error={Perror}
              />
            </div>
          </div>
          <div className="px-2 w-full h-[57.15%] space-y-10">
            <div className="h-[25%] w-full ">
              <SimpleButton content="Log-in" buttonType="submit" />
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
      </div>
    </main>
  );
}

export default Login;
