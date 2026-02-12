import React from 'react';
import { ViewMode, User } from '../types';
import { Layout, Search, Bell, ChevronDown, Briefcase, MessageSquare } from 'lucide-react';

interface TopBarProps {
  currentView: ViewMode;
  onToggleView: (view: ViewMode) => void;
  currentUser: User;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentView, onToggleView, currentUser, activeTab, onTabChange }) => {
  
  if (currentView === ViewMode.CLIENT) {
    return (
      <div className="bg-[#1a1a27] text-white h-18 flex items-center justify-between px-8 shadow-xl sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-12">
          {/* Logo Area */}
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-extrabold text-sm">C</span>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">CollabCRM</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center bg-[#252535] p-1 rounded-full border border-white/5">
            <button 
              onClick={() => onTabChange?.('deals')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium ${activeTab === 'deals' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Briefcase className="w-4 h-4" />
              Deals
            </button>
            <button 
              onClick={() => onTabChange?.('projects')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium ${activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Layout className="w-4 h-4" />
              Projects
            </button>
            <button 
              onClick={() => onTabChange?.('messages')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 text-sm font-medium ${activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <MessageSquare className="w-4 h-4" />
              Messages
            </button>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
           {/* Internal Toggle */}
           <button 
             onClick={() => onToggleView(ViewMode.INTERNAL)} 
             className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-400 transition-colors border border-white/5"
            >
              Switch to Internal
           </button>

           <div className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-red-500/20 tracking-wide">
             STAGING
           </div>

           <div className="h-8 w-[1px] bg-white/10 mx-1"></div>

           <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                 <div className="p-2 rounded-full hover:bg-white/5 transition-colors">
                    <Bell className="w-5 h-5 text-slate-300 group-hover:text-white" />
                 </div>
                 <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1a1a27] animate-pulse"></span>
              </div>

              <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                 <div className="text-right hidden sm:block">
                   <p className="text-sm font-medium group-hover:text-indigo-400 transition-colors">{currentUser.name}</p>
                   <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{currentUser.role}</p>
                 </div>
                 <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                   <img src={currentUser.avatar || "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?auto=format&fit=crop&q=80&w=100&h=100"} alt="Avatar" className="w-full h-full rounded-full object-cover border-2 border-[#1a1a27]" />
                 </div>
                 <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </div>
           </div>
        </div>
      </div>
    );
  }

  // Internal View TopBar
  return (
    <div className="h-18 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-slate-900 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
          <span>CollabCRM <span className="text-slate-400 font-normal">Internal</span></span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
        <button
            onClick={() => onToggleView(ViewMode.CLIENT)}
            className="px-4 py-2 text-sm font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100"
          >
            Switch to Client Portal
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
          HS
        </div>
      </div>
    </div>
  );
};