'use client';
import { useState } from "react";
import OptionBar from "../components/forms/OptionBar";
import SimpleInput from "../components/inputs/simpleInput";
import SimpleButton from "../components/buttons/simpleButton";




function Settings() {

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(false);
    return <OptionBar flag={5}>
        <main className="w-full h-full  flex flex-col items-center  font-Orbitron min-h-[480px] min-w-[280px]">
            <div className="w-full h-[8%] pl-6 md:pl-12 NeonShadow flex justify-start items-center text-base xl:text-3xl -yellow-300">
				Settings
			</div>
            <div className="w-[94%] h-[88%] NeonShadowBord flex flex-col items-center">
                <div className="w-full h-[10%] pl-6 md:pl-12 text-[#00B2FF] blueShadow flex justify-start items-center text-sm xl:text-2xl -yellow-300">
                    Personal Information
                </div>
                <div className="w-full h-[39%] grid grid-cols-2  ">
                    <div className="h-1/2 px-16 text-2xl NeonShadow" >
                        <div className="mb-4">First Name:</div>
                        <SimpleInput holder={'First Name'} type1={"text"} SetValue={setName} val={""} setError={setNameError} isVerif={false} />
                    </div>
                    <div className="h-1/2 px-16 text-2xl NeonShadow" >
                        <div className="mb-4">Last Name:</div>
                        <SimpleInput holder={'Last Name'} type1={"text"} SetValue={setName} val={""} setError={setNameError} isVerif={false} />
                    </div>
                    <div className="h-1/2 px-16 text-2xl NeonShadow" >
                        <div className="mb-4">Username:</div>
                        <SimpleInput holder={'Username'} type1={"text"} SetValue={setName} val={""} setError={setNameError} isVerif={false} />
                    </div>
                    <div className="h-1/2 px-16 text-2xl NeonShadow" >
                        <div className="mb-4">Email:</div>
                        <SimpleInput holder={'Email'} type1={"text"} SetValue={setName} val={""} setError={setNameError} isVerif={false} />
                    </div>

                </div>
                <div className="w-full h-[39%] "></div>
                <div className="w-1/3 h-[8%] ">
                    <SimpleButton buttonType={"button"} content="Save" />
                </div>
            </div>
        </main>
    </OptionBar>
}

export default Settings;