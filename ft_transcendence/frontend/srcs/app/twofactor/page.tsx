'use client';
import Link from 'next/link';
import Image from 'next/image';
import close from '../../public/close.svg';
import SimpleButton from '../components/buttons/simpleButton';
import SimpleInput from '../components/inputs/simpleInput';
import { useState } from 'react';

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

  const handlSubmit = (event: any) => {
    event.preventDefault();
    if (!change) return;
    if (
      change &&
      (CodeObj.fir < 0 ||
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
        CodeObj.six > 9)
    )
      return setError(false);
    else setError(true);
    console.log(CodeObj);
  };

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
  return (
    <main className="flex justify-center items-center w-full h-screen">
      <div className="flex flex-col bg-black NeonShadowBord">
        <div className="flex justify-end items-start w-full">
          <Link href="/">
            <Image src={close} alt="close" className="" />
          </Link>
        </div>
        <form
          onSubmit={handlSubmit}
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
              <div className="h-[70px] w-[54px] mx-4">
                <input
                  placeholder='_'
                  className='bg-[#282828] h-[70px] w-[54px] text-white font-Orbitron text-[40px] text-center neonBord'
                  maxLength={1}
                />
              </div>
              <div className="h-[70px] w-[54px] mx-4">
                <input
                  placeholder='_'
                  className='bg-[#282828] h-[70px] w-[54px] text-white font-Orbitron text-[40px] text-center neonBord'
                  maxLength={1}
                />
              </div>
              <div className="h-[70px] w-[54px] mx-4">
                <input
                  placeholder='_'
                  className='bg-[#282828] h-[70px] w-[54px] text-white font-Orbitron text-[39px] text-center neonBord'
                  maxLength={1}
                />
              </div>
            </div>
            <div className="flex flex-row  items-center mx-6">
              <div className="h-[70px] w-[54px] mx-4">
                <input
                  placeholder='_'
                  className='bg-[#282828] h-[70px] w-[54px] text-white font-Orbitron text-[40px] text-center neonBord'
                  maxLength={1}
                />
              </div>
              <div className="h-[70px] w-[54px] mx-4">
                <input
                  placeholder='_'
                  className='bg-[#282828] h-[70px] w-[54px] text-white font-Orbitron text-[40px] text-center neonBord'
                  maxLength={1}
                />
              </div>
              <div className="h-[70px] w-[54px] mx-4">
                <input
                  placeholder='_'
                  className='bg-[#282828] h-[70px] w-[54px] text-white font-Orbitron text-[40px] text-center neonBord'
                  maxLength={1}
                />
              </div>
            </div>
          </div>
          <div className="flex items-end justify-center mt-16 mb-32 w-full px-10">
            <div className="w-full text-[39px]">
              <button
                className='font-Orbitron text-[39px] text-center SmallNeonShadowBord w-full NeonShadow m-3'
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
