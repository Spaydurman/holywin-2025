import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthLayout from '@/layouts/auth-layout';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';

export default function GameLogin() {
    const [uid, setUid] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        
        router.post('/game/login', { 
            uid 
        }, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <AuthLayout title="Game Login" description="Enter your UID to access the game">
            <Head title="Game Login" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-full max-w-md border-2 border-cyan-500/30 bg-gray-900/80 backdrop-blur-sm shadow-xl shadow-cyan-50/10">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-40 to-purple-500 bg-clip-text text-transparent">
                            Game Access Portal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="uid" className="text-sm font-medium text-cyan-200">
                                    UID
                                </label>
                                <div className="relative">
                                    <Input
                                        id="uid"
                                        name="uid"
                                        type="text"
                                        value={uid}
                                        onChange={(e) => setUid(e.target.value)}
                                        className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-400 focus:ring-cyan-500 focus:border-cyan-500 py-6 text-lg"
                                        placeholder="Enter your UID"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-md pointer-events-none border-cyan-500/20 shadow-[0_0_10px_#00ffff20]"></div>
                                </div>
                                {errors.uid && <InputError message={errors.uid} />}
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-cyan-60 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white py-6 text-lg font-bold transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-cyan-50/20"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authenticating...
                                    </span>
                                ) : (
                                    'Access Game'
                                )}
                            </Button>
                        </form>
                        
                        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-cyan-500/20">
                            <h3 className="text-sm font-semibold text-cyan-300 mb-2">How to find your UID?</h3>
                            <p className="text-xs text-gray-300">
                                Your UID is a unique code that was provided during registration. 
                                It typically starts with "LVLUP" followed by 4 characters.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            
            {/* Futuristic background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            </div>
        </AuthLayout>
    );
}