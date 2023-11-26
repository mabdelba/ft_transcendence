'use client';
import Link from 'next/link';
import Image from 'next/image';
import close from '../../public/close.svg';
import SimpleButton from '../components/buttons/simpleButton';
import SimpleInput from '../components/inputs/simpleInput';
import { useState } from 'react';
import { toast } from 'react-toastify';

function TwoFactor() {
  const [fir, setFir] = useState(0);
  const [sec, setSec] = useState(0);
  const [thi, setThi] = useState(0);
  const [forth, setForth] = useState(0);
  const [fiv, setFiv] = useState(0);
  const [six, setSix] = useState(0);
  const [change, setChange] = useState(false);
  const [error, setError] = useState(true);
  const CodeObj = { fir, sec, thi, forth, fiv, six };

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
    if (result.length !== 6) {
      event.preventDefault();
      toast.error('The code must be 6 digits long.');
      return;
    }
    else {
      
      console.log(result);
    }
  };

  return (
    <main className="flex justify-center items-center w-fit h-screen m-auto">
      <div className="flex flex-col bg-black NeonShadowBord">
        <div className="flex justify-end items-start w-full">
          <Link href="/">
            <Image src={close} alt="close" className="" />
          </Link>
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
                className='font-Orbitron text-[39px] text-center SmallNeonShadowBord NeonShadow w-full h-full'
                type="submit"
              >
                Continue
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default TwoFactor;
