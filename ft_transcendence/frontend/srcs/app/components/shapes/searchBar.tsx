'use client';
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { Disclosure } from "@headlessui/react";
import MenuButton from '../buttons/menuButton';
import Logo from '../../../public/logo.svg';
import SearchLogo from '../../../public/searchLogo.svg';
import { type } from 'os';

interface UserData {
  name: string;
  type: number;
  isMember: boolean;
  id: number;
  login: string;
}

interface SearchBarProps {
  setUsersResults: React.Dispatch<React.SetStateAction<UserData[]>>;
  setChannelsResults: React.Dispatch<React.SetStateAction<UserData[]>>;
}

function SearchBar (prop : SearchBarProps)
{
  const [input, setInput] = useState("");
  const fetchUsers = async () => {
    const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/all-users';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const res = await fetch(apiUrl, config);
    return res.json();
  };

  const fetchChannels = async () => {
    const apiUrl = 'http://localhost:3000/api/atari-pong/v1/channels/list-all-channels';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const res = await fetch(apiUrl, config);
    return res.json();
  };

  const fetchData = async (value: string) => {
    try {
      value = value.toLowerCase();
      const [users, channels] = await Promise.all([fetchUsers(), fetchChannels()]);
      const usersResults = users.filter((user: any) => {
        return (
          value &&
          user &&
          user.login &&
          user.login.toLowerCase().startsWith(value)
        );
      });
      const channelsResults = channels.filter((channel: any) => {
        return (
          value &&
          channel &&
          channel.name.toLowerCase().startsWith(value)
        );
      });
      prop.setUsersResults(usersResults);
      prop.setChannelsResults(channelsResults);
    } catch (error) {
      console.log("No apparent user:", error);
    }
  };

  const handleChanges = (value: string) => {
    setInput(value);
    fetchData(value);
  }

  const fetchAll = async () => {
    try {
      const [users, channels] = await Promise.all([fetchUsers(), fetchChannels()]);
      prop.setUsersResults(users);
      prop.setChannelsResults(channels);
    } catch (error) {
      console.log("No apparent user:", error);
    }
  }

  return (
    <Disclosure as='search' className="w-full h-full font-Orbitron ">
      <div className='flex h-full'>
        <div className='min-h-full w-full h-full'>
          <div className='flex h-[97%] w-full'>
            <Image className='' src={SearchLogo} alt="logo" />
            <div className='w-[100%]'>
              {fetchAll}
              <input
              placeholder='Search ...'
              className="pl-2  md:text-lg lg:text-xl h-full w-full bg-transparent text-white outline-none placeholder-[rgba(255, 255, 255, 0.50);] text-sm focus:bg-opacity-5 transition-all duration-500"
              type="text"
              value={input}
              onChange={(e) => handleChanges(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}

export default SearchBar;