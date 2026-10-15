import React, { useState, useMemo } from 'react';
import { Item, Category, User, ItemType, ItemStatus, CATEGORY_LABELS, CAMPUS_LOCATIONS } from '../types/campuskhoj';
import { Search, MapPin, Calendar, UserCheck, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ItemRegisterViewProps {
  items: Item[];
  currentUser: User;
  onInitiateClaim: (item: Item) => void;
  onViewMatchesForItem: (item: Item) => void;
  onOpenReportModal: () => void;
}

export const ItemRegisterView: React.FC<ItemRegisterViewProps> = ({
  items,
  currentUser,
  onInitiateClaim,
  onViewMatchesForItem,
  onOpenReportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | ItemType>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Type filter
      if (selectedType !== 'ALL' && item.type !== selectedType) return false;
      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      // Location filter
      if (selectedLocation !== 'ALL' && item.location !== selectedLocation) return false;
      // Status filter
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchId = item.itemId.toLowerCase().includes(q);
        return matchName || matchDesc || matchLoc || matchId;
      }
      return true;
    });
  }, [items, searchQuery, selectedType, selectedCategory, selectedLocation, selectedStatus]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, serial number, item name, or location..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
            />
          </div>

          {/* Type Segmented Control (Interactive Filter Buttons - Allowed) */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setSelectedType('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedType === 'ALL' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setSelectedType('LOST')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedType === 'LOST' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Lost Reports ({items.filter(i => i.type === 'LOST').length})
            </button>
            <button
              onClick={() => setSelectedType('FOUND')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedType === 'FOUND' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Found Belongings ({items.filter(i => i.type === 'FOUND').length})
            </button>
          </div>
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => (
                <option key={catKey} value={catKey}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Campus Location Zone</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Campus Zones</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Verification Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="LOST">Active Lost (Unclaimed)</option>
              <option value="FOUND">Active Found (In Custody)</option>
              <option value="CLAIMED">Claimed (Pending Review)</option>
              <option value="RETURNED">Returned (Completed Handover)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Item Cards Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          Showing <span className="font-semibold text-slate-200 tabular-nums">{filteredItems.length}</span> recorded belongings in campus registry
        </div>
        {(searchQuery || selectedCategory !== 'ALL' || selectedLocation !== 'ALL' || selectedStatus !== 'ALL' || selectedType !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('ALL');
              setSelectedCategory('ALL');
              setSelectedLocation('ALL');
              setSelectedStatus('ALL');
            }}
            className="text-orange-400 hover:text-orange-300 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid of Item Cards */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-slate-800 bg-slate-900/60">
          <p className="text-slate-300 font-medium mb-1">No items matched your current search filters</p>
          <p className="text-slate-500 text-xs mb-4">Try clearing filters or search terms to broaden the campus register</p>
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors"
          >
            Report a New Belonging
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isLost = item.type === 'LOST';
            const isReturned = item.status === 'RETURNED';
            const isClaimed = item.status === 'CLAIMED';

            return (
              <div
                key={item.itemId}
                className="flex flex-col justify-between p-5 bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl transition-all shadow-md group"
              >
                <div>
                  {/* Clean unboxed metadata with separators (NO PILLS) */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 font-mono">
                    <span className={isLost ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      [{item.type}]
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-300 font-sans">{CATEGORY_LABELS[item.category] || item.category}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{item.itemId}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-orange-300 transition-colors">
                    {item.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Location & Date Details */}
                  <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>Reported Date: {item.incidentDate}</span>
                    </div>

                    {item.storageLocation && (
                      <div className="flex items-center gap-2 text-slate-300 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">Storage: {item.storageLocation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Status & Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div className="text-[11px]">
                    <span className="text-slate-500">Status: </span>
                    <span
                      className={`font-semibold ${
                        isReturned
                          ? 'text-emerald-400'
                          : isClaimed
                          ? 'text-amber-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLost ? (
                      <button
                        onClick={() => onViewMatchesForItem(item)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-orange-400 hover:text-white bg-slate-950 hover:bg-orange-600/30 border border-orange-500/30 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>Check Matches</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      !isReturned && (
                        <button
                          onClick={() => onInitiateClaim(item)}
                          disabled={isReturned}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Claim Item</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
