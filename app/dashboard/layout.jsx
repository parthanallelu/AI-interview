import React from 'react'
import Header from './_components/Header'

function Dashboardlayout({children}) {
  return (
    <div>
        <Header />
        <div className=' mx-auto max-w-7xl'>
          {children}
        </div>
        
    </div>
  )
}

export default Dashboardlayout
