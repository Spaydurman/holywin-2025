import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
    name: string;
    email: string;
    birthday: string;
    age: string;
    invitedBy: string;
    salvationist: string;
    mobileNumber: string;
}

interface RegistrationFormProps {
    onSuccess?: () => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        birthday: '',
        age: '',
        invitedBy: '',
        salvationist: '',
        mobileNumber: ''
    });

    const [errors, setErrors] = useState<{name?: string; email?: string; birthday?: string; age?: string; invitedBy?: string; salvationist?: string; mobileNumber?: string}>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [emailValidationStatus, setEmailValidationStatus] = useState<'valid' | 'invalid' | 'checking' | null>(null);
    const emailCheckTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (emailCheckTimeout.current) {
                clearTimeout(emailCheckTimeout.current);
            }
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'name' && errors.name) {
            setErrors(prev => ({ ...prev, name: undefined }));
        } else if (name === 'email' && errors.email) {
            setErrors(prev => ({ ...prev, email: undefined }));
            setEmailValidationStatus(null);
        } else if (name === 'birthday' && errors.birthday) {
            setErrors(prev => ({ ...prev, birthday: undefined }));
        } else if (name === 'age' && errors.age) {
            setErrors(prev => ({ ...prev, age: undefined }));
        } else if (name === 'invitedBy' && errors.invitedBy) {
            setErrors(prev => ({ ...prev, invitedBy: undefined }));
        } else if (name === 'salvationist' && errors.salvationist) {
            setErrors(prev => ({ ...prev, salvationist: undefined }));
        } else if (name === 'mobileNumber' && errors.mobileNumber) {
            setErrors(prev => ({ ...prev, mobileNumber: undefined }));
        }

        if (name === 'salvationist' && value === 'yes') {
            setFormData(prev => ({
                ...prev,
                invitedBy: '',
                mobileNumber: ''
            }));
            setErrors(prev => ({
                ...prev,
                invitedBy: undefined,
                mobileNumber: undefined
            }));
        }

        if (name === 'email') {
            if (emailCheckTimeout.current) {
                clearTimeout(emailCheckTimeout.current);
            }

            emailCheckTimeout.current = setTimeout(async () => {
                if (value) {
                    await checkEmailAvailability(value);
                } else {
                    setEmailValidationStatus(null);
                }
            }, 500);
        }
    };

    const checkEmailAvailability = async (email: string) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(email)) {
            setEmailValidationStatus('invalid');
            return;
        }

        setEmailValidationStatus('checking');

        try {
            const response = await axios.get(`/api/check-email?email=${encodeURIComponent(email)}`);

            if (response.data.exists) {
                setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
                setEmailValidationStatus('invalid');
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    if (newErrors.email?.includes('already registered')) {
                        delete newErrors.email;
                    }
                    return newErrors;
                });
                setEmailValidationStatus('valid');
            }
        } catch (error) {
            console.error('Error checking email availability:', error);
            setEmailValidationStatus('valid');
        }
    };

    const validateForm = (): boolean => {
        const newErrors: {name?: string; email?: string; birthday?: string; age?: string; invitedBy?: string; salvationist?: string; mobileNumber?: string} = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Full name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else {
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            } else if (emailValidationStatus === 'invalid') {
                newErrors.email = 'This email is already registered';
            }
        }

        if (!formData.birthday) {
            newErrors.birthday = 'Birthday is required';
        } else {
            const birthdayRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!birthdayRegex.test(formData.birthday)) {
                newErrors.birthday = 'Birthday must be in YYYY-MM-DD format';
            } else {
                const birthdayDate = new Date(formData.birthday);
                const today = new Date();
                if (isNaN(birthdayDate.getTime())) {
                    newErrors.birthday = 'Please enter a valid date';
                } else if (birthdayDate > today) {
                    newErrors.birthday = 'Please enter the day when you were born';
                } else if (today.getFullYear() - birthdayDate.getFullYear() > 120) {
                    newErrors.birthday = 'Please enter a realistic birthday';
                }
            }
        }

        if (!formData.age) {
            newErrors.age = 'Age is required';
        } else {
            if (!/^\d+$/.test(formData.age)) {
                newErrors.age = 'Age must be a whole number';
            } else {
                const ageNum = parseInt(formData.age, 10);
                if (formData.birthday) {
                    const birthdayDate = new Date(formData.birthday);
                    const today = new Date();
                    let calculatedAge = today.getFullYear() - birthdayDate.getFullYear();
                    const monthDiff = today.getMonth() - birthdayDate.getMonth();

                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdayDate.getDate())) {
                        calculatedAge--;
                    }

                    if (Math.abs(calculatedAge - ageNum) > 1) {
                        newErrors.age = `Age does not match your birthday`;
                    }
                } else if (ageNum < 13) {
                    newErrors.age = 'Age must be at least 13 years old';
                } else if (ageNum > 35) {
                    newErrors.age = 'Age must be 35 years old or less';
                }
            }
        }

        if (!formData.salvationist) {
            newErrors.salvationist = 'Please select an option';
        }

        if (formData.salvationist === 'no' && (!formData.invitedBy.trim() || formData.invitedBy.trim().length < 2)) {
            if (!formData.invitedBy.trim()) {
                newErrors.invitedBy = 'Please enter the name of the person who invited you';
            } else {
                newErrors.invitedBy = 'Invited by name must be at least 2 characters';
            }
        }

        if (formData.salvationist === 'no' && !formData.mobileNumber.trim()) {
            newErrors.mobileNumber = 'Mobile number is required';
        } else if (formData.mobileNumber.trim()) {
            const mobileRegex = /^(09\d{9}|\+639\d{9})$/;
            if (!mobileRegex.test(formData.mobileNumber.trim())) {
                newErrors.mobileNumber = 'Please enter a valid mobile number (e.g., 09123456789 or +639123456789)';
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
                const response = await axios.post('/api/register', {
                    name: formData.name,
                    email: formData.email,
                    birthday: formData.birthday,
                    age: formData.age,
                    invited_by: formData.invitedBy,
                    salvationist: formData.salvationist,
                    mobile_number: formData.mobileNumber
                });

                setSubmitSuccess(true);

                if (onSuccess) {
                    onSuccess();
                }

                setTimeout(() => {
                    setFormData({
                        name: '',
                        email: '',
                        birthday: '',
                        age: '',
                        invitedBy: '',
                        salvationist: '',
                        mobileNumber: ''
                    });

                    setEmailValidationStatus(null);
                    setSubmitSuccess(false);
                }, 5000);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        if (error.response.data.errors) {
                            setErrors(error.response.data.errors);
                        } else {
                            console.error('Registration failed:', error.response.data.message || 'Unknown error');
                        }
                    } else if (error.request) {
                        console.error('No response received:', error.request);
                    } else {
                        console.error('Error setting up request:', error.message);
                    }
                } else {
                    console.error('Unexpected error:', error);
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className='max-w-6xl w-full flex items-center justify-center flex-col text-white'>
            <div className="max-w-6xl w-full">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">Register Now</h2>
                <p className="text-xl text-muted-foreground text-center mb-12">
                    Join our community and worship with us
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
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter your email"
                                                className={`${errors.email ? 'border-red-500' : ''} ${emailValidationStatus === 'checking' ? 'pr-10' : ''}`}
                                            />
                                            {emailValidationStatus === 'checking' && (
                                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24">
                                                        <path fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c4.97 0 9 4.03 9 9">
                                                            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"/>
                                                            <animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
                                                        </path>
                                                    </svg>
                                                </span>
                                            )}
                                            {emailValidationStatus === 'valid' && !errors.email && (
                                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">✓</span>
                                            )}
                                            {emailValidationStatus === 'invalid' && (
                                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">✗</span>
                                            )}
                                        </div>
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

                                    {formData.salvationist === 'no' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="mobileNumber">Mobile Number *</Label>
                                            <Input
                                                id="mobileNumber"
                                                name="mobileNumber"
                                                value={formData.mobileNumber}
                                                onChange={handleInputChange}
                                                placeholder="Enter your mobile number (e.g., 09123456789 or +639123456789)"
                                                className={errors.mobileNumber ? 'border-red-500' : ''}
                                            />
                                            {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center pt-4">
                                    <Button type="submit" size="lg" className='cursor-pointer text-black border border-black' disabled={isSubmitting}>
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
