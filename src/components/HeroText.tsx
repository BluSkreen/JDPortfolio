import React from "react";
import { Link } from "react-router-dom";

const HeroText = (props:{size:string}) => {
    return (
        <div className="w-min h-min flex flex-col">
            <div className="w-full h-auto">
                <h1 className="w-min leading-[7rem] tracking-tighter text-[125px] text-grey-100 ">
                    {"\u003C"}Jason
                </h1>
            </div>
            <div className="flex">
                <div className="w-[20rem] h-auto pt-2 flex flex-wrap justify-center content-center">
                    <Link
                        to={"https://github.com/BluSkreen"}
                        className="text-violet-500 hover:text-violet-400 pl-10 py-1"
                    >
                        github.com/BluSkreen
                    </Link>
                    <Link
                        to={"https://www.linkedin.com/in/jasonduran303/"}
                        className="text-violet-500 hover:text-violet-400 pl-10 py-1"
                    >
                        LinkedIn
                    </Link>
                </div>
                <div className="w-min h-auto">
                    <h1 className="w-min leading-[7rem] tracking-tighter text-[125px]  text-grey-100">
                        Duran/{"\u003E"}
                    </h1>
                </div>
            </div>
        </div>
    );
};
export default HeroText;
