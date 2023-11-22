'use client';
import React from 'react';

type SearchBarProps = {
    result: string;
    key: number;
}

function SearchResult(props: SearchBarProps)
{
  return (
    <div
      className="m-1 hover:bg-black p-2 pl-[60px]"
      onClick={(e) => alert(`You selected ${props.result}!`)}
    >
      {
        props.result
        && props.result
      }
    </div>
  );
}

export default SearchResult;