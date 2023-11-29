'use client';
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  Fragment,
  MouseEventHandler,
} from 'react';
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
import { AiOutlineClose, AiOutlineUserAdd } from 'react-icons/ai';
import SimpleButton from '../components/buttons/simpleButton';
import SimpleInput from '../components/inputs/simpleInput';
import SwitchButton from '../components/buttons/switchButton';
import Popup from '../components/shapes/Popup';
import seePass from '../../public/seePassword.svg';
import hidePass from '../../public/hidepass.svg';
import DropDown from '../components/buttons/DropDown';
import UploadAvatar from '../components/buttons/uploadAvatar';
import Upload from '../../public/uploadIcon.svg';
import BlackUpload from '../../public/blackupload.svg';
import { toast } from 'react-toastify';
import { Socket } from 'socket.io-client';
import Avatar from 'react-avatar';
import InviteToast from '../components/shapes/invitetoast';

type ChatText = {
  sender: string;
  receiver: string;
  id: number;
  text: string;
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
  const [groups, setGroups] = useState<any>([]);
  const [chatArea, setChatArea] = useState<any>([]);
  const messageEl = useRef<any>();
  const [openModal, setOpenModal] = useState(false);
  const [openMembersModal, setOpenMembersModal] = useState(false);
  const [openSettingModal, setOpenSettingModal] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupPassword, setGroupPassword] = useState('');
  const [error, setError] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [fileName, setFilename] = useState('');
  const [description, setDescripion] = useState('');
  const [avatarToUpload, setAvatarToUpload] = useState('');
  const [friendList, setFriendList] = useState<any>([]);
  const [groupMembers, setGroupMembers] = useState<any>([]);
  const [iAm, setIam] = useState('');
  const [roomSelectedType, setRoomSelectedType] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    if (!user.login && socket) {
      const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios.get(apiUrl, config).then((response: any) => {
        const _user = response.data;
        // if ( _user.state == 0) {
        // console.log('hello hello hello');
        socket.emit('online', { token: localStorage.getItem('jwtToken') });
        _user.state = 1;
        // }
        socket?.on('inviteToGame', (data: { senderId: string; login: string }) => {
          console.log('inviteToGame');
          toast(<InviteToast senderId={data.senderId} login={data.login} />, {
            position: 'top-center',
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            theme: 'dark',
          });
        });
        socket?.on('cancelNotification', () => {
          console.log('cancelNotification=======');
          toast.dismiss();
        });
        setUser(_user);
      });
    }
  }, [socket]);

  const handleImage = (e: any) => {
    setFilename(e.target.files[0].name);
    setAvatarToUpload(e.target.files[0]);
  };

  const handleChangeSettings = (e: any) => {
    e.preventDefault();
    const apiUrl = 'http://localhost:3000/api/atari-pong/v1/channels/update-channel-password';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios.post(apiUrl, { channelName: roomSelected, password: description }, config).then(() => {
      const tempConv = user.groups;
      const index = tempConv.findIndex((obj: any) => obj.name == roomSelected);
      if (index != -1) {
        if (roomSelectedType == 0 && description != '') tempConv[index].type = 2;
        else if (roomSelectedType == 2 && description == '') tempConv[index].type = 0;
        const _user: User = user;
        _user.groups = tempConv;
        setUser(user);
      }
      setDescripion('');
      toast.success('Changes saved successfully!');
      setOpenSettingModal(false);
    });
  };
  useEffect(() => {
    if (selected == 1 && roomSelected != '') {
      setGroupMembers([]);
      const apiUrl = 'http://localhost:3000/api/atari-pong/v1/channels/channel-members';
      axios
        .post(
          apiUrl,
          { channelName: roomSelected, user: user.login },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
          },
        )
        .then(async (response: any) => {
          // console.log('for debug: ', response.data)
          response.data.owner.state = 'owner';

          response.data.admins.forEach(async (obj: any) => {
            obj.state = 'admin';
          });
          response.data.members.forEach(async (obj: any) => {
            obj.state = 'member';
          });
          let tempMembers: any[] = [];
          tempMembers[0] = response.data.owner;
          tempMembers = [...tempMembers, ...response.data.admins, ...response.data.members];

          setGroupMembers(tempMembers);
        })
        .catch();
    }
  }, [roomSelected, user.login]);

  const addNewGroup = (e: any) => {
    e.preventDefault();
    if (groupName != '') {
      let groupType = 0;
      enabled ? (groupType = 1) : groupPassword != '' ? (groupType = 2) : (groupType = 0);
      // const newChannel = [{ownerLogin: user.login, name : groupName, password: groupPassword, type : groupType}];
      const apiUrl = 'http://localhost:3000/api/atari-pong/v1/channels/add-new-channel';
      axios
        .post(
          apiUrl,
          { channelName: groupName, type: groupType, password: groupPassword },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
          },
        )
        .then((response: any) => {
          const tempGroup = [
            ...groups,
            { name: groupName, ownerLogin: user.login, type: groupType, whoIam: 'owner' },
          ];
          setGroups(tempGroup);
          const _user: User = { ...user, groups: tempGroup };
          setUser(_user);
        })
        .catch((error) => {
          toast.error('Error to create this channel');
        });
      setError(false);
      setOpenModal(false);
    } else setError(true);
  };

  useEffect(() => {
    if (selected == 1 && roomSelected != '') {
      setFriendList([]);
      const urlreq = 'http://localhost:3000/api/atari-pong/v1/channels/friend-list-for-channel';
      axios
        .post(
          urlreq,
          { channelName: roomSelected, user: user.login },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
          },
        )
        .then((response: any) => {
          // console.log('ljadid: ', response);
          setFriendList(response.data);
          // setUser(_user);
        })
        .catch();
    }
  }, [roomSelected, user.login]);

  useEffect(() => {
    if (enabled) setGroupPassword('');
  }, [enabled]);

  const handleSend = (e: any) => {
    e.preventDefault();
    // alert(`message to ${roomSelected} : ${message}`);
    if (message != '' && roomSelected != '') {
      socket.emit('send-message', {
        isChannel: selected == 1 ? true : false,
        senderLogin: user.login,
        receiverLogin: roomSelected,
        text: message,
        senderAvatar: user.avatarUrl,
        state: user.state,
      });
      const _chatArea = [
        ...chatArea,
        { sender: user.login, reciever: roomSelected, text: message },
      ];
      setChatArea(_chatArea);
      //   setChangeList(false);
      setMessage('');
      if (selected == 0 && conversations[0].login != roomSelected) {
        const tempConversation = conversations;
        const indexOfElementToMove = tempConversation.findIndex(
          (obj: any) => obj.login == roomSelected,
        );
        const elementToMove = tempConversation[indexOfElementToMove];
        if (indexOfElementToMove != -1) {
          tempConversation.splice(indexOfElementToMove, 1);
          tempConversation.unshift(elementToMove);
          const _user: User = { ...user };
          _user.conversations = tempConversation;
          setUser(_user);
          setConversations(tempConversation);
        }
      } else if (selected == 1 && groups[0].name != roomSelected) {
        const tempGroup = groups;
        const indexOfElementToMove = tempGroup.findIndex((obj: any) => obj.name == roomSelected);
        const elementToMove = tempGroup[indexOfElementToMove];
        if (indexOfElementToMove != -1) {
          tempGroup.splice(indexOfElementToMove, 1);
          tempGroup.unshift(elementToMove);
          const _user: User = { ...user };
          _user.groups = tempGroup;
          setUser(_user);
          setGroups(tempGroup);
        }
      }
    }
  };

  // useEffect(()=>{

  //   if(socket && user.login && groups && roomSelected != ''){
  //     socket.on('user-removed-from-channel', (data: any) => {
  //       if(data.login == user.login)
  //       {
  //         console.log(groups);
  //         const index = groups.findIndex((obj:any) => obj.name == data.channelName);
  //         console.log('index: ', index);
  //         if(index != -1)
  //         {
  //           if(selected ==1)
  //             setShowArray([])
  //           const _user : User = user;
  //           _user.groups = undefined;
  //           setUser(_user);
  //           toast.warning(`You have been kicked from ${data.channelName}`)
  //         }
  //       }
  //     })
  //   }
  // }, [socket, user.login, groups, roomSelected])

  const channelsWithConversation = async () => {
    if (socket) {
      if (user.groups == undefined) {
        const _user: User = user;
        socket.emit('channels-with-conversation', { channelName: user.login });
        socket.on('get-channels', (data: any) => {
          // console.log("zidch:================================================= ", data);
          setGroups(data);
          _user.groups = data;
          setUser(_user);
        });
      } else setGroups(user.groups);
      socket.on('user-removed-from-channel', (data: any) => {
        if (data.login == user.login) {
          // console.log(groups);
          const index = groups.findIndex((obj: any) => obj.name == data.channelName);
          // console.log('index: ', index);
          if (index != -1) {
            if (selected == 1) setShowArray([]);
            const _user: User = user;
            _user.groups = undefined;
            setUser(_user);
            // toast.warning(`You have been kicked from ${data.channelName}`)
          }
        }
      });
      socket.on('user-banned-from-channel', (data: any) => {
        if (data.login == user.login) {
          // console.log(groups);
          const index = groups.findIndex((obj: any) => obj.name == data.channelName);
          // console.log('index: ', index);
          if (index != -1) {
            if (selected == 1) setShowArray([]);
            const _user: User = user;
            _user.groups = undefined;
            setUser(_user);
            // toast.warning(`You have been banned from ${data.channelName}`)
          }
        }
      });
      socket.on('user-muted-in-channel', (data: any) => {
        if (data.login == user.login) {
          const index = groups.findIndex((obj: any) => obj.name == data.channelName);
          if (index != -1) {
            if (selected == 1) setShowArray([]);
            const _user = user;
            _user.groups = undefined;
            setUser(_user);
          }
        }
      });
      socket.on('channel-removed', (data: any) => {
        const index = groups.findIndex((obj: any) => obj.name == data.channelName);
        if (index != -1) {
          setShowArray([]);
          const _user = user;
          _user.groups = undefined;
          setUser(_user);
        }
      });
      return () => {
        socket.off('user-removed-from-channel');
        socket.off('user-banned-from-channel');
        socket.off('user-muted-in-channel');
        socket.off('channel-removed');
      };
    }
  };
  const usersWithConversation = async () => {
    if (socket) {
      if (!user.conversations || (user.conversations.length == 1 && user.conversations.isFrd)) {
        const _user: User = { ...user };
        //  console.log('fles message: ', user.conversations);
        socket.emit('users-with-conversation', { login: user.login || 'mabdelba' });
        socket.on('get-users', (data: any) => {
          //  console.log('data users,', data)
          if (user && user.conversations && user.conversations.length == 1) {
            const uLogin: string = user.conversations[0].login;
            data.map((obj: any) => {
              if (obj.login != uLogin) user.conversations = [...user.conversations, obj];
            });
            setUser(user);
            setConversations(user.conversations);
            // setRoomSelected(uLogin)
          } else if (!user.conversations || user.conversations.length == 0) {
            _user.conversations = data;
            setUser(_user);
            setConversations(_user.conversations);
          }
          // console.log('fles message wra : ', user.conversations);

          // console.log("nchufo hadi", _user.conversations);
        });
      } else setConversations(user.conversations);
    }
  };
  // const [friendList, setFriendList] = useState(user.friendList);

  function recieveMessage(data: any) {
    // console.log('is enter: ', data)
    if (data.senderLogin == roomSelected || data.receiverLogin == roomSelected)
      setChatArea([
        ...chatArea,
        { sender: data.senderLogin, reciever: data.receiverLogin, text: data.text },
      ]);
    if (selected == 0) {
      // console.log('heeeereeeeeee');

      const tempConversation = conversations;
      const indexOfElementToMove = tempConversation.findIndex(
        (obj: any) => obj.login == data.senderLogin || obj.login == data.receiverLogin,
      );
      const elementToMove = tempConversation[indexOfElementToMove];
      if (indexOfElementToMove != -1) {
        tempConversation.splice(indexOfElementToMove, 1);
        tempConversation.unshift(elementToMove);
        const _user: User = { ...user };
        _user.conversations = tempConversation;
        setUser(_user);
        setConversations(tempConversation);
      } else {
        // tempConversation.splice(indexOfElementToMove, 1);
        tempConversation.unshift({
          login: data.senderLogin,
          avatar: 'avatar',
          avatarUrl: data.senderAvatar,
          state: 1,
        });
        const _user: User = { ...user };
        _user.conversations = tempConversation;
        setUser(_user);
        setConversations(tempConversation);
        // tempConversation.unshift({
        //   login: data.senderLogin,
        //   avatar: data.senderAvatar,
        //   state: data.state,
        // });

        // const _user: User = { ...user };
        // _user.conversations = undefined;
        // setUser(_user);
        // setConversations([]);
      }
    } else if (selected == 1) {
      const tempGroup = groups;
      const indexOfElementToMove = tempGroup.findIndex(
        (obj: any) => obj.name == data.senderLogin || obj.name == data.receiverLogin,
      );
      const elementToMove = tempGroup[indexOfElementToMove];
      if (indexOfElementToMove != -1) {
        tempGroup.splice(indexOfElementToMove, 1);
        tempGroup.unshift(elementToMove);
        const _user: User = { ...user };
        _user.groups = tempGroup;
        setUser(_user);
        setGroups(tempGroup);
      }
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', recieveMessage);
      return () => socket.off('receive-message');
    }
  }, [chatArea, socket]);

  useEffect(() => {
    if (socket && roomSelected != '') {
      socket.emit('get-messages', {
        senderLogin: user.login,
        receiverLogin: roomSelected,
        isChannel: selected == 1 ? true : false,
      });
      socket.on('get-messages', (data: any) => {
        setChatArea(data);
      });
    } else setChatArea([]);
  }, [roomSelected, socket]);

  useEffect(() => {
    if (selected == 0) {
      setRoomSelected('');
      usersWithConversation();
      setShowArray(conversations);
      setChatArea([]);
    } else if (selected == 1) {
      setRoomSelected('');
      channelsWithConversation();
      setShowArray(groups);
      setChatArea([]);
    } else setShowArray([]);
  }, [selected, user.state, user.conversations, conversations, user.groups, groups]);

  useEffect(() => {
    const conversationDiv: any = messageEl.current;
    if (conversationDiv) {
      conversationDiv.scrollTop = conversationDiv.scrollHeight;
    }
  }, [chatArea]);

  useEffect(() => {
    if ((user.socket as Socket)?.connected) {
      (user.socket as Socket)?.disconnect();
      const _user: User = user;
      _user.socket = null;
      setUser(_user);
    }
  });

  const handleAddToGroup = (login: string) => {
    setOpenInviteModal(false);
    const apiUrl = 'http://localhost:3000/api/atari-pong/v1/channels/add-user-to-channel';
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    };
    axios
      .post(apiUrl, { channelName: roomSelected, user: login }, config)
      .then((response: any) => {
        toast.success(`${login} added to ${roomSelected} successfully!`);
        const indexOfElementToMove = friendList.findIndex((obj: any) => obj.login == login);
        const elementToMove = friendList[indexOfElementToMove];
        elementToMove.state = 'member';
        const tempInviteList = friendList;
        tempInviteList.splice(indexOfElementToMove, 1);
        setFriendList(tempInviteList);
        const tempMembers = [...groupMembers, elementToMove];
        setGroupMembers(tempMembers);
      })
      .catch((error: any) => {
        if (error.response.data) toast.error(error.response.data.message);
      });
  };
  return (
    <OptionBar flag={3}>
      <main className="w-full h-full    flex flex-col items-center  font-Orbitron min-h-[550px]  min-w-[280px] pb-2 px-6  md:px-12  ">
        <div className="w-full h-[8%]  NeonShadow flex justify-start items-center text-base xl:text-3xl ">
          Messages
        </div>
        <div className="w-full  h-auto md:h-[88%] NeonShadowBord flex flex-row items-center  overflow-hidden">
          <div
            className={`h-full ${
              showSideBar ? '' : 'hidden'
            }  sm:block  w-20 md:w-60 2xl:w-96  border-r-[3px] lineshad flex flex-col `}
          >
            <div className="h-16 min-h-16 2xl:h-20  border-b-[3px] lineshad bg-[#36494e] bg-opacity-70">
              <ListBox setSelected={setSelected} setOpenModal={setOpenModal} />
            </div>
            <div className="h-[60vh] w-full flex flex-col pt-2 2xl:pt-4 overflow-y-hidden ">
              <div className=" h-full  overflow-y-auto w-full ">
                {showArray &&
                  showArray.map(
                    (obj: any, index: number) =>
                      !obj.isBlocked && (
                        <button
                          onClick={() => {
                            setRoomSelected(selected == 0 ? obj.login : obj.name);
                            setRoomSelectedType(selected == 1 ? obj.type : 0);
                            setIam(selected == 1 ? obj.whoIam : '');
                            setIsMuted(selected == 1 ? obj.isMuted : false);
                            setUserId(obj.id);
                          }}
                          key={obj.id || `${obj.login}${index}` || `${obj.name}${index}`}
                          className={`w-full h-14 ease-in-out 2xl:h-[68px]  truncate   text-xs 2xl:text-base flex flex-row justify-center md:justify-start space-x-3 2xl:space-x-6 md:pl-5 2xl:pl-7 items-center transition-all duration-500 tracking-wide  ${
                            roomSelected == obj.login || roomSelected == obj.name
                              ? '   md:bg-[#EDEDED] border-[#36494e]  text-black  md:border-b-2   2xl:border-b-4   font-bold  underline-offset-8 '
                              : ' hover:md:border-b-2 hover:2xl:border-b-4 hover:border-[#36494e] '
                          }`}
                        >
                          {selected == 0 ? (
                            <Image
                              src={!obj.avatar ? alien : selected == 0 ? obj.avatarUrl : group}
                              alt="image"
                              width="50"
                              height="50"
                              className={`rounded-full border-2 2xl:border-[3px] w-10 h-10  2xl:w-12 2xl:h-12 border-inherit bg-slate-800 `}
                            />
                          ) : (
                            <Avatar
                              name={obj.name}
                              className="rounded-full border border-inherit"
                              size={'40'}
                            />
                          )}
                          <span className="hidden  text-left pt-1 md:flex flex-col 2xl:-space-y-1">
                            <div className="flex flex-row  items-center justify-between">
                              <h1 className="truncate w-[70%]">
                                {selected == 0 ? obj.login : obj.name}
                              </h1>
                              {selected == 0 && (
                                <PiCircleFill
                                  className={`${
                                    obj.state == 1
                                      ? 'text-green-500 border  border-neutral-500 rounded-full animate-pulse'
                                      : 'text-gray-500'
                                  } `}
                                />
                              )}
                            </div>
                            <h6 className="text-[7px] 2xl:text-[10px] antialiased  truncate w-24 2xl:w-44 overflow-hidden font-normal tracking-normal text-[#484848]">
                              {selected == 0
                                ? obj.state == 1
                                  ? `${obj.login} is available`
                                  : 'Disconnected'
                                : obj.type == 0
                                ? 'Public'
                                : obj.type == 1
                                ? 'Private'
                                : 'Protected'}
                            </h6>
                          </span>
                        </button>
                      ),
                  )}
              </div>
            </div>
          </div>
          <div className="h-full w-full flex flex-col justify-between">
            <div className="h-16  2xl:h-20   border-b-[3px] lineshad flex flex-row justify-between items-center bg-[#36494e] bg-opacity-70">
              <div>
                <BurgButton setFlag={setShowSideBar} val={showSideBar} />
              </div>
              <span className="text-xs md:text-base lg:text-lg truncate e">{roomSelected}</span>
              {roomSelected != '' && (
                <MyMenu
                  slected={selected}
                  setShowArray={setShowArray}
                  setOpenMembers={setOpenMembersModal}
                  roomSelected={roomSelected}
                  setOpenSettings={setOpenSettingModal}
                  setOpenInvite={setOpenInviteModal}
                  channelType={roomSelectedType}
                  iAm={iAm}
                  setRoomSelected={setRoomSelected}
                  userId={userId}
                />
              )}
            </div>
            <div className="  border-yellow-400 h-[60vh] w-full overflow-y-auto flex flex-col-reverse justify-end pb-4">
              <div className="h-auto  overflow-y-auto scroll-smooth" ref={messageEl}>
                {chatArea &&
                  chatArea.map((obj: ChatText, index: number) => (
                    <div key={index} className=" w-full h-auto">
                      <MessageText sender={obj.sender} message={obj.text} selected={selected} />
                    </div>
                  ))}
              </div>
            </div>
            <div
              className={`h-16  2xl:h-20  ${roomSelected != '' ? 'border-t-[3px] lineshad' : ''}  `}
            >
              {roomSelected != '' && !isMuted && (
                <SendMessage SetValue={setMessage} handleClick={handleSend} value={message} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Popup openModal={openModal} setOpenModal={setOpenModal}>
        <div className="h-[10%] w-full flex justify-end items-center pr-3 NeonShadow">
          <AiOutlineClose
            onClick={() => {
              setOpenModal(false);
            }}
            className="cursor-pointer h-7 w-7  lg:h-10 lg:w-10"
          />
        </div>
        <h1 className="h-[10%] w-full font-Orbitron NeonShadow text-base md:text-xl 2xl:text-3xl flex justify-center items-center">
          Add new group
        </h1>
        <form className="h-[75%] flex flex-col  justify-between w-full p-2 sm:p-10 ">
          <div className="h-1/5">
            <SimpleInput
              holder={'Group name'}
              type1={'text'}
              SetValue={setGroupName}
              val={''}
              setError={setError}
              isVerif={false}
            />
          </div>
          <div className="h-1/5 flex justify-around min-h-[45px] items-center overflow-hidden">
            <h1 className="font-Orbitron  text-sm truncate md:text-base 2xl:text-3xl">
              Private group
            </h1>
            <SwitchButton enabled={enabled} setEnabled={setEnabled} />
          </div>
          <div className="h-1/5">
            <SimpleInput
              readonly={enabled}
              holder={'Password (optional)'}
              type1={'password'}
              type2="text"
              icon={seePass}
              icon2={hidePass}
              SetValue={setGroupPassword}
              val={groupPassword}
              flag={true}
              setError={setError}
              isVerif={false}
            />
          </div>
          <div className="h-1/5">
            <SimpleButton content="Add group" buttonType={'submit'} handleClick={addNewGroup} />
          </div>
        </form>
      </Popup>
      <Popup openModal={openMembersModal} setOpenModal={setOpenMembersModal}>
        <div className="h-[10%] w-full flex justify-end items-center pr-3 NeonShadow">
          <AiOutlineClose
            onClick={() => {
              setOpenMembersModal(false);
            }}
            className="cursor-pointer h-7 w-7  lg:h-10 lg:w-10"
          />
        </div>
        <h1 className="h-[10%] w-full font-Orbitron NeonShadow text-base md:text-xl 2xl:text-3xl flex justify-center items-center">
          Group members
        </h1>
        <div className="h-[75%] flex flex-col font-Orbitron  justify-between w-full p-2 sm:p-10">
          <div className=" w-full h-full flex items-center flex-col  mb-8 overflow-x-hidden  overflow-y-auto">
            <ul className="w-full">
              {groupMembers &&
                groupMembers.map((member: any, index: number) => (
                  <li key={member.id || `${member.login}${index}`}>
                    <div className="flex flex-row items-center my-[10px] justify-between">
                      <div className="flex flex-row">
                        <div className="NeonShadowBord h-[60px] w-[60px] flex items-center mr-[10px]">
                          <Image
                            src={member.avatar ? member.avatarUrl : alien}
                            alt="avatar"
                            width="50"
                            height="50"
                            className="h-auto w-auto"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="truncate">{member.login}</span>
                          <p className="text-[12px] text-yellow-400">{member.state}</p>
                        </div>
                      </div>
                      <div className="ml-[30px] ">
                        {((iAm == 'owner' && member.state != 'owner') ||
                          (iAm == 'admin' && member.state == 'member')) && (
                          <DropDown
                            iAm={iAm}
                            memberSelected={member.login}
                            roomSelected={roomSelected}
                            members={groupMembers}
                            setMembers={setGroupMembers}
                            setOpenModal={setOpenMembersModal}
                          />
                        )}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Popup>
      <Popup openModal={openSettingModal} setOpenModal={setOpenSettingModal} flag={true}>
        <div className="h-[10%] w-full flex justify-end items-center pr-3 NeonShadow">
          <AiOutlineClose
            onClick={() => {
              setOpenSettingModal(false);
            }}
            className="cursor-pointer h-7 w-7 "
          />
        </div>
        <h1 className="h-[10%] w-full font-Orbitron NeonShadow text-base md:text-xl 2xl:text-3xl flex justify-center items-center">
          Group settings
        </h1>
        <form className="h-[78%] flex flex-col  justify-between w-full p-2 sm:p-10 ">
          <div className="h-1/5 w-full z-10">
            <div className=" mb-2 lg:mb-4 font-Orbitron  truncate">Change Password :</div>
            <input
              onChange={(e) => setDescripion(e.target.value)}
              placeholder={roomSelectedType == 1 ? 'Group is private' : 'Password'}
              readOnly={roomSelectedType == 1 ? true : false}
              className="h-full min-h-[60px]
               sm:min-h-[70px] p-4 text-sm md:text-lg lg:text-xl font-Orbitron  text-white outline-none placeholder-[#484848] max-h-36 sm:max-h-44 z-10 w-full NeonShadowBord bg-[#272727]"
            />
          </div>
          <div className="h-20 mt-2 z-0">
            <SimpleButton content="Save" buttonType={'submit'} handleClick={handleChangeSettings} />
          </div>
        </form>
      </Popup>
      <Popup openModal={openInviteModal} setOpenModal={setOpenInviteModal}>
        <div className="h-[10%] w-full flex justify-end items-center pr-3 NeonShadow">
          <AiOutlineClose
            onClick={() => {
              setOpenInviteModal(false);
            }}
            className="cursor-pointer h-7 w-7  lg:h-10 lg:w-10"
          />
        </div>
        <h1 className="h-[10%] w-full font-Orbitron NeonShadow text-base md:text-xl 2xl:text-3xl flex justify-center items-center">
          Invite Members
        </h1>
        <div className="h-[75%] flex flex-col font-Orbitron  justify-between w-full p-2 sm:p-10">
          <div className=" w-full flex items-center flex-col  mb-8 overflow-x-hidden  overflow-y-auto">
            <ul className="w-full">
              {friendList &&
                friendList.map((member: any, index: number) => (
                  <li key={member.id || `${member.login}${index}`}>
                    <div className="flex flex-row items-center my-[10px] justify-between">
                      <div className="flex flex-row">
                        <div className="NeonShadowBord h-[60px] w-[60px] flex items-center mr-[10px]">
                          <Image
                            src={member.avatar ? member.avatarUrl : alien}
                            alt="avatar"
                            width="50"
                            height="50"
                            className="h-auto w-auto"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span>{member.login}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToGroup(member.login)}
                        className="mr-5 p-1 text-[20px]"
                      >
                        {iAm != 'member' && (
                          <AiOutlineUserAdd className="md:h-8 md:w-8 md:hover:h-9 md:hover:w-9 focus:outline-none hover:font-extrabold hover:text-cyan-500 duration-500" />
                        )}
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Popup>
    </OptionBar>
  );
}

export default Messages;
