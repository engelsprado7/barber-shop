// NavBar component

import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { isAuthenticated, getUserInfo, logout } from '../utils/auth.js';
import { Avatar } from './ui/avatar';

export const NavBar = () => {

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userInfo, setUserInfo] = React.useState(null);
    useEffect(() => {


        setIsLoggedIn(isAuthenticated());
        setUserInfo(getUserInfo());
    }, []);

    console.log('isLoggedIn', isLoggedIn);
    console.log('userInfo', userInfo);
    return (
        <header className="flex justify-between w-full p-4">
            <h1 className="text-2xl font-bold text-gray-800">Barber Shop</h1>
            <div className='flex gap-4'>
                {isLoggedIn ? <Avatar src={userInfo?.avatar} alt={userInfo?.name} />
                    :
                    <Button className="mr-2 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                        <a href="/sign-in">Sign In</a>
                    </Button>
                }
                {isLoggedIn ? <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={logout}>Logout</Button> : <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
                    <a href="/sign-up">Sign Up</a>
                </Button>}
            </div>
        </header>
    )
}

export default NavBar;