import React from 'react';
import { User } from '../types/campuskhoj';
import { Download, UserCheck, Shield, GraduationCap, Briefcase } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  activeTab: 'register' | 'match' | 'claims' | 'oop';
  onSelectTab: (tab: 'register' | 'match' | 'claims' | 'oop') => void;
  onOpenReportModal: () => void;
  onOpenUserModal: () => void;
  onOpenDownloadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onOpenReportModal,
  onOpenUserModal,
  onOpenDownloadModal,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md">
      {/* Zone 1: Brand Wordmark (Single Text Element) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onSelectTab('register')}
          className="text-xl font-extrabold tracking-tight text-white hover:text-orange-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white text-base shadow-sm font-black">
            K
          </span>
          <span>CampusKhoj</span>
        </button>
      </div>

      {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
      <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
        <button
          onClick={() => onSelectTab('register')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'register' ? 'text-orange-400 font-semibold border-b-2 border-orange-500' : 'hover:text-white'
          }`}
        >
          Campus Register
        </button>
        <button
          onClick={onOpenReportModal}
          className="whitespace-nowrap shrink-0 text-slate-300 hover:text-white transition-colors py-1"
        >
          + Report Belonging
        </button>
        <button
          onClick={() => onSelectTab('match')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'match' ? 'text-orange-400 font-semibold border-b-2 border-orange-500' : 'hover:text-white'
          }`}
        >
          Smart Auto-Match
        </button>
        <button
          onClick={() => onSelectTab('claims')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'claims' ? 'text-orange-400 font-semibold border-b-2 border-orange-500' : 'hover:text-white'
          }`}
        >
          Claims & Verification
        </button>
        <button
          onClick={() => onSelectTab('oop')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
            activeTab === 'oop' ? 'text-orange-400 font-semibold border-b-2 border-orange-500' : 'hover:text-white'
          }`}
        >
          OOP Architecture
        </button>
      </nav>

      {/* Zone 3: Primary Action & Role Indicator */}
      <div className="flex items-center gap-3 shrink-0">
        {/* User Role Switcher Trigger */}
        <button
          onClick={onOpenUserModal}
          title="Switch Active Campus Persona"
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-200 transition-colors whitespace-nowrap shrink-0"
        >
          {currentUser.role === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-amber-400" />}
          {currentUser.role === 'STAFF' && <Briefcase className="w-3.5 h-3.5 text-emerald-400" />}
          {currentUser.role === 'STUDENT' && <GraduationCap className="w-3.5 h-3.5 text-blue-400" />}
          <span className="font-semibold">{currentUser.name.split(' ')[0]}</span>
          <span className="text-slate-500 hidden sm:inline">({currentUser.role})</span>
          <span className="text-slate-400 text-[10px]">⇄</span>
        </button>

        {/* Primary Action Button */}
        <button
          onClick={onOpenDownloadModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Java ZIP</span>
        </button>
      </div>
    </header>
  );
};
