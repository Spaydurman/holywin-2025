// LogoFlip.tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LogoFlip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const logo1Ref = useRef<HTMLImageElement>(null);
  const logo2Ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !logo1Ref.current || !logo2Ref.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top", // flip during scroll within section
        scrub: true,
        pin: true, // sticky effect
      },
    });

    tl.to(logo1Ref.current, {
      rotateY: 90,
      opacity: 0,
      duration: 0.5,
    }).fromTo(
      logo2Ref.current,
      { rotateY: -90, opacity: 0 },
      { rotateY: 0, opacity: 1, duration: 0.5 },
      "<" // run at same time
    );
  }, []);

  return (
    <div className="h-[200vh] bg-gradient-to-b from-[#001636] to-[#000B1B]">
      {/* Section with sticky logo */}
      <div
        ref={sectionRef}
        className="relative h-screen flex items-center justify-center perspective"
      >
        {/* Logo 1 */}
        <div ref={logo1Ref} className="h-screen w-screen flex items-center justify-center">
             <img

                src="/images/R.png"
                alt="Logo 1"
                className="w-60 h-auto object-contain absolute"
            />
        </div>


        {/* Logo 2 */}
        <img
          ref={logo2Ref}
          src="/images/valorant.png"
          alt="Logo 2"
          className="w-60 h-60 object-contain absolute"
          style={{ opacity: 0 }}
        />
      </div>
    </div>
  );
}
