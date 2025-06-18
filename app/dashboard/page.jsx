import React from 'react'
import { UserButton } from '@clerk/nextjs'
import AddNewInterview from './_components/AddNewInterview'

function Dashboard() {
  return (
    <div className='p-10 flex flex-col gap-1'>

      <h2 className='text-2xl font-bold'>Dashboard</h2>
      <h2 className='text-lg text-gray-500'>
        Welcome to your dashboard. Here you can manage your interviews and see your progress.
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7'>
        <AddNewInterview />
      </div>
    </div>
  )
}

export default Dashboard