'use client';
import { useRouter } from 'next/navigation';
import SimpleButton from '../buttons/simpleButton';
import { useContext } from 'react';
import { User, context } from '../../../context/context';


function NewGame() {
  let router = useRouter();
  const {user, setUser} = useContext(context);

  return (
    <div className="h-full w-full NeonShadowBord flex flex-col ">
      <div className="w-full h-[50%]  flex justify-center items-center text-sm base:text-base 2xl:text-2xl">
        Ready for a new challenge!
      </div>
      <div className="w-full h-[50%]  flex justify-center items-start">
        <div className="w-1/2 h-[50%]">
          <SimpleButton content="New game" buttonType="button" handleClick={
            () => {
              const _user : User = user;
              _user.gameType = 'private';
              setUser(_user);
              router.push('/queue');
            }
          }/>
        </div>
      </div>
    </div>
  );
}

export default NewGame;