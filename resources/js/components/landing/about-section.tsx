
import TextType from "../ui/text-type";
import PixelTransition from "../ui/pixel-transition";
export default function AboutSection() {


    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#000B1B] to-[#001636]">
            <div className="max-w-5xl w-full">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div>
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
                            animationStepDuration={0.4}
                            cycleInterval={2000}
                            autoCycle={true}
                            className="custom-pixel-card"
                        />
                    </div>

                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 vt323">About Meow</h2>
                            <TextType
                                text={[
                                    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
                                    "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
                                ]}
                                typingSpeed={75}
                                pauseDuration={1500}
                                showCursor={true}
                                cursorCharacter="_"
                            />
                    </div>
                </div>
            </div>
        </div>
    );
}
