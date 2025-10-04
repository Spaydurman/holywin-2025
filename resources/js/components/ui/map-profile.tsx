import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProfileCard from "../ui/profile-card";
import Map from "../ui/map";
import TargetCursor from "../ui/target-cursor";
import TextTypeScrambler from "./text-type-scrambler";
import ScrollReveal from "./scroll-reveal"; 
// Hook to detect when an element is in the viewport
const useOnScreen = (ref: React.RefObject<HTMLElement | null>) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1, // Trigger when 10% of the element is visible
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isIntersecting;
};

gsap.registerPlugin(ScrollTrigger);

export default function DetailsSection() {
    const [isMouseOver, setIsMouseOver] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const speakerContainerRef = useRef<HTMLDivElement>(null);
    const isMapContainerVisible = useOnScreen(mapContainerRef);
    const isSpeakerContainerVisible = useOnScreen(speakerContainerRef);

    const handleMouseEnter = () => {
        setIsMouseOver(true);
    };

    const handleMouseLeave = () => {
        setIsMouseOver(false);
    };

    useEffect(() => {
        gsap.set("#map-container", {
            x: 0,
            y: 0,
            scale: 1,
        });

        ScrollTrigger.create({
            trigger: "#profile-card-section",
            start: "top center",
            end: "bottom top", 
            onEnter: () => {
                gsap.to("#map-container", {
                    x: -window.innerWidth / 2 + 200, 
                    y: -window.innerHeight / 2 + window.innerHeight * 1.25, 
                    scale: 0.7,
                    duration: 1.5,
                    ease: "power3.out",
                    pin: true,
                });
            },
            onLeave: () => {
                gsap.to("#map-container", {
                    x: 0,
                    y: 0, 
                    scale: 1,
                    duration: 1.5,
                    ease: "power3.out",
                });
            },
            onLeaveBack: () => {
                gsap.to("#map-container", {
                    x: 0,
                    y: 0, 
                    scale: 1, 
                    duration: 1.5,
                    ease: "power3.out",
                });
            },
        });

        // Clean up function
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div
            ref={containerRef}
            // grid grid-cols-1 lg:grid-cols-2 gap-8
            className="bg-gradient-to-b from-[#000B1B] to-[#001636] "
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >

            <TargetCursor
                spinDuration={2}
                hideDefaultCursor={true}
                isActive={isMouseOver}
            />
            <div className="h-screen flex items-center justify-center gap-4">
                <div className="flex flex-col gap-4" id="map-container" ref={mapContainerRef}>
                    <div className="dashed-circle-border relative z-0">
                        <Map className="mt-0 rounded-xl cursor-target" style={{ width: '400px', height: '400px' }} />
                    </div>
                    <div className="min-w-[300px]">
                        <TextTypeScrambler
                            text={[
                                "Location: Manila, Philippines",
                                "Coordinates: 14.5995° N, 120.9842° E",
                                "Address: Roxas Blvd, Ermita, Manila"
                            ]}
                                speed={60}
                                scrambleSpeed={40}
                                onComplete={() => console.log("Location details complete!")}
                                className="text-lg font-mono text-white text-center"
                                isActive={isMapContainerVisible}
                        />
                    </div>
                </div>
            </div>
            <div className="h-screen flex items-center justify-end" id="profile-card-section" ref={speakerContainerRef}>
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                        <ProfileCard
                            name="Clark V."
                            title="Software Engineer"
                            handle="javicodes"
                            status="Online"
                            contactText="Contact Me"
                            avatarUrl="/images/clark.png"
                            className="cursor-target"

                            showUserInfo={false}
                            enableTilt={true}
                            enableMobileTilt={false}
                            onContactClick={() => console.log('Contact clicked')}
                        />
                        <div className="min-w-[600px] h-full">
                            <TextTypeScrambler
                                text={[
                                    "Speaker: Pastor John Doe",
                                    "Background: Senior Pastor with 20 years of ministry",
                                    "Focus: Community outreach and youth empowerment"
                                ]}
                                    speed={60}
                                    scrambleSpeed={40}
                                    onComplete={() => console.log("Map details complete!")}
                                    className="text-lg font-mono text-white"
                                    isActive={isSpeakerContainerVisible}
                            />
                        </div>
                </div>

            </div>

            <div className="h-screen flex items-center justify-center" id="profile-card-section">
                <div className="max-w-[600px]">
                    <ScrollReveal
                        baseOpacity={0}
                        enableBlur={true}
                        baseRotation={5}
                        blurStrength={10}
                    >
                        "I press on toward the goal to win the prize
                        for which God has called me heavenward
                        in Christ Jesus."

                        - Philippians 3:14 (NIV)
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
}
