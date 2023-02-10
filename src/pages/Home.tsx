import HeroText from "../components/HeroText";

const Home = () => {
    return (
        <section className="w-full h-auto flex justify-center">
            <div className="mt-44 w-full h-full max-w-[70rem] max-h-[20rem] flex flex-col-reverse">
                <div className="w-full h-full">
                    <HeroText size="hero"/>
                </div>
                <div className="relative w-full h-full text-grey-0 flex justify-end">
                    <div>
                        <h2 className="text-end text-[35px]">Full Stack Developer</h2>
                        <p className="absolute top-10 right-20 z-20 text-[20px]"></p>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Home;
