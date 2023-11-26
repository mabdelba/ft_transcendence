'use client';
import { useRouter } from 'next/navigation';
import SimpleButton from '../buttons/simpleButton';
import { useContext } from 'react';


function NewGame() {
  let router = useRouter();

  return (
    <div className="h-full w-full NeonShadowBord flex flex-col ">
      <div className="w-full h-[50%]  flex justify-center items-center text-sm base:text-base 2xl:text-2xl">
        Ready for a new challenge!
      </div>
      <div className="w-full h-[50%]  flex justify-center items-start">
        <div className="w-1/2 h-[50%]">
          <SimpleButton content="New game" buttonType="button" handleClick={
            () => {
              router.push('/queue');
            }
          }/>
        </div>
      </div>
    </div>
  );
}

export default NewGame;