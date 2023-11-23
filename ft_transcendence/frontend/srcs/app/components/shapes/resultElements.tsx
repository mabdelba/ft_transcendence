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
  users: UserData[];
  channels: UserData[];
}

function ResultElements (props : SearchBarProps)
{

  return (
    <div className="z-10 fixed m-1 pb-2 NeonShadowBord font-Orbitron NeonShadow h-fit w-[calc(100%-8px)] sm:w-[50%] bg-[#101622] cursor-pointer">
      {
        props.users
        && props.users.length > 0
        && <div className='mx-8 mt-4 font-bold'>Users</div>
      }
      {
        props.users
        && props.users.length > 0
        && props.users.map((results, id) => {
          return (
            <SearchResult result={results.login} key={id} type={false} isMember={false} channelType={0} />
          );
        })
      }
      {
        props.channels &&
        props.channels.length > 0 &&
        !props.channels.every((channel) => channel.isMember === true)
        && <div className='mx-8 mt-4 font-bold'>Channels</div>
      }
      {
        props.channels
        && props.channels.length > 0
        && !props.channels.every((channel) => channel.isMember === true)
        && props.channels.map((results, id) => {
          return (
            (results.isMember === false &&
            <SearchResult result={results.name} key={id} type={true} isMember={results.isMember} channelType={results.type} />)
          );
        })
      }
    </div>
  );
}

export default ResultElements;