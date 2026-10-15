import React from 'react';
import { Item, Claim, User } from '../types/campuskhoj';
import { Search, PlusCircle, CheckCircle2, Cpu } from 'lucide-react';

interface HeroBannerProps {
  currentUser: User;
  items: Item[];
  claims: Claim[];
  matchCount: number;
  onOpenReportModal: () => void;
  onSelectTab: (tab: 'register' | 'match' | 'claims' | 'oop') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentUser,
  items,
  claims,
  matchCount,
  onOpenReportModal,
  onSelectTab,
}) => {
  const lostCount = items.filter(i => i.type === 'LOST').length;
  const foundCount = items.filter(i => i.type === 'FOUND').length;
  const returnedCount = items.filter(i => i.status === 'RETURNED').length;
  const pendingClaimsCount = claims.filter(c => c.status === 'PENDING').length;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 mb-8 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        {/* Left Column: Text & Action Controls */}
        <div className="lg:col-span-7 p-7 sm:p-9 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-3 tracking-wide">
              <span>CAMPUS LOST & FOUND MANAGEMENT SYSTEM</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">JAVA OOP COURSE PROJECT</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3 text-balance leading-tight">
              Reuniting Campus Belongings with Automated Intelligence
            </h1>

            <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed max-w-xl">
              Replace unstructured chat messages and manual registries with an authoritative campus directory.
              Built on Java 17 and Spring Boot, demonstrating all four OOP pillars, multi-tier user authorization,
              and our deterministic 50-point matching engine.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenReportModal}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report Belonging</span>
              </button>

              <button
                onClick={() => onSelectTab('match')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-750 hover:text-white border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-orange-400" />
                <span>View Auto-Matches ({matchCount})</span>
              </button>

              {currentUser.canApproveClaims && pendingClaimsCount > 0 && (
                <button
                  onClick={() => onSelectTab('claims')}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/80 rounded-lg hover:bg-amber-900/60 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{pendingClaimsCount} Claims Awaiting Your Review</span>
                </button>
              )}
            </div>
          </div>

          {/* Micro Project Attribution */}
          <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span className="text-slate-500">Project Engineers:</span>
            <span>CH. Shri Varshith (25071A6607)</span>
            <span className="text-slate-600">·</span>
            <span>P. Dhruva Krishna (25071A6616)</span>
            <span className="text-slate-600">·</span>
            <span>D. Ashwith (25071A6617)</span>
            <span className="text-slate-600">·</span>
            <span>I. Hansika (25071A6621)</span>
          </div>
        </div>

        {/* Right Column: High-Fidelity Campus Photo Banner */}
        <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full border-t lg:border-t-0 lg:border-l border-slate-800">
          <img
            src="/src/assets/images/hero_campus_kiosk_1792044733132.jpg"
            alt="University student center information desk"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-slate-900/60 lg:to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 backdrop-blur-sm flex items-center justify-between text-xs text-slate-300">
            <div>
              <div className="font-semibold text-white">Central Security & Custody</div>
              <div className="text-[11px] text-slate-400">Main Office · Ground Floor, Student Center</div>
            </div>
            <div className="text-right">
              <span className="font-mono text-emerald-400 font-medium">Locker #12 Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Metric Full-Width Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-slate-800 bg-slate-950/70 divide-x divide-slate-800/80">
        <div className="p-4 sm:p-5 text-center">
          <div className="text-xs font-medium text-slate-400">Lost Reports</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 tabular-nums font-mono">{lostCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Reported by students</div>
        </div>
        <div className="p-4 sm:p-5 text-center">
          <div className="text-xs font-medium text-slate-400">Found Belongings</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 tabular-nums font-mono">{foundCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Held in campus custody</div>
        </div>
        <div className="p-4 sm:p-5 text-center">
          <div className="text-xs font-medium text-slate-400">Suggested Matches</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-400 mt-0.5 tabular-nums font-mono">{matchCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Score ≥ 50 Threshold</div>
        </div>
        <div className="p-4 sm:p-5 text-center">
          <div className="text-xs font-medium text-slate-400">Verified Returns</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-0.5 tabular-nums font-mono">{returnedCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Reunited with owners</div>
        </div>
      </div>
    </div>
  );
};
