import React, { useState } from 'react';
import { X, Download, Terminal, Check, FolderArchive, ShieldCheck, Play } from 'lucide-react';

interface DownloadZipModalProps {
  onClose: () => void;
}

export const DownloadZipModal: React.FC<DownloadZipModalProps> = ({ onClose }) => {
  const [copiedVerify, setCopiedVerify] = useState(false);
  const [copiedSetup, setCopiedSetup] = useState(false);

  const copyToClipboard = (text: string, type: 'verify' | 'setup') => {
    navigator.clipboard.writeText(text);
    if (type === 'verify') {
      setCopiedVerify(true);
      setTimeout(() => setCopiedVerify(false), 2000);
    } else {
      setCopiedSetup(true);
      setTimeout(() => setCopiedSetup(false), 2000);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/CampusKhoj-Full-Stack-Java.zip';
    link.download = 'CampusKhoj-Full-Stack-Java.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">CampusKhoj-Full-Stack-Java.zip</h3>
              <div className="text-xs text-slate-400">Complete Java 17 + Spring Boot + Maven Project</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Download CTA Card */}
          <div className="p-5 bg-gradient-to-r from-orange-950/30 to-slate-950 border border-orange-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-white mb-0.5">Extractable ZIP Package Ready</div>
              <p className="text-xs text-slate-300">
                Contains complete source code, 12+ Java classes, JUnit 5 test suites, Maven wrapper (<code className="text-orange-300 font-mono">mvnw.cmd</code>), and PowerShell scripts.
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-lg transition-colors shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download ZIP (56.5 KB)</span>
            </button>
          </div>

          {/* Windows 11 PowerShell Setup Instructions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
              <Terminal className="w-4 h-4" />
              <span>WINDOWS 11 POWERSHELL EXECUTION COMMANDS</span>
            </div>

            {/* Step 1: Verification */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  1. Check Java & Run Automated JUnit 5 Tests
                </span>
                <button
                  onClick={() => copyToClipboard('.\\verify.ps1', 'verify')}
                  className="flex items-center gap-1 text-[11px] font-mono text-orange-400 hover:text-orange-300 cursor-pointer"
                >
                  {copiedVerify ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                  <span>{copiedVerify ? 'Copied!' : 'Copy Command'}</span>
                </button>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs text-emerald-300 select-all">
                .\verify.ps1
              </div>
              <p className="text-[11px] text-slate-400">
                Verifies JDK 17+ in PATH, runs 4 test suites (MatchingEngine, OOP Pillars, Claim Workflow, FileHandler persistence).
              </p>
            </div>

            {/* Step 2: Launch Server */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  2. Launch CampusKhoj Web Server
                </span>
                <button
                  onClick={() => copyToClipboard('.\\setup.ps1', 'setup')}
                  className="flex items-center gap-1 text-[11px] font-mono text-orange-400 hover:text-orange-300 cursor-pointer"
                >
                  {copiedSetup ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                  <span>{copiedSetup ? 'Copied!' : 'Copy Command'}</span>
                </button>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-xs text-emerald-300 select-all">
                .\setup.ps1
              </div>
              <p className="text-[11px] text-slate-400">
                Starts Spring Boot on port 8080 and mounts the HTML5 web app at <code className="text-orange-300">http://localhost:8080</code>.
              </p>
            </div>
          </div>

          {/* Test Accounts Table */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-300">Pre-configured Accounts (Encrypted with BCrypt)</div>
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                  <tr>
                    <th className="p-2.5">Role</th>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Email</th>
                    <th className="p-2.5">Password</th>
                    <th className="p-2.5">College ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300 font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 text-amber-400 font-bold">ADMIN</td>
                    <td className="p-2.5 font-sans">CH. Shri Varshith</td>
                    <td className="p-2.5">varshith@campus.edu</td>
                    <td className="p-2.5 text-orange-300">Admin@123</td>
                    <td className="p-2.5">25071A6607</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-emerald-400 font-bold">STAFF</td>
                    <td className="p-2.5 font-sans">P. Dhruva Krishna</td>
                    <td className="p-2.5">dhruva@campus.edu</td>
                    <td className="p-2.5 text-orange-300">Staff@123</td>
                    <td className="p-2.5">25071A6616</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-blue-400 font-bold">STUDENT</td>
                    <td className="p-2.5 font-sans">D. Ashwith</td>
                    <td className="p-2.5">ashwith@campus.edu</td>
                    <td className="p-2.5 text-orange-300">Student@123</td>
                    <td className="p-2.5">25071A6617</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-purple-400 font-bold">STUDENT</td>
                    <td className="p-2.5 font-sans">I. Hansika</td>
                    <td className="p-2.5">hansika@campus.edu</td>
                    <td className="p-2.5 text-orange-300">Student@123</td>
                    <td className="p-2.5">25071A6621</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
