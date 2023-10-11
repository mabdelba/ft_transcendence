'use client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SimpleButton from '../buttons/simpleButton';
import { useEffect, useState } from 'react';
import axios from 'axios';

type newType = {
  state: number;
  login: string;
  reqArray?: string[];
  friendArray?: string[];
  setState?: any;
};

function AddFriend(props: newType) {
  const [flag, setFlag] = useState(false);
  const [userId, setUserId] = useState<any>(null);

  const requestSended = () =>{

    const url = "http://localhost:3000/api/atari-pong/v1/friend/getuserbylogin";
    const token = localStorage.getItem('jwtToken');
		const conf = {
			headers: { Authorization: `Bearer ${token}` },
		};
    axios
    .post(url, { userLogin: props.login }, conf)
    .then((response) => {
      setUserId(response.data.id);
      // console.log('asidi hak l id dyalk', response.data.id);
    })
    .catch((error) => {
      console.log('error ', error);
    });
    
    if(props.state == 3)
      setFlag(true);
  }

  useEffect(()=> {
    requestSended();
  }, [props.state]);

  const handleAdd = () => {
    
		const url = 'http://localhost:3000/api/atari-pong/v1/friend/send-friend-request';
		const token = localStorage.getItem('jwtToken');
		const conf = {
			headers: { Authorization: `Bearer ${token}` },
		};
		axios
			.post(url, { recieverId: userId }, conf)
			.then((response) => {
				console.log('response ', response);
			})
			.catch((error) => {
				console.log('error ', error);
			});
    setFlag(true);
  };

  const handleDelete = () => {
   
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
    toast.error(`Friend request from ${props.login} has been deleted!`, {
      position: 'top-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    props.setState(0);
  };
  const handleAccept = () => {
    
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
    toast.success(`New friend ${props.login} added successfully!`, {
      position: 'top-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
    props.setState(1);
  };
  const [profile, setProfile] = useState<any>({firstName: 'loading', lastName: 'loading', login: '', level:0, matchPlayed: 0,
  winPercent: 50,
  numberOfGamesPlayed: 0,
  numberOfGamesWon: 0,
  state: 0,
});

  const getUserData = async () => {

    const url = 'http://localhost:3000/api/atari-pong/v1/user/me';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const user = await axios.post(url, { userLogin: props.login }, config);
    setProfile(user.data);
  }

  useEffect(()=> {

    getUserData();
  }, [props.login]);
  return (
    <div className="h-full w-full NeonShadowBord flex flex-col ">
      <div
        className={`w-full ${
          (props.state == 1)? 'h-1/5' : 'h-1/2'
        } flex justify-center items-center text-xs  xl:text-xl`}
      >
        {(props.state == 0 || props.state == 3)
          ? `Add ${props.login} to your friends list!`
          : props.state == 2
          ? `You have a friend request from ${props.login} :`
          : 'All time stats'}
      </div>
      <div
        className={`w-full ${
          props.state == 1 ? 'h-4/5' : 'h-1/2'
        }   flex justify-center items-start`}
      >
        {(props.state == 0 || props.state == 3) ? (
          <div className="w-1/2 h-[50%]" onClick={handleAdd}>
            {!flag ? (
              <SimpleButton content="Add friend" buttonType="button" />
            ) : (
              <div className="bg-[#272727] hover:cursor-pointer redShadowBord text-[#00B2FF] blueShadow  transition-all duration-500 text-sm md:text-lg lg:text-xl h-full w-full  font-Orbitron flex justify-center items-center">
                Requested
              </div>
            )}
          </div>
        ) : props.state == 2 ? (
          <div className="w-[70%] h-[50%] flex flex-row items-start justify-around space-x-3">
            <SimpleButton buttonType="button" content="Accept" handleClick={handleAccept} />
            <SimpleButton buttonType="button" content="Delete" handleClick={handleDelete} />
          </div>
        ) : (
          <div className="w-[70%] h-[90%] flex flex-col justify-center space-y-4 text-xs md:text-base xl:text-xl">
            <div className="flex flex-row justify-between">
              Matches played
              <div>{profile.numberOfGamesPlayed}</div>
            </div>
            <div className="flex flex-row justify-between">
              Matches won
              <div>{profile.numberOfGamesWon}</div>
            </div>
            <div className="flex flex-row justify-between">
              Matches lost
              <div>{profile.numberOfGamesPlayed - profile.numberOfGamesWon}</div>
            </div>
            <div className="flex flex-row justify-between">
              Level
              <div>{profile.level}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddFriend;
