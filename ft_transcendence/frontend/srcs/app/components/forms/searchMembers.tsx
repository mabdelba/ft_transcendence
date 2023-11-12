'use client'
import * as React from 'react'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import close from '../../../public/close.svg'
import alien from '../../../public/alien.svg'
import {AiOutlineUserAdd} from 'react-icons/ai'

function groupMembers() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    }

	const groupMembers = [
		{login: 'mabdelba', avatar : alien, state: 'admin' },
		{login: 'ahel-bah', avatar : alien, state: 'moderator' },
		{login: 'flan 1', avatar : alien, state: 'member' },
		{login: 'flan 2', avatar : alien, state: 'member' },
		{login: 'flan 3', avatar : alien, state: 'member' },
		{login: 'flan 4', avatar : alien, state: 'member' },
		{login: 'flan 5', avatar : alien, state: 'member' },
		{login: 'flan 6', avatar : alien, state: 'moderator' },
		{login: 'flan 7', avatar : alien, state: 'moderator' },
		{login: 'flan 8', avatar : alien, state: 'moderator' },
		{login: 'flan 9', avatar : alien, state: 'moderator' },
		{login: 'flan 10', avatar : alien, state: 'admin' },
		{login: 'flan 11', avatar : alien, state: 'admin' },
		{login: 'flan 12', avatar : alien, state: 'admin' },
		{login: 'flan 13', avatar : alien, state: 'admin' }
	]

    return (
      <>
        <div className='flex flex-col items-center h-screen justify-center'>
            <button className='' onClick={toggleModal}>
              button
            </button>
        </div>
        {isOpen && (
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={toggleModal}>
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex justify-center items-center bg-opacity-40 bg-[#282828] w-screen h-screen">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="font-Orbitron NeonShadow flex flex-col justify-center items-center min-w-fit min-h-fit max-h-[620px] bg-black NeonShadowBord">
					  <button className='w-full flex justify-end text-[20px] duration-300' onClick={toggleModal}>
							<Image src={close} alt='close' className='h-[50px] w-[50px] md:h-fit md:w-fit' />
					  </button>
                      <div className='text-[20px] sm:text-[25px] md:text-[30px] mx-8 my-3'>Search results</div>
					  <div className='my-[30px] sm:m-[30px] sm:w-[350px]'>
						<div className=' w-full flex items-center flex-col mt-3 mb-8 max-h-[350px] overflow-auto'>
							<ul className='w-full'>
								{groupMembers.map((member, index) => (
								<li key={index}>
									<div className='flex flex-row items-center my-[10px] justify-between'>
										<div className='flex flex-row'>
											<div className='NeonShadowBord h-[60px] w-[60px] flex items-center mr-[10px]'>
												<Image src={member.avatar} alt="avatar" />
											</div>
											<div className='flex flex-col justify-center'>
												<span>{member.login}</span>
											</div>
										</div>
										<button className='mr-5 p-1 text-[20px]'>
											<AiOutlineUserAdd />
										</button>
									</div>
								</li>))}
							</ul>
						</div>
					  </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
      </>
    )
}

export default groupMembers;