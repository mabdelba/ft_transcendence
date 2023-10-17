'use client';
import { useEffect, useState } from "react";
import OptionBar from "../components/forms/OptionBar";
import SimpleInput from "../components/inputs/simpleInput";
import SimpleButton from "../components/buttons/simpleButton";
import Pdp from "../components/shapes/Pdp";
import Upload from "../../public/uploadIcon.svg"
import BlackUpload from "../../public/blackupload.svg"
import axios from "axios";




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
    return <OptionBar flag={5}>
        <main className="w-full h-full  flex flex-col items-center  font-Orbitron min-h-[480px] min-w-[280px]">
            <div className="w-full h-[8%] pl-6 md:pl-12 NeonShadow flex justify-start items-center text-base xl:text-3xl -yellow-300">
				Settings
			</div>
            <div className="w-[94%] h-[88%] NeonShadowBord flex flex-col items-center">
                <div className="w-full h-[10%] pl-6 md:pl-12 text-[#00B2FF] font-light blueShadow flex justify-start items-center text-sm xl:text-2xl -yellow-300">
                    Personal Information
                </div>
                <div className="w-full h-[36%] grid grid-cols-1 def:grid-cols-2  ">
                    <div className="h-1/2 px-16 text-2xl NeonShadow" >
                        <div className="mb-4">First Name:</div>
                        <SimpleInput holder={'First Name'}  type1={"text"} SetValue={setName}  setError={setNameError}  isVerif={false} flag={true} val={name} />
                    </div>
                    <div className="h-1/2 px-16 text-2xl NeonShadow" >
                        <div className="mb-4">Last Name:</div>
                        <SimpleInput holder={'Last Name'} type1={"text"} SetValue={setLastName}  setError={setlastNameError} flag={true} val={Lastname}   isVerif={false} />
                    </div>
                    <div className="h-1/2 px-16 text-2xl NeonShadow"  >
                        <div className="mb-4">Username:</div>
                        <SimpleInput holder={'Username'} readonly={true} type1={"text"} SetValue={setUsername}  setError={setUsernameError} flag={true} val={username}   isVerif={false} />
                    </div>
                    <div className="h-1/2 px-16 text-2xl NeonShadow" >
                        <div className="mb-4">Email:</div>
                        <SimpleInput holder={'Email'} type1={"email"} SetValue={setEmail}  setError={setEmailError} flag={true} val={email}  isVerif={false} />
                    </div>

                </div>
                <div className="w-full h-[42%]  flex ">
                    <div className="w-1/2 h-full px-16  flex-col">
                        <div className="w-full h-1/2  flex">
                            <div className="w-1/6  ">
                                <Pdp name={username} color={false} flag={true} />
                            </div>
                            <div className="w-1/2 NeonShadow text-lg flex font-light items-end px-4 pb-8">{filename}</div>
                        </div>
                        <div className="w-full h-[22%] text-2xl NeonShadow ">
                            <div className="mb-4">Avatar:</div>
                            <SimpleButton buttonType="button" content="Upload avatar" icon={Upload} icon2={BlackUpload} />
                        </div>
                    </div>
                    <div className="w-1/2 h-full "></div>
                </div>
                <div className="w-1/3 h-[9%] ">
                    <SimpleButton buttonType={"button"} content="Save" />
                </div>
            </div>
        </main>
    </OptionBar>
}

export default Settings;