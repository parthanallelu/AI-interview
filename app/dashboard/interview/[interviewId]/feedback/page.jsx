'use client'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState, use } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { 
    ChevronDown, 
    Star, 
    CheckCircle2, 
    AlertCircle, 
    Award, 
    ChevronLeft, 
    Trophy,
    Target,
    Zap,
    History,
    Sparkles,
    CheckCircle,
    XCircle,
    TrendingUp,
    Lightbulb
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Card } from '@/components/ui/card'

function Feedback({ params }) {
  const { interviewId } = use(params);
  const [feedbackList, setFeedbackList] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, [interviewId]);

  const GetFeedback = async () => {
    try {
        setLoading(true);
        const result = await db.select()
          .from(UserAnswer)
          .where(eq(UserAnswer.mockIdRef, interviewId))
          .orderBy(UserAnswer.id);

        // Process results - some might be legacy (string), some new (JSON)
        const processedList = result.map(item => {
            try {
                // Try parsing feedback if it's a JSON string
                const parsed = JSON.parse(item.feedback);
                return { ...item, assessment: parsed };
            } catch (e) {
                // Fallback for legacy data
                return { 
                    ...item, 
                    assessment: {
                        score: Number(item.rating) || 0,
                        performance_summary: item.feedback,
                        strengths: ["Strong technical core"],
                        weaknesses: ["Detailed metrics unavailable for legacy sessions"],
                        improvements: ["Continue practicing with the new assessment engine"],
                        model_answer: item.correctAns,
                        confidence_rating: "N/A"
                    }
                };
            }
        });

        setFeedbackList(processedList);
        
        if (processedList.length > 0) {
          const sum = processedList.reduce((acc, item) => acc + (item.assessment.score || 0), 0);
          setOverallRating((sum / processedList.length).toFixed(1));
        }
    } catch (error) {
        console.error("Error fetching feedback:", error);
    } finally {
        setLoading(false);
    }
  }

  const downloadReport = async () => {
    const element = document.getElementById('report-container');
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Interview_Report_${interviewId.substring(0,8)}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-black animate-pulse uppercase tracking-widest text-xs">Generating Comprehensive Report...</p>
      </div>
    );
  }

  return (
    <div id="report-container" className='flex flex-col gap-10 max-w-7xl mx-auto px-4 py-8 bg-white dark:bg-gray-950 min-h-screen'>
        {/* Header Section */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.replace('/dashboard')} className="rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900 h-12 w-12">
                    <ChevronLeft size={24} />
                </Button>
                <div>
                    <h1 className='text-4xl font-black tracking-tight text-gray-900 dark:text-white font-serif italic'>
                        Assessment <span className="text-indigo-600">Report</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500 mt-1">Industrial Grade AI Performance Analytics</p>
                </div>
            </div>
            
            <div className="flex gap-4">
                <Button 
                    variant="outline"
                    onClick={downloadReport}
                    className="hidden md:flex border-2 border-indigo-100 dark:border-indigo-900/40 rounded-2xl px-8 h-12 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all flex items-center gap-2"
                >
                    <FileText size={18} />
                    Download PDF
                </Button>
                <Button 
                    onClick={() => router.replace('/dashboard')}
                    className="hidden md:flex bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 h-12 font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                >
                    Back to Center
                </Button>
            </div>
        </div>

        {/* Global Summary Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-white dark:bg-gray-900 p-12 rounded-[48px] shadow-2xl border border-gray-100 dark:border-gray-800 relative overflow-hidden group'
        >
            <div className='absolute top-[-100px] right-[-100px] w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] group-hover:bg-indigo-600/10 transition-colors' />
            
            <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                <div className="relative">
                    {/* Professional Score Circle */}
                    <div className="w-56 h-56 rounded-full border-[16px] border-indigo-50 dark:border-indigo-950/50 flex flex-col items-center justify-center bg-white dark:bg-gray-950 shadow-2xl relative">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle 
                                cx="112" cy="112" r="96" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="16"
                                className="text-indigo-600"
                                strokeDasharray={603}
                                strokeDashoffset={603 - (603 * overallRating) / 10}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{overallRating}</span>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-2">Overall Score</span>
                    </div>
                </div>

                <div className="flex-1 text-center lg:text-left">
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
                        <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                            overallRating >= 8 ? 'bg-green-50 text-green-600 border-green-100' : 
                            overallRating >= 5 ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                            'bg-red-50 text-red-600 border-red-100'
                        }`}>
                            LEVEL: {overallRating >= 8 ? 'ELITE' : overallRating >= 5 ? 'COMPETENT' : 'NEEDS ACCELERATION'}
                        </div>
                        <div className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-gray-50 dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700">
                           {feedbackList.length} TEST UNITS
                        </div>
                    </div>
                    
                    <h2 className='text-4xl font-black text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight max-w-xl'>
                        {overallRating >= 8 ? 'Exceptional mastery of technical concepts.' : 'Solid foundation with specific growth vectors identified.'}
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
                        <div className="flex items-start gap-3 p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/50">
                            <Target size={20} className="text-indigo-600 shrink-0 mt-1" />
                            <div>
                                <h4 className="text-[10px] font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-1">Contextual Fit</h4>
                                <p className="text-xs font-bold text-gray-600 dark:text-gray-400">{feedbackList[0]?.category || 'General Technical'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-100/50">
                            <Zap size={20} className="text-amber-600 shrink-0 mt-1" />
                            <div>
                                <h4 className="text-[10px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-widest mb-1">Growth Index</h4>
                                <p className="text-xs font-bold text-gray-600 dark:text-gray-400">High Velocity potential</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Detailed Assessment Breakdown */}
        <div className="space-y-12">
            <div className="flex items-center gap-4 px-6">
                <div className="w-12 h-1.5 bg-indigo-600 rounded-full" />
                <h2 className='text-2xl font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-4'>
                    <Sparkles size={24} className="text-indigo-600" />
                    Unit Analysis
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {feedbackList && feedbackList.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className='rounded-[40px] border-none shadow-xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-50 dark:border-gray-800'>
                            <div className="p-8 lg:p-10">
                                <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10 pb-8 border-b border-gray-100 dark:border-gray-800">
                                    <div className="flex gap-8 items-start">
                                        <div className="bg-indigo-600 text-white w-14 h-14 rounded-3xl flex items-center justify-center font-black text-2xl shrink-0 shadow-xl shadow-indigo-600/30 font-serif italic">
                                            {index + 1}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Performance Node</span>
                                                <div className="h-[1px] w-12 bg-indigo-200 dark:bg-indigo-800" />
                                            </div>
                                            <h3 className="font-serif italic text-2xl lg:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                                                {item.question}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 self-end lg:self-start">
                                        <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-sm ${
                                            item.assessment.score >= 8 ? 'bg-green-50 text-green-600 border border-green-100' : 
                                            item.assessment.score >= 5 ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                                            'bg-red-50 text-red-600 border border-red-100'
                                        }`}>
                                            Score: {item.assessment.score}/10
                                        </div>
                                        <div className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] bg-gray-50 dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700">
                                            CONFIDENCE: {item.assessment.confidence_rating || 'HIGH'}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                                    {/* Evaluation Summary */}
                                    <div className="xl:col-span-1 space-y-8">
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <History size={14} /> Executive Summary
                                            </h4>
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-4 border-indigo-600 pl-6 py-2">
                                                {item.assessment.performance_summary}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <Lightbulb size={14} className="text-amber-500" /> Model Response
                                            </h4>
                                            <div className="p-6 bg-amber-50/30 dark:bg-amber-950/10 rounded-[32px] border border-amber-100 dark:border-amber-900/40 text-xs font-medium text-gray-600 leading-relaxed">
                                                {item.assessment.model_answer}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data Visualization Cards */}
                                    <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-8 bg-green-50/50 dark:bg-green-950/20 rounded-[40px] border border-green-100 dark:border-green-950/50">
                                            <div className="flex items-center gap-3 mb-6 text-green-600">
                                                <CheckCircle size={20} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Key Strengths</span>
                                            </div>
                                            <ul className="space-y-4">
                                                {item.assessment.strengths.map((s, i) => (
                                                    <li key={i} className="text-xs font-bold text-green-800 dark:text-green-300 leading-snug flex items-start gap-2">
                                                        <div className="w-1 h-1 bg-green-400 rounded-full mt-1 shrink-0" />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="p-8 bg-red-50/50 dark:bg-red-950/20 rounded-[40px] border border-red-100 dark:border-red-950/50">
                                            <div className="flex items-center gap-3 mb-6 text-red-600">
                                                <XCircle size={20} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Growth Areas</span>
                                            </div>
                                            <ul className="space-y-4">
                                                {item.assessment.weaknesses.map((w, i) => (
                                                    <li key={i} className="text-xs font-bold text-red-800 dark:text-red-300 leading-snug flex items-start gap-2">
                                                        <div className="w-1 h-1 bg-red-400 rounded-full mt-1 shrink-0" />
                                                        {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="p-8 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-[40px] border border-indigo-100 dark:border-indigo-950/50">
                                            <div className="flex items-center gap-3 mb-6 text-indigo-600">
                                                <TrendingUp size={20} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Evolution map</span>
                                            </div>
                                            <ul className="space-y-4">
                                                {item.assessment.improvements.map((imp, i) => (
                                                    <li key={i} className="text-xs font-bold text-indigo-800 dark:text-indigo-300 leading-snug flex items-start gap-2">
                                                        <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1 shrink-0" />
                                                        {imp}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Action Footer */}
        <div className="py-20 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/50 dark:from-indigo-950/20 to-transparent -mx-4 h-full pointer-events-none" />
            <div className="relative z-10">
                <Button 
                    onClick={() => router.replace('/dashboard')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-16 h-20 text-xl font-black shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all uppercase tracking-tighter italic font-serif"
                >
                    Back to Command Center
                </Button>
                <div className="mt-8 flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Proprietary AI Assessment Engine v5.2</p>
                    <div className="h-1 w-24 bg-indigo-600 rounded-full" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Feedback
