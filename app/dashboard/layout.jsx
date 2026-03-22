"use client"

import React from 'react'
import Sidebar from './_components/Sidebar'
import Header from './_components/Header'

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-24 px-4 md:px-8 pb-10">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
