import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import HomeSection from '@/components/landing/home-section';
import AboutSection from '@/components/landing/about-section';
import DetailsSection from '@/components/landing/details-section';
import RegistrationSection from '@/components/landing/registration-section';

export default function Landing() {
    const [activeSection, setActiveSection] = useState('home');
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const sections = ['home', 'about', 'details', 'registration', 'pixel-demo'];
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

                <div id="home" className="w-full">
                    <HomeSection activeSection={activeSection} />
                </div>

                <div id="about" className="w-full">
                    <AboutSection />
                </div>

                <div id="details" className="w-full">
                    <DetailsSection />
                </div>

                <div id="registration" className="w-full">
                    <RegistrationSection onNavigate={handleNavigate} />
                </div>
            </div>
        </>
    );
}
