'use client';
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { Disclosure } from "@headlessui/react";
// import SearchInput from '../inputs/searchInput';
import MenuButton from '../buttons/menuButton';
import Logo from '../../../public/logo.svg';
import SearchLogo from '../../../public/searchLogo.svg';

function SearchBar ({ setResults } : any)
{
  const [input, setInput] = useState("");

  const fetchData = (value: string) => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user: any) => {
          return (
            value &&
            user &&
            user.name &&
            user.name.toLowerCase().includes(value)
          );
        });
        // setResults(results);
      });
  };

  const handleChanges = (value: string) => {
    setInput(value);
    fetchData(value);
  }

  return (
    <Disclosure as='search' className="w-full h-full font-Orbitron ">
      {/* <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
        Dashboard
      </Disclosure.Button> */}

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