'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { Download, Trash2, AlertTriangle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * UU PDP Compliance - Data Management Section
 * Provides UI for data export and account deletion (data subject rights)
 */
export function DataManagementSection() {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletionStatus, setDeletionStatus] = useState<{
    isScheduled: boolean;
    scheduledDate?: string;
    daysRemaining?: number;
  } | null>(null);
  const { toast } = useToast();

  // Check deletion status on mount
  React.useEffect(() => {
    checkDeletionStatus();
  }, []);

  const checkDeletionStatus = async () => {
    try {
      const response = await fetch('/api/user/delete', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setDeletionStatus({
          isScheduled: data.isScheduledForDeletion,
          scheduledDate: data.scheduledDeletionDate,
          daysRemaining: data.daysRemaining,
        });
      }
    } catch (error) {
      }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/user/export', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: 'Autentikasi Diperlukan',
            description: 'Silakan login untuk mengekspor data Anda.',
            variant: 'destructive',
          });
          return;
        }
        throw new Error('Export failed');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ppsdm-data-export-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Data Berhasil Diekspor',
        description: 'File PDF berhasil diunduh. Dokumen ini sesuai dengan UU PDP.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Gagal Mengekspor Data',
        description: 'Terjadi kesalahan saat mengekspor data. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch('/api/user/delete', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirm: true,
          reason: 'User requested deletion',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 && data.scheduledDeletionDate) {
          setDeletionStatus({
            isScheduled: true,
            scheduledDate: data.scheduledDeletionDate,
            daysRemaining: data.daysRemaining,
          });
          toast({
            title: 'Penghapusan Sudah Dijadwalkan',
            description: `Akun Anda sudah dijadwalkan untuk dihapus dalam ${data.daysRemaining} hari.`,
            variant: 'default',
          });
          return;
        }
        throw new Error(data.error || 'Delete failed');
      }

      setDeletionStatus({
        isScheduled: true,
        scheduledDate: data.scheduledDeletionDate,
        daysRemaining: data.daysRemaining,
      });

      toast({
        title: 'Penghapusan Dijadwalkan',
        description: `Akun Anda akan dihapus dalam 14 hari. Anda dapat membatalkan kapan saja.`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Gagal Menjadwalkan Penghapusan',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleCancelDeletion = async () => {
    try {
      const response = await fetch('/api/user/delete/cancel', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Cancel failed');
      }

      setDeletionStatus({
        isScheduled: false,
      });

      toast({
        title: 'Penghapusan Dibatalkan',
        description: 'Akun Anda tidak akan dihapus. Semua data tetap aman.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Gagal Membatalkan',
        description: 'Terjadi kesalahan saat membatalkan penghapusan.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Export Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Ekspor Data Pribadi
          </CardTitle>
          <CardDescription>
            Unduh semua data pribadi Anda dalam format PDF sesuai dengan UU No. 27 Tahun 2022 (PDP).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Data yang akan diekspor:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Profil pengguna (nama, NRP, fakultas, departemen)</li>
                <li>• Riwayat asesmen dan respons</li>
                <li>• Hasil asesmen dan skor</li>
                <li>• Progress pengerjaan</li>
                <li>• Pencapaian dan sertifikat</li>
              </ul>
            </div>
            <Button
              onClick={handleExportData}
              disabled={isExporting}
              className="w-full sm:w-auto"
            >
              {isExporting ? (
                <>Mengekspor...</>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Unduh Data Saya (PDF)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Deletion Card */}
      <Card className={deletionStatus?.isScheduled ? 'border-orange-200 bg-orange-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Hapus Akun
          </CardTitle>
          <CardDescription>
            {deletionStatus?.isScheduled
              ? 'Akun Anda telah dijadwalkan untuk dihapus.'
              : 'Hapus akun dan semua data pribadi Anda secara permanen.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deletionStatus?.isScheduled ? (
            <div className="space-y-4">
              <div className="bg-orange-100 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">Penghapusan Dijadwalkan</h4>
                    <p className="text-sm text-orange-800 mt-1">
                      Akun Anda akan dihapus pada:{' '}
                      <strong>
                        {deletionStatus.scheduledDate
                          ? new Date(deletionStatus.scheduledDate).toLocaleDateString('id-ID')
                          : 'N/A'}
                      </strong>
                    </p>
                    <p className="text-sm text-orange-800 mt-1">
                      Sisa waktu: <strong>{deletionStatus.daysRemaining} hari</strong>
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleCancelDeletion}
                variant="outline"
                className="w-full sm:w-auto border-orange-500 text-orange-700 hover:bg-orange-100"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Batalkan Penghapusan
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Perhatian:</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Semua data pribadi akan dihapus secara permanen</li>
                  <li>• Riwayat asesmen tidak dapat dipulihkan</li>
                  <li>• Sertifikat dan pencapaian akan hilang</li>
                  <li>• Anda memiliki 14 hari untuk membatalkan penghapusan</li>
                </ul>
              </div>

              <Button
                variant="destructive"
                disabled={isDeleting}
                onClick={() => setShowDeleteDialog(true)}
                className="w-full sm:w-auto"
              >
                {isDeleting ? (
                  <>Memproses...</>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus Akun Saya
                  </>
                )}
              </Button>

              {/* Delete Confirmation Dialog */}
              <ConfirmationDialog
                isOpen={showDeleteDialog}
                title="Konfirmasi Penghapusan Akun"
                message={
                  <div className="space-y-2">
                    <p>
                      Tindakan ini akan menjadwalkan penghapusan akun Anda dalam 14 hari.
                      Selama periode ini, Anda dapat membatalkan penghapusan.
                    </p>
                    <p className="font-medium text-red-600">
                      Setelah 14 hari, akun dan semua data akan dihapus secara permanen
                      dan tidak dapat dipulihkan.
                    </p>
                  </div>
                }
                confirmText="Ya, Hapus Akun Saya"
                cancelText="Batal"
                onConfirm={handleDeleteAccount}
                onCancel={() => setShowDeleteDialog(false)}
                variant="danger"
                isLoading={isDeleting}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Info */}
      <div className="text-xs text-muted-foreground text-center">
        <p>
          Sesuai dengan UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi (PDP),
          Anda memiliki hak untuk mengakses, mengekspor, dan menghapus data pribadi Anda.
        </p>
      </div>
    </div>
  );
}
