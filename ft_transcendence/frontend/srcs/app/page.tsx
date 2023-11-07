'use client';

import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Register from './components/forms/Register';
import Login from './components/forms/Login';

export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const closeLoginModal = () => {
    setLoginOpen(false);
  };

  const openLoginModal = () => {
    setLoginOpen(true);
  };

  const closeRegisterModal = () => {
    setRegisterOpen(false);
  };

  const openRegisterModal = () => {
    setRegisterOpen(true);
  };
  
  const router = useRouter();
  function checkToken() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const exp = decodedToken.exp;
      const current_time = Date.now() / 1000;
      if (exp < current_time) {
        localStorage.removeItem('jwtToken');
        router.push('/');
      }
      else
      router.push('/dashboard');
    }
  }
  checkToken();

  return (
    <>
      <div className="h-screen fixed inset-0 flex items-center justify-center">
        <div className="ft_background">
          <div className="ft_board">
            <div className="ft_left">
              <div className="ft_edge"></div>
              <div className="ft_edge ft_edge-down"></div>
            </div>
            <div className="ft_right">
              <div className="ft_edge"></div>
              <div className="ft_edge ft_edge-down"></div>
            </div>
            <div className="ft_ball"></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-fit h-full min-w-fit">
          <h1 className="ft_title">Atari pong</h1>
          <button className="ft_button" type="button" onClick={openLoginModal}>
            log-in
          </button>
          <button className="ft_button" type="button" onClick={openRegisterModal}>
            Register
          </button>
        </div>
      </div>
      {/* Register section */}
      <Transition appear show={registerOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeRegisterModal}>
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
                <Dialog.Panel className="px-2 py-1 flex flex-col justify-center min-w-[280px] min-h-[479px] w-full h-[90%] md:w-2/3  lg:w-1/3  lg:h-[80%] bg-black NeonShadowBord">
                  <Register handler={closeRegisterModal} rout={router} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* Login Section */}
      <Transition appear show={loginOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeLoginModal}>
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
                <Dialog.Panel className="px-6 py-1 flex flex-col justify-center min-w-[280px] min-h-[479px] w-full h-[65%] md:w-2/3  lg:w-1/3  bg-black NeonShadowBord">
                  <Login handler={closeLoginModal} rout={router} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
