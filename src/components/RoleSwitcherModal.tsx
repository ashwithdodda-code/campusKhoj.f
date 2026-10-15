import React, { useState } from 'react';
import { User, UserRole } from '../types/campuskhoj';
import { X, Shield, Briefcase, GraduationCap, UserPlus, Check } from 'lucide-react';

interface RoleSwitcherModalProps {
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  onRegisterUser: (newUser: User) => void;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  currentUser,
  users,
  onSelectUser,
  onRegisterUser,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'SELECT' | 'REGISTER'>('SELECT');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'STUDENT' | 'STAFF'>('STUDENT');
  const [regRoll, setRegRoll] = useState('');
  const [regDept, setRegDept] = useState('Computer Science');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regRoll.trim()) {
      setErrorMsg('Please fill in all required registration fields');
      return;
    }

    const newUser: User = {
      userId: `USR-${5000 + users.length + 1}`,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      role: regRole,
      collegeId: regRoll.trim(),
      departmentOrBranch: regDept.trim(),
      canApproveClaims: false, // Security constraint: Admin role cannot be self-selected via registration
      avatarColor: regRole === 'STAFF' ? 'bg-emerald-600' : 'bg-blue-600',
    };

    onRegisterUser(newUser);
    onSelectUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Campus Identity & Roles</h3>
            <div className="text-xs text-slate-400">Switch user account or register a new profile</div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('SELECT')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'SELECT' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Select Existing Persona
          </button>
          <button
            onClick={() => setActiveTab('REGISTER')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'REGISTER' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register New Profile
          </button>
        </div>

        {activeTab === 'SELECT' ? (
          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {users.map((u) => {
              const isSelected = u.userId === currentUser.userId;
              return (
                <button
                  key={u.userId}
                  onClick={() => {
                    onSelectUser(u);
                    onClose();
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-950 border-orange-500 shadow-md ring-1 ring-orange-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white shrink-0">
                      {u.role === 'ADMIN' && <Shield className="w-4 h-4 text-amber-400" />}
                      {u.role === 'STAFF' && <Briefcase className="w-4 h-4 text-emerald-400" />}
                      {u.role === 'STUDENT' && <GraduationCap className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-2">
                        <span>{u.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({u.role})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {u.collegeId} · {u.departmentOrBranch}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-white shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            {errorMsg && (
              <div className="p-2 bg-rose-950/40 border border-rose-800 text-rose-300 rounded text-[11px]">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Campus Email</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="rahul@campus.edu"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Role</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as 'STUDENT' | 'STAFF')}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="STUDENT">Student</option>
                  <option value="STAFF">Campus Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">College ID / Roll</label>
                <input
                  type="text"
                  required
                  value={regRoll}
                  onChange={(e) => setRegRoll(e.target.value)}
                  placeholder="25071A..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Department / Branch</label>
              <input
                type="text"
                value={regDept}
                onChange={(e) => setRegDept(e.target.value)}
                placeholder="Computer Science & Engineering"
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Create Account & Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
