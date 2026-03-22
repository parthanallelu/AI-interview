'use client'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useAuth } from '@/lib/AuthContext';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Calendar, Briefcase, FileText, ArrowRight } from 'lucide-react';

function InterviewList() {
    const { user } = useAuth();
    const [interviewList, setInterviewList] = useState([]);
    const router = useRouter();

    useEffect(() => {
        user && GetInterviewList();
    }, [user])

    const GetInterviewList = async () => {
        const result = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.createdby, user?.email))
            .orderBy(desc(MockInterview.id));

        setInterviewList(result);
    }

    return (
        <div className='mt-8 max-w-7xl'>
            <div className="flex items-center justify-between mb-8 px-4">
                <h2 className='font-black text-2xl dark:text-white flex items-center gap-3 font-serif'>
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <History size={24} />
                    </div>
                    Recent Interviews
                </h2>
                <div className="text-sm font-bold text-gray-400 dark:text-gray-500 flex items-center gap-2">
                    Total: <span className="text-indigo-600 dark:text-indigo-400">{interviewList?.length}</span> sessions
                </div>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 pt-0'>
                {interviewList?.length > 0 ? interviewList.map((interview, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className='bg-white dark:bg-gray-900 p-7 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900 transition-all group flex flex-col h-full'
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 p-3.5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                <Briefcase className='text-indigo-600 dark:text-indigo-400' size={24} />
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                    {interview.createdat ? new Date(interview.createdat).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                                </span>
                                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                    Completed
                                </div>
                            </div>
                        </div>
                        
                        <h3 className='font-black text-xl text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
                            {interview.jobPosition}
                        </h3>
                        
                        <p className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 line-clamp-2'>
                            Professional • {interview.jobExperience} Years Exp
                        </p>
                        
                        <div className='flex items-center gap-3 mt-auto pt-6 border-t border-gray-50 dark:border-gray-800'>
                            <Button size="sm" variant="outline" className="flex-1 h-11 rounded-xl text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 font-bold"
                                onClick={() => router.push('/dashboard/interview/' + interview?.mockid + '/feedback')}>
                                Results
                            </Button>
                            <Button size="sm" className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/10 active:scale-95 transition-all text-xs"
                                onClick={() => router.push('/dashboard/interview/' + interview?.mockid)}>
                                Retake
                            </Button>
                        </div>
                    </motion.div>
                )) : (
                    [1, 2, 3].map((item, index) => (
                        <div key={index} className='h-[280px] w-full bg-gray-100/50 dark:bg-gray-800/50 animate-pulse rounded-[32px] border border-gray-100 dark:border-gray-800'></div>
                    ))
                )}
            </div>
        </div>
    )
}

function History({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg>
    )
}

export default InterviewList
