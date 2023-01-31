import React from "react";
import { Link } from "react-router-dom";

const HeroText = () => {
    return (
        <div className="w-[55rem] flex flex-wrap">
            <div className="w-full ">
                <h1 className="w-min leading-[6.5rem] tracking-tighter text-[125px] text-grey-100 ">{"\u003C"}Jason</h1>
            </div>
            <div className="w-[20rem] h-auto pt-2 flex flex-wrap justify-center content-center">
                <Link
                    to={"https://github.com/BluSkreen"}
                    className="text-grey-100 pl-10 py-1"
                >
                    github.com/BluSkreen
                </Link>
                <Link
                    to={"https://github.com/BluSkreen"}
                    className="text-grey-100 pl-10 py-1"
                >
                    LinkedIn
                </Link>
            </div>
            <div className="w-min">
                <h1 className="w-min leading-[6.5rem] tracking-tighter text-[125px]  text-grey-100">Duran/{"\u003E"}</h1>
            </div>
        </div>
    );
};
export default HeroText;
