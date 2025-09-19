
import TextType from "../ui/text-type";
export default function AboutSection() {


    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#000B1B] to-[#001636]">
            <div className="max-w-5xl w-full">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Our Story</h3>
                        <p className="text-muted-foreground mb-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
                            Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus
                            rhoncus ut eleifend nibh porttitor.
                        </p>
                        <p className="text-muted-foreground mb-4">
                            Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl
                            tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 vt323">About Us</h2>
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
