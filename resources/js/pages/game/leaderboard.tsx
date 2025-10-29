import { Head } from '@inertiajs/react';
import GameLayout from '@/layouts/game-layout';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '@/config';

interface LeaderboardEntry {
    name: string;
    total_points: number;
    rank: number;
}

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_ENDPOINTS.LEADERBOARD);
            const dataWithRanks = response.data.map((entry: any, index: number) => ({
                ...entry,
                rank: index + 1
            }));
            setLeaderboard(dataWithRanks);
        } catch (err) {
            setError('Failed to load leaderboard data');
            console.error('Error fetching leaderboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        router.post('/game/logout');
    };

    return (
        <GameLayout breadcrumbs={[{ title: "Leaderboard", href: "/game/leaderboard" }]}>
            <Head title="Game Leaderboard" />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-90 p-4 sm:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-purple-500 bg-clip-text text-transparent">
                            Game Leaderboard
                        </h1>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                        >
                            Logout
                        </Button>
                    </div>

                    <Card className="border-2 border-cyan-500/30 bg-gray-900/80 backdrop-blur-sm shadow-xl shadow-cyan-50/10">
                        <CardHeader>
                            <CardTitle className="text-xl text-cyan-300">Top Players</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-8 text-red-400">
                                    {error}
                                    <Button 
                                        onClick={fetchLeaderboard}
                                        className="mt-4 bg-cyan-600 hover:bg-cyan-700"
                                    >
                                        Retry
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Rank</th>
                                                <th className="text-left py-3 px-4 text-cyan-300 font-semibold">Player</th>
                                                <th className="text-right py-3 px-4 text-cyan-300 font-semibold">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaderboard.map((entry, index) => (
                                                <motion.tr
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    className={`border-b border-gray-800 hover:bg-gray-800/50 ${index < 3 ? 'bg-gradient-to-r from-gray-800/30 to-transparent' : ''}`}
                                                >
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center">
                                                            {entry.rank <= 3 ? (
                                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                                                    entry.rank === 1 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                                                    entry.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                                                                    'bg-gradient-to-r from-amber-700 to-amber-800'
                                                                }`}>
                                                                    {entry.rank}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 font-semibold">{entry.rank}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center">
                                                            <div className="bg-gray-700/50 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                                                                <span className="text-cyan-40 font-bold">
                                                                    {entry.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <span className="text-white font-medium">{entry.name}</span>
                                                            {entry.rank <= 3 && (
                                                                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30">
                                                                    {entry.rank === 1 ? '🏆 CHAMPION' : entry.rank === 2 ? '🥈 SILVER' : '🥉 BRONZE'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                                            {entry.total_points}
                                                        </span>
                                                        <span className="text-gray-400 ml-1">pts</span>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {leaderboard.length === 0 && (
                                        <div className="text-center py-8 text-gray-400">
                                            No players on the leaderboard yet. Be the first to earn points!
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
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