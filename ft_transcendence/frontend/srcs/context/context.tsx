'use client'
import { createContext, useState } from "react"

export interface User{
    id? : number,
    login? : string,
    firstName? : string,
    lastName? : string,
    email? : string,
    password? : string,
    avatar? :   string,
    twoFaActive? :   boolean,
    twoFaSecret? :  string,
    state? : number,
    level? : number,
	matchPlayed? : number,
	winPercent? : number,
	numberOfGamesPlayed? : number,
	numberOfGamesWon? : number,
}

export const context = createContext<{user: User; setUser: Function}>({user: {}, setUser: ()=>{}})

const Context = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User>({});
    return (
        <context.Provider value={{user, setUser}}>
            {children}
        </context.Provider>
    );
}

export default Context;