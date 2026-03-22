"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, CameraOff, Mic, Square, RefreshCcw, Save, CheckCircle2, AlertCircle, Timer as TimerIcon, Play, Pause, RotateCcw } from 'lucide-react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Webcam from 'react-webcam'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useAuth } from '@/lib/AuthContext'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

function RecordAnswerSection({
    mockInterviewQuestions,
    currentQuestionIndex = 0,
    onRecordedAnswer,
    recordedAnswers = {},
    interviewId
}) {
    const [isRecording, setIsRecording] = useState(false)
    const [webcamEnabled, setWebcamEnabled] = useState(false)
    const [error, setError] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [timer, setTimer] = useState(0)
    const timerRef = useRef(null)

    const mediaRecorderRef = useRef(null)
    const webcamRef = useRef(null)
    const { user } = useAuth()

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition()

    useEffect(() => {
        const savedState = sessionStorage.getItem('interviewCameraState');
        if (savedState) setWebcamEnabled(true);
        return () => stopTimer();
    }, []);

    useEffect(() => {
        setSaveSuccess(false);
        resetTranscript();
        setTimer(0);
        stopTimer();
    }, [currentQuestionIndex]);

    const startTimer = () => {
        setTimer(0);
        timerRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
    }

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    const startRecording = () => {
        if (!webcamRef.current?.stream) return;
        setIsRecording(true);
        setSaveSuccess(false);
        resetTranscript();
        startTimer();
        if (browserSupportsSpeechRecognition) {
            SpeechRecognition.startListening({ continuous: true });
        }
    }

    const stopRecording = () => {
        setIsRecording(false);
        stopTimer();
        SpeechRecognition.stopListening();
        if (onRecordedAnswer) {
            onRecordedAnswer(currentQuestionIndex, null, transcript);
        }
    }

    const handleRetry = () => {
        resetTranscript();
        setTimer(0);
        setSaveSuccess(false);
        setIsRecording(false);
        stopTimer();
    }

    const SaveUserAns = async () => {
        if (!transcript && !recordedAnswers[currentQuestionIndex]) {
            setError("Analysis failed: No voice signal detected.");
            return;
        }

        setIsSaving(true);
        setError(null);
        
        try {
            const currentQuestion = mockInterviewQuestions[currentQuestionIndex].question;
            const userAns = transcript || "User provided an answer.";
            
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: currentQuestion,
                    userAns: userAns
                }),
            });

            const feedbackData = await response.json();

            if (feedbackData.error) {
                throw new Error(feedbackData.error);
            }

            // Store the entire structured feedback as a JSON string in the 'feedback' column
            const resp = await db.insert(UserAnswer).values({
                mockIdRef: interviewId,
                question: currentQuestion,
                correctAns: feedbackData.model_answer || '',
                userAns: userAns,
                feedback: JSON.stringify(feedbackData), // Critical change: Save entire object
                rating: String(feedbackData.score),
                difficulty: mockInterviewQuestions[currentQuestionIndex].difficulty || 'Intermediate',
                category: mockInterviewQuestions[currentQuestionIndex].category || 'Technical',
                userEmail: user?.email || 'unknown',
                createdAt: moment().toDate() // Use Date object for timestamp
            });

            if (resp) {
                setSaveSuccess(true);
            }
        } catch (err) {
            console.error('Error saving:', err);
            setError("Neural link interrupted. Please analyze again.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="flex flex-col h-full gap-6">
            <motion.div 
                layout
                className="relative bg-black rounded-[40px] overflow-hidden shadow-2xl border-8 border-white dark:border-gray-900 aspect-video group"
            >
                {/* Camera View */}
                {webcamEnabled ? (
                    <Webcam
                        ref={webcamRef}
                        audio={true}
                        mirrored={true}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-950">
                        <div className="text-center">
                            <CameraOff size={64} className="text-gray-800 mx-auto mb-4" />
                            <p className="text-gray-600 font-black text-xs uppercase tracking-widest">Awaiting Video Input</p>
                        </div>
                    </div>
                )}

                {/* UI Overlays */}
                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
                    <div className="flex items-center justify-between">
                        <AnimatePresence>
                            {isRecording && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex items-center gap-4 bg-red-600 px-5 py-2.5 rounded-2xl pointer-events-auto"
                                >
                                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
                                    <span className="text-xs font-black text-white uppercase tracking-widest">Recording</span>
                                    <div className="h-4 w-[1px] bg-white/30" />
                                    <span className="text-sm font-black text-white tabular-nums">{formatTime(timer)}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-2">
                           <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${webcamEnabled ? 'bg-green-600/20 text-green-400 border-green-500/30' : 'bg-gray-800/50 text-gray-400 border-gray-700'}`}>
                                CAM {webcamEnabled ? 'OK' : 'ERR'}
                           </div>
                           <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${listening ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-gray-800/50 text-gray-400 border-gray-700'}`}>
                                MIC {listening ? 'LIVE' : 'AUTO'}
                           </div>
                        </div>
                    </div>
                </div>

                {/* Status Ring */}
                <div className="absolute top-8 left-8">
                     <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Secure Session ID: {interviewId?.substring(0,8)}</div>
                </div>
            </motion.div>

            {/* Controls Suite */}
            <div className="flex items-center justify-between gap-4 px-2">
                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setWebcamEnabled(!webcamEnabled)}
                        className="rounded-3xl h-16 w-16 dark:bg-gray-900 dark:border-gray-800 border-2 hover:border-indigo-500 transition-all"
                    >
                        {webcamEnabled ? <CameraOff size={28} /> : <Camera size={28} />}
                    </Button>
                    {transcript && !isRecording && (
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={handleRetry}
                            className="rounded-3xl h-16 w-16 dark:bg-gray-900 border-2 border-red-100 dark:border-red-900/40 text-red-500 hover:bg-red-50 transition-all"
                        >
                            <RotateCcw size={28} />
                        </Button>
                    )}
                </div>

                <div className="flex-1 max-w-sm">
                    {!saveSuccess ? (
                        <Button 
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`w-full h-16 rounded-3xl font-black text-lg shadow-2xl transition-all active:scale-[0.98] border-b-4 ${
                                isRecording 
                                    ? 'bg-red-600 hover:bg-red-700 text-white border-red-800 shadow-red-600/20' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-800 shadow-indigo-600/20'
                            }`}
                        >
                            {isRecording ? (
                                <div className="flex items-center gap-3">
                                    <Square size={24} fill="currentColor" />
                                    STOP RECORDING
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Play size={24} fill="currentColor" />
                                    {transcript ? "RE-RECORD ANSWER" : "START RECORDING"}
                                </div>
                            )}
                        </Button>
                    ) : (
                        <div className="h-16 flex items-center justify-center bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-900 rounded-3xl gap-4">
                            <CheckCircle2 className="text-green-600" size={28} />
                            <span className="font-black text-green-700 dark:text-green-400 uppercase tracking-widest text-sm text-center">AI Analysis Synchronized</span>
                        </div>
                    )}
                </div>

                <Button 
                    variant="outline"
                    onClick={SaveUserAns}
                    disabled={isSaving || isRecording || (!transcript && !saveSuccess)}
                    className={`h-16 px-10 rounded-3xl font-black transition-all flex items-center gap-3 border-2 ${
                        saveSuccess 
                            ? 'bg-transparent text-gray-400 border-gray-100 dark:border-gray-800' 
                            : 'bg-indigo-600/5 text-indigo-600 border-indigo-600/20 hover:bg-indigo-600 hover:text-white'
                    }`}
                >
                    {isSaving ? (
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
                            ANALYZING...
                        </div>
                    ) : (
                        <>
                            <Save size={24} />
                            {saveSuccess ? "SYNCED" : "SAVE & ANALYZE"}
                        </>
                    )}
                </Button>
            </div>

            {/* Transcript & Insights */}
            <AnimatePresence>
                {transcript && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm relative grow"
                    >
                        <div className="flex items-center justify-between mb-4">
                             <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Voice Transcript (Auto-Generated)</h4>
                             <div className="flex gap-1">
                                <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce" />
                                <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                                <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                             </div>
                        </div>
                        <p className="text-xl font-bold text-gray-800 dark:text-white leading-relaxed font-serif italic max-h-[150px] overflow-y-auto cursor-default">
                            "{transcript}"
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <div className="flex items-center gap-3 p-5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-3xl border border-red-100 dark:border-red-900 text-sm font-black uppercase tracking-tighter">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}
        </div>
    )
}

export default RecordAnswerSection