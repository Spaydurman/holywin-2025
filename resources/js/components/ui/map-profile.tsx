import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProfileCard from "../ui/profile-card";
import Map from "../ui/map";
import TargetCursor from "../ui/target-cursor";

gsap.registerPlugin(ScrollTrigger);

export default function DetailsSection() {
    const [isMouseOver, setIsMouseOver] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

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
            className=" w-full bg-gradient-to-b from-[#000B1B] to-[#001636] "
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >

            <TargetCursor
                spinDuration={2}
                hideDefaultCursor={true}
                isActive={isMouseOver}
            />
            <div className="h-screen flex items-center justify-center">
                <div className="relative" id="map-container">
                    <div className="dashed-circle-border">
                        <Map className="mt-0 rounded-xl cursor-target" style={{ width: '400px', height: '400px' }} />
                    </div>
                </div>
            </div>
            <div className="h-screen flex items-center justify-center" id="profile-card-section">
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
            </div>
        </div>
    );
}
