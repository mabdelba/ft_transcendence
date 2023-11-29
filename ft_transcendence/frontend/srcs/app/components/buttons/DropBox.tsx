'use client';
import { Menu, Transition } from '@headlessui/react';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { AiOutlinePlus } from 'react-icons/ai';
import { ImBlocked } from 'react-icons/im';
import { BsFillEyeFill } from 'react-icons/bs';
import { GiGamepad } from 'react-icons/gi';
import { FiSettings } from 'react-icons/fi';
import { TbLogout2 } from 'react-icons/tb';
import { MdGroups2, MdDelete } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { SocketContext, User, context } from '../../../context/context';
import { toast } from 'react-toastify';
import { channel } from 'diagnostics_channel';
import axios from 'axios';

function MyMenu(props: {
  slected: number;
  setOpenMembers: any;
  setOpenSettings: any;
  setOpenInvite: any;
  roomSelected: string;
  iAm?: string;
  channelType?: number;
  setShowArray: any;
  setRoomSelected: any;
  userId: number;
}) {
  const { user, setUser } = useContext(context);
  const { socket } = useContext(SocketContext);

  const handleLeave = () => {
    if (socket) {
      socket.emit('remove-user-from-channel', {
        channelName: props.roomSelected,
        myLogin: user.login,
      });
      const _user: User = user;
      // console.log('props.roomSelectd: ', props.roomSelected)
      const index = _user.groups.findIndex((obj: any) => obj.name == props.roomSelected);
      // console.log('index ', index);
      if (index != -1) {
        // props.setShowArray([]);
        props.setRoomSelected('');
        const tempGroup = _user.groups;
        tempGroup.splice(index, 1);
        toast.warning(`You left ${props.roomSelected}`);
        _user.groups = tempGroup;
        setUser(_user);
      }
    }
  };

  const blockFriend = () => {
    const _user: User = user;
    const index = _user.conversations.findIndex((obj: any) => obj.login == props.roomSelected);
    if (index != -1) {
      const newBlocked = _user.conversations[index];
      props.setRoomSelected('');
      const tempConv = _user.conversations;
      tempConv.splice(index, 1);
      toast.error(`You have blocked ${props.roomSelected}`);
      _user.conversations = tempConv;
      _user.groups = undefined;
      if (_user.blockedList != undefined) _user.blockedList.push(newBlocked);
      const indexF = _user.friendList?.findIndex((obj: any) => obj.login == props.roomSelected);
      if (indexF != -1) {
        const temFiend = _user.friendList;
        temFiend?.splice(indexF, 1);
        _user.friendList = temFiend;
      }
      setUser(_user);
    }

    const url = 'http://localhost:3000/api/atari-pong/v1/friend/block-user';
    const token = localStorage.getItem('jwtToken');
    const conf = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .post(url, { userId: props.userId }, conf)
      .then((response) => {
        // console.log('response ', response);
      })
      .catch((error) => {
        // console.log('error ', error);
      });
  };

  const router = useRouter();
  const removeChannel = () => {
    if (socket) {
      socket.emit('remove-channel', { channelName: props.roomSelected, user: user.login });
      const _user: User = user;
      // console.log('props.roomSelectd: ', props.roomSelected)
      const index = _user.groups.findIndex((obj: any) => obj.name == props.roomSelected);
      // console.log('index ', index);
      if (index != -1) {
        // props.setShowArray([]);
        props.setRoomSelected('');
        const tempGroup = _user.groups;
        tempGroup.splice(index, 1);
        toast.warning(`You have deleted  ${props.roomSelected}`);
        _user.groups = tempGroup;
        setUser(_user);
      }
    }
  };

  const handleInvite = () => {
    // userToInvite => props.roomSelected
    const _user: User = user;
    _user.gameType = 'private';
    _user.opponent = props.roomSelected;
    setUser(_user);
    router.push('/queue');
  };

  const friendMenu = [
    {
      handleClick: () => {
        props.roomSelected != '' && router.push(`/profil/${props.roomSelected}`);
      },
      label: 'View profile',
      render: () => {
        return <BsFillEyeFill size="20" />;
      },
    },
    {
      handleClick: blockFriend,
      label: 'Block',
      render: () => {
        return <ImBlocked size="20" />;
      },
    },
    {
      handleClick: handleInvite,
      label: 'Invite for a match',
      render: () => {
        return <GiGamepad size="20" />;
      },
    },
  ];

  const GroupMenu = [
    {
      handleClick: () => {
        props.setOpenSettings(true);
      },
      label: 'Group settings',
      render: () => {
        return <FiSettings size="20" />;
      },
    },
    {
      handleClick: handleLeave,
      label: 'Leave',
      render: () => {
        return <TbLogout2 size="20" />;
      },
    },
    {
      handleClick: () => {
        props.setOpenMembers(true);
      },
      label: 'Group Members',
      render: () => {
        return <MdGroups2 size="20" />;
      },
    },
    {
      handleClick: () => {
        props.setOpenInvite(true);
      },
      label: 'Invite members',
      render: () => {
        return <AiOutlinePlus size="20" />;
      },
    },
  ];
  const [links, setLinks] = useState(friendMenu);

  useEffect(() => {
    if (props.slected == 0) setLinks(friendMenu);
    else if (props.slected == 1 && props.iAm != '') {
      // console.log('roomSelected: ', props.roomSelected);
      // console.log("channelType: ", props.channelType);
      // console.log("iAm: ", props.iAm);
      // console.log("GroupMenu: ", GroupMenu);
      if (props.iAm == 'owner') {
        GroupMenu[1].label = 'Delete';
        GroupMenu[1].render = () => {
          return <MdDelete size="20" />;
        };
        GroupMenu[1].handleClick = removeChannel;
      } else if (props.iAm == 'member' && props.channelType != 0) GroupMenu.splice(3, 1);
      if (props.iAm != 'owner') GroupMenu.splice(0, 1);
      setLinks(GroupMenu);
    } else setLinks([]);
  }, [props.slected, props.roomSelected, props.iAm]);

  return (
    <div className="">
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md  px-4 py-2 text-sm font-medium focus:outline-none ">
                <ChevronUpIcon
                  className={`${!open ? 'rotate-180 transform ' : ''} h-5 w-5  2xl:h-8 2xl:w-8 `}
                />
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
                  {links &&
                    links.map((link: any, index: number) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <button
                            onClick={link.handleClick}
                            className={` w-full h-14 relative border-b-2  cursor-pointer select-none flex flex-row items-center justify-center space-x-2  ${
                              active ? 'bg-white text-black' : 'text-white'
                            }`}
                          >
                            {/* {(link.label == 'Invite for a match'|| link.label == 'Invite members') && <AiOutlinePlus size="23" />} */}
                            {link.render()}
                            <h1>{link.label}</h1>
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
}

export default MyMenu;
