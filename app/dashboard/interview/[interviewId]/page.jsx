"use client"
import React, { useEffect, useState, use } from 'react'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import Webcam from 'react-webcam';
import {
  Lightbulb,
  WebcamIcon,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Brain,
  Camera,
  Mic,
  MicOff,
  CameraOff,
  Play,
  Settings,
  ShieldCheck,
  Zap,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

function Interview({ params }) {
  const { interviewId } = use(params);
  const router = useRouter();
  const [interviewDetails, setInterviewDetails] = useState();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [webcamStream, setWebcamStream] = useState(null);
  const [checklist, setChecklist] = useState({
    camera: false,
    environment: false,
    mindset: false
  });

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      setIsLoading(true);
      const result = await db.select().from(MockInterview).where(eq(MockInterview.mockid, interviewId));
      setInterviewDetails(result[0]);
    } catch (error) {
      console.error('Error fetching interview details:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCameraToggle = () => {
    setIsCameraOpen(!isCameraOpen);
    setChecklist(prev => ({ ...prev, camera: !isCameraOpen }));
  };

  const handleChecklistToggle = (item) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const handleWebcamUserMedia = (stream) => {
    setIsCameraOpen(true);
    setIsMicEnabled(true);
    setWebcamStream(stream);
    setChecklist(prev => ({ ...prev, camera: true }));
  };

  const handleWebcamUserMediaError = (error) => {
    console.error('Webcam error:', error);
    setIsCameraOpen(false);
    setIsMicEnabled(false);
    setWebcamStream(null);
    setChecklist(prev => ({ ...prev, camera: false }));
  };

  const startInterviewWithCamera = () => {
    if (isCameraOpen && webcamStream) {
      const cameraState = {
        isCameraEnabled: true,
        timestamp: Date.now()
      };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('interviewCameraState', JSON.stringify(cameraState));
      }
    }
    router.push(`/dashboard/interview/${interviewId}/start`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse">Initializing Virtual Interview Room...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-10'>
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
                <ChevronLeft size={24} />
            </Button>
            <div>
                <h1 className='text-3xl font-black tracking-tight text-gray-900 dark:text-white font-serif'>
                   Preparation Lounge
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Verify your setup before the AI interview begins.</p>
            </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10'>
            {/* Left Section - Rules & Strategy */}
            <div className='lg:col-span-7 space-y-8'>
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='bg-white dark:bg-gray-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden'
                >
                    <div className='absolute top-0 right-0 p-4'>
                        <ShieldCheck className='text-indigo-600 opacity-10' size={120} />
                    </div>
                    
                    <h2 className='text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3'>
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <Users size={20} />
                        </div>
                        Interview Blueprint
                    </h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        <div className='space-y-6'>
                            <div>
                                <label className='text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1'>Target Role</label>
                                <p className='text-lg font-bold text-gray-900 dark:text-white'>{interviewDetails?.jobPosition}</p>
                            </div>
                            <div>
                                <label className='text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1'>Experience</label>
                                <p className='text-lg font-bold text-gray-900 dark:text-white'>{interviewDetails?.jobExperience} Years</p>
                            </div>
                        </div>
                        <div className='space-y-6'>
                            <div>
                                <label className='text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-1'>Tech Stack</label>
                                <p className='text-sm font-semibold text-gray-700 dark:text-gray-300 leading-relaxed'>{interviewDetails?.jobDescription}</p>
                            </div>
                        </div>
                    </div>

                    <div className='mt-10 p-6 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/50 flex items-start gap-4'>
                        <Lightbulb className='text-indigo-600 dark:text-indigo-400 shrink-0 mt-1' />
                        <p className='text-sm font-medium text-indigo-900 dark:text-indigo-200 leading-relaxed'>
                            <span className="font-bold">Pro Tip:</span> Our AI focuses heavily on the technical skills mentioned. Be prepared to explain your architectural choices in depth.
                        </p>
                    </div>
                </motion.div>

                {/* Readiness Checklist */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className='grid grid-cols-1 md:grid-cols-2 gap-6'
                >
                    {[
                        { id: 'environment', label: 'Quiet Environment', desc: 'Minimal background noise', icon: ShieldCheck },
                        { id: 'mindset', label: 'Technical Mindset', desc: 'Ready for deep dives', icon: Brain }
                    ].map((item) => (
                        <div 
                            key={item.id}
                            onClick={() => handleChecklistToggle(item.id)}
                            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group ${checklist[item.id] ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg ${checklist[item.id] ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors'}`}>
                                    <item.icon size={20} />
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checklist[item.id] ? 'bg-green-500 border-green-500' : 'border-gray-200 dark:border-gray-700'}`}>
                                    {checklist[item.id] && <CheckCircle size={12} className="text-white" />}
                                </div>
                            </div>
                            <h4 className={`font-bold text-sm ${checklist[item.id] ? 'text-green-900 dark:text-green-300' : 'text-gray-900 dark:text-gray-200'}`}>{item.label}</h4>
                            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Right Section - Hardware & Start */}
            <div className='lg:col-span-5 space-y-8'>
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='bg-white dark:bg-gray-900 p-6 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800'
                >
                    <div className="aspect-video bg-gray-50 dark:bg-gray-950 rounded-2xl overflow-hidden relative mb-6 border border-gray-100 dark:border-gray-800 group">
                        {isCameraOpen ? (
                            <Webcam
                                onUserMedia={handleWebcamUserMedia}
                                onUserMediaError={handleWebcamUserMediaError}
                                className='w-full h-full object-cover'
                                mirrored={true}
                                audio={true}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full flex-col gap-4">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                                    <Camera size={32} />
                                </div>
                                <div className="text-center">
                                    <p className='text-gray-900 dark:text-white font-bold text-sm'>Camera Disabled</p>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>Enable permissions to continue</p>
                                </div>
                            </div>
                        )}
                        
                        <div className="absolute top-4 right-4 flex gap-2">
                            <div className={`w-3 h-3 rounded-full ${isCameraOpen ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'} animate-pulse`} />
                             <div className={`w-3 h-3 rounded-full ${isMicEnabled ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'} animate-pulse`} />
                        </div>
                    </div>

                    <Button 
                        onClick={handleCameraToggle}
                        variant={isCameraOpen ? "outline" : "default"}
                        className={`w-full h-14 rounded-2xl font-bold flex items-center gap-3 transition-all ${isCameraOpen ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20'}`}
                    >
                        {isCameraOpen ? <><CameraOff size={20} /> Turn Off Camera</> : <><Camera size={20} /> Enable Camera & Mic</>}
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button 
                        disabled={!checklist.mindset || !checklist.environment}
                        onClick={startInterviewWithCamera}
                        className='w-full h-20 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-[32px] text-xl font-black shadow-xl shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-50 disabled:grayscale'
                    >
                        <Zap size={28} className="fill-current group-hover:scale-125 transition-transform" />
                        START SESSION
                    </Button>
                    <p className="text-center text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500 mt-4">
                        Please finish the checklist to unlock the room
                    </p>
                </motion.div>
            </div>
        </div>
    </div>
  )
}

export default Interview;