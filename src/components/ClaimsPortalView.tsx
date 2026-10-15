import React, { useState } from 'react';
import { Claim, Item, User, ClaimStatus } from '../types/campuskhoj';
import { ShieldCheck, CheckCircle2, XCircle, ArrowRight, Clock, AlertTriangle, FileText, Lock } from 'lucide-react';

interface ClaimsPortalViewProps {
  claims: Claim[];
  items: Item[];
  currentUser: User;
  onReviewClaim: (claimId: string, approve: boolean, notes: string) => void;
  onConfirmHandover: (claimId: string) => void;
}

export const ClaimsPortalView: React.FC<ClaimsPortalViewProps> = ({
  claims,
  items,
  currentUser,
  onReviewClaim,
  onConfirmHandover,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | ClaimStatus>('ALL');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  const isAdmin = currentUser.canApproveClaims;

  const filteredClaims = claims.filter(c => {
    if (activeFilter === 'ALL') return true;
    return c.status === activeFilter;
  });

  const handleOpenReview = (claim: Claim) => {
    setSelectedClaim(claim);
    setReviewNotes('');
    setReviewError('');
    setShowReviewModal(true);
  };

  const handleExecuteReview = (approve: boolean) => {
    if (!selectedClaim) return;
    if (!isAdmin) {
      setReviewError('Security check failed: Only users with ADMIN clearance can review claims.');
      return;
    }
    // Prevent self-approval
    if (selectedClaim.claimantId === currentUser.userId) {
      setReviewError('Conflict of Interest: Administrators cannot approve their own claims.');
      return;
    }

    const defaultNote = approve ? 'Proof of ownership validated against physical item' : 'Insufficient proof of ownership';
    onReviewClaim(selectedClaim.claimId, approve, reviewNotes.trim() ? reviewNotes.trim() : defaultNote);
    setShowReviewModal(false);
  };

  const handleExecuteHandover = (claim: Claim) => {
    if (!isAdmin) {
      alert('Only administrators can confirm item handovers at the security desk.');
      return;
    }
    onConfirmHandover(claim.claimId);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Verification Desk Asset */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>OWNERSHIP VERIFICATION & CUSTODY DISPATCH DESK</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Claims Lifecycle & Identity Handover
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mb-4">
              To prevent fraudulent retrieval, all claims require private distinguishing marks
              (serial numbers, casing scratches, internal storage contents). Verification is audited and restricted to authorized administrators.
            </p>

            {/* Current Active Clearance Bar */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl inline-flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-400">Current Operator:</span>
              <span className="text-white font-bold">{currentUser.name}</span>
              <span className="text-slate-600">·</span>
              <span className={`font-semibold ${isAdmin ? 'text-amber-400' : 'text-blue-400'}`}>
                Clearance: {currentUser.role} {isAdmin ? '(Review Authority Enabled)' : '(Standard Claimant)'}
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 h-44 rounded-xl overflow-hidden border border-slate-800 relative">
            <img
              src="/src/assets/images/campus_verification_vault_1792044751867.jpg"
              alt="Campus security dispatch desk"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-3">
              <div className="text-[11px] text-slate-300 font-medium">
                Admin Dispatch Desk · Custody Protocol Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeFilter === 'ALL' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Claims ({claims.length})
          </button>
          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeFilter === 'PENDING' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Review ({claims.filter(c => c.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setActiveFilter('APPROVED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeFilter === 'APPROVED' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Approved ({claims.filter(c => c.status === 'APPROVED').length})
          </button>
          <button
            onClick={() => setActiveFilter('RETURNED')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeFilter === 'RETURNED' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Returned ({claims.filter(c => c.status === 'RETURNED').length})
          </button>
        </div>

        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white tabular-nums">{filteredClaims.length}</span> recorded claims
        </div>
      </div>

      {/* Claims List */}
      {filteredClaims.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 text-sm">
          No claims recorded under this filter status.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredClaims.map((claim) => {
            const isPending = claim.status === 'PENDING';
            const isApproved = claim.status === 'APPROVED';
            const isReturned = claim.status === 'RETURNED';
            const isRejected = claim.status === 'REJECTED';

            return (
              <div
                key={claim.claimId}
                className="p-5 bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl space-y-4 shadow-md transition-all"
              >
                {/* Header row with Claim ID, Item Reference, and Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                      <span className="text-orange-400 font-bold">[{claim.claimId}]</span>
                      <span>·</span>
                      <span>Target Item: {claim.itemId}</span>
                      <span>·</span>
                      <span>Filed: {new Date(claim.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{claim.itemName}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span
                        className={`text-xs font-extrabold font-mono px-2.5 py-1 rounded border ${
                          isReturned
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                            : isApproved
                            ? 'bg-blue-950/60 border-blue-500/50 text-blue-300'
                            : isPending
                            ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                            : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                        }`}
                      >
                        STATUS: {claim.status}
                      </span>
                    </div>

                    {/* Admin Action Buttons */}
                    {isAdmin && isPending && (
                      <button
                        onClick={() => handleOpenReview(claim)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        Review Evidence
                      </button>
                    )}

                    {isAdmin && isApproved && !claim.handoverConfirmed && (
                      <button
                        onClick={() => handleExecuteHandover(claim)}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        Confirm Handover
                      </button>
                    )}
                  </div>
                </div>

                {/* Proof & Claimant Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Proof Description Provided by Owner */}
                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
                    <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px] uppercase tracking-wide">
                      <span>Submitted Proof of Ownership</span>
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <p className="text-slate-200 leading-relaxed font-mono text-[11px]">
                      {claim.proofDescription}
                    </p>
                  </div>

                  {/* Claimant Profile & Contact Info */}
                  <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
                    <div className="text-slate-400 font-semibold text-[11px] uppercase tracking-wide">
                      Claimant Identity
                    </div>
                    <div className="text-slate-200 font-medium">{claim.claimantName}</div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      Email: {claim.claimantEmail} · Roll: {claim.claimantCollegeId}
                    </div>
                    {claim.contactPhone && (
                      <div className="text-slate-400 font-mono text-[11px]">
                        Phone: {claim.contactPhone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Audit Review Trail if already reviewed */}
                {claim.reviewedByAdminName && (
                  <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-lg text-xs space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="font-semibold text-slate-300">Reviewed by Admin:</span>
                      <span className="text-white font-medium">{claim.reviewedByAdminName}</span>
                      <span>·</span>
                      <span>{claim.reviewedAt ? new Date(claim.reviewedAt).toLocaleString() : ''}</span>
                    </div>
                    {claim.adminReviewNotes && (
                      <div className="text-slate-300 italic">
                        "{claim.adminReviewNotes}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Review Modal */}
      {showReviewModal && selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Administrator Claim Review</h3>
              <span className="text-xs font-mono text-orange-400 font-bold">{selectedClaim.claimId}</span>
            </div>

            {reviewError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs rounded-lg">
                {reviewError}
              </div>
            )}

            <div className="space-y-2 text-xs">
              <div className="text-slate-400">Target Item: <span className="text-white font-bold">{selectedClaim.itemName}</span></div>
              <div className="text-slate-400">Claimant: <span className="text-white">{selectedClaim.claimantName} ({selectedClaim.claimantCollegeId})</span></div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <div className="text-slate-400 font-semibold mb-1">Claimant's Proof Evidence:</div>
                <div className="text-slate-200 font-mono text-xs">{selectedClaim.proofDescription}</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Administrative Audit Notes & Justification <span className="text-orange-400">*</span>
              </label>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Record why this claim was approved or rejected (e.g. Serial code verified against student receipts)..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleExecuteReview(false)}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
                >
                  Reject Claim
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteReview(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Approve Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
