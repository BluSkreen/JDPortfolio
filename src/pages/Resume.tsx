// fake news -> import * as Separator from '@radix-ui/react-separator';
import { useAppDispatch } from '../redux/hooks';
import { setLocation } from "../redux/location";
import { Link } from "react-router-dom";

const tech = ["JavaScript", "TypeScript", "React", "GraphQL", "Apollo", "MongoDB/Mongoose", "MySQL/Sequalize", "Express", "Git"];

const Info = () => {
    const dispatch = useAppDispatch();
    dispatch(setLocation("info"));
    return (
        <section className="mt-44 w-full h-full flex gap-6 justify-center ">
            <Link to="https://docs.google.com/document/d/e/2PACX-1vTbAb9BXuWkw5CG813-zo0IPw3H96MJ7luNjaYC0HRsGHogaa0dIbAqMpd1gzl0Ug/pub" className="border mt-[-0.5rem] px-4 p-2 rounded-md text-xl flex-none absolute">Resume</Link>

            <div className="max-w-lg flex flex-col gap-3">
                <h1 className="text-4xl self-center">About Me</h1>
                <div className="border border-color-grey-100 w-[34rem] self-center"></div>
                <div className="mt-4 max-w-md flex place-self-center">
                    <p>Hey, my name is Jason Duran and I'm a full Stack web 
                    developer from Colorado. I've been fascinated with computers
                    ever since I could play video games as a kid. Through this discovery 
                    of computers, I have found a deep passion for learning how to 
                    manipulate them.</p>
                </div>
                <h1 className="text-4xl pt-3 self-center">Technical Skills</h1>
                <div className="border border-color-grey-100 w-[30rem] self-center"></div>
                <div className="max-w-md text-violet-300 text-xl flex flex-wrap gap-3 justify-center">
                    {tech.map((item)=> (
                        <span>-{item}</span>
                    ))}
                </div>
            </div>

            <div className='flex flex-col gap-3'>
                <div className="border border-color-grey-100 mt-[4rem] h-[25rem] self-center"></div>
            </div>

            <div className="max-w-lg flex flex-col gap-3 px-6">
                <h1 className="text-4xl text-center">Education</h1>
                <div className="border border-color-grey-100 w-[34rem] self-center"></div>
                <div className="flex flex-col items-center">
                    <h2 className="text-xl bg-violet-700 border rounded-sm px-2 my-2 mb-4">DU Full Stack Certification</h2>
                    <p>- Created full stack web applications and static websites 
                    with relevant industry technologies</p>
                    <p>- Group projects challenged my abilities to work with others 
                    and take action in leading a project</p>
                </div>
                <div className="flex flex-col items-center mb-3">
                    <h2 className="text-xl bg-violet-700 border rounded-sm px-2 my-2 mb-4">CU Denver Computer Science</h2>
                    <p>- Spent two years at CU Denver learning various computer 
                    science concepts like OOP, algorithms, data structures, 
                    database systems, logic design, and assembly language</p>
                </div>
            </div>
        </section>
    );
};
export default Info;
