'use client';
import close from '../../../public/close.svg';
import Image from 'next/image';
import Pdp from './Pdp';
import SimpleButton from '../buttons/simpleButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { User, context } from '../../../context/context';
import { useContext } from 'react';

type newType = {
  closeModal?: any;
  avatar?: any;
  login: string;
  accept: any;
  delete?: any;
  Color: boolean;
  Content1: string;
  Content2: string;
  flag: number;
};

function Invit(props: newType) {
  const router = useRouter();
  const {user, setUser} = useContext(context);

  const handleClick = () => {
    router.push(`/profil/${props.login}`);
  };

  const handleMessage = ()=> {
    const _user : User = user;
    let conversation  = _user.conversations;
    let indexOfElementToMove = -1;
    if(conversation)
      indexOfElementToMove = conversation.findIndex((obj: any) => obj.login == props.login);
    if(indexOfElementToMove == -1)
    {
      if(conversation)
        conversation.unshift({login: props.login, avatar: props.avatar});
      else
        conversation = [{login: props.login, avatar: props.avatar}]
    }
    else
    {
      const elementToMove = conversation[indexOfElementToMove];
      conversation.splice(indexOfElementToMove, 1);
      conversation.unshift(elementToMove);
    }
    conversation['isFrd'] = true;
    _user.conversations = conversation;
    setUser(_user);
    router.push('/messages');
  }
  return (
    <div className="h-full w-full flex flex-col font-Orbitron NeonShadow">
      <div className="flex justify-end items-center h-[15%] w-full ">
        <button type="button" onClick={props.closeModal}>
          <Image src={close} alt="close" className="w-10 h-10" />
        </button>
      </div>
      <div className="w-full  flex justify-center h-[25%] text-xs xl:text-lg items-center">
        {props.flag == 0
          ? 'Friend request :'
          : props.flag == 1
          ? 'You are already friends'
          : `you have blocked ${props.login}, Click to unblock!`}
      </div>
      <div className="h-1/2 w-full flex flex-row ">
        <div
          className="h-full w-1/2 flex justify-center items-center hover:bg-slate-800 hover:bg-opacity-5 hover:font-extrabold"
          onClick={handleClick}
        >
          <Pdp name={props.login} myProfile={true} image={props.avatar} color={props.Color} />
        </div>
        <div className="h-[90%] pt-2 w-[40%] flex flex-col justify-center pr-4 space-y-3">
          {props.flag == 2 ? (
            <div className="h-2/3  flex justify-center items-center">
              <SimpleButton buttonType="button" content="Unblock" handleClick={props.accept} />
            </div>
          ) : (
            <>
            <div className='flex flex-row h-full w-full space-x-2'>
              <SimpleButton
                buttonType="button"
                content={props.Content1}
                handleClick={props.accept}
              />
              {props.flag == 1 &&
              <SimpleButton
                buttonType="button"
                content={props.Content2}
                handleClick={props.delete}
              />
              }
            </div>
            <div className='h-full w-full'>
            { 
              props.flag != 1 ? 
              <SimpleButton 
                buttonType="button"
                content={props.Content2}
                handleClick={props.delete} /> : 
              <SimpleButton 
                buttonType="button"
                content="Message"
                handleClick={handleMessage} />
              }
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Invit;
