"use client"

import React, { useEffect, useState } from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import { Card, CardContent } from "@/components/ui/card"
import { 
    Users, 
    CheckCircle2, 
    Trophy, 
    Calendar,
    ArrowUpRight,
    TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'
import { db } from '@/utils/db'
import { MockInterview, UserAnswer } from '@/utils/schema'
import { useAuth } from '@/lib/AuthContext'
import { eq, count, avg } from 'drizzle-orm'

function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        avgScore: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            
            // Fetch total interviews
            const totalResult = await db.select({ value: count() })
                .from(MockInterview)
                .where(eq(MockInterview.createdby, user.email));
            
            // Fetch completed (interviews with answers)
            const completedResult = await db.select({ value: count() })
                .from(UserAnswer)
                .where(eq(UserAnswer.userEmail, user.email));
            
            // Fetch avg score
            const avgResult = await db.select({ value: avg(UserAnswer.rating) })
                .from(UserAnswer)
                .where(eq(UserAnswer.userEmail, user.email));

            setStats({
                total: totalResult[0]?.value || 0,
                completed: completedResult[0]?.value || 0,
                avgScore: parseFloat(avgResult[0]?.value || 0).toFixed(1)
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-serif">
                        Supercharge Your Preparation
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                        Welcome back, <span className="text-indigo-600 dark:text-indigo-400 font-bold">{user?.name}</span>. Track your progress and crush your next interview.
                    </p>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full border border-green-100 dark:border-green-900 shadow-sm">
                    <TrendingUp size={16} />
                    <span>8.2% improvement this week</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: 'Total Interviews', value: stats.total, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800' },
                    { label: 'Completed Questions', value: stats.completed, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-800' },
                    { label: 'Average AI Score', value: `${stats.avgScore}/10`, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className={`overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 rounded-3xl group ${stat.bg}`}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                                        <stat.icon size={28} />
                                    </div>
                                    <ArrowUpRight className="text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" size={20} />
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-1">
                                        {loading ? <div className="h-10 w-16 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" /> : stat.value}
                                    </h3>
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AddNewInterview />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-2">
                <InterviewList />
            </div>
        </div>
    )
}

export default Dashboard