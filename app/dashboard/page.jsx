'use client'
import React, { useEffect, useState } from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import Analytics from './_components/Analytics'
import { db } from '@/utils/db'
import { UserAnswer, MockInterview } from '@/utils/schema'
import { eq, desc } from 'drizzle-orm'
import { useAuth } from '@/lib/AuthContext'
import { motion } from 'framer-motion'
import { Sparkles, Activity, Clock, Award, Star, History, TrendingUp, Target } from 'lucide-react'

function Dashboard() {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState([]);
  const [stats, setStats] = useState({ avg: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getDashboardData();
    }
  }, [user]);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const answers = await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.userEmail, user?.email))
        .orderBy(desc(UserAnswer.id));
      
      setFeedbackList(answers);

      if (answers.length > 0) {
        const sum = answers.reduce((acc, item) => acc + (Number(item.rating) || 0), 0);
        
        // Calculate Streak
        const uniqueDates = [...new Set(answers.map(a => moment(a.createdAt).format('YYYY-MM-DD')))];
        let streak = 0;
        let today = moment().format('YYYY-MM-DD');
        let yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
        
        if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
            streak = 1;
            let checkDate = moment(uniqueDates.includes(today) ? today : yesterday);
            while (uniqueDates.includes(checkDate.subtract(1, 'day').format('YYYY-MM-DD'))) {
                streak++;
            }
        }

        setStats({
          avg: (sum / answers.length).toFixed(1),
          count: answers.length,
          streak: streak
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-12 max-w-[1600px] mx-auto'>
      {/* Dynamic Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="space-y-2">
            <h1 className='text-6xl font-black tracking-tight text-gray-900 dark:text-white font-serif italic'>
              Command <span className="text-indigo-600">Center</span>
            </h1>
            <p className='text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mt-2'>Assessment Intelligence Dashboard v5.2</p>
          </div>
          
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20">
                  <Zap size={18} className="text-amber-500 fill-amber-500" />
                  <span className="text-sm font-black text-amber-600">{stats.streak || 0} DAY STREAK</span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Neural Link Synchronized</span>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">Ready for Live Simulation</p>
              </div>
          </div>
      </div>

      {/* Analytics Suite */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
            <div className="w-12 h-1.5 bg-indigo-600 rounded-full" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 flex items-center gap-3">
              <TrendingUp size={16} /> Performance Visualizer
            </h2>
        </div>
        <Analytics feedbackList={feedbackList} />
      </section>

      {/* Main Action Hub */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
        {/* Creation Node */}
        <section className='lg:col-span-1 space-y-8'>
           <div className="flex items-center gap-4">
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Simulation Access</h2>
           </div>
           <AddNewInterview />
           
           {/* Quick Tips Card */}
           <div className="p-8 bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                   <Target size={14} /> Mission Protocols
                </h4>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 leading-snug">Upload your resume for AI-tailored technical challenges.</p>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 leading-snug">Paste the JD to focus on specific tech stack requirements.</p>
                    </li>
                    <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1.5 shrink-0" />
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 leading-snug">Review weekly trends to identify your technical blindspots.</p>
                    </li>
                </ul>
           </div>
        </section>

        {/* History Stream */}
        <section className='lg:col-span-2 space-y-8'>
           <div className="flex items-center gap-4">
              <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Simulation Archive</h2>
           </div>
           <InterviewList />
        </section>
      </div>

      {/* Optional Streak System in Sidebar or Footer style */}
      <footer className="py-12 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-8 opacity-60">
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                  <Activity size={18} className="text-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Uptime: 99.9%</span>
              </div>
              <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800" />
              <div className="flex items-center gap-2">
                  <Clock size={18} className="text-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Last Synced: Just Now</span>
              </div>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-400">© 2026 AI-INTERVIEW PROTOCOL • SECURE LINK ENCRYPTED</p>
      </footer>
    </div>
  )
}

export default Dashboard