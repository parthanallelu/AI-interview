"use client"

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '@/lib/AuthContext'
import moment from 'moment'
import { chatSession } from '@/utils/GeminiAI'
import { LoaderCircle, Plus, Briefcase, Calendar, Lightbulb, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    jobPosition: '',
    jobDescription: '',
    yearOfExperience: '',
    difficulty: 'Intermediate',
    numQuestions: 5
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth();
  const router = useRouter();

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const inputPrompt = `Job Position: ${formData.jobPosition}, Job Description: ${formData.jobDescription}, Years of Experience: ${formData.yearOfExperience}, Difficulty: ${formData.difficulty}, Number of Questions: ${formData.numQuestions}. Based on this information, please give me ${formData.numQuestions} interview questions with answers in JSON format. Give "question" and "answer" and "difficulty" and "category" as fields in JSON.`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const mockJsonResp = (await result.response.text()).replace('```json', '').replace('```', '');
      
      const resp = await db.insert(MockInterview)
        .values({
          mockid: uuidv4(),
          jsonmockresp: mockJsonResp,
          jobPosition: formData.jobPosition,
          jobDescription: formData.jobDescription,
          jobExperience: formData.yearOfExperience,
          createdby: user?.email,
          createdat: moment().format('DD-MM-YYYY'),
          difficulty: formData.difficulty,
          numQuestions: formData.numQuestions
        }).returning({ mockid: MockInterview.mockid });

      if (resp) {
        setOpenDialog(false);
        router.push('/dashboard/interview/' + resp[0].mockid);
      }
    } catch (error) {
      console.error("Error generating interview:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div 
        className='p-10 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-900 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group h-full shadow-sm hover:shadow-xl'
        onClick={() => setOpenDialog(true)}
      >
        <div className='w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 shadow-sm'>
            <Plus size={32} />
        </div>
        <div className='text-center'>
            <h2 className='font-black text-xl text-gray-800 dark:text-white mb-1'>Add New Interview</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>Create a new mock interview session <br/> tailored to your job application</p>
        </div>
        <Button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
            Get Started
        </Button>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className='max-w-2xl bg-white dark:bg-gray-950 border-none rounded-[32px] p-0 overflow-hidden shadow-2xl'>
          <div className='bg-indigo-600 p-10 text-white relative overflow-hidden'>
             <div className='absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-3xl' />
             <div className='absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-blue-400/20 rounded-full blur-2xl' />
             <DialogHeader>
                <DialogTitle className='text-4xl font-black mb-3 tracking-tight font-serif'>New AI Interview</DialogTitle>
                <DialogDescription className='text-indigo-100 text-lg font-medium opacity-90 leading-relaxed'>
                   Our AI will craft a high-fidelity interview experience based on your specific target role and experience level.
                </DialogDescription>
             </DialogHeader>
          </div>
          
          <form onSubmit={onSubmit} className='p-10 space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-3'>
                <Label htmlFor="jobPosition" className='text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2'>
                  <Briefcase size={14} className="text-indigo-600" /> Job Role / Position
                </Label>
                <Input
                  id="jobPosition"
                  placeholder="e.g., Senior Frontend Engineer"
                  required
                  value={formData.jobPosition}
                  onChange={(e) => handleInputChange('jobPosition', e.target.value)}
                  className='rounded-2xl border-gray-100 dark:border-gray-800 h-14 bg-gray-50 dark:bg-gray-900/50 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-semibold'
                />
              </div>

              <div className='space-y-3'>
                <Label htmlFor="yearOfExperience" className='text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2'>
                  <Calendar size={14} className="text-indigo-600" /> Years of Experience
                </Label>
                <Input
                  type="number"
                  id="yearOfExperience"
                  placeholder="e.g., 5"
                  min="0"
                  required
                  value={formData.yearOfExperience}
                  onChange={(e) => handleInputChange('yearOfExperience', e.target.value)}
                  className='rounded-2xl border-gray-100 dark:border-gray-800 h-14 bg-gray-50 dark:bg-gray-900/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-center font-bold text-lg'
                />
              </div>
            </div>

            <div className='space-y-3'>
              <Label htmlFor="jobDescription" className='text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-2'>
                <Lightbulb size={14} className="text-indigo-600" /> Tech Stack / Skills
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="React, Node.js, Next.js, tailwind, System Design..."
                rows={3}
                required
                value={formData.jobDescription}
                onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                className='rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none p-4 font-medium'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
               <div className='space-y-3'>
                  <Label htmlFor="difficulty" className='text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400'>Difficulty Level</Label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className='w-full h-14 px-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold appearance-none cursor-pointer'
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
               </div>
               <div className='space-y-3'>
                  <Label htmlFor="numQuestions" className='text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400'>Question Count</Label>
                  <Input
                    type="number"
                    id="numQuestions"
                    min="1"
                    max="10"
                    value={formData.numQuestions}
                    onChange={(e) => handleInputChange('numQuestions', parseInt(e.target.value))}
                    className='rounded-2xl border-gray-100 dark:border-gray-800 h-14 bg-gray-50 dark:bg-gray-900/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-center font-bold text-lg'
                  />
               </div>
            </div>

            <div className='flex justify-end gap-4 pt-4'>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setOpenDialog(false)}
                className='rounded-2xl px-8 h-12 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className='bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-10 h-12 font-bold shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2'
              >
                {loading ? (
                  <>
                    <LoaderCircle className='animate-spin' size={18} />
                    Preparing Session...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Start Now
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview