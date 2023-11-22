'use client';
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { Disclosure } from "@headlessui/react";
// import SearchInput from '../inputs/searchInput';
import SearchResult from './searchResult';

interface UserData {
  name: string;
  type: number;
  isMember: boolean;
  id: number;
  login: string;
}

type SearchBarProps = {
  players: UserData[];
}

function ResultElements (props : SearchBarProps)
{

  return (
    <div className="fixed m-1 NeonShadowBord font-Orbitron NeonShadow h-fit w-[calc(100%-8px)] sm:w-[50%] bg-[#101622] cursor-pointer">

      {
        props.players.map((results, id) => {
          return (
            <SearchResult result={results.login} key={id} />
          );
        })
      }
    </div>
  );
}

export default ResultElements;