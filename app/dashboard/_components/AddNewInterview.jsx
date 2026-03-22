"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/lib/AuthContext'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, FileText, Upload, Briefcase, Sparkles, AlertCircle, FileUp, MessageSquareText } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false)
    const [jobPosition, setJobPosition] = useState('')
    const [jobDesc, setJobDesc] = useState('')
    const [jobExperience, setJobExperience] = useState('')
    const [resumeFile, setResumeFile] = useState(null)
    const [resumeText, setResumeText] = useState('')
    const [isBehavioral, setIsBehavioral] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { user } = useAuth()
    const router = useRouter()

    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
            setError(null);
        } else {
            setError("Only PDF resumes are supported.");
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            let extractedResumeText = '';
            
            // Extract text from Resume if provided
            if (resumeFile) {
                const formData = new FormData();
                formData.append('file', resumeFile);
                
                const extractResponse = await fetch('/api/extract-pdf', {
                    method: 'POST',
                    body: formData
                });
                
                const extractData = await extractResponse.json();
                if (extractData.text) {
                    extractedResumeText = extractData.text;
                }
            }
            
            const prompt = `
                Job Position: ${jobPosition}
                Job Description: ${jobDesc}
                Years of Experience: ${jobExperience}
                Candidate Background (from Resume): ${extractedResumeText || "Not provided."}
                Interview Type: ${isBehavioral ? "Behavioral & HR Prep" : "Technical & Domain Specific"}

                As a world-class hiring manager, generate exactly 5 interview questions.
                ${isBehavioral ? "Focus heavily on behavioral questions using the STAR method (Situation, Task, Action, Result)." : "Focus on technical problem-solving and domain-specific knowledge."}
                Crucial: Tailor the questions specifically to the candidate's background (resume) and how it aligns with the job description.
                Return strictly in JSON format as an array of objects:
                [{ "question": "...", "answer": "...", "difficulty": "...", "category": "..." }]
            `;

            const response = await fetch("/api/generate-questions", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt }),
            });

            const jsonResponse = await response.json();
            
            if (jsonResponse.error) throw new Error(jsonResponse.error);

            const mockId = uuidv4();
            const resp = await db.insert(MockInterview)
                .values({
                    mockid: mockId,
                    jsonmockresponse: JSON.stringify(jsonResponse),
                    jobPosition: jobPosition,
                    jobDescription: jobDesc,
                    jobExperience: jobExperience,
                    createdby: user?.email || 'anonymous',
                    createdat: new Date(),
                    resumeText: extractedResumeText,
                    jobDescText: jobDesc
                }).returning({ id: MockInterview.id });

            if (resp) {
                setOpenDialog(false);
                router.push('/dashboard/interview/' + mockId);
            }
        } catch (err) {
            console.error(err);
            setError("Simulation initialization failed. Check your network or file format.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div 
                className='p-10 border-4 border-dashed rounded-[40px] bg-white dark:bg-gray-950 border-gray-100 dark:border-gray-800 hover:border-indigo-600 hover:bg-indigo-50/10 transition-all cursor-pointer group flex flex-col items-center justify-center gap-6 shadow-2xl shadow-gray-200/50 dark:shadow-none'
                onClick={() => setOpenDialog(true)}
            >
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 group-hover:scale-110 transition-transform">
                    <Plus size={40} />
                </div>
                <div className="text-center">
                    <h2 className='font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tighter'>Initialize New Assessment</h2>
                    <p className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] mt-2'>Configure AI Simulation Parameters</p>
                </div>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-3xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-gray-950">
                    <div className="bg-indigo-600 p-10 flex items-center justify-between">
                         <div className="space-y-2">
                             <DialogTitle className="text-3xl font-black text-white uppercase tracking-tighter italic font-serif">Assessment Config</DialogTitle>
                             <DialogDescription className="text-indigo-100 text-xs font-black uppercase tracking-[0.2em] opacity-80">Syncing Simulation with Job Requirements</DialogDescription>
                         </div>
                         <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
                             <Sparkles size={32} />
                         </div>
                    </div>

                    <form onSubmit={onSubmit} className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className='space-y-3'>
                                <label className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2'>
                                    <Briefcase size={14} /> Target Position
                                </label>
                                <Input 
                                    placeholder="e.g. Senior Full Stack Engineer" 
                                    required
                                    onChange={(event) => setJobPosition(event.target.value)}
                                    className="h-14 rounded-2xl border-gray-100 dark:border-gray-800 focus:ring-indigo-600 font-bold"
                                />
                            </div>
                            <div className='space-y-3'>
                                <label className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2'>
                                    <FileText size={14} /> Years of Experience
                                </label>
                                <Input 
                                    placeholder="e.g. 5" 
                                    type="number" 
                                    required
                                    max="50"
                                    onChange={(event) => setJobExperience(event.target.value)}
                                    className="h-14 rounded-2xl border-gray-100 dark:border-gray-800 focus:ring-indigo-600 font-bold"
                                />
                            </div>
                        </div>

                        <div className='space-y-3'>
                            <label className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2'>
                                <Sparkles size={14} /> Job Description / Tech Stack
                            </label>
                            <Textarea 
                                placeholder="Paste the job requirements or specific technologies you want to be tested on..." 
                                required
                                onChange={(event) => setJobDesc(event.target.value)}
                                className="min-h-[120px] rounded-3xl border-gray-100 dark:border-gray-800 focus:ring-indigo-600 font-bold p-6"
                            />
                        </div>

                        {/* Behavioral Toggle */}
                        <div className="flex items-center justify-between p-6 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/40">
                             <div className="flex items-center gap-4">
                                 <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                                     <MessageSquareText size={24} />
                                 </div>
                                 <div className="space-y-1">
                                     <Label className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Behavioral Focus</Label>
                                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prioritize soft skills & STAR method</p>
                                 </div>
                             </div>
                             <Switch 
                                checked={isBehavioral}
                                onCheckedChange={setIsBehavioral}
                                className="data-[state=checked]:bg-indigo-600"
                             />
                        </div>

                        {/* Resume Upload Section */}
                        <div className='space-y-3'>
                            <label className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2'>
                                <FileUp size={14} /> Professional Resume (Optional)
                            </label>
                            <div 
                                {...getRootProps()} 
                                className={`border-2 border-dashed rounded-[32px] p-8 text-center transition-all cursor-pointer ${
                                    isDragActive ? 'border-indigo-600 bg-indigo-50/50' : 
                                    resumeFile ? 'border-green-500 bg-green-50/20' : 
                                    'border-gray-100 dark:border-gray-800 hover:border-gray-300'
                                }`}
                            >
                                <input {...getInputProps()} />
                                {resumeFile ? (
                                    <div className="flex items-center justify-center gap-3 text-green-600 font-black uppercase tracking-widest text-xs">
                                        <FileText size={20} />
                                        {resumeFile.name} (Ready for Analysis)
                                    </div>
                                ) : (
                                    <div className="text-gray-400 space-y-2">
                                        <Upload size={32} className="mx-auto mb-2 opacity-20" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">DRAG PDF OR CLICK TO ATTACH</p>
                                        <p className="text-[8px] font-black uppercase tracking-widest opacity-40">AI WILL CUSTOMIZE QUESTIONS TO YOUR BACKGROUND</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900 text-xs font-bold">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div className='flex gap-4 justify-end pt-4'>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setOpenDialog(false)}
                                className="rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest text-gray-400"
                            >
                                Abort
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl h-14 px-10 font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all"
                            >
                                {loading ? (
                                    <div className='flex items-center gap-3'>
                                        <Loader2 className='animate-spin' size={20} />
                                        GEN ARCHIVING...
                                    </div>
                                ) : 'START AI SIMULATION'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewInterview