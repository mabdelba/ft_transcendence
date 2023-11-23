'use client';
import React from 'react';
import { IoMdAdd } from "react-icons/io";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useContext, useEffect, useState } from 'react';
import { context } from '../../../context/context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { error } from 'console';

type SearchBarProps = {
    result: string;
    key: number;
    type: boolean;
    isMember: boolean;
    channelType: number;
}

function SearchResult(props: SearchBarProps)
{
  const [JoinPopUp, setJoinPopUp] = useState(false);
  const [Joinpublic, setJoinPublic] = useState(true);
  const {user} = useContext(context)

  const closeLoginModal = () => {
    setJoinPopUp(false);
    joinProtectedChannel(props.result);
  }

  const openLoginModal = () => {
    setJoinPopUp(true);
  }

  const joinChannel = async (name: string) => {
    const apiUrl = 'http://localhost:3000/api/atari-pong/v1/channels/add-user-to-channel';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },

    };
    axios.post(apiUrl, {channelName: name, user: user.login}, config)
    .then(()=> {
      toast.success(`You joined ${name}!`)
    }
    )
    .catch((error : any)=> {
      
      toast.error(error.response.data.message);
    })
    setJoinPublic(false);
  }
  let channelPass: any = 123;

  const joinProtectedChannel = async (name: string) => {
    const apiUrl = 'http://localhost:3000/api/atari-pong/v1/channels/add-user-to-channel';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiUrl, {channelName: name, user: user.login, password: channelPass}, config)
    .then(()=> {
      toast.success(`You joined ${name}!`)
    }
    )
    .catch((error : any)=> {
      
      toast.error(error.response.data.message);
    })
    setJoinPublic(false);
  }
  return (
    <>
      <div className="flex flex-row justify-between m-1 hover:bg-black p-2 pl-[60px] pr-[25px]">
        {
          props.result
          && props.type === false
          && <div onClick={(e) => alert(`You selected ${props.result}!`)}>{props.result}</div>
        }
        {
          props.result
          && props.type === true
          && props.isMember === false
          && <div className=' items-start'>{props.result}</div>
        }
        {
          props.result
          && props.type === true
          && props.isMember === false
          && <div>
            {
              props.type === true
              && props.channelType === 0
              && Joinpublic === true
              &&  <button className='hover:text-[#BEF264] flex flex-row items-center' onClick={()=>joinChannel(props.result)}>
                    <IoMdAdd />
                    Join
                  </button>
            }
            {
              props.type === true
              && props.channelType === 2
              &&  <button className='hover:text-[#BEF264] flex flex-row items-center' onClick={openLoginModal}>
                    <IoMdAdd />
                    Join
                  </button>
            }
          </div>
        }
        {/* {
          props.result
          && props.type === true
          && props.isMember === false
          && <div>
            {
              props.type === true
              &&  <button className='hover:text-[#BEF264] flex flex-row items-center' onClick={openLoginModal}>
                    <IoMdAdd />
                    Join
                  </button>
            }
          </div>
        } */}
      </div>
      <Transition appear show={JoinPopUp} as={Fragment}>
        <Dialog as="div" className="relative z-20 font-Orbitron" onClose={closeLoginModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex justify-center items-center bg-opacity-40 backdrop-blur bg-[#282828] w-screen h-screen">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="px-6 py-1 flex flex-col justify-center min-w-[200px] w-full md:w-2/3  lg:w-1/3  bg-black NeonShadowBord">
                  {/* <JoinPopUp handler={closeLoginModal} rout={router} /> */}
                  <div className='m-5'>Type the channel's password</div>
                  <input type="password" placeholder='Password' className="w-full h-14 bg-[#272727] neonBord pl-[20px] mb-5 text-white outline-none placeholder-[rgba(255, 255, 255, 0.50);] text-sm transition-all duration-500" />
                  <div className="flex flex-row justify-center">
                    <button className="mt-2 mb-2 py-3 px-5 mb-5 NeonShadowBord hover:text-[#BEF264] flex flex-row items-center" onClick={closeLoginModal}>
                      Join
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default SearchResult;