import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Head } from '@inertiajs/react';

const HomeSection = lazy(() => import('@/components/landing/home-section'));
const AboutSection = lazy(() => import('@/components/landing/about-section'));
const DetailsSection = lazy(() => import('@/components/landing/details-section'));
const RegistrationSection = lazy(() => import('@/components/landing/registration-section'));
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function Landing() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['home', 'about', 'details', 'registration'];
    const sectionElements = sections.map(id => document.getElementById(id));
    const offsets = sectionElements.map(el => el?.offsetTop || 0);

    const currentSectionIndex = offsets.findIndex((offset, index) => {
      const nextOffset = offsets[index + 1] || Infinity;
      return scrollPosition >= offset - 100 && scrollPosition < nextOffset - 100;
    });

    if (currentSectionIndex !== -1) {
      setActiveSection(sections[currentSectionIndex]);
    }
  }, [scrollPosition]);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Head title="Level Up" />
      <div className="w-full">
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
          {['home', 'about', 'details', 'registration'].map((section) => (
            <button
              key={section}
              onClick={() => handleNavigate(section)}
              className={`block w-3 h-3 rounded-full my-2 transition-all ${
                activeSection === section
                  ? 'bg-primary scale-125'
                  : 'bg-muted-foreground'
              }`}
              aria-label={`Go to ${section} section`}
            />
          ))}
        </div>

        {/* Pixelated Vintage Game Button for Registration */}
        <div className="absolute top-8 right-8 z-50">
          <button
            onClick={() => handleNavigate('registration')}
            className="relative group overflow-visible"
            aria-label="Go to registration section"
          >
            <div className="absolute -inset-1 bg-cyan-400 opacity-75 group-hover:opacity-100 transition duration-300 blur transform scale-110"></div>
            <div className="relative bg-black text-cyan-40 font-bold py-2 px-4 border-2 border-cyan-600 rounded-xs transform transition-all duration-200 hover:scale-105 active:scale-95 font-mono text-xs md:text-sm tracking-wider uppercase">
              <span className="block text-cyan-300 vt323 text-xl cursor-pointer" >REGISTER</span>
            </div>
          </button>
        </div>

        {isClient ? (
          <Suspense fallback={<LoadingSpinner />}>
            <section id="home" className="w-full">
              <HomeSection activeSection={activeSection} />
            </section>

            <section id="about" className="w-full">
              <AboutSection />
            </section>

            <section id="details" className="w-full">
              <DetailsSection />
            </section>

            <section id="registration" className="w-full">
              <RegistrationSection />
            </section>
          </Suspense>
        ) : (
          <div className="py-16 text-center">Preparing content...</div>
        )}
      </div>
    </>
  );
}
