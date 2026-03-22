'use client'
import React, { useMemo } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts'
import { TrendingUp, Award, BarChart3, Activity, Target, Zap, Trophy, Star } from 'lucide-react'
import { motion } from 'framer-motion'

function Analytics({ feedbackList = [] }) {
    const chartData = useMemo(() => {
        return feedbackList.map((item, index) => ({
            name: `Session ${index + 1}`,
            score: Number(item.rating) || 0,
            date: item.createdAt || ''
        })).slice(-10); // Last 10 sessions
    }, [feedbackList]);

    const stats = useMemo(() => {
        if (feedbackList.length === 0) return { avg: 0, total: 0, highest: 0 };
        const total = feedbackList.length;
        const sum = feedbackList.reduce((acc, item) => acc + (Number(item.rating) || 0), 0);
        const avg = (sum / total).toFixed(1);
        const highest = Math.max(...feedbackList.map(item => Number(item.rating) || 0));
        return { avg, total, highest };
    }, [feedbackList]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Trend Chart */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-3 bg-white dark:bg-gray-950 p-10 rounded-[48px] border border-gray-100 dark:border-gray-800 shadow-xl"
            >
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                            <TrendingUp className="text-indigo-600" />
                            Performance Velocity
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Growth Index across latest 10 sequences</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-5 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100/50">
                            Trajectory: +12%
                        </div>
                    </div>
                </div>

                <div className="h-[300px] w-full">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                                    domain={[0, 10]}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                                    itemStyle={{ fontWeight: 900, fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                             <BarChart3 size={40} className="text-gray-200 mb-4" />
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calibration Data Insufficient</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Quick Metrics */}
            <div className="space-y-6">
                <div className="p-8 bg-indigo-600 rounded-[40px] shadow-2xl shadow-indigo-600/20 text-white relative overflow-hidden group">
                     <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-6">Aggregate Mastery</h4>
                     <div className="flex items-end gap-3">
                         <span className="text-6xl font-black leading-none tracking-tighter italic font-serif">{stats.avg}</span>
                         <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-1">Index Score</span>
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest mt-6 flex items-center gap-2">
                        <Activity size={14} /> Global Rank: Platinum
                     </p>
                </div>

                <div className="p-8 bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl group">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Peak Performance</h4>
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                             <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-center text-amber-600 group-hover:rotate-12 transition-transform">
                                 <Trophy size={24} />
                             </div>
                             <span className="text-4xl font-black tracking-tighter">{stats.highest}</span>
                         </div>
                         <div className="text-right">
                             <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                                <Zap size={10} fill="currentColor" /> Record
                             </p>
                             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Assessment Max</p>
                         </div>
                     </div>
                </div>

                <div className="p-8 bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl group">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Total Engagements</h4>
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                             <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                 <Target size={24} />
                             </div>
                             <span className="text-4xl font-black tracking-tighter">{stats.total}</span>
                         </div>
                         <div className="text-right">
                             <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Units</p>
                             <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Simulations Complete</p>
                         </div>
                     </div>
                </div>
            </div>
        </div>
    )
}

export default Analytics
