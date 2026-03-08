import React from 'react';
import { Home, PieChart, PlusCircle, Target, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <aside className="w-20 lg:w-24 hidden md:flex flex-col h-full items-center py-8 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] backdrop-blur-3xl shadow-xl flex-shrink-0 relative z-20">
      
      {/* Logo */}
      <div className="mb-12 cursor-pointer group">
        <div className="h-12 w-12 rounded-[1rem] bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-500">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
      </div>

      <nav className="flex-1 space-y-8 mt-4 w-full px-4 text-center">
         <div className="flex flex-col space-y-6">
           <NavItem icon={<Home className="w-6 h-6" />} active={true} tooltip="Overview" />
           <NavItem icon={<PieChart className="w-6 h-6" />} active={false} tooltip="Analytics" />
           <NavItem icon={<PlusCircle className="w-6 h-6" />} active={false} tooltip="Add Expense" className="text-blue-400 group-hover:text-blue-300" />
           <NavItem icon={<Target className="w-6 h-6" />} active={false} tooltip="Budgets" />
         </div>

         <div className="w-8 h-px bg-white/[0.08] mx-auto my-6 rounded-full" />

         <div className="flex flex-col space-y-6">
           <NavItem icon={<Settings className="w-6 h-6" />} active={false} tooltip="Settings" />
         </div>
      </nav>

      {/* User / Logout */}
      <div className="mt-auto pt-8 pb-2">
        <button className="h-12 w-12 rounded-[1rem] flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-white/[0.04] transition-all duration-300 group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, active, tooltip, className = "" }: { icon: React.ReactNode, active: boolean, tooltip: string, className?: string }) {
  return (
    <div className="relative group flex justify-center">
      <Link href="#" className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${active ? 'bg-white/[0.1] text-white shadow-inner shadow-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/[0.04] hover:scale-110'}`}>
        <div className={className}>{icon}</div>
      </Link>
      
      {/* Tooltip */}
      <div className="absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#17171a] border border-white/[0.08] text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-xl pointer-events-none">
        {tooltip}
      </div>
    </div>
  )
}
