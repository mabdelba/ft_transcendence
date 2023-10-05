'use client';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import Achievement from '../shapes/Achievement';
import Pdp from '../shapes/Pdp';

type newType = {
  title: string;
  textColor: string;
  Color: boolean;
  divArray: string[];
  hoverColor: string;
  isFriend: boolean;
  image: string;
  setOpen?: any;
  setLogin?: any;
  setAvatar?: any;
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
                <ChevronUpIcon
                  className={`${!open ? 'rotate-180 transform ' : ''} text-white h-10 w-10 `}
                />
              </Disclosure.Button>
              <Disclosure.Panel
                className={`w-full h-auto px-1 xl:px-10 pb-10 grid grid-cols-3 sm:grid-cols-4 ${
                  props.isFriend ? 'md:grid-cols-7' : 'md:grid-cols-6'
                } gap-1 2xl:gap-4`}
              >
                {props.divArray.map((divName: any) => (
                  <div>
                    {props.isFriend ? (
                      <Pdp
                        name={divName}
                        image={props.image}
                        color={props.Color}
                        handleClick={() => {
                          props.setOpen(true);
                          props.setLogin(divName);
                          // props.setAvatar(props.image);
                        }}
                      />
                    ) : (
                      <Achievement name={divName} color={props.Color} />
                    )}
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
