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

  const handleNavigate = (section) => {
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
              <RegistrationSection onNavigate={handleNavigate} />
            </section>
          </Suspense>
        ) : (
          <div className="py-16 text-center">Preparing content...</div>
        )}
      </div>
    </>
  );
}
