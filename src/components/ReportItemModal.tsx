import React, { useState } from 'react';
import { Item, Category, User, ItemType, CATEGORY_LABELS, CAMPUS_LOCATIONS } from '../types/campuskhoj';
import { X, AlertCircle } from 'lucide-react';

interface ReportItemModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmitItem: (newItem: Omit<Item, 'itemId' | 'status' | 'createdAt'>) => void;
}

export const ReportItemModal: React.FC<ReportItemModalProps> = ({
  currentUser,
  onClose,
  onSubmitItem,
}) => {
  const [reportType, setReportType] = useState<ItemType>('LOST');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('ELECTRONICS');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [storageLocation, setStorageLocation] = useState('Central Security Desk - Locker #12');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Item name is required');
      return;
    }
    if (!description.trim() || description.trim().length < 8) {
      setErrorMsg('Please provide a descriptive explanation (at least 8 characters) to help identify the belonging');
      return;
    }

    const finalLocation = customLocation.trim() ? customLocation.trim() : location;

    onSubmitItem({
      name: name.trim(),
      category,
      type: reportType,
      description: description.trim(),
      location: finalLocation,
      incidentDate,
      reportedByUserId: currentUser.userId,
      reportedByUserName: currentUser.name,
      storageLocation: reportType === 'FOUND' ? storageLocation.trim() : undefined,
      suspectedLossArea: reportType === 'LOST' ? finalLocation : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h2 className="text-lg font-bold text-white">Record Campus Belonging</h2>
            <div className="text-xs text-slate-400">
              Reporting as: <span className="text-orange-400 font-semibold">{currentUser.name}</span> ({currentUser.role})
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/80 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Toggle Type: LOST vs FOUND */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Report Classification</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReportType('LOST')}
                className={`py-2.5 px-4 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  reportType === 'LOST'
                    ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                I Lost Something
              </button>
              <button
                type="button"
                onClick={() => setReportType('FOUND')}
                className={`py-2.5 px-4 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  reportType === 'FOUND'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                I Found Something
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Item Name & Model <span className="text-orange-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Casio fx-991CW Calculator, Red Lanyard with Student ID..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Incident Date</label>
              <input
                type="date"
                required
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Campus Location / Building
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-orange-500 mb-2"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
              <option value="CUSTOM">Specific Room or Custom Zone...</option>
            </select>
            {location === 'CUSTOM' && (
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Specify classroom, floor, or outdoor bench..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            )}
          </div>

          {/* Storage Location (Required for Found Items as per PPT Slide 3) */}
          {reportType === 'FOUND' && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-800/60 rounded-xl space-y-1.5">
              <label className="block text-xs font-bold text-emerald-300">
                Where is this item currently stored? (PPT Requirement)
              </label>
              <input
                type="text"
                required
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                placeholder="e.g. Main Gate Security Cabin, Library Issue Desk Shelf 3..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-emerald-700/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <p className="text-[11px] text-slate-400">
                Found belongings must be deposited with verified campus staff or security for custody.
              </p>
            </div>
          )}

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Distinguishing Features & Description <span className="text-orange-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Color shades, brand, scratches, specific stickers, contents inside..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-md transition-colors"
            >
              Submit to Campus Registry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
