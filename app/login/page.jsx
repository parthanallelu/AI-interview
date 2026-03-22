'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
    const [name, setName] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            login({ name, email: `${name.toLowerCase()}@example.com` });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
                    <p className="text-center text-gray-500 mt-2">Sign in to access your dashboard</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 block">
                            Name
                        </label>
                        <Input 
                            id="name" 
                            placeholder="Enter your name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>
                    
                    <Button type="submit" className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all">
                        Sign In
                    </Button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-400">
                        No API key required. Just enter any name to get started.
                    </p>
                </div>
            </div>
        </div>
    );
}
