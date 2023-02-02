import React from 'react';
import { Link } from 'react-router-dom';

interface NavItem {
    text: string,
    location: string
}

const navItems: NavItem[] = [
    {
        text:"// home",
        location:"/"
    },
    {
        text:"// projects",
        location:"/projects"
    },
    {
        text:"// resume",
        location:"/resume"
    },
];

const NavTab = ( {text, location}: NavItem) => {
    return (
            <Link to={location} className='px-4 text-lg font-normal text-grey-100 hover:text-violet-300'>{text}</Link>
    )
}

const AppNavbar = () => {

    return (
        <nav className='h-44 w-full flex-none fixed top-0 z-20'>
            <div className='h-full justify-center flex items-center'>
            {navItems.map((item) => <NavTab key={item.text} text={item.text} location={item.location} />)}</div>
        </nav>
    )
}
export default AppNavbar;
