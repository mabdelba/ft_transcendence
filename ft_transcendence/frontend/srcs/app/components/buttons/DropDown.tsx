'use client'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { AiOutlinePlus } from 'react-icons/ai'
import { ImBlocked } from 'react-icons/im'
import {BsFillVolumeMuteFill} from 'react-icons/bs'
import {GiBootKick} from 'react-icons/gi'


function MyDropDown() {
  
  const links = [
    { href: '/', label: 'Block' , render: (renderFuntion: any) => {return(<ImBlocked size="20"/>)}},
    { href: '/', label: 'Mute' ,render: (renderFuntion: any) => {return(<BsFillVolumeMuteFill size="20"/>)}},
    { href: '/', label: 'Kick' ,render: (renderFuntion: any) => {return(<GiBootKick size="20"/>)} },
    { href: '/', label: 'make admin' ,render: (renderFuntion: any) => {return(<AiOutlinePlus size="20"/>)} },
  ]

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
                links.map((link: any) => (
                  <Menu.Item>
                  {({ active }) => (
                    <button
                      className={ ` w-full h-10 relative border-b-2  cursor-pointer select-none flex flex-row items-center justify-center space-x-2 transition-all duration-500  ${
                        active ? 'bg-white text-black' : 'text-white'
                      }`}
                    >
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

export default MyDropDown;