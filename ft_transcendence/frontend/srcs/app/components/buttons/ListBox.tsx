'use client';
import { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { AiOutlinePlus } from "react-icons/ai"
import { TbMessage2Plus } from "react-icons/tb"

const people = [
  { name: 'Friends Messages' },
  { name: 'Groups Messages' },
  { name: 'Add New Group' },
  { name: 'DM a friend' },
];

type newType = {

  setSelected: any;
}

function MyListbox(props: newType) {
  const [selected, setSelected] = useState(people[0]);
  // const [open, setOpen] = useState(false);

  useEffect(()=> {

    if(selected.name == 'Friends Messages')
      props.setSelected(0);
    else if(selected.name == 'Groups Messages')
      props.setSelected(1);
    else
      props.setSelected(2);

    // console.log('kitab hayati: ', selected.name);
  }, [selected])
  return (
    <div className="h-full w-full ">
      <Listbox value={selected} onChange={setSelected}  >

          {
            ({ open }) => (
          <div className="relative  w-full h-full">
          <Listbox.Button className="relative h-full w-full  flex flex-row justify-center items-center space-x-0 2xl:space-x-2   shadow-md focus:outline-none text-sm 2xl:text-lg">
            <span className="hidden md:block  ">{selected.name}</span>
            <ChevronUpIcon className={`${!open ? 'rotate-180 transform ' : ''} h-5 w-5  2xl:h-8 2xl:w-8 `}/>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute ml-4 mt-1 max-h-60  w-40 xl:w-60 2xl:w-80 overflow-auto SmallNeonShadowBord  bg-[#36494e] text-base  ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {people.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative border-b-2 border-r-2 cursor-pointer select-none py-2 xl:py-4 pl-10 pr-4 ${
                      active ? 'bg-white text-black' : 'text-white'
                    }`
                  }
                  value={person}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`flex flex-row text-[8px] xl:text-base space-x-1 xl:space-x-2 justify-center items-center ${selected ? 'font-extrabold' : ''}`}
                      >
                        {personIdx == 2 && <AiOutlinePlus  />}
                        {personIdx == 3 && <TbMessage2Plus />}
                        <h3>{person.name}</h3>
                      </span>
                      {selected ? (
                        <span className={ `absolute inset-y-0 left-0 flex items-center pl-3  font-bold `}>
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>)}
      </Listbox>
    </div>
  );
}

export default MyListbox;
