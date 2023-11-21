'use client';
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { Disclosure } from "@headlessui/react";
import MenuButton from '../buttons/menuButton';
import Logo from '../../../public/logo.svg';
import SearchLogo from '../../../public/searchLogo.svg';

interface UserData {
  id: number;
  username: string;
}

interface SearchBarProps {
  setResults: React.Dispatch<React.SetStateAction<UserData[]>>;
}

function SearchBar (prop : SearchBarProps)
{
  const [input, setInput] = useState("");
  const fetchUsers = async () => {
    const apiUrl = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const res = await fetch(apiUrl, config);
    return res.json();
  };
  const fetchData = async (value: string) => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const json: UserData[] = await response.json();

      const results = json.filter((user) => {
        return (
          value &&
          user &&
          user.username &&
          user.username.toLowerCase().includes(value)
        );
      });
      prop.setResults(results);
    } catch (error) {
      console.log("No apparent user:", error);
    }
  };

  const handleChanges = (value: string) => {
    setInput(value);
    fetchData(value);
  }

  return (
    <Disclosure as='search' className="w-full h-full font-Orbitron ">
      <div className='flex h-full'>
        <div className='min-h-full w-full h-full'>
          <div className='flex h-[97%] w-full'>
            <Image className='' src={SearchLogo} alt="logo" />
            <div className='w-[100%]'>
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