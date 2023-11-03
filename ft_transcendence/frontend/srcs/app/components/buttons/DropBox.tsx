'use client'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { AiOutlinePlus } from 'react-icons/ai'
import { ImBlocked } from 'react-icons/im'
import {BsFillEyeFill} from 'react-icons/bs'
import {GiGamepad} from 'react-icons/gi'
import {FiSettings} from 'react-icons/fi'
import {TbLogout2} from 'react-icons/tb'
import {MdGroups2} from 'react-icons/md'


const friendMenu = [
  { href: '/account-settings', label: 'View profile' , render: (renderFuntion: any) => {return(<BsFillEyeFill size="20"/>)}},
  { href: '/support', label: 'Block' ,render: (renderFuntion: any) => {return(<ImBlocked size="20"/>)}},
  { href: '/license', label: 'Invite for a match' ,render: (renderFuntion: any) => {return(<GiGamepad size="20"/>)} },
]

const GroupMenu = [
  { href: '/account-settings', label: 'Group settings' ,render: (renderFuntion: any) => {return(<FiSettings size="20"/>)}},
  { href: '/support', label: 'Leave' ,render: (renderFuntion: any) => {return(<TbLogout2 size="20"/>)}},
  { href: '/license', label: 'Group Members' ,render: (renderFuntion: any) => {return(<MdGroups2 size="20"/>)}},  
  { href: '/license', label: 'Invite members' ,render: (renderFuntion: any) => {return(<AiOutlinePlus size="20"/>)}},  
]


function MyMenu(props: {slected: number}) {


  const [links, setLinks] = useState(friendMenu);

  useEffect(()=> {
    
    props.slected == 0 ? setLinks(friendMenu) : props.slected == 1 ? setLinks(GroupMenu) : setLinks([]);
  }, [props.slected])

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
          <Menu.Items className="absolute right-0 mr-3 mt-2 w-60 z-10 origin-top-right divide-yoverflow-auto SmallNeonShadowBord  bg-[#36494e] text-base shadow-lg ring-1 ring-black ring-opacity-5  sm:text-sm focus:outline-none">
            <div className="px-1  ">
              {
                links.map((link: any) => (
                  <Menu.Item>
                  {({ active }) => (
                    <button
                      className={ ` w-full h-14 relative border-b-2  cursor-pointer select-none flex flex-row items-center justify-center space-x-2  ${
                        active ? 'bg-white text-black' : 'text-white'
                      }`}
                    >
                      {/* {(link.label == 'Invite for a match'|| link.label == 'Invite members') && <AiOutlinePlus size="23" />} */}
                      {link.render()}
                      <h1>{link.label}</h1>
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

export default MyMenu;