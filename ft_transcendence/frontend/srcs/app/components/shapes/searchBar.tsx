'use client';
import React from 'react';
import { Disclosure } from "@headlessui/react";
import SearchInput from '../inputs/searchInput';
import MenuButton from '../buttons/menuButton';
import Logo from '../../../public/logo.svg';
import SearchLogo from '../../../public/searchLogo.svg';

function SearchBar() {
  return (
    <Disclosure as='search' className="w-full h-full font-Orbitron ">
      {/* <Disclosure.Button className="absolute top-4 right-4 inline-flex items-center peer justify-center rounded-md p-2 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
        Dashboard
      </Disclosure.Button> */}
      <div className='flex h-full'>
        <SearchInput icon={SearchLogo} holder='Search ...' />
      </div>
    </Disclosure>
  );
}

export default SearchBar;