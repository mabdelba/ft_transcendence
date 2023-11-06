'use client';
import { useCallback, useContext, useEffect, useRef, useState, Fragment} from 'react';
import OptionBar from '../components/forms/OptionBar';
import ListBox from '../components/buttons/ListBox';
import { User, context, SocketContext } from '../../context/context';
import BurgButton from '../components/shapes/burgButton';
import MyMenu from '../components/buttons/DropBox';
import alien from '../../public/alien.svg';
import Image from 'next/image';
import group from '../../public/friends.svg';
import SendMessage from '../components/inputs/SendMessage';
import { PiCircleFill } from 'react-icons/pi';
import axios from 'axios';
import MessageText from '../components/shapes/MessageText';
import { Dialog, Transition } from '@headlessui/react';
import {AiOutlineClose} from 'react-icons/ai'
import SimpleButton from '../components/buttons/simpleButton';
import SimpleInput from '../components/inputs/simpleInput';

const path = `/goinfre/mabdelba/ft_transcendence/ft_transcendence/backend/srcs/public/avatars/`;
const friendList = [
  { login: 'abas', id: 1, avatar: `${path}waelhamd.jpg` },
  { login: 'ozahid', id: 3, avatar: `${path}ozahid.jpg` },
  { login: 'mo9atil', id: 2, avatar: `${path}mo9atil.jpg` },
  { login: 'mlahlafi', id: 5, avatar: `${path}mlahlafi.jpg` },
];
const Groups = [
  { login: '#Group one', id: 777, avatar: '' },
  { login: 'Group two', id: 778, avatar: '' },
  { login: '&Group three', id: 98, avatar: '' },
];

type ChatText = {
  sender: string;
  receiver: string;
  id: number;
  text: string;
};
var id = 10;
// const chatText: ChatText[] = [
//   { sender: 'mabdelba', receiver: 'waelhamd', id: 1, text: 'Salut Cava' },

//   { sender: 'mabdelba', receiver: 'waelhamd', id: 2, text: '?' },
//   { sender: 'waelhamd', receiver: 'mabdelba', id: 3, text: 'Lhamdoulah toi' },
//   { sender: 'mabdelba', receiver: 'waelhamd', id: 2, text: '?' },
//   { sender: 'waelhamd', receiver: 'mabdelba', id: 3, text: 'Lhamdoulah toi' },
//   { sender: 'mabdelba', receiver: 'waelhamd', id: 2, text: '?' },
//   { sender: 'waelhamd', receiver: 'mabdelba', id: 3, text: 'Lhamdoulah toi' },
//   { sender: 'mabdelba', receiver: 'waelhamd', id: 2, text: '?' },
//   { sender: 'waelhamd', receiver: 'mabdelba', id: 3, text: 'Lhamdoulah toi' },
//   { sender: 'mabdelba', receiver: 'waelhamd', id: 2, text: '?' },
//   { sender: 'waelhamd', receiver: 'mabdelba', id: 3, text: 'Lhamdoulah toi' },
// ];

const getImageByLogin = async (login: string): Promise<string | null> => {
  return new Promise<string | null>(async (resolve) => {
    if (login != '') {
      await axios
        .post(
          'http://localhost:3000/api/atari-pong/v1/user/avatar',
          { userLogin: login },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
            responseType: 'blob',
          },
        )
        .then((response) => {
          const imageBlob = URL.createObjectURL(response.data) as string;
          if (imageBlob) resolve(imageBlob);
          else resolve(alien);
        })
        .catch(() => {
          // resolve(alien);
        });
    }
  });
};

function Messages() {
  const [showSideBar, setShowSideBar] = useState(false);
  const [selected, setSelected] = useState(0);
  const { user, setUser } = useContext(context);
  const { socket } = useContext(SocketContext);
  const [showArray, setShowArray] = useState<any>();
  const [roomSelected, setRoomSelected] = useState<string>('');
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<any>([]);
  const [chatArea, setChatArea] = useState<any>([]);
  const messageEl = useRef<any>();
  const [openModal, setOpenModal] = useState(false);
  const [groupName , setGroupName ] = useState('');
  const [groupPassword, setGroupPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSend = (e: any) => {
    e.preventDefault();
    // alert(`message to ${roomSelected} : ${message}`);
    socket.emit('send-message', {
      isChannel: false,
      senderLogin: user.login,
      receiverLogin: roomSelected,
      text: message,
    });
    if (message != '') {
      const _chatArea = [
        ...chatArea,
        { sender: user.login, reciever: roomSelected, text: message },
      ];
      setChatArea(_chatArea);
      //   setChangeList(false);
      setMessage('');
      if(conversations[0].login != roomSelected ){

        const tempConversation = conversations;
        const indexOfElementToMove = tempConversation.findIndex((obj: any) => obj.login == roomSelected);
        const elementToMove = tempConversation[indexOfElementToMove];
        if(indexOfElementToMove != -1)
        {
          tempConversation.splice(indexOfElementToMove, 1);
          tempConversation.unshift(elementToMove);
          const _user : User = {...user, }
          _user.conversations = tempConversation;
          setUser(_user);
          setConversations(tempConversation);
        }
      }
    }
  };

  const usersWithConversation = async () => {
    if (socket) {
      if(!user.conversations || (user.conversations.length == 1 && user.conversations.isFrd)) {
        const _user: User = { ...user };
        if (!user.state) {
          socket.emit('online', { token: localStorage.getItem('jwtToken') });
          _user.state = 1;
          setUser(_user);
        }
        socket.emit('users-with-conversation', { login: user.login || 'mabdelba' });
        socket.on('get-users', (data: any) => {
          console.log('this is all users === ', data);
          data.map((obj: any) =>
            getImageByLogin(obj.login).then((image) => {
              obj.avatar = image;
            }),
          );
        if(user.conversations)
        {
          data.map((obj: any) => {
            if(obj.login != _user.conversations[0].login)
              _user.conversations = [..._user.conversations, obj]
          })
        }
        else
         _user.conversations = data;
        setUser(_user);
        setConversations(_user.conversations);
        });
      }
      else setConversations(user.conversations);
    }
  };
  // const [friendList, setFriendList] = useState(user.friendList);

  function recieveMessage(data: any) {
    if (data.senderLogin == roomSelected || data.receiverLogin == roomSelected)
      setChatArea([
        ...chatArea,
        { sender: data.senderLogin, reciever: data.receiverLogin, text: data.text },
      ]);
    else {
      // console.log('heeeereeeeeee');

      const tempConversation = conversations;
      const indexOfElementToMove = tempConversation.findIndex((obj: any) => (obj.login == data.senderLogin || obj.login == data.receiverLogin));
      const elementToMove = tempConversation[indexOfElementToMove];
      if(indexOfElementToMove != -1)
      {
        tempConversation.splice(indexOfElementToMove, 1);
        tempConversation.unshift(elementToMove);
        const _user : User = {...user, }
        _user.conversations = tempConversation;
        setUser(_user);
        setConversations(tempConversation);
      }
    }
  }

  useEffect(() => {
    if (socket) {
      socket.emit('get-messages', {
        senderLogin: user.login || 'mabdelba',
        receiverLogin: roomSelected,
      });
      socket.on('get-messages', (data: any) => {
        setChatArea(data);
      });
    }
  }, [roomSelected, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', recieveMessage);
      return () => socket.off('receive-message');
    }
  }, [chatArea, socket]);

  useEffect(() => {
    if (conversations.length != 0) {
  
      selected == 0
        ? (setShowArray(conversations), setRoomSelected(conversations[0].login || ''))
        : selected == 1
        ? (setShowArray(Groups), setRoomSelected(Groups[0].login))
        : setShowArray([]);
    }
    usersWithConversation();
  }, [selected, user.state, user.conversations, conversations]);

  useEffect(() => {
    const conversationDiv: any = messageEl.current;
    if (conversationDiv) {
      conversationDiv.scrollTop = conversationDiv.scrollHeight;
    }
  }, [chatArea]);

  return (
    <OptionBar flag={3}>
      <main className="w-full h-full   flex flex-col items-center  font-Orbitron min-h-[550px]  min-w-[280px] pb-2 px-6  md:px-12  ">
        <div className="w-full h-[8%]  NeonShadow flex justify-start items-center text-base xl:text-3xl ">
          Messages
        </div>
        <div className="w-full  h-auto md:h-[88%] NeonShadowBord flex flex-row items-center overflow-y-auto ">
          <div
            className={`h-full ${
              showSideBar ? '' : 'hidden'
            }  sm:block  w-20 md:w-60 2xl:w-96  border-r-[3px] lineshad flex flex-col`}
          >
            <div className="h-16  2xl:h-20  border-b-[3px] lineshad bg-[#36494e] bg-opacity-70">
              <ListBox setSelected={setSelected} setOpenModal={setOpenModal} />
            </div>
            <div className="h-auto w-full grid grid-cols-1 pt-2 2xl:pt-4">
              {
                showArray &&
                showArray.map(
                (obj: any) =>
                  !obj.isBlocked && (
                    <button
                      onClick={() => {
                        setRoomSelected(obj.login);
                      }}
                      key={obj.loin}
                      className={`h-14 ease-in-out 2xl:h-[68px]  truncate rounded-br-full rounded-tr-full rounded-bl-full text-xs 2xl:text-base flex flex-row justify-center md:justify-start space-x-3 2xl:space-x-6 md:pl-5 2xl:pl-7 items-center transition-all duration-500 tracking-wide  ${
                        roomSelected == obj.login
                          ? ' text-white  hover:bg-[#EDEDED] hover:border-[#00B2FF] hover:text-black border-white md:border-b-2   2xl:border-b-4   font-bold  underline-offset-8 '
                          : ' hover:bg-[#EDEDED] hover:text-black hover:border-[#00B2FF] hover:blueShadow '
                      }`}
                    >
                      {
                        <Image
                          src={
                            selected == 0 &&
                            obj.avatar &&
                            obj.avatar != `public/avatars/${obj.login}.jpg`
                              ? obj.avatar
                              : group
                          }
                          alt="image"
                          width="50"
                          height="50"
                          className={`rounded-full border-2 2xl:border-[3px] w-10 h-10  2xl:w-12 2xl:h-12 border-inherit bg-slate-800 `}
                        />
                      }
                      <span className="hidden  text-left pt-1 md:flex flex-col 2xl:-space-y-1">
                        <div className="flex flex-row  items-center justify-between">
                          <h1>{obj.login}</h1>
                          {selected == 0 && (
                            <PiCircleFill
                              className={`${
                                obj.state == 1
                                  ? 'text-green-500 border  border-neutral-500 rounded-full '
                                  : 'text-gray-500'
                              } `}
                            />
                          )}
                        </div>
                        <h6 className="text-[7px] 2xl:text-[10px] antialiased  truncate w-24 2xl:w-44 overflow-hidden font-normal tracking-normal text-[#484848]">
                          {obj.state == 1 ? `${obj.login} is available` : 'Disconnected'}
                        </h6>
                      </span>
                    </button>
                  ),
              )}
            </div>
          </div>
          <div className="h-full w-full flex flex-col justify-between">
            <div className="h-16  2xl:h-20   border-b-[3px] lineshad flex flex-row justify-between items-center bg-[#36494e] bg-opacity-70">
              <div>
                <BurgButton setFlag={setShowSideBar} val={showSideBar} />
              </div>
              <span className="text-xs md:text-base lg:text-lg truncate e">{roomSelected}</span>
              <MyMenu slected={selected} />
            </div>
            <div className="  border-yellow-400 h-[60vh] w-full overflow-y-auto flex flex-col-reverse justify-end pb-4">
              <div className="h-auto  overflow-y-auto scroll-smooth" ref={messageEl}>
                {chatArea.map((obj: ChatText) => (
                  <div key={obj.id} className=" w-full h-auto">
                    <MessageText sender={obj.sender} message={obj.text} />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-16  2xl:h-20  border-t-[3px] lineshad">
              <SendMessage SetValue={setMessage} handleClick={handleSend} value={message} />
            </div>
          </div>
        </div>
      </main>
      <Transition appear show={openModal} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={()=> {setOpenModal(false)}}>
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
                <Dialog.Panel className="relative min-w-[260px] min-h-[100px]  h-[60%] xl:h-[60%] w-4/5  sm:w-2/3  xl:w-1/3 bg-black NeonShadowBord">
                  <div className='h-[10%] w-full flex justify-end items-center pr-3 NeonShadow'>
                    <AiOutlineClose  onClick={()=> {setOpenModal(false)}}  className="cursor-pointer h-7 w-7  lg:h-10 lg:w-10"/>
                  </div>
                  <h1 className='h-[10%] w-full font-Orbitron NeonShadow text-base md:text-xl 2xl:text-3xl flex justify-center items-center'>Add new group</h1>
                  <form className='h-[75%] flex flex-col justify-between w-full p-2 sm:p-10 '>
                    <div className='h-1/5'>
                      <SimpleInput holder={'Group name'} type1={'text'} SetValue={setGroupName} val={''} setError={setError} isVerif={false}  />
                    </div>
                    <div className='h-1/5 flex justify-between'></div>
                    <div className='h-1/5'>
                      <SimpleInput holder={'Password (optional)'} type1={'text'} type2='password' SetValue={setGroupPassword} val={''} setError={setError} isVerif={false}  />
                    </div>
                    <div className='h-1/5'>
                      <SimpleButton content='Add group' buttonType={"submit"} handleClick={(e: any)=> {e.preventDefault()}}/>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </OptionBar>
  );
}

export default Messages;
