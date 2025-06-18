'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; 
import { Label } from "@/components/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Briefcase, User, Calendar, FileText } from 'lucide-react';
import { generateInterviewQuestions } from '@/utils/GeminiAI';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
  const router = useRouter();
  const { user } = useUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobPosition: '',
    jobDescription: '',
    yearOfExperience: '',
    skills: ''
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.jobPosition.trim()) {
      newErrors.jobPosition = 'Job position is required';
    }
    
    if (!formData.jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
    }
    
    if (!formData.yearOfExperience.trim()) {
      newErrors.yearOfExperience = 'Years of experience is required';
    } else if (isNaN(formData.yearOfExperience) || formData.yearOfExperience < 0) {
      newErrors.yearOfExperience = 'Please enter a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleStartInterview = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      console.log('Starting interview with data:', formData);
      
      // Call the Gemini API function
      console.log('Calling Gemini API...');
      const result = await generateInterviewQuestions(
        formData.jobPosition,
        formData.jobDescription,
        formData.yearOfExperience
      );
      
      console.log('Gemini API Result:', result);

      if (result.success) {
        console.log('Generated Interview Questions:', result.data);

        // Ensure data is properly formatted - FIXED FIELD NAMES
        const mockId = uuidv4();
        const formattedData = {
          jobPosition: String(formData.jobPosition),        // Fixed: was 'jobposition'
          jobDescription: String(formData.jobDescription),  // Fixed: was 'jobdescription'  
          jobExperience: String(formData.yearOfExperience), // Fixed: was 'jobexperience'
          jsonmockresponse: typeof result.data === 'string' ? result.data : JSON.stringify(result.data),
          mockid: mockId,
          createdby: String(user?.emailAddresses[0]?.emailAddress || 'unknown@example.com'), // Added fallback
          createdat: new Date() // Added explicit timestamp
        };

        console.log('Inserting formatted data:', formattedData);

        // Validate required fields before insertion
        if (!formattedData.createdby || formattedData.createdby === 'unknown@example.com') {
          throw new Error('User email not available. Please ensure you are logged in.');
        }

        if (!formattedData.jsonmockresponse) {
          throw new Error('No interview questions generated. Please try again.');
        }

        const resp = await db.insert(MockInterview)
          .values(formattedData)
          .returning({ mockid: MockInterview.mockid });
        
        console.log("Inserted mockid", resp[0]?.mockid);

        if (!resp[0]?.mockid) {
          throw new Error('Database insertion failed - no ID returned');
        }

        // Reset form and close dialog
        setFormData({
          jobPosition: '',
          jobDescription: '',
          yearOfExperience: '',
          skills: ''
        });
        setOpenDialog(false);
        
        // Navigate to interview page
        router.push(`/dashboard/interview/${resp[0].mockid}`);
        
      } else {
        console.error('Error from Gemini:', result.error);
        throw new Error(`Failed to generate questions: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Error starting interview:', error);
      console.error('Error details:', error.message);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      console.error('Stack trace:', error.stack);
      
      // More descriptive error message
      let errorMessage = 'Failed to generate interview questions. ';
      if (error.message.includes('mock_interview') || error.message.includes('Database')) {
        errorMessage += 'Database error occurred. Please check your connection and try again.';
      } else if (error.message.includes('User email')) {
        errorMessage += 'Please ensure you are logged in and try again.';
      } else if (error.message.includes('questions generated')) {
        errorMessage += 'AI service error. Please try again.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      jobPosition: '',
      jobDescription: '',
      yearOfExperience: '',
      skills: ''
    });
    setErrors({});
  };

  return (
    <>
      {/* Trigger Card */}
      <div 
        className='group bg-gradient-to-br from-white to-gray-50 border-2 border-dashed border-gray-300 rounded-xl shadow-sm p-8 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-white min-h-[200px]'
        onClick={() => setOpenDialog(true)}
      >
        <div className='bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors duration-300'>
          <Plus className='w-8 h-8 text-blue-600' />
        </div>
        
        <h3 className='text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300'>
          Add New Interview
        </h3>
        
        <p className='text-sm text-gray-600 text-center leading-relaxed'>
          Create a new mock interview session tailored to your job application
        </p>
        
        <Button 
          className='mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300'
          onClick={(e) => {
            e.stopPropagation();
            setOpenDialog(true);
          }}
        >
          <Plus className='w-4 h-4 mr-2' />
          Get Started
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader className='space-y-3'>
            <DialogTitle className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
              <Briefcase className='w-6 h-6 text-blue-600' />
              Interview Setup
            </DialogTitle>
            <DialogDescription className='text-gray-600'>
              Please provide details about the position you're applying for. This helps us create relevant interview questions.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-6 mt-6'>
            {/* Job Position */}
            <div className='space-y-2'>
              <Label htmlFor="jobPosition" className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                <User className='w-4 h-4' />
                Job Position/Role Name *
              </Label>
              <Input
                type="text"
                id="jobPosition"
                placeholder="e.g., Frontend Developer, Data Scientist, Product Manager"
                value={formData.jobPosition}
                onChange={(e) => handleInputChange('jobPosition', e.target.value)}
                className={`transition-colors duration-200 ${errors.jobPosition ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              />
              {errors.jobPosition && (
                <p className='text-red-500 text-xs mt-1'>{errors.jobPosition}</p>
              )}
            </div>

            {/* Job Description */}
            <div className='space-y-2'>
              <Label htmlFor="jobDescription" className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                <FileText className='w-4 h-4' />
                Job Description/Requirements *
              </Label>
              <textarea
                id="jobDescription"
                placeholder="Describe the key responsibilities, required skills, and qualifications for this role..."
                value={formData.jobDescription}
                onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md min-h-[100px] transition-colors duration-200 resize-y ${errors.jobDescription ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'}`}
                rows={4}
              />
              {errors.jobDescription && (
                <p className='text-red-500 text-xs mt-1'>{errors.jobDescription}</p>
              )}
            </div>

            {/* Years of Experience */}
            <div className='space-y-2'>
              <Label htmlFor="yearOfExperience" className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                Years of Experience *
              </Label>
              <Input
                type="number"
                id="yearOfExperience"
                placeholder="e.g., 2, 5, 10"
                min="0"
                max="50"
                value={formData.yearOfExperience}
                onChange={(e) => handleInputChange('yearOfExperience', e.target.value)}
                className={`transition-colors duration-200 ${errors.yearOfExperience ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
              />
              {errors.yearOfExperience && (
                <p className='text-red-500 text-xs mt-1'>{errors.yearOfExperience}</p>
              )}
            </div>

            {/* Skills (Optional) */}
            <div className='space-y-2'>
              <Label htmlFor="skills" className='text-sm font-medium text-gray-700'>
                Key Skills (Optional)
              </Label>
              <Input
                type="text"
                id="skills"
                placeholder="e.g., React, Node.js, Python, AWS, etc."
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                className='focus:border-blue-500 transition-colors duration-200'
              />
              <p className='text-xs text-gray-500'>Separate multiple skills with commas</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 justify-end mt-8 pt-6 border-t border-gray-200'>
            <Button 
              variant="outline" 
              onClick={handleCloseDialog}
              disabled={isLoading}
              className='px-6 py-2'
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStartInterview}
              disabled={isLoading}
              className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2'
            >
              {isLoading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                  Generating Questions...
                </>
              ) : (
                <>
                  <Briefcase className='w-4 h-4 mr-2' />
                  Generate Questions
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddNewInterview;