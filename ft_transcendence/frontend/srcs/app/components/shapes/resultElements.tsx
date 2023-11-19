'use client';
import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { Disclosure } from "@headlessui/react";
// import SearchInput from '../inputs/searchInput';

function SearchBar ({ setResults })
{

  return (
    <div className="results-list">
      {setResults.map((setResults, id) => {
        return <SearchResult result={setResults.name} key={id} />;
      })}
    </div>
  );
}

export default SearchBar;