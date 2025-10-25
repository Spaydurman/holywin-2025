import { Head } from '@inertiajs/react';
import GameLayout from '@/layouts/game-layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UidDisplay from '@/components/ui/uid-display';
import { router } from '@inertiajs/react';

interface SideQuestLine {
    id: number;
    input_type: string;
    placeholder: string;
    is_question: boolean;
    validation_rule: string;
    points: number;
}

interface SideQuestHeader {
    id: number;
    question: string;
    lines: SideQuestLine[];
}

interface GameSideQuestProps {
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
    headers: SideQuestHeader[];
    total_points?: number;
}

export default function GameSideQuest({ game_user, headers, total_points }: GameSideQuestProps) {
    const handleLogout = () => {
        router.post('/game/logout');
    };

    const handleStartQuest = (headerId: number) => {
        // Redirect to the form for the specific quest
        router.get(`/game/side-quest/form/${headerId}`);
    };

    return (
        <GameLayout breadcrumbs={[]}>
            <Head title="Game Side Quest" />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-40 to-purple-500 bg-clip-text text-transparent">
                            Game Side Quest Portal
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

                    <Card className="border-2 border-cyan-500/30 bg-gray-900/80 backdrop-blur-sm shadow-xl shadow-cyan-50/10 mb-8">
                        <CardHeader>
                            <CardTitle className="text-xl text-cyan-300">Welcome, {game_user?.name}!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300 mb-4">
                                You have successfully accessed the game portal. Complete side quests to earn points and rewards!
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-cyan-500/20">
                                    <h3 className="text-lg font-semibold text-cyan-300 mb-3">Current Quests</h3>
                                    <ul className="space-y-2">
                                        <li className="flex justify-between items-center py-2 border-b border-gray-700">
                                            <span className="text-gray-300">Complete Registration</span>
                                            <span className="text-green-400 font-semibold">✓ Completed</span>
                                        </li>
                                        <li className="flex justify-between items-center py-2 border-b border-gray-700">
                                            <span className="text-gray-300">Attend Opening Ceremony</span>
                                            <span className="text-yellow-400">In Progress</span>
                                        </li>
                                        <li className="flex justify-between items-center py-2">
                                            <span className="text-gray-300">Complete Side Quests</span>
                                            <span className="text-gray-400">Pending</span>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="bg-gray-800/50 p-6 rounded-xl border border-cyan-500/20">
                                    <h3 className="text-lg font-semibold text-cyan-300 mb-3">Your Stats</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-gray-400 text-sm">UID</p>
                                            <UidDisplay uid={game_user?.uid} className="text-white font-mono" />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Status</p>
                                            <p className="text-green-400">Active Player</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Points</p>
                                            <p className="text-white">{total_points || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {headers.map((header) => (
                            <motion.div
                                key={header.id}
                                whileHover={{ y: -5 }}
                                className="bg-gray-800/50 rounded-xl border border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-cyan-300">Side Quest {header.id}</h3>
                                    <span className="bg-purple-50/20 text-purple-300 px-3 py-1 rounded-full text-xs">
                                        {header.lines.reduce((total, l) => total + (Number(l.points) || 0), 0)} pts
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm mb-4">
                                    {header.question}
                                </p>
                                <Button
                                    className="w-full bg-gradient-to-r from-cyan-900 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white"
                                    onClick={() => handleStartQuest(header.id)}
                                >
                                    Start Quest
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
                
                {/* Futuristic background elements */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                </div>
            </div>
        </GameLayout>
    );
}