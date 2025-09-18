import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    bio: string;
    avatar: string;
}

interface AboutSectionProps {
    onNavigate: (section: string) => void;
}

export default function AboutSection({ onNavigate }: AboutSectionProps) {
    const [teamMembers] = useState<TeamMember[]>([
        {
            id: 1,
            name: "John Doe",
            role: "CEO & Founder",
            bio: "Visionary leader with 15+ years of industry experience.",
            avatar: "JD"
        },
        {
            id: 2,
            name: "Jane Smith",
            role: "CTO",
            bio: "Tech innovator passionate about cutting-edge solutions.",
            avatar: "JS"
        },
        {
            id: 3,
            name: "Robert Brown",
            role: "Lead Developer",
            bio: "Full-stack expert with a focus on user experience.",
            avatar: "RB"
        }
    ]);

    const [activeMember, setActiveMember] = useState<number | null>(null);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#000B1B] to-[#001636]">
            <div className="max-w-4xl w-full">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">About Us</h2>

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
                        <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
                        <p className="text-muted-foreground mb-4">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                            veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        </p>
                        <p className="text-muted-foreground">
                            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
                            sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                        </p>
                    </div>
                </div>

                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle className="text-center">Our Team</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {teamMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className={`text-center cursor-pointer transition-all duration-300 ${
                                        activeMember === member.id ? 'scale-105' : ''
                                    }`}
                                    onClick={() => setActiveMember(activeMember === member.id ? null : member.id)}
                                >
                                    <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                                        <span className="text-2xl font-bold">{member.avatar}</span>
                                    </div>
                                    <h4 className="font-semibold">{member.name}</h4>
                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                    {activeMember === member.id && (
                                        <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Button onClick={() => onNavigate('details')}>
                        View Details
                    </Button>
                </div>
            </div>
        </div>
    );
}
