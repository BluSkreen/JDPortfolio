import HeroText from "../components/HeroText";

const Home = () => {
    return (
        <section className="w-full h-full max-w-[88rem] flex flex-col-reverse self-center">
            <div className="w-auto h-auto mb-40">
                <HeroText />
            </div>
            <div className="w-full h-full pt-16 flex justify-end content-center text-grey-0 text-[45px]">
                <h2 className="">Full Stack Developer</h2>
            </div>
        </section>
    );
};
export default Home;
