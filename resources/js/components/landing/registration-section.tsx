import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface FormData {
    name: string;
    email: string;
    plan: string;
    message: string;
    terms: boolean;
}

interface RegistrationSectionProps {
    onNavigate: (section: string) => void;
}

export default function RegistrationSection({ onNavigate }: RegistrationSectionProps) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        plan: 'free',
        message: '',
        terms: false
    });

    const [errors, setErrors] = useState<{name?: string; email?: string; terms?: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Pre-select a plan if one was selected in the details section
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const selectedPlan = urlParams.get('plan');
        if (selectedPlan && ['free', 'standard', 'premium'].includes(selectedPlan)) {
            setFormData(prev => ({ ...prev, plan: selectedPlan }));
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (name === 'name' && errors.name) {
            setErrors(prev => ({ ...prev, name: undefined }));
        } else if (name === 'email' && errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, terms: checked }));

        // Clear error when checkbox is checked
        if (checked && errors.terms) {
            setErrors(prev => ({ ...prev, terms: undefined }));
        }
    };

    const handlePlanChange = (planId: string) => {
        setFormData(prev => ({ ...prev, plan: planId }));
    };

    const validateForm = (): boolean => {
        const newErrors: {name?: string; email?: string; terms?: string} = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.terms) {
            newErrors.terms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            // Simulate API call
            setTimeout(() => {
                console.log('Form submitted:', formData);
                setIsSubmitting(false);
                setSubmitSuccess(true);

                // Reset form after success
                setTimeout(() => {
                    setFormData({
                        name: '',
                        email: '',
                        plan: 'free',
                        message: '',
                        terms: false
                    });
                    setSubmitSuccess(false);
                }, 3000);
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#000B1B] to-[#001636]">
            <div className="max-w-4xl w-full">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Register Now</h2>
                <p className="text-xl text-muted-foreground text-center mb-12">
                    Join our community and get started today
                </p>

                <Card>
                    <CardHeader>
                        <CardTitle>Registration Form</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {submitSuccess ? (
                            <div className="text-center py-8">
                                <div className="text-5xl mb-4">🎉</div>
                                <h3 className="text-2xl font-bold mb-2">Registration Successful!</h3>
                                <p className="text-muted-foreground mb-6">
                                    Thank you for registering. We've sent a confirmation email to {formData.email}.
                                </p>
                                <Button onClick={() => onNavigate('home')}>
                                    Back to Home
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter your email"
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Choose Plan</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {['free', 'standard', 'premium'].map((plan) => (
                                            <div
                                                key={plan}
                                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                    formData.plan === plan
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-muted-foreground hover:border-primary'
                                                }`}
                                                onClick={() => handlePlanChange(plan)}
                                            >
                                                <div className="flex items-center">
                                                    <div className={`w-4 h-4 rounded-full border mr-2 ${
                                                        formData.plan === plan
                                                            ? 'bg-primary border-primary'
                                                            : 'border-muted-foreground'
                                                    }`}>
                                                        {formData.plan === plan && (
                                                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                                        )}
                                                    </div>
                                                    <span className="capitalize font-medium">{plan}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message (Optional)</Label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Tell us anything you'd like to know..."
                                        rows={4}
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>

                                <div className="flex items-start space-x-2">
                                    <Checkbox
                                        id="terms"
                                        checked={formData.terms}
                                        onCheckedChange={handleCheckboxChange}
                                    />
                                    <Label htmlFor="terms" className="text-sm">
                                        I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                                    </Label>
                                </div>
                                {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

                                <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4">
                                    <Button type="button" variant="outline" onClick={() => onNavigate('details')}>
                                        View Plans
                                    </Button>
                                    <Button type="submit" size="lg" disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
