'use client';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import Achievement from '../shapes/Achievement';

type newType = {
  title: string;
  textColor: string;
  Color: boolean;
  divArray: string[];
  hoverColor: string;
};

function DiscloComp(props: newType) {
  return (
    <div className="w-full h-auto  border ">
      <div className="w-full font-Orbitron  NeonShadowBord">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                className={`flex w-full h-auto ${props.textColor} justify-between  ${props.hoverColor}  items-center p-5  md:p-10 text-left text-xs md:text-xl font-medium`}
              >
                <span>{props.title}</span>
                <ChevronUpIcon className={`${!open ? 'rotate-180 transform ' : ''} h-10 w-10 `} />
              </Disclosure.Button>
              <Disclosure.Panel className="w-full h-auto px-1 xl:px-10 pb-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1 2xl:gap-4">
                {props.divArray.map((divName: any) => (
                  <div>
                    <Achievement name={divName} color={props.Color} />
                  </div>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}

export default DiscloComp;
