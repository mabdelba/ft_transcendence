'use client';


import alien from '../../public/alien.svg';
import DiscloComp from '../components/shapes/DiscloComp';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useContext, useEffect, useState } from 'react';
import Invit from '../components/shapes/Invit';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { User, context,SocketContext} from '../../context/context';
import OptionBar from '../components/forms/OptionBar';
import { useQueries, useQuery } from 'react-query';


const fetchRequestList = async () => {
  const urlreq = 'http://localhost:3000/api/atari-pong/v1/friend/friend-requests-list';
  const res = await fetch(urlreq, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
    },
  });
  return res.json();
};
const fetchFriendList = async () => {
  const urlreq = 'http://localhost:3000/api/atari-pong/v1/friend/friend-list';
  const res = await fetch(urlreq, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
    },
  });
  return res.json();
};

const fetchBlockedList = async () => {
  const urlreq = 'http://localhost:3000/api/atari-pong/v1/friend/blocked-user-list';
  const res = await fetch(urlreq, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
    },
  });
  return res.json();
};

function Friends() {
  const router = useRouter();
  const { user, setUser } = useContext(context);
  const { socket } = useContext(SocketContext);

  const { data: requestListData, status } = useQuery('requestList', fetchRequestList);
  const { data: friendListData, status: status_ } = useQuery('friendList', fetchFriendList);
  const { data: blockedListData, status: status__ } = useQuery('blockedList', fetchBlockedList);

  useEffect(()=> {
    if(!user.login){

      const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios.get(apiUrl, config)
      .then((response : any) => {
        const _user = response.data;
        setUser(_user);

      })
    }
  })
  // const getImageByLogin = async (login: string): Promise<string | null> => {
  //   return new Promise<string | null>(async (resolve) => {
  //     if (login != '') {
  //       await axios
  //         .post(
  //           'http://localhost:3000/api/atari-pong/v1/user/avatar',
  //           { userLogin: login },
  //           {
  //             headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
  //             responseType: 'blob',
  //           },
  //         )
  //         .then((response) => {
  //           const imageBlob = URL.createObjectURL(response.data) as string;
  //           if (imageBlob) resolve(imageBlob);
  //           else resolve(alien);
  //         })
  //         .catch(() => {
  //           // resolve(alien);
  //         });
  //     }
  //   });
  // };

  const getReq = async () => {
    if (requestListData) {

      
      setRequest(requestListData.recievedFriendRequestsBy);
      const _user: User = user;
      _user.friendRequestList = requestListData.recievedFriendRequestsBy;
      if (!_user.state) {
        socket.emit('online', { token: localStorage.getItem('jwtToken') });
        _user.state = 1;
      }
      setUser(_user);
    }
  };

  const getFriend = async () => {
    if (friendListData) {
      
      setFriendsList(friendListData.friends);
      const _user: User = user;
      _user.friendList = friendListData.friends;
      setUser(_user);
    }
  };

  const getBlocked = async () => {
    if (blockedListData) {
      // console.log("test all: ", blockedListData.blockedList);
      setBlockedList(blockedListData.blockedList);
      const _user: User = user;
      _user.blockedList = blockedListData.blockedList;
      setUser(_user);
    }
  };
  const [requests, setRequest] = useState<any>(null);

  const [friendsList, setFriendsList] = useState<any>(null);

  const [blockedList, setBlockedList] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) router.push('/');
    else {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const exp = decodedToken.exp;
      const current_time = Date.now() / 1000;
      if (exp < current_time) {
        localStorage.removeItem('jwtToken');
        router.push('/');
      } else if (!user.friendRequestList || !user.friendList || !user.blockedList) {
        getFriend();
        getReq();
        getBlocked();
      } else {
        setRequest(user.friendRequestList);
        setFriendsList(user.friendList);
        setBlockedList(user.blockedList);
      }
    }
  }, [status, status_, status__]);

  const deleteFriend = () => {
    const elementToDelete = friendsList.findIndex((obj: any) => obj.id === userId);
    if (elementToDelete !== -1) {
      friendsList.splice(elementToDelete, 1);
      const _user: User = user;
      _user.friendList = friendsList;
      setUser(_user);
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
    const newObject = { id: userId, login: userName, avatar: userAvatar };
    blockedList.push(newObject);
    const _user: User = user;
    _user.friendList = friendsList;
    _user.blockedList = blockedList;
    setUser(_user);
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
      const _user: User = user;
      _user.friendRequestList = requests;
      setUser(_user);
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
    const _user: User = user;
    _user.friendRequestList = requests;
    _user.friendList = friendsList;
    setUser(_user);
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
      const _user: User = user;
      _user.blockedList = blockedList;
      setUser(_user);
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
  const [userAvatar, setUserAvatar] = useState(alien);
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
          {(status == 'loading' || status_ == 'loading' || status__ == 'loading' )&& (
            <div className=" flex flex-col space-y-2 w-full h-[80%] items-center justify-center">
              <h1>Loading</h1>
              <div className="spinner"></div>
            </div>
          )}
          {
            (status == 'success' && status_ == 'success' && status__ == 'success' ) &&
            <div className="w-full h-auto flex flex-col px-2  md:px-12 space-y-8 md:space-y-12 ">
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
          </div>}
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
                <Dialog.Panel className="min-w-[260px] min-h-[100px] h-[40%] xl:h-[30%] w-4/5  sm:w-2/3  xl:w-1/3 bg-black NeonShadowBord">
                  <Invit
                    login={userName}
                    closeModal={closeModal}
                    avatar={userAvatar}
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
        <Dialog as="div" className="relative z-10 " onClose={closeFriendModal}>
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

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex justify-center items-center bg-opacity-40 backdrop-blur bg-[#282828] w-full h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="min-w-[260px] min-h-[100px] h-[40%] xl:h-[30%] w-4/5  sm:w-2/3  xl:w-1/3 bg-black NeonShadowBord">
                  <Invit
                    login={userName}
                    closeModal={closeFriendModal}
                    avatar={userAvatar}
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
            <div className="flex justify-center items-center bg-opacity-40 backdrop-blur bg-[#282828] w-full h-full">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="min-w-[260px] min-h-[100px] h-[40%] xl:h-[30%] w-4/5  sm:w-2/3  xl:w-1/3 bg-black NeonShadowBord">
                  <Invit
                    login={userName}
                    closeModal={closeBlockModal}
                    avatar={userAvatar}
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
