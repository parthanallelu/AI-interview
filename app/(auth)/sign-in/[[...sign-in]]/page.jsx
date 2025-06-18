'use client';

import React from 'react';
import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="flex w-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-lg">
        {/* Left side - Background Image */}
        <div 
          className="hidden lg:block lg:w-1/2 bg-cover bg-center" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')"
          }}
        >
        </div>

        {/* Right side - Sign In Form */}
        <div className="w-full px-6 py-8 lg:w-1/2">
          {/* Logo */}
          <div className="flex justify-center mx-auto mb-8">
            <img 
              className="w-auto h-8" 
              src="/logo.svg" alt="logo" 
              width={82} 
              height={40} 
            />
          </div>

          {/* Welcome Text */}
          <p className="text-xl text-center text-gray-600 mb-8">
            Welcome back!
          </p>

          {/* Clerk SignIn Component */}
          <div className="flex justify-center">
            <SignIn 
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              redirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "w-full max-w-md",
                  card: "shadow-none bg-transparent",
                  formButtonPrimary: "bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300",
                  formFieldInput: "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  formFieldLabel: "block text-sm font-medium text-gray-700 mb-2",
                  socialButtonsBlockButton: "w-full border rounded-lg py-2 px-4 flex items-center justify-center hover:bg-gray-50 transition-colors duration-300",
                  dividerText: "text-xs text-gray-500 uppercase"
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;