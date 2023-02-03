import React from "react";
import { Link } from "react-router-dom";

interface HeroProps{
    size: string;
}

const Links = () => {
    return (<>
            <Link
            to={"https://github.com/BluSkreen"}
            className="pl-10 py-1 text-violet-500 hover:text-violet-400"
            >
            github.com/BluSkreen
            </Link>
            <Link
            to={"https://www.linkedin.com/in/jasonduran303/"}
            className="pl-10 py-1 text-violet-500 hover:text-violet-400"
            >
            LinkedIn
            </Link>
    </>);
}

const Icons = () => {
    return (<>
            <img className="w-7" src="/icons8-github-50-2.svg" alt="Jasons github svg"></img>
            <img className="w-7" src="/icons8-linkedin-50-2.svg" alt="Jasons github svg"></img>
            <img className="w-7" src="/icons8-twitter-squared-50.svg" alt="Jasons github svg"></img>
    </>);
}

const HeroText = ({ size }: HeroProps) => {
    console.log(size);
    return (
        <div className="w-min h-min flex flex-col">
            <div className="w-full h-auto">
                <h1 className={ "w-min text-grey-100 " 
                + (size === "hero" ? "leading-[7rem] tracking-tighter text-[125px]" 
                    : size === "small" ? "leading-[2.5rem] text-[50px]"
                    : "" )}>
                    {"\u003C"}Jason
                </h1>
            </div>
            <div className="flex">
                <div className={"h-auto pt-2 flex flex-wrap justify-center items-center "
                    + (size === "hero" ? "w-[20rem] flex-col"
                    : size === "small" ? "w-[10rem]"
                    : "" 
                )}>
                    { 
                        size === "hero" ? <Links/>
                        : size === "small" ? <Icons/>
                        : (<></>)
                    }
                </div>
                <div className="w-min h-auto">
                    <h1 className={ "w-min text-grey-100 "
                    + (size === "hero" ? "leading-[7rem] tracking-tighter text-[125px]" 
                        : size === "small" ? "leading-[2.5rem] text-[50px]"
                        : "" )}>
                        Duran/{"\u003E"}
                    </h1>
                </div>
            </div>
        </div>
    );
};
export default HeroText;
