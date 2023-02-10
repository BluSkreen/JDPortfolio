// fake news -> import * as Separator from '@radix-ui/react-separator';

const tech = ["JavaScript", "TypeScript", "React", "GraphQL", "Apollo", "MongoDB/Mongoose", "MySQL/Sequalize", "Express", "Git"];

const Resume = () => {
    return (
        <section className="mt-44 w-full h-full flex justify-center">
            <div className="max-w-xl flex flex-col px-6">
                <h1 className="text-4xl text-center">Education</h1>
                <div className="border border-color-grey-100 w-[30rem] self-center"></div>
                <div className="flex flex-col items-center">
                    <h2 className="text-2xl">DU Full Stack Certification</h2>
                    <p>Created full stack web applications and static websites with relevant industry technologies. Group projects challenged my abilities to work with others and take action in leading a project. Through my passion for coding, I took every opportunity to learn and do much more than the criteria.</p>
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-2xl">CU Denver Computer Science</h2>
                    <p>Spent two years at CU Denver learning various computer science concepts like OOP, algorithms, data structures, database systems, logic design, and assembly. Although it’s been a while since I've touched on some of these subjects, they have provided a solid foundation for me to think critically about how I solve problems and learn new concepts.</p>
                </div>
            </div>
            <div className="flex flex-col">
                <h1 className="text-4xl self-center">Technical Skills</h1>
                <div className="border border-color-grey-100 w-[30rem] self-center"></div>
                <div className="flex justify-center">
                    <h2 className="flex justify-center"></h2>
                    <div className="flex flex-col">
                    {tech.map((item)=> (
                        <span>{item}</span>
                    ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Resume;
