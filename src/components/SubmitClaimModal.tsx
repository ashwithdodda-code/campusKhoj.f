import React, { useState } from 'react';
import { Item, User } from '../types/campuskhoj';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SubmitClaimModalProps {
  item: Item;
  currentUser: User;
  onClose: () => void;
  onSubmitClaim: (itemId: string, proof: string, phone: string) => void;
}

export const SubmitClaimModal: React.FC<SubmitClaimModalProps> = ({
  item,
  currentUser,
  onClose,
  onSubmitClaim,
}) => {
  const [proof, setProof] = useState('');
  const [phone, setPhone] = useState('+91 98');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proof.trim() || proof.trim().length < 8) {
      setErrorMsg('Please supply substantive ownership evidence (at least 8 characters) such as unique markings, serial numbers, or contents.');
      return;
    }
    onSubmitClaim(item.itemId, proof.trim(), phone.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Submit Ownership Claim</h3>
            <div className="text-xs text-slate-400">
              Claimant: <span className="text-orange-400 font-semibold">{currentUser.name}</span> ({currentUser.collegeId})
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Item Snapshot */}
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-mono">
            <span className="text-emerald-400 font-semibold">[{item.itemId}]</span>
            <span>Stored at: {item.storageLocation || 'Security Custody'}</span>
          </div>
          <div className="text-sm font-bold text-white">{item.name}</div>
          <div className="text-slate-400">Found Location: {item.location} · {item.incidentDate}</div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Private Proof of Ownership <span className="text-orange-400">*</span>
            </label>
            <p className="text-[11px] text-slate-400 mb-1.5 leading-relaxed">
              Describe identifying characteristics not listed in the public post: serial numbers, stickers,
              scratches, interior contents, or passcode patterns.
            </p>
            <textarea
              required
              rows={4}
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              placeholder="e.g. Serial number ends with 4910. The back casing has a blue scratch. Contains a student bus pass inside the flap..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Contact Phone Number for Admin Handover Verification
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-md transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Submit Claim for Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
