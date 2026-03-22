"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  BarChart3, 
  HelpCircle,
  PlusCircle,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    name: 'Interviews',
    icon: FileText,
    path: '/dashboard/interviews' // I'll make this work or point to dashboard
  },
  {
    name: 'Analytics',
    icon: BarChart3,
    path: '/dashboard/analytics'
  },
  {
    name: 'Settings',
    icon: Settings,
    path: '/dashboard/settings'
  },
  {
    name: 'How it Works',
    icon: HelpCircle,
    path: '/dashboard/how'
  }
]

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-40 hidden lg:flex flex-col">
      <div className="p-6 pb-2">
        <Link href="/" className="flex items-center gap-2 group mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white" size={18} />
            </div>
            <span className="text-xl font-black tracking-tighter dark:text-white">
              AI<span className="text-indigo-600">PREP</span>
            </span>
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-2 py-4">
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group",
              pathname === item.path 
                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              pathname === item.path ? "text-indigo-600 dark:text-indigo-400" : "group-hover:text-gray-900 dark:group-hover:text-white"
            )} />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl p-5 text-white shadow-lg overflow-hidden relative group">
           <div className="absolute top-[-20px] right-[-20px] w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
           <h4 className="font-bold text-sm mb-1 relative z-10">Go Unlimited</h4>
           <p className="text-[11px] text-white/80 mb-4 relative z-10">Get full access to all AI features and history.</p>
           <Link href="/dashboard/upgrade">
             <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors relative z-10">
               Upgrade Now
             </button>
           </Link>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest font-bold">
            v1.0.0 Stable
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
