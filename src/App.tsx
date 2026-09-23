import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Info from "./components/Info";
import Contact from "./components/Contact";
import Scene from "./scene/Scene";
import PhysicsToggle from "./components/PhysicsToggle";

const App = () => (
  <>
    <a
      href="#main"
      className="fixed top-2 left-2 z-50 -translate-y-20 rounded-md bg-violet-600 px-4 py-2 font-bold text-grey-0 focus:translate-y-0"
    >
      Skip to content
    </a>
    <Scene />
    <Nav />
    <main id="main" className="relative z-10">
      <Hero />
      <About />
      <Projects />
      <Info />
      <Contact />
    </main>
    <PhysicsToggle />
  </>
);

export default App;
