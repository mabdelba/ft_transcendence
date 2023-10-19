'use client';
import { useEffect, useState } from "react";
import OptionBar from "../components/forms/OptionBar";
import SimpleInput from "../components/inputs/simpleInput";
import SimpleButton from "../components/buttons/simpleButton";
import Pdp from "../components/shapes/Pdp";
import Upload from "../../public/uploadIcon.svg"
import BlackUpload from "../../public/blackupload.svg"
import axios from "axios";
import Login from "../components/forms/Login";




function Settings() {

    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(false);

    const [Lastname, setLastName] = useState('');
    const [lastnameError, setlastNameError] = useState(false);

    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState(false);

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);

    const [filename, setFilename] = useState('');

    const getData = () => {

        const url = 'http://localhost:3000/api/atari-pong/v1/user/me-from-token';
        const token = localStorage.getItem('jwtToken');
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        axios.get(url, config).then((response)=> {

            setName(response.data.firstName);
            setLastName(response.data.lastName);
            setUsername(response.data.login);
            setEmail(response.data.email);
            setFilename(response.data.avatar);
        })
        .catch((error) => {

            console.log("Error from server haha: ", error);
        })
    }
    useEffect(()=> {

        getData();
    }, [])
    return (
    <OptionBar flag={5} userName={username}>
        <main className="w-full h-full   flex flex-col items-center  font-Orbitron min-h-[550px]  min-w-[280px] pb-2 ">
            <div className="w-full h-[8%] pl-6 md:pl-12 NeonShadow flex justify-start items-center text-base xl:text-3xl -yellow-300">
				Settings
			</div>
            <div className="w-[94%] h-auto md:h-[88%] NeonShadowBord flex flex-col items-center overflow-y-auto ">
                <div className="w-full h-[10%] pl-6 md:pl-12 text-[#00B2FF] font-light blueShadow flex justify-start items-center text-sm xl:text-2xl -yellow-300">
                    Personal Informations
                </div>
                <div className="w-full h-auto md:h-[36%] px-4 md:px-8  xl:px-16 grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-y-2 def:gap-y-0 md:gap-x-10 text-xs md:text-base 2xl:text-2xl  ">
                    <div className="h-1/2 min-h-[42px]  NeonShadow" >
                        <div className="mb-1 lg:mb-4">First Name:</div>
                        <SimpleInput holder={'First Name'}  type1={"text"} SetValue={setName} val={name} setError={setNameError}  isVerif={false} flag={true}  />
                    </div>
                    <div className="h-1/2 min-h-[42px]  NeonShadow" >
                        <div className="mb-1 lg:mb-4">Last Name:</div>
                        <SimpleInput holder={'Last Name'} type1={"text"} SetValue={setLastName} val={Lastname} setError={setlastNameError} flag={true}    isVerif={false} />
                    </div>
                    <div className="h-1/2 min-h-[42px]  NeonShadow" >
                        <div className="mb-1 lg:mb-4">Username:</div>
                        <SimpleInput holder={'Username'} type1={"text"} SetValue={setUsername} val={username} setError={setUsernameError} flag={true}   isVerif={false} readonly={true} />
                    </div>
                    <div className="h-1/2 min-h-[42px]  NeonShadow" >
                        <div className="mb-1 lg:mb-4">Email:</div>
                        <SimpleInput holder={'Email'} type1={"text"} SetValue={setEmail} val={email} setError={setEmailError} flag={true}   isVerif={false} />
                    </div>

                </div>
                <div className="w-full h-auto md:h-[42%]    mt-8 md:mt-0 px-4 md:px-8  xl:px-16   ">
                    <div className=" w-full  md:w-1/2 md:h-full h-auto  flex    flex-col ">
                        <div className="w-full h-auto  md:h-1/2  flex flex-col justify-center">
                            <div className="w-1/6 pl-2">
                                <Pdp name={username} color={false} flag={true} />
                            </div>
                            <span className="w-1/2 NeonShadow text-[5px] md:text-[12px]  flex font-light items-center ">({filename})</span>
                        </div>
                        <div className="w-full h-auto  lg:h-12 xl:h-16 2xl:h-24  text-xs md:text-base 2xl:text-2xl NeonShadow ">
                            <div className="mb-1 lg:mb-4">Avatar:</div>
                            <SimpleButton buttonType="button" content="Upload avatar" icon={Upload} icon2={BlackUpload} />
                        </div>
                    </div>
                </div>
                <div className="w-2/3 md:w-1/3 h-12 md:h-[9%] my-4 md:my-0">
                    <SimpleButton buttonType={"button"} content="Save" />
                </div>
            </div>
        </main>
    
    </OptionBar>
    )
}

export default Settings;