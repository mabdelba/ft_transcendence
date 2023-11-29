// PercentagePresentation.js
import React from 'react';

type newType = {
  width1: string;
  width2?: string;
  firstColor: string;
  secondColor?: string;
  bord: boolean;
};
function Percent(props: newType) {
  return (
    <div
      className={`w-[75%] flex flex-row items-center justify-start p-0.5 ${
        props.bord ? 'neonBord h-2.5' : 'h-1.5'
      }`}
    >
      <div
        style={{ minWidth: props.width1, height: '2px' }}
        className={`${props.firstColor}`}
      ></div>
      {props.secondColor && props.width2 && (
        <div
          style={{ minWidth: props.width2, height: '2px' }}
          className={`${props.secondColor} NeonShadow `}
        ></div>
      )}
    </div>
  );
}

export default Percent;
