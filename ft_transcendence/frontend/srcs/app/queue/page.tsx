'use client'
import * as React from 'react'
import Image from 'next/image';
import LightMap from '../../public/lightMap.svg';
import DarkMap from '../../public/darkMap.svg';

function Queue() {

    return (
        <>
            <div className='flex flex-col items-center h-screen justify-center'>
                <h1 className='font-Orbitron NeonShadow text-[30px] mb-[30px]'>Chouse a map</h1>
                <div className='flex content-center justify-center'>
                    <button className=''>
                        <Image src={LightMap} alt="LightMap" />
                    </button>
                    <button className=''>
                        <Image src={DarkMap} alt="DarkMap" />
                    </button>
                </div>
            </div>
        </>
    )
}

export default Queue;