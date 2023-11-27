'use client';
import Link from 'next/link';
import Image from 'next/image';
import close from '../../public/close.svg';
import SimpleButton from '../components/buttons/simpleButton';
import SimpleInput from '../components/inputs/simpleInput';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import Login from '../components/forms/Login';
import axios from 'axios';
import { SocketContext } from '../../context/context';
import { useRouter } from 'next/navigation';



function TwoFactor(props: {setopenModal: any, jwtToken: any, login: string}) {
  const [fir, setFir] = useState(0);
  const [sec, setSec] = useState(0);
  const [thi, setThi] = useState(0);
  const [forth, setForth] = useState(0);
  const [fiv, setFiv] = useState(0);
  const [six, setSix] = useState(0);
  const [change, setChange] = useState(false);
  const [error, setError] = useState(true);
  const CodeObj = { fir, sec, thi, forth, fiv, six };
  const {socket} = useContext(SocketContext)
  const router = useRouter()

  const handleBlur = () => {
    if (!change) return;
    if (
      CodeObj.fir < 0 ||
      CodeObj.fir > 9 ||
      CodeObj.sec < 0 ||
      CodeObj.sec > 9 ||
      CodeObj.thi < 0 ||
      CodeObj.thi > 9 ||
      CodeObj.forth < 0 ||
      CodeObj.forth > 9 ||
      CodeObj.fiv < 0 ||
      CodeObj.fiv > 9 ||
      CodeObj.six < 0 ||
      CodeObj.six > 9
    )
      setError(false);
    else setError(true);
  };

  const checkChange = (event: any) => {
    event.preventDefault();
    setChange(true);
  };

  let [result, setResult] = useState('');

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (result.length !== 6) {
      toast.error('The code must be 6 digits long.');
      return;
    }
    else {
      
      // console.log(result);
      // console.log(props.login);
      // console.log(props.jwtToken);

      const url = "http://localhost:3000/api/atari-pong/v1/two-factor-auth/verify";
      const config = {
        headers: { Authorization: `Bearer ${props.jwtToken}` },
    };
      axios.post(url, {code: result}, config)
      .then((response) => {
          // console.log("response: ", response.data);
          // console.log("res: ", result);
          if (response.data === true)
          {
            toast.success('You have successfully logged in!')
            const jwtToken = props.jwtToken;
            localStorage.setItem('jwtToken', jwtToken);
            socket.emit('online', {token: jwtToken});
            router.push('/dashboard');
          }
          else
              toast.error('Wrong code!');
      })
      .catch((error) => {
          // console.log("error: ", error);
          toast.error(error.response.data.message);
      })
    }
  };

  return (
    // <main className="flex justify-center items-center w-fit h-screen m-auto">
      <div className="flex flex-col bg-black NeonShadowBord">
        <div className="flex justify-end items-start w-full">
          <button type='button' onClick={()=> {props.setopenModal(false)}}>
            <Image src={close} alt="close" className="outline-none" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          onChange={checkChange}
          className="flex flex-col items-center"
        >
          <div className="flex justify-center items-center my-16">
            <h1 className="NeonShadow text-white font-Orbitron text-[39px]">
              Two-factor authentication
            </h1>
          </div>
          <div onBlur={handleBlur} className="flex flex-row">
            <div className="flex flex-row  items-center mx-6">
                <input
                  placeholder='___ ___'
                  className='h-[70px] w-[calc(54px*5)] mx-4 bg-[#282828] text-white font-Orbitron text-[39px] text-center neonBord'
                  type="text"
                  maxLength={6}
                  onChange={(e) => setResult(e.target.value)}
                  />
            </div>
          </div>
          <div className="flex justify-center mt-16 mb-32 mx-[40px] w-[568px] h-[70px]">
            <div className="text-[39px] w-full h-full">
              <button
                className='font-Orbitron text-[39px] hover:text-black hover:bg-white text-center SmallNeonShadowBord NeonShadow w-full h-full'
                type="submit"
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    // </main>
  );
}

export default TwoFactor;
