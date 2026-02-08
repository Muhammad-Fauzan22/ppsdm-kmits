'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Trash2, 
  AlertTriangle, 
  FileText, 
  Shield, 
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';


/**
 * Data Management Section Component
 * UU PDP Compliance: Data Export & Deletion (Pasal 35-40)
 */

interface DeletionStatus {
  hasPendingDeletion: boolean;
  deletionId?: string;
  scheduledDeletionDate?: string;
  daysRemaining?: number;
  canCancel?: boolean;
}

export function DataManagementSection() {

  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [deletionStatus, setDeletionStatus] = useState<DeletionStatus | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteFeedback, setDeleteFeedback] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  // Check deletion status on mount
  React.useEffect(() => {
    checkDeletionStatus();
  }, []);

  const checkDeletionStatus = async () => {
    try {
      const response = await fetch('/api/user/delete');
      if (response.ok) {
        const data = await response.json();
        setDeletionStatus(data);
      }
    } catch (error) {
      console.error('Error checking deletion status:', error);
    }
  };

  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showExportError, setShowExportError] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/user/export', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ppsdm-data-export-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setShowExportSuccess(true);
    } catch (error) {
      setShowExportError(true);
    } finally {
      setIsExporting(false);
    }
  };


  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE_MY_ACCOUNT') {
      setDeleteErrorMessage('Please type "DELETE_MY_ACCOUNT" exactly to confirm.');
      setShowDeleteError(true);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('/api/user/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmation: confirmationText,
          reason: deleteReason,
          feedback: deleteFeedback,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to schedule account deletion');
      }

      setDeletionStatus({
        hasPendingDeletion: true,
        deletionId: data.deletionId,
        scheduledDeletionDate: data.scheduledDeletionDate,
        daysRemaining: data.daysRemaining,
        canCancel: true,
      });

      setShowDeleteDialog(false);
      setConfirmationText('');
      setDeleteReason('');
      setDeleteFeedback('');

      setShowDeleteSuccess(true);
    } catch (error: any) {
      setDeleteErrorMessage(error.message || 'Failed to schedule account deletion.');
      setShowDeleteError(true);
    } finally {
      setIsDeleting(false);
    }
  };


  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [showCancelError, setShowCancelError] = useState(false);
  const [cancelErrorMessage, setCancelErrorMessage] = useState('');

  const handleCancelDeletion = async () => {
    if (!deletionStatus?.deletionId) return;

    setIsCancelling(true);
    try {
      const response = await fetch('/api/user/delete/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deletionId: deletionStatus.deletionId,
          reason: cancelReason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel deletion');
      }

      setDeletionStatus({
        hasPendingDeletion: false,
      });

      setShowCancelDialog(false);
      setCancelReason('');

      setShowCancelSuccess(true);
    } catch (error: any) {
      setCancelErrorMessage(error.message || 'Failed to cancel deletion request.');
      setShowCancelError(true);
    } finally {
      setIsCancelling(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Data Management</h2>
        <p className="text-slate-600 mt-1">
          Manage your personal data in accordance with UU No. 27 Tahun 2022 (Perlindungan Data Pribadi)
        </p>
      </div>

      {/* Pending Deletion Alert */}
      {deletionStatus?.hasPendingDeletion && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">Account Deletion Scheduled</h3>
              <p className="text-amber-800 text-sm mt-1">
                Your account is scheduled for deletion on{' '}
                {deletionStatus.scheduledDeletionDate && 
                  new Date(deletionStatus.scheduledDeletionDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                }{' '}
                ({deletionStatus.daysRemaining} days remaining).
              </p>
              {deletionStatus.canCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancel Deletion Request
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Export Card */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Download className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Export Your Data</h3>
            <p className="text-slate-600 text-sm mt-1">
              Download a copy of all your personal data stored on our platform. 
              This includes your profile, assessment results, progress, and activity history.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Button
                onClick={handleExportData}
                disabled={isExporting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </>
                )}
              </Button>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                UU PDP Pasal 35 - Hak Portabilitas Data
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Deletion Card */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-50 rounded-lg">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Delete Your Account</h3>
            <p className="text-slate-600 text-sm mt-1">
              Permanently delete your account and all associated data. 
              You have a 14-day grace period to cancel this action.
            </p>
            <div className="mt-4">
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={deletionStatus?.hasPendingDeletion}
                className="bg-red-600 hover:bg-red-700"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                {deletionStatus?.hasPendingDeletion 
                  ? 'Deletion Already Scheduled' 
                  : 'Delete Account'}
              </Button>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                UU PDP Pasal 38 - Hak Penghapusan Data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Notice */}
      <div className="bg-slate-50 border rounded-lg p-4 text-sm text-slate-600">
        <h4 className="font-semibold text-slate-900 mb-2">Your Rights Under UU No. 27 Tahun 2022</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <strong>Data Portability (Pasal 35):</strong> You have the right to obtain and reuse your personal data 
            across different services.
          </li>
          <li>
            <strong>Right to Deletion (Pasal 38):</strong> You have the right to request deletion of your personal data, 
            subject to legal retention requirements.
          </li>
          <li>
            <strong>Grace Period:</strong> A 14-day grace period allows you to cancel deletion requests.
          </li>
        </ul>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Your Account
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Your account will be permanently deleted after a 14-day grace period.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> All your data will be permanently deleted including:
              </p>
              <ul className="text-sm text-red-700 mt-2 list-disc list-inside">
                <li>Profile information</li>
                <li>Assessment results and history</li>
                <li>Progress and achievements</li>
                <li>Journal entries</li>
                <li>Goals and activities</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for leaving (optional)</Label>
              <select
                id="reason"
                className="w-full border rounded-md p-2 text-sm"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
              >
                <option value="">Select a reason...</option>
                <option value="not_useful">Platform not useful for me</option>
                <option value="privacy_concerns">Privacy concerns</option>
                <option value="found_alternative">Found alternative platform</option>
                <option value="graduating">Graduating/leaving ITS</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback">Additional feedback (optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Tell us how we can improve..."
                value={deleteFeedback}
                onChange={(e) => setDeleteFeedback(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmation">
                Type <code className="bg-slate-100 px-1 rounded">DELETE_MY_ACCOUNT</code> to confirm
              </Label>
              <Input
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="DELETE_MY_ACCOUNT"
                className="text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting || confirmationText !== 'DELETE_MY_ACCOUNT'}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Delete Account'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Deletion Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelDeletion}
        title="Cancel Account Deletion?"
        description={`Your account is scheduled for deletion in ${deletionStatus?.daysRemaining} days. You can cancel this request to keep your account and all your data.`}
        confirmText={isCancelling ? 'Cancelling...' : 'Yes, Keep My Account'}
        cancelText="Keep Deletion"
        variant="default"
      />

      {/* Success/Error Dialogs */}
      <ConfirmationDialog
        isOpen={showExportSuccess}
        onClose={() => setShowExportSuccess(false)}
        onConfirm={() => setShowExportSuccess(false)}
        title="Data Exported Successfully"
        description="Your personal data has been exported as a PDF file."
        confirmText="OK"
        cancelText=""
        variant="default"
      />

      <ConfirmationDialog
        isOpen={showExportError}
        onClose={() => setShowExportError(false)}
        onConfirm={() => setShowExportError(false)}
        title="Export Failed"
        description="Failed to export your data. Please try again later."
        confirmText="OK"
        cancelText=""
        variant="destructive"
      />

      <ConfirmationDialog
        isOpen={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        onConfirm={() => setShowDeleteSuccess(false)}
        title="Account Deletion Scheduled"
        description={`Your account will be deleted in ${deletionStatus?.daysRemaining} days. You can cancel this anytime before then.`}
        confirmText="OK"
        cancelText=""
        variant="default"
      />

      <ConfirmationDialog
        isOpen={showDeleteError}
        onClose={() => setShowDeleteError(false)}
        onConfirm={() => setShowDeleteError(false)}
        title="Deletion Failed"
        description={deleteErrorMessage}
        confirmText="OK"
        cancelText=""
        variant="destructive"
      />

      <ConfirmationDialog
        isOpen={showCancelSuccess}
        onClose={() => setShowCancelSuccess(false)}
        onConfirm={() => setShowCancelSuccess(false)}
        title="Deletion Cancelled"
        description="Your account deletion request has been cancelled. Your data is safe."
        confirmText="OK"
        cancelText=""
        variant="default"
      />

      <ConfirmationDialog
        isOpen={showCancelError}
        onClose={() => setShowCancelError(false)}
        onConfirm={() => setShowCancelError(false)}
        title="Cancellation Failed"
        description={cancelErrorMessage}
        confirmText="OK"
        cancelText=""
        variant="destructive"
      />
    </div>
  );
}
