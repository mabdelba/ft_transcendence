'use client';
import { useContext, useEffect, useState } from 'react';
import OptionBar from '../components/forms/OptionBar';
import ListBox from '../components/buttons/ListBox';
import { User, context, SocketContext } from '../../context/context';
import BurgButton from '../components/shapes/burgButton';
import MyMenu from '../components/buttons/DropBox';
import alien from '../../public/alien.svg';
import Image from 'next/image';
import group from '../../public/friends.svg';
import SendMessage from '../components/inputs/SendMessage';
import {PiCircleFill} from 'react-icons/pi'
import axios from 'axios';
import MessageText from '../components/shapes/MessageText'


const path = `/goinfre/mabdelba/ft_transcendence/ft_transcendence/backend/srcs/public/avatars/`;
const friendList = [{login: 'waelhamd', id:1, avatar: `${path}waelhamd.jpg`}, {login: 'ozahid', id:3, avatar: `${path}ozahid.jpg`},
	{login: 'mo9atil', id:2, avatar: `${path}mo9atil.jpg`}, {login: 'mlahlafi', id:5, avatar: `${path}mlahlafi.jpg`}];
const Groups = [{login: '#Group one', id: 777, avatar : ''}, {login:'Group two', id:778,  avatar : ''}, {login:'&Group three', id:98,  avatar : ''}];

const chatText = [{sender: 'mabdelba', receiver: 'waelhamd', id: 1, text: 'Salut Cava'},
{sender: 'mabdelba', receiver: 'waelhamd', id: 2, text: '?'},
{sender: 'waelhamd', receiver: 'mabdelba', id: 3, text: 'Lhamdoulah toi'},
{sender: 'mabdelba', receiver: 'waelhamd', id: 4, text: 'Lhamdoulah'}]

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
  const [showArray, setShowArray] = useState<any>([]);
  const [roomSelected, setRoomSelected] = useState(friendList[0].login);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<any>(null);

  const handleSend = (e: any) => {
	e.preventDefault();
	// alert(`message to ${roomSelected} : ${message}`);
	setMessage('');
  };

  const usersWithConversation = async () => {
	
	if(socket)
	{if(!user.conversations){
		const _user: User = {...user}

		if (!user.state) {
			socket.emit('online', { token: localStorage.getItem('jwtToken') });
			_user.state = 1;
			setUser(_user);
		}
	  	socket.emit('users-with-conversation', { login: user.login });
	  	socket.on('get-users', (data: any) => {
		console.log('users ===== ', data);
		data.map((obj:any) => (
			getImageByLogin(obj.login).then((image) => {
				obj.avatar = image;
			})
		));
		_user.conversations = data;
		setUser(_user);
		setConversations(data);
	  });
	} 
	else 
		setConversations(user.conversations);}
  };
  // const [friendList, setFriendList] = useState(user.friendList);

  useEffect(() => {
	if(conversations)
	{	
		selected == 0
		? (setShowArray(conversations), setRoomSelected(conversations[0].login))
		: selected == 1
		? (setShowArray(Groups), setRoomSelected(Groups[0].login))
		: setShowArray([]);
	}
	usersWithConversation();
  }, [selected, user.state, user.conversations, conversations]);

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
			  <ListBox setSelected={setSelected} />
			</div>
			<div className="h-auto w-full grid grid-cols-1 pt-2 2xl:pt-4">
			  {showArray.map((obj: any) => (
				<button
				  onClick={() => {
					setRoomSelected(obj.login);
				  }}
				  key={obj.id}
				  className={`h-14 ease-in-out 2xl:h-[68px]  truncate rounded-br-full rounded-tr-full rounded-bl-full text-xs 2xl:text-base flex flex-row justify-center md:justify-start space-x-3 2xl:space-x-6 md:pl-5 2xl:pl-7 items-center transition-all duration-500 tracking-wide  ${
					roomSelected == obj.login
					  ? ' text-[#FF184F]  hover:bg-[#EDEDED]  border-[#FF184F] md:border-b-2   2xl:border-b-4   font-bold  underline-offset-8 '
					  : ' hover:bg-[#EDEDED] hover:text-black hover:border-[#00B2FF] hover:blueShadow '
				  }`}
				>
					{  
					<Image
					src={(selected == 0  &&  obj.avatar && obj.avatar != `public/avatars/${obj.login}.jpg` ) ?  obj.avatar :  group}
					alt="image"
					width="50"
					height="50"
					className={`rounded-full border-2 2xl:border-[3px] w-10 h-10  2xl:w-12 2xl:h-12 border-inherit bg-slate-800 `}
				  />}
				  <span className="hidden  text-left pt-1 md:flex flex-col 2xl:-space-y-1">
					<div className='flex flex-row  items-center justify-between'>
						<h1>{obj.login}</h1>
						<PiCircleFill className={`${obj.state == 1 ? 'text-green-500 border  border-neutral-500 rounded-full animate-pulse' : 'text-gray-500'} `}/>
					</div>
					<h6 className="text-[7px] 2xl:text-[10px] antialiased  truncate w-24 2xl:w-44 overflow-hidden font-normal tracking-normal text-[#484848]">
				  		hello from {obj.login}, how are you ?
					</h6>
				  </span>
				</button>
			  ))}
			</div>
		  </div>
		  <div className="h-full w-full flex flex-col justify-between">
			<div className="h-16  2xl:h-20   border-b-[3px] lineshad flex flex-row justify-between items-center bg-[#36494e] bg-opacity-70">
			  <div>
				<BurgButton setFlag={setShowSideBar} val={showSideBar} />
			  </div>
			  <span className="text-base lg:text-lg">{roomSelected}</span>
			  <MyMenu slected={selected} />
			</div>
			<div className='  border-yellow-400 h-[60vh] w-full overflow-y-auto flex flex-col justify-end'>
				<div className='border-2  h-auto'>
					<MessageText sender='mabdelba' message='salam alikom mohamed abdelbar too large a si mohamed'/>
				</div>
			</div>
			<div className="h-16  2xl:h-20  border-t-[3px] lineshad">
			  <SendMessage SetValue={setMessage} handleClick={handleSend} value={message} />
			</div>
		  </div>
		</div>
	  </main>
	</OptionBar>
  );
}

export default Messages;
