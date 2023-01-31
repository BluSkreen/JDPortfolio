import React from 'react';
import { Link } from 'react-router-dom';

interface NavItem {
    text: string,
    location: string
}

const navItems: NavItem[] = [
    {
        text:"home",
        location:"/"
    },
    {
        text:"about",
        location:"/about"
    },
];

const NavTab = ( {text, location}: NavItem) => {
    return (
            <Link to={location} className='px-3 text-grey-100 hover:text-grey-400'>{text}</Link>
    )
}

const AppNavbar = () => {

    return (
        <div className='h-32 w-full'>
            {navItems.map((item) => <NavTab key={item.text} text={item.text} location={item.location} />)}
        </div>
    )
}
export default AppNavbar;
