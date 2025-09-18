import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface DetailItem {
    id: number;
    title: string;
    description: string;
    features: string[];
    price?: string;
    popular?: boolean;
}

interface TechnicalSpec {
    category: string;
    items: { name: string; value: string }[];
}

interface DetailsSectionProps {
    onNavigate: (section: string) => void;
}

export default function DetailsSection({ onNavigate }: DetailsSectionProps) {
    const [details] = useState<DetailItem[]>([
        {
            id: 1,
            title: "Free Plan",
            description: "Ideal for getting started",
            features: ["Limited access", "Community support", "Basic features"],
            price: "$0/month"
        },
        {
            id: 2,
            title: "Standard Plan",
            description: "Great for individuals and small teams",
            features: ["Basic access", "Email support", "Standard analytics"],
            price: "$9/month",
            popular: true
        },
        {
            id: 3,
            title: "Premium Plan",
            description: "Perfect for businesses and power users",
            features: ["Unlimited access", "Priority support", "Advanced analytics", "Custom integrations"],
            price: "$29/month"
        }
    ]);

    const [technicalSpecs] = useState<TechnicalSpec[]>([
        {
            category: "Performance",
            items: [
                { name: "Response Time", value: "Under 100ms" },
                { name: "Uptime", value: "99.9%" },
                { name: "Scalability", value: "Auto-scaling" }
            ]
        },
        {
            category: "Security",
            items: [
                { name: "Encryption", value: "256-bit SSL" },
                { name: "Compliance", value: "GDPR" },
                { name: "Backups", value: "Daily" }
            ]
        }
    ]);

    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#001636] to-[#000B1B]">
            <div className="max-w-6xl w-full">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Detailed Information</h2>
                <p className="text-xl text-muted-foreground text-center mb-12">
                    Explore our comprehensive features and plans
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {details.map((detail) => (
                        <Card
                            key={detail.id}
                            className={`flex flex-col transition-all duration-300 ${
                                selectedPlan === detail.id ? 'ring-2 ring-primary scale-105' : ''
                            } ${detail.popular ? 'relative border-primary' : ''}`}
                        >
                            {detail.popular && (
                                <Badge className="absolute top-4 right-4">Most Popular</Badge>
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl flex justify-between items-center">
                                    {detail.title}
                                    {detail.price && (
                                        <span className="text-lg font-bold text-primary">{detail.price}</span>
                                    )}
                                </CardTitle>
                                <p className="text-muted-foreground">{detail.description}</p>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-2 mb-6">
                                    {detail.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="mr-2">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        setSelectedPlan(detail.id);
                                        onNavigate('registration');
                                    }}
                                    variant={detail.popular ? 'default' : 'outline'}
                                >
                                    Select Plan
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="mb-12">
                    <CardHeader>
                        <CardTitle>Technical Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {technicalSpecs.map((spec, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold mb-2">{spec.category}</h3>
                                    <ul className="space-y-1">
                                        {spec.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className="flex justify-between">
                                                <span>{item.name}:</span>
                                                <Badge variant="secondary">{item.value}</Badge>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Button size="lg" onClick={() => onNavigate('home')}>
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
