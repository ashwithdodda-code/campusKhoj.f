import React, { useState } from 'react';
import { Item, MatchScoreResult, CATEGORY_LABELS } from '../types/campuskhoj';
import { Sparkles, MapPin, Calendar, CheckCircle, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

interface AutoMatchViewProps {
  items: Item[];
  matches: MatchScoreResult[];
  selectedLostItem?: Item | null;
  onSelectLostItem: (item: Item) => void;
  onInitiateClaim: (foundItem: Item) => void;
}

export const AutoMatchView: React.FC<AutoMatchViewProps> = ({
  items,
  matches,
  selectedLostItem,
  onSelectLostItem,
  onInitiateClaim,
}) => {
  const lostItems = items.filter(i => i.type === 'LOST');
  const [activeLostId, setActiveLostId] = useState<string>(
    selectedLostItem ? selectedLostItem.itemId : (lostItems[0]?.itemId || '')
  );

  const currentLost = items.find(i => i.itemId === activeLostId) || lostItems[0];

  // Filter matches specifically for the selected lost item
  const itemMatches = matches.filter(m => m.lostItem.itemId === activeLostId);

  return (
    <div className="space-y-6">
      {/* Scoring Engine Mathematical Formula Card (PPT Slide 5) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-2 font-mono">
              <Cpu className="w-4 h-4" />
              <span>PPT SLIDE 05 · DETERMINISTIC MATCHING ALGORITHM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Automated Lost & Found Cross-Verification
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Every reported lost item is continuously scored against active found belongings held in custody.
              Matches qualifying at <span className="text-orange-400 font-semibold font-mono">50 points or above</span> are
              flagged for user verification.
            </p>
          </div>

          {/* Scoring Matrix Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 font-medium">Category</div>
              <div className="text-lg font-bold text-white font-mono">+40</div>
              <div className="text-[10px] text-slate-500">Exact classification</div>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 font-medium">Location</div>
              <div className="text-lg font-bold text-white font-mono">+20</div>
              <div className="text-[10px] text-slate-500">Zone proximity</div>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 font-medium">Date Proximity</div>
              <div className="text-lg font-bold text-white font-mono">+10</div>
              <div className="text-[10px] text-slate-500">Within 3 days</div>
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 font-medium">Keywords</div>
              <div className="text-lg font-bold text-white font-mono">+30</div>
              <div className="text-[10px] text-slate-500">Name & details</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Match Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Selectable Lost Reports (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-200">Select Lost Report to Analyze</span>
            <span className="font-mono">{lostItems.length} Lost Items</span>
          </div>

          <div className="space-y-2.5">
            {lostItems.map(lost => {
              const count = matches.filter(m => m.lostItem.itemId === lost.itemId).length;
              const isSelected = lost.itemId === activeLostId;

              return (
                <button
                  key={lost.itemId}
                  onClick={() => {
                    setActiveLostId(lost.itemId);
                    onSelectLostItem(lost);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-orange-500/80 shadow-md ring-1 ring-orange-500/30'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                    <span className="text-amber-400 font-semibold">{lost.itemId}</span>
                    <span className={count > 0 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      {count} {count === 1 ? 'match' : 'matches'}
                    </span>
                  </div>

                  <div className="font-bold text-sm text-white mb-1 line-clamp-1">
                    {lost.name}
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="truncate">{lost.location}</span>
                    <span>·</span>
                    <span>{lost.incidentDate}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Comparative Evaluation & Candidate Matches (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {currentLost ? (
            <>
              {/* Lost Item Details Spotlight */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-mono">
                    <span className="text-amber-400 font-bold">[LOST REPORT UNDER EVALUATION]</span>
                    <span>·</span>
                    <span>{currentLost.itemId}</span>
                  </div>
                  <span className="text-slate-400">Reported by: {currentLost.reportedByUserName}</span>
                </div>

                <h3 className="text-lg font-bold text-white">{currentLost.name}</h3>
                <p className="text-xs text-slate-300">{currentLost.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Category:</span>
                    <span className="text-slate-200">{CATEGORY_LABELS[currentLost.category]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Loss Zone:</span>
                    <span className="text-slate-200">{currentLost.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Date:</span>
                    <span className="text-slate-200">{currentLost.incidentDate}</span>
                  </div>
                </div>
              </div>

              {/* Suggested Matches Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-slate-200 uppercase tracking-wider">
                    Candidate Found Items in Campus Custody (Threshold ≥ 50 pts)
                  </span>
                  <span className="font-mono text-orange-400 font-semibold">{itemMatches.length} Matches Found</span>
                </div>

                {itemMatches.length === 0 ? (
                  <div className="p-8 text-center rounded-xl border border-slate-800 bg-slate-900/40">
                    <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-300 font-medium text-sm mb-1">No qualified matches recorded yet</p>
                    <p className="text-slate-500 text-xs max-w-md mx-auto">
                      No found item in custody has reached the 50-point similarity threshold for this report.
                      Check back when new found belongings are deposited at campus security.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {itemMatches.map((match, idx) => (
                      <div
                        key={idx}
                        className="p-5 bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl space-y-4 shadow-md transition-all"
                      >
                        {/* Match Score Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                          <div>
                            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                              <span>[FOUND CANDIDATE: {match.foundItem.itemId}]</span>
                              <span className="text-slate-600">·</span>
                              <span className="text-slate-300 font-sans">{CATEGORY_LABELS[match.foundItem.category]}</span>
                            </div>
                            <h4 className="text-base font-bold text-white">{match.foundItem.name}</h4>
                          </div>

                          {/* Score Gauge Badge */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="text-2xl font-black text-orange-400 font-mono tabular-nums leading-none">
                                {match.totalScore}<span className="text-xs text-slate-400">/100</span>
                              </div>
                              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide">
                                Verified Match
                              </div>
                            </div>

                            <button
                              onClick={() => onInitiateClaim(match.foundItem)}
                              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer"
                            >
                              Claim This Item
                            </button>
                          </div>
                        </div>

                        {/* Description & Storage Location */}
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {match.foundItem.description}
                        </p>

                        <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between text-xs text-slate-400">
                          <div>
                            <span className="text-slate-500">Storage Custody: </span>
                            <span className="text-emerald-400 font-medium">{match.foundItem.storageLocation}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Found Date: </span>
                            <span className="text-slate-300">{match.foundItem.incidentDate}</span>
                          </div>
                        </div>

                        {/* Interactive Mathematical Breakdown Bar */}
                        <div className="space-y-2 pt-2">
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            Mathematical Score Breakdown (PPT Algorithm)
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                              <span className="text-slate-400 font-sans text-[11px]">Category:</span>
                              <span className="text-orange-400 font-bold">+{match.categoryScore}/40</span>
                            </div>
                            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                              <span className="text-slate-400 font-sans text-[11px]">Location:</span>
                              <span className="text-orange-400 font-bold">+{match.locationScore}/20</span>
                            </div>
                            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                              <span className="text-slate-400 font-sans text-[11px]">Date Proximity:</span>
                              <span className="text-orange-400 font-bold">+{match.dateScore}/10</span>
                            </div>
                            <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                              <span className="text-slate-400 font-sans text-[11px]">Keywords:</span>
                              <span className="text-orange-400 font-bold">+{match.keywordScore}/30</span>
                            </div>
                          </div>

                          {/* Match Justifications */}
                          <div className="space-y-1 pt-1">
                            {match.reasons.map((reason, rIdx) => (
                              <div key={rIdx} className="flex items-center gap-2 text-[11px] text-slate-400">
                                <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>{reason}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 text-sm">
              Please select a lost report on the left to inspect candidate matches.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
