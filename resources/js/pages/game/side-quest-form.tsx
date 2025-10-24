import { Head } from '@inertiajs/react';
import GameLayout from '@/layouts/game-layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UidDisplay from '@/components/ui/uid-display';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { API_ENDPOINTS } from '@/config';

interface SideQuestLine {
    id: number;
    input_type: string;
    placeholder: string;
    is_question: boolean;
    answer: string;
    validation_rule: string;
    points: number;
}

interface SideQuestHeader {
    id: number;
    question: string;
    lines: SideQuestLine[];
}

interface GameSideQuestFormProps {
    header: SideQuestHeader;
    game_user?: {
        id: number;
        name: string;
        uid: string;
        email: string;
        birthday?: string;
        age?: number;
        invited_by?: string;
        salvationist?: string;
        mobile_number?: string;
    };
}

export default function GameSideQuestForm({ header, game_user }: GameSideQuestFormProps) {
    const [inputs, setInputs] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        // Initialize inputs array based on the number of lines
        setInputs(new Array(header.lines.length).fill(''));
    }, [header]);

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);
        
        // Clear error for this input
        const newErrors = [...errors];
        newErrors[index] = '';
        setErrors(newErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors([]);
        setSuccessMessage(null);

        try {
            // Check for empty inputs before submitting
            const newErrors = inputs.map(input => input.trim() ? '' : 'This field is required');
            const hasEmptyInputs = newErrors.some(error => error !== '');
            if (hasEmptyInputs) {
                setErrors(newErrors);
                return;
            }
            
            const response = await axios.post(API_ENDPOINTS.VALIDATE_SIDE_QUEST, {
                header_id: header.id,
                inputs: inputs.map((input, index) => ({
                    value: input,
                    input_type: header.lines[index].input_type,
                    placeholder: header.lines[index].placeholder,
                    is_question: header.lines[index].is_question,
                    answer: header.lines[index].answer,
                    validation_rule: header.lines[index].validation_rule,
                    points: header.lines[index].points
                })),
                user: game_user
            });

            if (response.data.success) {
                setSuccessMessage('Side quest completed successfully!');
                setTimeout(() => {
                    router.get('/game/side-quest');
                }, 2000);
            } else {
                const newErrors = new Array(header.lines.length).fill('');
                response.data.results.forEach((result: any, index: number) => {
                    if (!result.is_valid) {
                        newErrors[index] = result.error_message;
                    }
                });
                setErrors(newErrors);
            }
        } catch (error: any) {
            console.error('Error validating side quest:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                const newErrors = new Array(header.lines.length).fill('');
                error.response.data.errors.forEach((errMsg: string, index: number) => {
                    if (index < newErrors.length) {
                        newErrors[index] = errMsg;
                    }
                });
                setErrors(newErrors);
            } else {
                setErrors(['An error occurred while validating the side quest']);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        router.post('/game/logout');
    };

    return (
        <GameLayout breadcrumbs={[]}>
            <Head title={`Side Quest: ${header.question}`} />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-90 p-4 sm:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-40 to-purple-500 bg-clip-text text-transparent">
                            Side Quest: {header.question}
                        </h1>
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <div className="bg-gray-800/50 px-4 py-2 rounded-lg border-cyan-500/30 w-full sm:w-auto">
                                <span className="text-cyan-300 text-sm">UID: </span>
                                <UidDisplay uid={game_user?.uid} className="text-white font-mono break-all" />
                            </div>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 w-full sm:w-auto mt-2 sm:mt-0"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-900/50 border border-green-500/30 rounded-lg text-green-300">
                            {successMessage}
                        </div>
                    )}

                    <Card className="border-2 border-cyan-500/30 bg-gray-900/80 backdrop-blur-sm shadow-xl shadow-cyan-50/10">
                        <CardHeader>
                            <CardTitle className="text-xl text-cyan-300">{header.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {header.lines.map((line, index) => (
                                    <div key={line.id} className="space-y-2">
                                        <Label htmlFor={`input-${index}`} className="text-gray-300">
                                            {line.placeholder || `Input ${index + 1}`}
                                            <span className="text-red-400 ml-1">*</span> {/* All fields are required */}
                                        </Label>
                                        <Input
                                            id={`input-${index}`}
                                            type={line.input_type}
                                            placeholder={line.placeholder}
                                            value={inputs[index] || ''}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            className="bg-gray-800/50 border-cyan-500/30 text-white placeholder-gray-400"
                                            // required={true} // Make all inputs required
                                        />
                                        {errors[index] && (
                                            <p className="text-red-400 text-sm mt-1">{errors[index]}</p>
                                        )}
                                    </div>
                                ))}

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button
                                        type="button"
                                        onClick={() => router.get('/game/side-quest')}
                                        variant="outline"
                                        className="border-gray-500 text-gray-300 hover:bg-gray-700 w-full sm:w-auto"
                                    >
                                        Back to Quests
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full sm:w-auto bg-gradient-to-r from-cyan-60 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                                    >
                                        {isSubmitting ? 'Validating...' : 'Submit Quest'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </GameLayout>
    );
}