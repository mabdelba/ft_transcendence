'use client';
import { use, useState, MouseEvent } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

type InputProps = {
  holder: string;
  type1: string;
  type2?: string;
  icon?: string;
  icon2?: string;
  SetValue: Function;
  regex?: any;
  val: string;
  setError: Function;
  isVerif: boolean;
  pass?: string;
  flag?: boolean;
  readonly?: boolean;
};

function SimpleInput(props: InputProps) {
  const [verror, setError] = useState(true);
  const [showpassword, setShowPassword] = useState(false);
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setShowPassword(!showpassword);
  }

  const handleChange = (event: any) => {
    props.SetValue(event.target.value);
    if (props.isVerif && props.pass) {
      if (event.target.value != props.pass) {

        setError(false);
        props.setError(false);
      } else {
        setError(true);

        props.setError(true);
      }
    } else if (props.regex) {
      const reg = props.regex.test(event.target.value);
      if (!reg) {
        setError(false);
        props.setError(false);
      } else {
        setError(true);
        props.setError(true);
      }
    }
  };

  // const handleBlur = () => {
  //   if (props.isVerif && props.pass) {
  //     if (props.val !== props.pass) {
  //       setError(false);
  //       props.setError(false);
  //     } else {
  //       setError(true);
  //       props.setError(true);
  //     }
  //   } else if (props.regex) {
  //     const reg = props.regex.test(props.val);
  //     if (!reg) {
  //       setError(false);
  //       props.setError(false);
  //     } else {
  //       setError(true);
  //       props.setError(true);
  //     }
  //   }
  //   props.setError(verror);
  // };

  return (
    <div className="space-y-44 h-full w-full min-h-[45px]">
      <div
        className={`w-full h-full  flex justify-center  items-center ${
          verror ? 'NBord' : 'NeonShadowBordRed'
        } bg-[#272727] pr-2`}
      >
        <div className="flex justify-center items-center bg-transparent font-Orbitron text-sm md:text-lg lg:text-xl h-full w-full">
          <input
            placeholder={props.holder}
            className="h-full w-full pl-3 bg-transparent text-white outline-none placeholder-[#484848]"
            type={!showpassword ? props.type1 : props.type2}
            onChange={(event) => handleChange(event)}
            value={props.flag ? props.val : undefined}
            readOnly={props.readonly}

            // required
          />
        </div>
        {props.icon && props.icon2 && (
          <button
            onClick={(event) => handleClick(event)}
            className="right-5 flex w-15 h-10 justify-center items-center p-2"
          >
            <Image src={!showpassword ? props.icon : props.icon2} alt="eye" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SimpleInput;
