import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Info from "./components/Info";
import Contact from "./components/Contact";
import Scene from "./scene/Scene";

const App = () => (
  <>
    <Scene />
    <Nav />
    <main className="relative z-10">
      <Hero />
      <About />
      <Projects />
      <Info />
      <Contact />
    </main>
  </>
);

export default App;
