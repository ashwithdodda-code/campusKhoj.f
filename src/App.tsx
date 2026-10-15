/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { User, Item, Claim, MatchScoreResult } from './types/campuskhoj';
import { INITIAL_USERS, INITIAL_ITEMS, INITIAL_CLAIMS } from './data/initialData';
import { computeAllMatches } from './services/matchingEngine';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ItemRegisterView } from './components/ItemRegisterView';
import { AutoMatchView } from './components/AutoMatchView';
import { ClaimsPortalView } from './components/ClaimsPortalView';
import { OopArchitectureView } from './components/OopArchitectureView';
import { ReportItemModal } from './components/ReportItemModal';
import { SubmitClaimModal } from './components/SubmitClaimModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { DownloadZipModal } from './components/DownloadZipModal';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

const STORAGE_KEYS = {
  ITEMS: 'campuskhoj_items_v2',
  CLAIMS: 'campuskhoj_claims_v2',
  USERS: 'campuskhoj_users_v2',
  CURRENT_USER_ID: 'campuskhoj_current_uid_v2',
};

export default function App() {
  // Initialize state with localStorage fallbacks
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const savedUid = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const found = users.find(u => u.userId === savedUid);
      return found || users[2] || INITIAL_USERS[2]; // Default to Ashwith (Student)
    } catch {
      return INITIAL_USERS[2];
    }
  });

  const [items, setItems] = useState<Item[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
      return saved ? JSON.parse(saved) : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  const [claims, setClaims] = useState<Claim[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLAIMS);
      return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
    } catch {
      return INITIAL_CLAIMS;
    }
  });

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'register' | 'match' | 'claims' | 'oop'>('register');
  const [showReportModal, setShowReportModal] = useState(false);
  const [itemToClaim, setItemToClaim] = useState<Item | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedLostItemForMatch, setSelectedLostItemForMatch] = useState<Item | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.userId);
  }, [currentUser]);

  // Toast auto-clear
  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  // Compute matches using PPT algorithm
  const matches = useMemo(() => {
    return computeAllMatches(items);
  }, [items]);

  // Handlers
  const handleCreateItem = (newItemData: Omit<Item, 'itemId' | 'status' | 'createdAt'>) => {
    const nextIdNum = 1000 + items.length + 1;
    const newItem: Item = {
      ...newItemData,
      itemId: `ITEM-${nextIdNum}`,
      status: newItemData.type === 'LOST' ? 'LOST' : 'FOUND',
      createdAt: new Date().toISOString(),
    };

    setItems(prev => [newItem, ...prev]);
    setShowReportModal(false);
    setNotification({
      message: `${newItem.type === 'LOST' ? 'Lost item reported' : 'Found belonging registered'} as #${newItem.itemId}`,
      type: 'success',
    });
  };

  const handleSubmitClaim = (itemId: string, proof: string, phone: string) => {
    const targetItem = items.find(i => i.itemId === itemId);
    if (!targetItem) return;

    if (targetItem.status === 'RETURNED') {
      setNotification({ message: 'This item has already been verified and returned to its owner.', type: 'error' });
      return;
    }

    const nextClaimNum = 7000 + claims.length + 1;
    const newClaim: Claim = {
      claimId: `CLM-${nextClaimNum}`,
      itemId: targetItem.itemId,
      itemName: targetItem.name,
      itemCategory: targetItem.category,
      itemType: targetItem.type,
      itemLocation: targetItem.location,
      claimantId: currentUser.userId,
      claimantName: currentUser.name,
      claimantEmail: currentUser.email,
      claimantCollegeId: currentUser.collegeId,
      proofDescription: proof,
      contactPhone: phone,
      status: 'PENDING',
      handoverConfirmed: false,
      createdAt: new Date().toISOString(),
    };

    // Update target item status to CLAIMED
    setItems(prev => prev.map(i => i.itemId === itemId ? { ...i, status: 'CLAIMED' } : i));
    setClaims(prev => [newClaim, ...prev]);
    setItemToClaim(null);

    setNotification({
      message: `Claim #${newClaim.claimId} submitted for ${targetItem.name}. Awaiting Admin Review.`,
      type: 'success',
    });
    setActiveTab('claims');
  };

  const handleReviewClaim = (claimId: string, approve: boolean, notes: string) => {
    if (!currentUser.canApproveClaims) {
      setNotification({ message: 'Unauthorized: Only Administrators can review claims.', type: 'error' });
      return;
    }

    setClaims(prev => prev.map(c => {
      if (c.claimId === claimId) {
        return {
          ...c,
          status: approve ? 'APPROVED' : 'REJECTED',
          adminReviewNotes: notes,
          reviewedByAdminName: currentUser.name,
          reviewedAt: new Date().toISOString(),
        };
      }
      return c;
    }));

    if (!approve) {
      // Revert item status if no other pending claims exist
      const targetClaim = claims.find(c => c.claimId === claimId);
      if (targetClaim) {
        const otherPending = claims.some(c => c.itemId === targetClaim.itemId && c.claimId !== claimId && c.status === 'PENDING');
        if (!otherPending) {
          setItems(prev => prev.map(i => i.itemId === targetClaim.itemId ? { ...i, status: i.type === 'LOST' ? 'LOST' : 'FOUND' } : i));
        }
      }
    }

    setNotification({
      message: `Claim #${claimId} has been ${approve ? 'APPROVED' : 'REJECTED'}.`,
      type: 'success',
    });
  };

  const handleConfirmHandover = (claimId: string) => {
    if (!currentUser.canApproveClaims) {
      setNotification({ message: 'Unauthorized: Only Administrators can confirm handovers.', type: 'error' });
      return;
    }

    const claim = claims.find(c => c.claimId === claimId);
    if (!claim) return;

    setClaims(prev => prev.map(c => {
      if (c.claimId === claimId) {
        return {
          ...c,
          status: 'RETURNED',
          handoverConfirmed: true,
          handoverConfirmedAt: new Date().toISOString(),
        };
      }
      return c;
    }));

    setItems(prev => prev.map(i => i.itemId === claim.itemId ? { ...i, status: 'RETURNED' } : i));

    setNotification({
      message: `Handover confirmed! Item #${claim.itemId} is now officially marked RETURNED.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-[#0c121e] text-slate-100 flex flex-col selection:bg-orange-600 selection:text-white">
      {/* Top Bar Contract (Section 2) */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenReportModal={() => setShowReportModal(true)}
        onOpenUserModal={() => setShowUserModal(true)}
        onOpenDownloadModal={() => setShowDownloadModal(true)}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl text-xs font-semibold text-white animate-in slide-in-from-top-2 duration-200">
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <HeroBanner
          currentUser={currentUser}
          items={items}
          claims={claims}
          matchCount={matches.length}
          onOpenReportModal={() => setShowReportModal(true)}
          onSelectTab={setActiveTab}
        />

        {/* View Routing */}
        {activeTab === 'register' && (
          <ItemRegisterView
            items={items}
            currentUser={currentUser}
            onInitiateClaim={(item) => setItemToClaim(item)}
            onViewMatchesForItem={(item) => {
              setSelectedLostItemForMatch(item);
              setActiveTab('match');
            }}
            onOpenReportModal={() => setShowReportModal(true)}
          />
        )}

        {activeTab === 'match' && (
          <AutoMatchView
            items={items}
            matches={matches}
            selectedLostItem={selectedLostItemForMatch}
            onSelectLostItem={(item) => setSelectedLostItemForMatch(item)}
            onInitiateClaim={(foundItem) => setItemToClaim(foundItem)}
          />
        )}

        {activeTab === 'claims' && (
          <ClaimsPortalView
            claims={claims}
            items={items}
            currentUser={currentUser}
            onReviewClaim={handleReviewClaim}
            onConfirmHandover={handleConfirmHandover}
          />
        )}

        {activeTab === 'oop' && (
          <OopArchitectureView />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/70 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">CampusKhoj</span>
            <span>—</span>
            <span>Campus Lost and Found Management System</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Persistence: <code className="text-orange-400 font-mono">items.dat</code></span>
            <span>·</span>
            <button
              onClick={() => setShowDownloadModal(true)}
              className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
            >
              Download Full Java Source
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showReportModal && (
        <ReportItemModal
          currentUser={currentUser}
          onClose={() => setShowReportModal(false)}
          onSubmitItem={handleCreateItem}
        />
      )}

      {itemToClaim && (
        <SubmitClaimModal
          item={itemToClaim}
          currentUser={currentUser}
          onClose={() => setItemToClaim(null)}
          onSubmitClaim={handleSubmitClaim}
        />
      )}

      {showUserModal && (
        <RoleSwitcherModal
          currentUser={currentUser}
          users={users}
          onSelectUser={(u) => setCurrentUser(u)}
          onRegisterUser={(newU) => setUsers(prev => [...prev, newU])}
          onClose={() => setShowUserModal(false)}
        />
      )}

      {showDownloadModal && (
        <DownloadZipModal onClose={() => setShowDownloadModal(false)} />
      )}
    </div>
  );
}
