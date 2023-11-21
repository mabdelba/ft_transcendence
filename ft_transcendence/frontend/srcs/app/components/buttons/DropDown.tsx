'use client'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { AiOutlinePlus } from 'react-icons/ai'
import { ImBlocked } from 'react-icons/im'
import {BsFillVolumeMuteFill} from 'react-icons/bs'
import {GiBootKick} from 'react-icons/gi'
import { StoreID } from 'recoil'
import axios from 'axios'
import { toast } from 'react-toastify'


function MyDropDown(props : {iAm: string, memberSelected : string, roomSelected: string, members : any, setMembers : any}) {
  
  
  const setAsAdmin = () =>{

    const apiUrl = "http://localhost:3000/api/atari-pong/v1/channels/add-admin-to-channel";
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: {Authorization : `Bearer ${token}`}
    }
    axios.post(apiUrl, {channelName : props.roomSelected, user: props.memberSelected}, config)
    .then(()=> {
      const tempMembers = props.members;
      const index = tempMembers.findIndex((obj:any)=> obj.login == props.memberSelected)
      if(index != -1)
      {
        tempMembers[index].state = 'admin';
        props.setMembers(tempMembers);
      }
      toast.success(`You have designated ${props.memberSelected} as admin!`);
    })
    .catch((error: any)=> {
      // console.log("error", error.response.data.message)
      toast.warning(error.response.data.message);
    })
  }
  const link = [
    { href: ()=>{}, label: 'Ban' , render: () => {return(<ImBlocked size="20"/>)}},
    { href: ()=>{}, label: 'Mute' ,render: () => {return(<BsFillVolumeMuteFill size="20"/>)}},
    { href: ()=>{}, label: 'Kick' ,render: () => {return(<GiBootKick size="20"/>)} },
    { href: setAsAdmin, label: 'Set as admin' ,render: () => {return(<AiOutlinePlus size="20"/>)} },
  ]

  const [links, setLinks] = useState(link);

  useEffect(()=>{

    if(props.iAm != 'owner')
    {
      link.splice(3, 1);
      setLinks(link);
    }
  }, [props.iAm])

  return (
    <div className="">
      <Menu as="div" className="relative inline-block text-left">
        {
            ({open}) => (
            <>
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md  px-4 py-2 text-sm font-medium focus:outline-none ">
          <ChevronUpIcon className={`${!open ? 'rotate-180 transform ' : ''} h-5 w-5  2xl:h-8 2xl:w-8 `}/>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="bg-black absolute right-0 w-36 z-10 origin-top-right divide-yoverflow-auto SmallNeonShadowBord text-base ring-1 ring-black ring-opacity-5 sm:text-sm focus:outline-none sm:mr-2">
            <div className="">
              {
                links.map((link: any, index: number) => (
                  <Menu.Item key={index}>
                  {({ active }) => (
                    <button
                      onClick={link.href}
                      className={ ` w-full h-10 relative border-b-2  cursor-pointer select-none flex flex-row items-center justify-center space-x-2 transition-all duration-500  ${
                        active ? 'bg-white text-black' : 'text-white'
                      }`}
                    >
                      {link.render()}
                      <h1 className='truncate'>{link.label}</h1>
                    </button>
                  )}
                  </Menu.Item>
                )
              )}
            </div>
          </Menu.Items>
        </Transition>
        </>
        )}
      </Menu>
    </div>
  )
}

export default MyDropDown;