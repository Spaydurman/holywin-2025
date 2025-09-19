import React from 'react';
import PixelTransition from '../ui/pixel-transition';

const PixelDemo: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#000B1B] to-[#001636]">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">Pixel Transition Demo</h1>
        <p className="text-xl text-center mb-12 text-gray-300">
          Automatic cycling through multiple images every 2 seconds
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-center mb-4 text-white">Auto-Cycling Images</h2>
            <PixelTransition
              contents={[
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
                  alt="Cat 1"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />,
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg"
                  alt="Cat 2"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />,
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Cat_poster_1.jpg/1200px-Cat_poster_1.jpg"
                  alt="Cat 3"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />,
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: "#111"
                  }}
                >
                  <p style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>Meow!</p>
                </div>
              ]}
              gridSize={12}
              pixelColor='#ffffff'
              animationStepDuration={0.7}
              cycleInterval={2000}
              autoCycle={true}
              className="custom-pixel-card"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-center mb-4 text-white">Hover to Transition</h2>
            <PixelTransition
              firstContent={
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
                  alt="Cat 1"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              }
              secondContent={
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    backgroundColor: "#111"
                  }}
                >
                  <p style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>Hover!</p>
                </div>
              }
              gridSize={12}
              pixelColor='#ffffff'
              animationStepDuration={0.4}
              className="custom-pixel-card"
            />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Features</h2>
          <ul className="text-lg text-gray-300 max-w-2xl mx-auto text-left list-disc list-inside">
            <li>Automatic cycling through multiple images every 2 seconds</li>
            <li>Configurable grid size and pixel color</li>
            <li>Adjustable animation speed</li>
            <li>Works with any React content (images, text, components)</li>
            <li>Backward compatible with existing two-content API</li>
            <li>Responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PixelDemo;
