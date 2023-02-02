import HeroText from "../components/HeroText";

const Home = () => {
    return (
        <section className="mt-44 w-full h-full flex justify-center">
            <div className="w-full h-full max-w-[70rem] max-h-[20rem] flex flex-col-reverse">
                <div className="w-full h-full">
                    <HeroText size="small"/>
                </div>
                <div className="w-full h-full text-grey-0 text-[35px]">
                    <h2 className="text-end">Full Stack Developer</h2>
                </div>
            </div>
        </section>
    );
};
export default Home;
