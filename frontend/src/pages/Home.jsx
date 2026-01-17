// src/pages/Home.jsx
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import StatsSection from "../components/StatsSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      {/* Secciones de la Home */}
      <Hero />
      <AboutSection />
      <StatsSection />
       <Footer />
    </div>
  );
}
