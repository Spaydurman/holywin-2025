import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Lanyard from '../ui/lanyard';
interface FormData {
    name: string;
    email: string;
    birthday: string;
    age: string;
    invitedBy: string;
    salvationist: string; // 'yes' or 'no'
}

interface RegistrationSectionProps {
    onNavigate: (section: string) => void;
}

export default function RegistrationSection({ onNavigate }: RegistrationSectionProps) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        birthday: '',
        age: '',
        invitedBy: '',
        salvationist: '' // Initialize salvationist state
    });

    const [errors, setErrors] = useState<{name?: string; email?: string; birthday?: string; age?: string; invitedBy?: string; salvationist?: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (name === 'name' && errors.name) {
            setErrors(prev => ({ ...prev, name: undefined }));
        } else if (name === 'email' && errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
        } else if (name === 'birthday' && errors.birthday) {
            setErrors(prev => ({ ...prev, birthday: undefined }));
        } else if (name === 'age' && errors.age) {
            setErrors(prev => ({ ...prev, age: undefined }));
        } else if (name === 'invitedBy' && errors.invitedBy) {
            setErrors(prev => ({ ...prev, invitedBy: undefined }));
        } else if (name === 'salvationist' && errors.salvationist) {
            setErrors(prev => ({ ...prev, salvationist: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: {name?: string; email?: string; birthday?: string; age?: string; invitedBy?: string; salvationist?: string} = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Full name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else {
            // More robust email validation regex
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (!formData.birthday) {
            newErrors.birthday = 'Birthday is required';
        } else {
            // Validate birthday format (YYYY-MM-DD)
            const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!birthdayRegex.test(formData.birthday)) {
                newErrors.birthday = 'Birthday must be in YYYY-MM-DD format';
            } else {
                // Check if birthday is a valid date and not in the future
                const birthdayDate = new Date(formData.birthday);
                const today = new Date();
                if (isNaN(birthdayDate.getTime())) {
                    newErrors.birthday = 'Please enter a valid date';
                } else if (birthdayDate > today) {
                    newErrors.birthday = 'Birthday cannot be in the future';
                } else if (today.getFullYear() - birthdayDate.getFullYear() > 120) {
                    newErrors.birthday = 'Please enter a realistic birthday';
                }
            }
        }

        if (!formData.age) {
            newErrors.age = 'Age is required';
        } else {
            // Validate age is a number between 1 and 120
            // First check if the input contains only numbers
            if (!/^\d+$/.test(formData.age)) {
                newErrors.age = 'Age must be a whole number';
            } else {
                const ageNum = parseInt(formData.age, 10);
                if (ageNum < 1) {
                    newErrors.age = 'Age must be at least 1';
                } else if (ageNum > 120) {
                    newErrors.age = 'Age must be 120 or less';
                }
            }
        }

        // Validate salvationist selection
        if (!formData.salvationist) {
            newErrors.salvationist = 'Please select an option';
        }

        // Only validate invitedBy if salvationist is 'no'
        if (formData.salvationist === 'no' && (!formData.invitedBy.trim() || formData.invitedBy.trim().length < 2)) {
            if (!formData.invitedBy.trim()) {
                newErrors.invitedBy = 'Please enter the name of the person who invited you';
            } else {
                newErrors.invitedBy = 'Invited by name must be at least 2 characters';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        birthday: formData.birthday,
                        age: formData.age,
                        invited_by: formData.invitedBy, // Note: snake_case for API
                        salvationist: formData.salvationist
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Registration successful:', data);
                    setSubmitSuccess(true);

                    // Reset form after success
                    setTimeout(() => {
                        setFormData({
                            name: '',
                            email: '',
                            birthday: '',
                            age: '',
                            invitedBy: '',
                            salvationist: ''
                        });
                        setSubmitSuccess(false);
                    }, 3000);
                } else {
                    // Handle validation errors from backend
                    if (data.errors) {
                        setErrors(data.errors);
                    } else {
                        console.error('Registration failed:', data.message || 'Unknown error');
                        // You might want to set a general error message here
                    }
                }
            } catch (error) {
                console.error('Error submitting registration:', error);
                // Handle network errors or other issues
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-[#001636] to-[#000B1B]">
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
                                    Thank you for registering. See you at Level Up.
                                </p>
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

                                    <div className="space-y-2">
                                        <Label htmlFor="birthday">Birthday</Label>
                                        <Input
                                            id="birthday"
                                            name="birthday"
                                            type="date"
                                            value={formData.birthday}
                                            onChange={handleInputChange}
                                            className={errors.birthday ? 'border-red-500' : ''}
                                        />
                                        {errors.birthday && <p className="text-red-500 text-sm">{errors.birthday}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="age">Age</Label>
                                        <Input
                                            id="age"
                                            name="age"
                                            type="number"
                                            min="1"
                                            max="120"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            placeholder="Enter your age"
                                            className={errors.age ? 'border-red-500' : ''}
                                        />
                                        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                                    </div>

                                    {/* Salvationist question with radio buttons */}
                                    <div className="space-y-2">
                                        <Label>Are you a salvationist? *</Label>
                                        <div className="flex space-x-4">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="salvationist"
                                                    value="yes"
                                                    checked={formData.salvationist === 'yes'}
                                                    onChange={handleInputChange}
                                                    className="mr-2"
                                                />
                                                Yes
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="salvationist"
                                                    value="no"
                                                    checked={formData.salvationist === 'no'}
                                                    onChange={handleInputChange}
                                                    className="mr-2"
                                                />
                                                No
                                            </label>
                                        </div>
                                        {errors.salvationist && <p className="text-red-500 text-sm">{errors.salvationist}</p>}
                                    </div>

                                    {/* Conditionally render the Invited By field based on salvationist selection */}
                                    {formData.salvationist === 'no' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="invitedBy">Invited By *</Label>
                                            <Input
                                                id="invitedBy"
                                                name="invitedBy"
                                                value={formData.invitedBy}
                                                onChange={handleInputChange}
                                                placeholder="Enter the name of the person who invited you"
                                                className={errors.invitedBy ? 'border-red-500' : ''}
                                            />
                                            {errors.invitedBy && <p className="text-red-500 text-sm">{errors.invitedBy}</p>}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center pt-4">
                                    <Button type="submit" size="lg" disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
        </div>
    );
}
