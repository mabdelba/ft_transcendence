import { Transition, Dialog } from "@headlessui/react";
import { Children, Fragment, ReactNode } from "react";
import {AiOutlineClose} from 'react-icons/ai'


function Popup({children, openModal, setOpenModal} : {children : ReactNode, openModal : boolean, setOpenModal : any}){

    return (
        <Transition appear show={openModal} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={()=> {setOpenModal(false)}} >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex justify-center items-center bg-opacity-40 backdrop-blur bg-[#282828] w-full h-full ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative min-w-[260px] min-h-[280px]  h-[60%] xl:h-[60%] w-4/5  sm:w-2/3 md:w-1/2  xl:w-1/3 bg-black NeonShadowBord">
                    {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    )

}

export default Popup;