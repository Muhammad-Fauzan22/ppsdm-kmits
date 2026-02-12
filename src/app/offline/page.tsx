/**
 * Offline Page
 * Ditampilkan saat user tidak memiliki koneksi internet
 */

'use client';

import React from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-4 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl text-center">
        {/* Offline Icon */}
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Anda Sedang Offline
        </h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Sepertinya Anda tidak memiliki koneksi internet. Jangan khawatir, beberapa konten masih dapat diakses secara offline.
        </p>

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 text-left">
          <h2 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Tips:
          </h2>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Periksa koneksi internet Anda</li>
            <li>• Coba refresh halaman ini</li>
            <li>• Beberapa konten mungkin tersedia di cache</li>
            <li>• Gunakan fitur offline untuk akses konten yang sudah diunduh</li>
          </ul>
        </div>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
        >
          Coba Lagi
        </button>

        {/* Home Button */}
        <Link
          href="/"
          className="block w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Kembali ke Beranda
        </Link>

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          PPSDM KMITS - Platform Pengembangan SDM Mahasiswa ITS
        </p>
      </div>
    </div>
  );
}
