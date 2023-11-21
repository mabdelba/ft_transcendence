'use client';
import { useCallback, useContext, useEffect, useRef, useState, Fragment, MouseEventHandler } from 'react';
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

type ChatText = {
  sender: string;
  receiver: string;
  id: number;
  text: string;
};

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

  const handleImage = (e: any) => {
    setFilename(e.target.files[0].name);
    setAvatarToUpload(e.target.files[0]);
  };

  useEffect(() => {
    if (selected == 1 && roomSelected != '') {
      setIam('');
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
          setIam(response.data.iAm);
          response.data.owner.state = 'owner';
          const url : any = `http://localhost:3000/avatars/${response.data.owner.login}.jpg`
          const res = await fetch(url);
          const blob = await res.blob();
          const imageBlob = URL.createObjectURL(blob) as string;
          if(response.data.owner.avatar)
            response.data.owner.avatar = imageBlob;
          response.data.admins.forEach( async (obj: any) => {
            obj.state = 'admin';
            const url : any = `http://localhost:3000/avatars/${obj.login}.jpg`
            const res = await fetch(url);
            const blob = await res.blob();
            const imageBlob = URL.createObjectURL(blob) as string;
            if(obj.avatar)
              obj.avatar = imageBlob;
          });
          response.data.members.forEach(async (obj: any) => {
            obj.state = 'member';
            const url : any = `http://localhost:3000/avatars/${obj.login}.jpg`
            const res = await fetch(url);
            const blob = await res.blob();
            const imageBlob = URL.createObjectURL(blob) as string;
            if(obj.avatar)
              obj.avatar = imageBlob;
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
            { name: groupName, ownerLogin: user.login, type: groupType },
          ];
          setGroups(tempGroup);
          const _user: User = { ...user, groups: tempGroup };
          setUser(_user);
        })
        .catch();
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
          response.data.forEach(async (obj: any)=> {
            const url : any = `http://localhost:3000/avatars/${obj.login}.jpg`
            const res = await fetch(url);
            const blob = await res.blob();
            const imageBlob = URL.createObjectURL(blob) as string;
            if(obj.avatar)
              obj.avatar = imageBlob;
          } )
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
    if (message != '') {
      socket.emit('send-message', {
        isChannel: selected == 1 ? true : false,
        senderLogin: user.login,
        receiverLogin: roomSelected,
        text: message,
        senderAvatar: user.avatar,
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

  const channelsWithConversation = async () => {
    if (socket) {
      if (!user.groups) {
        const _user: User = user;
        if (!user.state) {
          socket.emit('online', { token: localStorage.getItem('jwtToken') });
          _user.state = 1;
          setUser(_user);
        }
        socket.emit('channels-with-conversation', { channelName: user.login || 'mabdelba' });
        socket.on('get-channels', (data: any) => {
          setGroups(data);
          _user.groups = data;
          setUser(_user);
        });
      } else setGroups(user.groups);
    }
  };
  const usersWithConversation = async () => {
    if (socket) {
      if (!user.conversations || (user.conversations.length == 1 && user.conversations.isFrd)) {
        const _user: User = { ...user };
        if (!user.state) {
          socket.emit('online', { token: localStorage.getItem('jwtToken') });
          _user.state = 1;
          setUser(_user);
        }
        socket.emit('users-with-conversation', { login: user.login || 'mabdelba' });
        socket.on('get-users', (data: any) => {
          data.map(async (obj: any) =>
            { 
              const url : any = `http://localhost:3000/avatars/${obj.login}.jpg`
              const res = await fetch(url);
              const blob = await res.blob();
              const imageBlob = URL.createObjectURL(blob) as string;
              if(obj.avatar)
                obj.avatar = imageBlob;
            }
          
          );
          if (user.conversations) {
            data.map((obj: any) => {
              if (obj.login != _user.conversations[0].login)
                _user.conversations = [..._user.conversations, obj];
            });
          } else _user.conversations = data;
          setUser(_user);
          setConversations(_user.conversations);
        });
      } else setConversations(user.conversations);
    }
  };
  // const [friendList, setFriendList] = useState(user.friendList);

  function recieveMessage(data: any) {
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
        tempConversation.unshift({
          login: data.senderLogin,
          avatar: data.senderAvatar,
          state: data.state,
        });
        const _user: User = { ...user };
        _user.conversations = tempConversation;
        setUser(_user);
        setConversations(tempConversation);
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
        senderLogin: user.login || 'mabdelba',
        receiverLogin: roomSelected,
        isChannel: selected == 1 ? true : false,
      });
      socket.on('get-messages', (data: any) => {
        setChatArea(data);
      });
    } else setChatArea([]);
  }, [roomSelected, socket]);

  useEffect(() => {
    selected == 0
      ? (setShowArray(conversations),
        setRoomSelected(conversations.length == 0 ? '' : conversations[0].login))
      : selected == 1
      ? (setShowArray(groups), setRoomSelected(groups.length == 0 ? '' : groups[0].name))
      : setShowArray([]);
    if (selected == 0) usersWithConversation();
    else if (selected == 1) channelsWithConversation();
  }, [selected, user.state, user.conversations, conversations, user.groups, groups]);

  useEffect(() => {
    const conversationDiv: any = messageEl.current;
    if (conversationDiv) {
      conversationDiv.scrollTop = conversationDiv.scrollHeight;
    }
  }, [chatArea]);

  const handleAddToGroup  = ( login: string) => {

    const apiUrl = "http://localhost:3000/api/atari-pong/v1/channels/add-user-to-channel";
    const config =   {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    };
    axios.post(apiUrl, {channelName : roomSelected, user : login}, config)
    .then((response: any)=> {
      toast.success(`${login} added to ${roomSelected} successfully!`);
      let indexOfElementToMove = friendList.findIndex((obj: any) => obj.login == login);
      let elementToMove = friendList[indexOfElementToMove];
      elementToMove.state = 'member';
      const tempInviteList = friendList;
      tempInviteList.splice(indexOfElementToMove, 1);
      setFriendList(tempInviteList);
      const tempMembers = [...groupMembers, elementToMove];
      setGroupMembers(tempMembers);

    })
    .catch((error : any) => {
      if(error.response.data)
      toast.error(error.response.data.message);
    })

  }
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
                    (obj: any) =>
                      !obj.isBlocked && (
                        <button
                          onClick={() => {
                            setRoomSelected(selected == 0 ? obj.login : obj.name);
                          }}
                          key={selected == 0 ? obj.login : obj.channelName}
                          className={`w-full h-14 ease-in-out 2xl:h-[68px]  truncate   text-xs 2xl:text-base flex flex-row justify-center md:justify-start space-x-3 2xl:space-x-6 md:pl-5 2xl:pl-7 items-center transition-all duration-500 tracking-wide  ${
                            roomSelected == obj.login || roomSelected == obj.name
                              ? '   md:bg-[#EDEDED] border-[#36494e]  text-black  md:border-b-2   2xl:border-b-4   font-bold  underline-offset-8 '
                              : ' hover:md:border-b-2 hover:2xl:border-b-4 hover:border-[#36494e] '
                          }`}
                        >
                          {
                            <Image
                              src={
                                 !obj.avatar || obj.avatar == `public/avatars/${obj.login}.jpg`
                                  ? alien
                                  : selected == 0
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
                              <h1 className="truncate w-[70%]">
                                {selected == 0 ? obj.login : obj.name}
                              </h1>
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
                  setOpenMembers={setOpenMembersModal}
                  roomSelected={roomSelected}
                  setOpenSettings={setOpenSettingModal}
                  setOpenInvite={setOpenInviteModal}
                />
              )}
            </div>
            <div className="  border-yellow-400 h-[60vh] w-full overflow-y-auto flex flex-col-reverse justify-end pb-4">
              <div className="h-auto  overflow-y-auto scroll-smooth" ref={messageEl}>
                {chatArea &&
                  chatArea.map((obj: ChatText) => (
                    <div key={obj.id} className=" w-full h-auto">
                      <MessageText sender={obj.sender} message={obj.text} selected={selected} />
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
                  <li key={index}>
                    <div className="flex flex-row items-center my-[10px] justify-between">
                      <div className="flex flex-row">
                        <div className="NeonShadowBord h-[60px] w-[60px] flex items-center mr-[10px]">
                          <Image
                            src={
                              !member.avatar ||
                              member.avatar == `public/avatars/${member.login}.jpg`
                                ? alien
                                : member.avatar
                            }
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
                      <div className="ml-[30px]">{((iAm == 'owner' && member.state != 'owner') || (iAm == 'admin' && member.state == 'member')) && <DropDown />}</div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Popup>
      <Popup openModal={openSettingModal} setOpenModal={setOpenSettingModal}>
        <div className="h-[10%] w-full flex justify-end items-center pr-3 NeonShadow">
          <AiOutlineClose
            onClick={() => {
              setOpenSettingModal(false);
            }}
            className="cursor-pointer h-7 w-7  lg:h-10 lg:w-10"
          />
        </div>
        <h1 className="h-[10%] w-full font-Orbitron NeonShadow text-base md:text-xl 2xl:text-3xl flex justify-center items-center">
          Group settings
        </h1>
        <form className="h-[78%] flex flex-col  justify-between w-full p-2 sm:p-10 ">
          <div className="h-1/5 w-full z-10">
            <textarea
              onChange={(e) => setDescripion(e.target.value)}
              placeholder="Group description"
              className="h-full min-h-[60px]
               sm:min-h-[70px] p-4 text-sm md:text-lg lg:text-xl font-Orbitron  text-white outline-none placeholder-[#484848] max-h-36 sm:max-h-44 z-10 w-full NeonShadowBord bg-[#272727]"
            />
          </div>
          <div className="h-1/5 z-0">
            <div className="mb-1 font-Orbitron lg:mb-4 truncate">
              Group avatar : <span className="text-cyan-400 truncate">{fileName}</span>
            </div>
            <input onChange={handleImage} type="file" id="files" className="hidden" />
            <label htmlFor="files">
              <UploadAvatar content="Upload avatar" icon2={BlackUpload} icon={Upload} />
            </label>
          </div>
          <div className="h-1/5 z-0">
            <SimpleButton content="Save" buttonType={'submit'} handleClick={() => {}} />
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
                  <li key={index}>
                    <div className="flex flex-row items-center my-[10px] justify-between">
                      <div className="flex flex-row">
                        <div className="NeonShadowBord h-[60px] w-[60px] flex items-center mr-[10px]">
                          <Image
                            src={
                              member.avatar && member.avatar != `public/avatars/${member.login}.jpg`
                                ? member.avatar
                                : alien
                            }
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
                      <button onClick={()=> handleAddToGroup(member.login)} className="mr-5 p-1 text-[20px]">
                        {
                          (iAm != 'member') &&
                          <AiOutlineUserAdd className="md:h-8 md:w-8 md:hover:h-9 md:hover:w-9 focus:outline-none hover:font-extrabold hover:text-cyan-500 duration-500" />
                        }
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
