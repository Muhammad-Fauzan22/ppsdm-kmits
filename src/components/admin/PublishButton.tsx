'use client';

import React, { useState } from 'react';

/**
 * Publish Button Component
 * ========================
 * One-click publish button untuk publish ke website
 */

interface PublishButtonProps {
  isPublishing: boolean;
  lastPublished: Date | null;
  version: number;
  onPublish: (options: { notifyMembers?: boolean; createBackup?: boolean }) => Promise<void>;
}

interface PublishOptions {
  notifyMembers: boolean;
  createBackup: boolean;
  generateSitemap: boolean;
  clearCache: boolean;
}

export function PublishButton({ isPublishing, lastPublished, version, onPublish }: PublishButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<PublishOptions>({
    notifyMembers: true,
    createBackup: true,
    generateSitemap: true,
    clearCache: true,
  });
  const [showHistory, setShowHistory] = useState(false);

  const handlePublish = async () => {
    await onPublish(options);
    setShowOptions(false);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="relative">
      {/* Main Publish Button */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isPublishing}
        className={`relative px-6 py-3 rounded-xl font-semibold transition-all ${
          isPublishing
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-green-500/25'
        }`}
      >
        <div className="flex items-center gap-3">
          {isPublishing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <span className="text-xl">🚀</span>
              <span>Publish to Website</span>
            </>
          )}
        </div>
      </button>

      {/* Version Badge */}
      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
        v{version}
      </div>

      {/* Publish Options Dropdown */}
      {showOptions && !isPublishing && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700">
            <h3 className="text-white font-semibold">Publish Options</h3>
            <p className="text-slate-400 text-sm mt-1">Configure your publish settings</p>
          </div>

          {/* Options */}
          <div className="p-4 space-y-3">
            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <div className="text-white text-sm font-medium">Notify Members</div>
                  <div className="text-slate-400 text-xs">Send email notifications to all members</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={options.notifyMembers}
                onChange={(e) => setOptions({ ...options, notifyMembers: e.target.checked })}
                className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <span className="text-xl">💾</span>
                <div>
                  <div className="text-white text-sm font-medium">Create Backup</div>
                  <div className="text-slate-400 text-xs">Backup current version before publishing</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={options.createBackup}
                onChange={(e) => setOptions({ ...options, createBackup: e.target.checked })}
                className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <span className="text-xl">🗺️</span>
                <div>
                  <div className="text-white text-sm font-medium">Generate Sitemap</div>
                  <div className="text-slate-400 text-xs">Update sitemap for SEO</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={options.generateSitemap}
                onChange={(e) => setOptions({ ...options, generateSitemap: e.target.checked })}
                className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <span className="text-xl">🧹</span>
                <div>
                  <div className="text-white text-sm font-medium">Clear Cache</div>
                  <div className="text-slate-400 text-xs">Clear CDN and browser cache</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={options.clearCache}
                onChange={(e) => setOptions({ ...options, clearCache: e.target.checked })}
                className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
              />
            </label>
          </div>

          {/* Last Published Info */}
          {lastPublished && (
            <div className="px-4 py-3 bg-slate-900/30 border-t border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Last published:</span>
                <span className="text-white font-medium">{formatTimeAgo(lastPublished)}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex gap-2">
            <button
              onClick={() => setShowOptions(false)}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              🚀 Publish Now
            </button>
          </div>
        </div>
      )}

      {/* Version History Button */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="absolute -bottom-12 right-0 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
      >
        <span>📜</span>
        <span>Version History</span>
      </button>

      {/* Version History Dropdown */}
      {showHistory && (
        <div className="absolute right-0 bottom-full mb-2 w-72 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-50 overflow-hidden">
          <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700">
            <h3 className="text-white font-semibold">Version History</h3>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {/* Mock version history */}
            {[
              { version: version, date: lastPublished || new Date(), status: 'current' },
              { version: version - 1, date: new Date(Date.now() - 86400000), status: 'published' },
              { version: version - 2, date: new Date(Date.now() - 172800000), status: 'published' },
              { version: version - 3, date: new Date(Date.now() - 259200000), status: 'published' },
            ].map((v) => (
              <div
                key={v.version}
                className="px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      v.status === 'current' ? 'bg-green-500' : 'bg-slate-500'
                    }`} />
                    <div>
                      <div className="text-white text-sm font-medium">v{v.version}</div>
                      <div className="text-slate-400 text-xs">{formatTimeAgo(v.date)}</div>
                    </div>
                  </div>
                  {v.status === 'current' && (
                    <span className="text-xs text-green-400 font-medium">Current</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-900/30 border-t border-slate-700">
            <button className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-medium transition-colors">
              View All Versions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
