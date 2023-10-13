'use client';

import Pdp from '../components/shapes/Pdp';
import alien from '../../public/alien.svg';
import blueAchiev from '../../public/blueAchiev.svg';
import DiscloComp from '../components/shapes/DiscloComp';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import Invit from '../components/shapes/Invit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { error } from 'console';
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';


const OptionBar = dynamic(() => import('../components/forms/OptionBar'), {ssr: false});

function Friends() {
  const router = useRouter();
  function setOnline() {
    io('http://localhost:3000', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('jwtToken'),
      },
    });
  }
  useEffect(() => {
    if (!localStorage.getItem('jwtToken')) router.push('/');
    else setOnline();
  }, []);
  const getReq = () => {
    const urlreq = 'http://localhost:3000/api/atari-pong/v1/friend/friend-requests-list';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .get(urlreq, config)
      .then((response) => {
        // console.log("friend request from : ", response.data.recievedFriendRequestsBy);
        setRequest(response.data.recievedFriendRequestsBy);
      })
      .catch((error) => {
        console.log('Error from backend', error);
      });
  };

  const getFriend = () => {
    const urlreq = 'http://localhost:3000/api/atari-pong/v1/friend/friend-list';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .get(urlreq, config)
      .then((response) => {
        setFriendsList(response.data.friends);
      })
      .catch((error) => {
        console.log('Error from backend', error);
      });
  };

  const getBlocked = () => {
    const url = 'http://localhost:3000/api/atari-pong/v1/friend/blocked-user-list';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .get(url, config)
      .then((response) => {
        setBlockedList(response.data.blockedList);
      })
      .catch((error) => {
        console.log('Error from backend', error);
      });
  };
  const [requests, setRequest] = useState<any>(null);

  const [friendsList, setFriendsList] = useState<any>(null);

  const [blockedList, setBlockedList] = useState<any>(null);

  useEffect(() => {
    if (!localStorage.getItem('jwtToken')) router.push('/');
    else getFriend();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('jwtToken')) router.push('/');
    else getReq();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('jwtToken')) router.push('/');
    else getBlocked();
  }, []);

  const deleteFriend = () => {
    const elementToDelete = friendsList.findIndex((obj: any) => obj.id === userId);
    if (elementToDelete !== -1) {
      friendsList.splice(elementToDelete, 1);
    }
    const url = 'http://localhost:3000/api/atari-pong/v1/friend/remove-friend';
    const token = localStorage.getItem('jwtToken');
    const conf = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(url, { friendId: userId }, conf)
      .then((response) => {
        console.log('response ', response);
      })
      .catch((error) => {
        console.log('error ', error);
      });
    toast.error(`${userName} has been deleted from your friend list!`, {
      position: 'top-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    setOpenFriend(false);
  };

  const blockFriend = () => {
    const elementToDelete = friendsList.findIndex((obj: any) => obj.id === userId);
    if (elementToDelete !== -1) {
      friendsList.splice(elementToDelete, 1);
    }
    const url = 'http://localhost:3000/api/atari-pong/v1/friend/block-user';
    const token = localStorage.getItem('jwtToken');
    const conf = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(url, { userId: userId }, conf)
      .then((response) => {
        console.log('response ', response);
      })
      .catch((error) => {
        console.log('error ', error);
      });
    toast.error(`You blocked ${userName}!`, {
      position: 'top-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    setOpenFriend(false);
  };
  const deleteRequest = () => {
    const elementToDelete = requests.findIndex((obj: any) => obj.id === userId);
    if (elementToDelete !== -1) {
      requests.splice(elementToDelete, 1);
    }

    const url = 'http://localhost:3000/api/atari-pong/v1/friend/reject-friend-request';
    const token = localStorage.getItem('jwtToken');
    const conf = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(url, { senderId: userId }, conf)
      .then((response) => {
        console.log('response ', response);
      })
      .catch((error) => {
        console.log('error ', error);
      });
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
    const elementToDelete = requests.findIndex((obj: any) => obj.id === userId);
    if (elementToDelete !== -1) {
      requests.splice(elementToDelete, 1);
    }
    const newObject = { id: userId, login: userName, avatar: userAvatar };
    friendsList.push(newObject);
    const url = 'http://localhost:3000/api/atari-pong/v1/friend/accept-friend-request';
    const token = localStorage.getItem('jwtToken');
    const conf = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(url, { senderId: userId }, conf)
      .then((response) => {
        console.log('response ', response);
      })
      .catch((error) => {
        console.log('error ', error);
      });
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

  const unblockUser = () => {
    const elementToDelete = blockedList.findIndex((obj: any) => obj.id === userId);
    if (elementToDelete !== -1) {
      blockedList.splice(elementToDelete, 1);
    }

    const url = 'http://localhost:3000/api/atari-pong/v1/friend/unblock-user';
    const token = localStorage.getItem('jwtToken');
    const conf = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(url, { userId: userId }, conf)
      .then((response) => {
        console.log('response ', response);
      })
      .catch((error) => {
        console.log('error ', error);
      });
    setOpenBlock(false);
  };
  const [userId, setUserId] = useState<any>(null);
  const [userAvatar, setUserAvatar] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [open, setOpen] = useState(false);
  const [openFriend, setOpenFriend] = useState(false);
  const [openBlock, setOpenBlock] = useState(false);
  const closeModal = () => {
    setOpen(false);
  };
  const closeFriendModal = () => {
    setOpenFriend(false);
  };
  const closeBlockModal = () => {
    setOpenBlock(false);
  };

  return (
    <>
      <OptionBar flag={2}>
        <main className="w-full h-auto md:h-full flex flex-col font-Orbitron min-h-[480px] min-w-[280px]">
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
                setUserId={setUserId}
                setAvatar={setUserAvatar}
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
                setOpen={setOpenFriend}
                setLogin={setUserName}
                setUserId={setUserId}
                setAvatar={setUserAvatar}
              />
            </div>
            <div className="w-full h-auto ">
              <DiscloComp
                title="Blocked list"
                divArray={blockedList}
                textColor="text-[#FF0742] redShadow"
                Color={false}
                hoverColor="hover:font-extrabold hover:bg-slate-900 hover:bg-opacity-10"
                image={alien}
                isFriend={true}
                setOpen={setOpenBlock}
                setLogin={setUserName}
                setUserId={setUserId}
                setAvatar={setUserAvatar}
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
      </OptionBar>
      {/* request */}
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
                <Dialog.Panel className="min-w-[280px] min-h-[300px] h-[30%] w-full  md:w-2/3  xl:w-1/3 bg-black NeonShadowBord">
                  <Invit
                    login={userName}
                    closeModal={closeModal}
                    avatar={alien}
                    accept={acceptRequest}
                    delete={deleteRequest}
                    Color={false}
                    Content1="Accept"
                    Content2="Delete"
                    flag={0}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* Friends */}
      <Transition appear show={openFriend} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeFriendModal}>
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
                <Dialog.Panel className="min-w-[280px] min-h-[300px] h-[30%] w-full  md:w-2/3  xl:w-1/3 bg-black NeonShadowBord">
                  <Invit
                    login={userName}
                    closeModal={closeFriendModal}
                    avatar={alien}
                    accept={deleteFriend}
                    delete={blockFriend}
                    Color={true}
                    Content1="Delete"
                    Content2="Block"
                    flag={1}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Blocked */}
      <Transition appear show={openBlock} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeBlockModal}>
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
                <Dialog.Panel className="min-w-[280px] min-h-[300px] h-[30%] w-full  md:w-2/3  xl:w-1/3 bg-black NeonShadowBord">
                  <Invit
                    login={userName}
                    closeModal={closeBlockModal}
                    avatar={alien}
                    accept={unblockUser}
                    Color={true}
                    Content1="Delete"
                    Content2="Block"
                    flag={2}
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
