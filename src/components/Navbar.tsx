import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroText from "../components/HeroText";

import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setLocation } from "../redux/location";

interface NavItem {
    navText: string,
    navLocation: string
}

const navItems: NavItem[] = [
    {
        navText:"// home",
        navLocation:"/"
    },
    {
        navText:"// projects",
        navLocation:"/projects"
    },
    {
        navText:"// resume",
        navLocation:"/resume"
    },
];

const NavTab = ( {navText, navLocation}: NavItem) => {
    const dispatch = useAppDispatch();
    return (
            <Link to={navLocation} onClick={() => dispatch(setLocation(navLocation))} 
            className='px-4 text-lg font-normal text-grey-100 hover:text-violet-300'>{navText}</Link>
    )
}

const AppNavbar = () => {
    // 'state' is correctly typed as 'RootState'
    const location = useAppSelector((state) => state.locationState.location);

    return (
        <nav className='h-44 w-full flex-none fixed top-0 z-20'>
            <div className='h-full justify-center flex items-center'>
                <div className='px-5'>
                    { location === "/" ? (<></>) : (<HeroText size="small"/>)}
                </div>
                {navItems.map((item) => <NavTab key={item.navText} navText={item.navText} navLocation={item.navLocation} />)}
            </div>
        </nav>
    )
}
export default AppNavbar;
