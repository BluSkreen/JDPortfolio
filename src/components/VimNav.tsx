import React from 'react';


const VimNavSection = () => {
    return (
        <div className='h-12 mb-1 w-full flex-none fixed bottom-0 z-20 text-grey-0'>
            <div className='bg-violet-500 pl-3'><span>{"jasonduran.me/home"}</span></div>
            <div className='pl-3'><span>{":find home"}</span></div>
        </div>
    );
};
export default VimNavSection;
