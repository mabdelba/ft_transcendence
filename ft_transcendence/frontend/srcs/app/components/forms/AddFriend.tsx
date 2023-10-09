'use client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SimpleButton from '../buttons/simpleButton';
import { useState } from 'react';

type newType = {
  state: number;
  login: string;
  reqArray?: string[];
  friendArray?: string[];
  setState?: any;
};

function AddFriend(props: newType) {
  const [flag, setFlag] = useState(false);

  const handleAdd = (e: any) => {
    e.preventDefault();
    setFlag(true);
  };
  const handleDelete = (e: any) => {
    e.preventDefault();
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
  const handleAccept = (e: any) => {
    e.preventDefault();
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
    props.setState(2);
  };

  return (
    <div className="h-full w-full NeonShadowBord flex flex-col ">
      <div
        className={`w-full ${
          props.state == 2 ? 'h-1/5' : 'h-1/2'
        } flex justify-center items-center text-xs  xl:text-xl`}
      >
        {props.state == 0
          ? `Add ${props.login} to your friends list!`
          : props.state == 1
          ? `You have a friend request from ${props.login} :`
          : 'All time stats'}
      </div>
      <div
        className={`w-full ${
          props.state == 2 ? 'h-4/5' : 'h-1/2'
        }   flex justify-center items-start`}
      >
        {props.state == 0 ? (
          <div className="w-1/2 h-[50%]" onClick={handleAdd}>
            {!flag ? (
              <SimpleButton content="Add friend" buttonType="button" />
            ) : (
              <div className="bg-[#272727] redShadowBord text-[#00B2FF] blueShadow  transition-all duration-500 text-sm md:text-lg lg:text-xl h-full w-full  font-Orbitron flex justify-center items-center">
                Requested
              </div>
            )}
          </div>
        ) : props.state == 1 ? (
          <div className="w-[70%] h-[50%] flex flex-row items-start justify-around space-x-3">
            <SimpleButton buttonType="button" content="Accept" handleClick={handleAccept} />
            <SimpleButton buttonType="button" content="Delete" handleClick={handleDelete} />
          </div>
        ) : (
          <div className="w-[70%] h-[90%] flex flex-col justify-center space-y-4 text-xs md:text-base xl:text-xl">
            <div className="flex flex-row justify-between">
              Matches played
              <div>17</div>
            </div>
            <div className="flex flex-row justify-between">
              Matches won
              <div>10</div>
            </div>
            <div className="flex flex-row justify-between">
              Matches lost
              <div>7</div>
            </div>
            <div className="flex flex-row justify-between">
              Total achievements
              <div>9</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddFriend;
