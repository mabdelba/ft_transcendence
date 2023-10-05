'use client';
import Pdp from '../components/shapes/Pdp';
import alien from '../../public/alien.svg';
import blueAchiev from '../../public/blueAchiev.svg';
import DiscloComp from '../components/shapes/DiscloComp';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Invit from '../components/shapes/Invit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Friends() {
  const [requests, setRequest] = useState(['aelabid', 'ktbatou']);
  const [friendsList, setFriendsList] = useState([
    'waelhamd',
    'mabdelba',
    'ahel-bah',
    'waelhamd',
    'mabdelba',
    'ahel-bah',
    'mabdelba',
  ]);

  const deleteRequest = () => {
    setRequest(requests.filter((str) => str !== userName));
    toast.error(`Friend request from ${userName} has been deleted!`, {
      position: 'top-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    setOpen(false);
  };

  const acceptRequest = () => {
    setRequest(requests.filter((str) => str !== userName));
    friendsList.push(userName);
    setFriendsList(friendsList);
    toast.success(`New friend ${userName} added successfully!`, {
      position: 'top-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    setOpen(false);
  };
  const [userName, setUserName] = useState('');
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <main className="w-screen h-auto md:h-screen flex flex-col font-Orbitron min-h-[480px] min-w-[280px]">
        <div className="w-full h-12 md:h-[10%] pl-6 md:pl-12 NeonShadow flex justify-start items-center text-base xl:text-3xl -yellow-300">
          Friends
        </div>
        <div className="w-full h-auto flex flex-col px-0  md:px-12 space-y-8 md:space-y-12 ">
          <div className="w-full  h-auto ">
            <DiscloComp
              title="Friend requests"
              divArray={requests}
              textColor="text-[#FF0742] redShadow"
              Color={false}
              hoverColor="hover:font-extrabold hover:bg-slate-900 hover:bg-opacity-10"
              image={alien}
              isFriend={true}
              setOpen={setOpen}
              setLogin={setUserName}
            />
          </div>
          <div className="w-full h-auto ">
            <DiscloComp
              title="Friends list"
              divArray={friendsList}
              textColor="text-[#00B2FF] blueShadow"
              Color={true}
              hoverColor="hover:font-extrabold hover:bg-slate-900 hover:bg-opacity-10"
              image={alien}
              isFriend={true}
            />
          </div>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </main>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
            <div className="flex justify-center items-center bg-transparent bg-[#282828] w-screen h-screen">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="min-w-[280px] min-h-[300px] h-[30%] w-full  md:w-2/3  lg:w-1/3 bg-black NeonShadowBord">
                  <Invit
                    login={userName}
                    closeModal={closeModal}
                    avatar={alien}
                    accept={acceptRequest}
                    delete={deleteRequest}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default Friends;
