'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { 
  Download, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  Shield
} from 'lucide-react';

interface DeletionStatus {
  hasPendingDeletion: boolean;
  status?: string;
  requestedAt?: string;
  scheduledDeletionDate?: string;
  daysRemaining?: number;
  canCancel?: boolean;
}

export function DataManagementSection() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [deletionStatus, setDeletionStatus] = useState<DeletionStatus | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  
  // Dialog states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch deletion status on mount
  useEffect(() => {
    fetchDeletionStatus();
  }, []);

  const fetchDeletionStatus = async () => {
    try {
      const response = await fetch('/api/user/delete');
      if (response.ok) {
        const data = await response.json();
        setDeletionStatus(data);
      }
    } catch (error) {
      console.error('Error fetching deletion status:', error);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/user/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'pdf' })
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ppsdm-data-export-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setShowExportSuccess(true);
    } catch (error) {
      console.error('Export error:', error);
      setErrorMessage('Gagal mengekspor data. Silakan coba lagi.');
      setShowError(true);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          confirmDelete: true,
          reason: deleteReason 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      setShowDeleteSuccess(true);
      await fetchDeletionStatus();
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menghapus akun');
      setShowError(true);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDeletion = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch('/api/user/delete/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel deletion');
      }

      setShowCancelSuccess(true);
      await fetchDeletionStatus();
    } catch (error) {
      console.error('Cancel error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Gagal membatalkan penghapusan');
      setShowError(true);
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* UU PDP Compliance Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Kepatuhan UU PDP No. 27 Tahun 2022</h3>
            <p className="text-sm text-blue-700 mt-1">
              Platform ini mematuhi Undang-Undang Perlindungan Data Pribadi Indonesia. 
              Anda memiliki hak untuk mengakses, mengekspor, dan menghapus data pribadi Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Data Export Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Ekspor Data Pribadi (Pasal 35-37 UU PDP)
          </CardTitle>
          <CardDescription>
            Unduh semua data pribadi Anda dalam format PDF. Dokumen ini berisi riwayat asesmen, 
            profil, dan aktivitas Anda di platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>Format: PDF dengan branding resmi KMITS</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
<span>Waktu pemrosesan: {'< 2 menit'}</span>

            </div>
            <Button 
              onClick={handleExportData} 
              disabled={isExporting}
              className="w-full sm:w-auto"
            >
              {isExporting ? (
                <>Memproses...</>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Ekspor Data Saya
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Deletion Card */}
      <Card className={deletionStatus?.hasPendingDeletion ? 'border-orange-200' : 'border-red-200'}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${deletionStatus?.hasPendingDeletion ? 'text-orange-700' : 'text-red-700'}`}>
            {deletionStatus?.hasPendingDeletion ? (
              <Clock className="w-5 h-5" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
            {deletionStatus?.hasPendingDeletion 
              ? 'Penghapusan Akun Dijadwalkan' 
              : 'Hapus Akun (Pasal 38-40 UU PDP)'}
          </CardTitle>
          <CardDescription>
            {deletionStatus?.hasPendingDeletion 
              ? `Akun Anda akan dihapus secara permanen dalam ${deletionStatus.daysRemaining} hari.`
              : 'Hapus akun dan semua data pribadi Anda dari platform. Proses ini memiliki masa tenggang 14 hari.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deletionStatus?.hasPendingDeletion ? (
            <div className="space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">Penghapusan Dijadwalkan</p>
                    <p className="text-sm text-orange-700 mt-1">
                      Tanggal penghapusan: {new Date(deletionStatus.scheduledDeletionDate!).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-sm text-orange-700">
                      Sisa waktu: {deletionStatus.daysRemaining} hari
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowCancelConfirm(true)}
                disabled={isCancelling}
                className="w-full sm:w-auto"
              >
                {isCancelling ? (
                  <>Membatalkan...</>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Batalkan Penghapusan
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Peringatan</p>
                    <p className="text-sm text-red-700 mt-1">
                      Penghapusan akun bersifat permanen setelah masa tenggang 14 hari. 
                      Data yang dihapus tidak dapat dipulihkan.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Alasan penghapusan (opsional):</label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Beritahu kami mengapa Anda ingin menghapus akun..."
                  className="w-full p-3 border rounded-lg text-sm min-h-[80px]"
                />
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                {isDeleting ? (
                  <>Memproses...</>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus Akun Saya
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Konfirmasi Penghapusan Akun"
        message={`Apakah Anda yakin ingin menghapus akun Anda? Akun akan dihapus secara permanen dalam 14 hari. Tindakan ini tidak dapat dibatalkan setelah masa tenggang berakhir.`}
        confirmText="Ya, Hapus Akun"
        cancelText="Batal"
        variant="danger"
      />

      <ConfirmationDialog
        isOpen={showCancelConfirm}
        onCancel={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelDeletion}
        title="Batalkan Penghapusan Akun"
        message="Apakah Anda yakin ingin membatalkan permintaan penghapusan akun? Semua data Anda akan tetap aman dan Anda dapat menggunakan platform kembali."
        confirmText="Ya, Batalkan"
        cancelText="Tutup"
        variant="info"
      />

      <ConfirmationDialog
        isOpen={showExportSuccess}
        onCancel={() => setShowExportSuccess(false)}
        onConfirm={() => setShowExportSuccess(false)}
        title="Ekspor Data Berhasil"
        message="Data pribadi Anda telah berhasil diekspor. File PDF telah diunduh ke perangkat Anda."
        confirmText="OK"
        cancelText=""
        variant="info"
      />

      <ConfirmationDialog
        isOpen={showDeleteSuccess}
        onCancel={() => setShowDeleteSuccess(false)}
        onConfirm={() => setShowDeleteSuccess(false)}
        title="Penghapusan Dijadwalkan"
        message="Akun Anda telah dijadwalkan untuk dihapus dalam 14 hari. Anda akan menerima email konfirmasi. Anda dapat membatalkan penghapusan kapan saja sebelum tanggal yang dijadwalkan."
        confirmText="Mengerti"
        cancelText=""
        variant="info"
      />

      <ConfirmationDialog
        isOpen={showCancelSuccess}
        onCancel={() => setShowCancelSuccess(false)}
        onConfirm={() => setShowCancelSuccess(false)}
        title="Penghapusan Dibatalkan"
        message="Permintaan penghapusan akun Anda telah berhasil dibatalkan. Semua data Anda tetap aman dan Anda dapat melanjutkan menggunakan platform."
        confirmText="OK"
        cancelText=""
        variant="info"
      />

      <ConfirmationDialog
        isOpen={showError}
        onCancel={() => setShowError(false)}
        onConfirm={() => setShowError(false)}
        title="Terjadi Kesalahan"
        message={errorMessage}
        confirmText="OK"
        cancelText=""
        variant="danger"
      />

    </div>
  );
}
