'use client';

import { useState } from 'react';
import { useIzinCuti } from '@/hooks/useIzinCuti';
import { IzinCuti } from '@/types/izin-cuti';
import { Button } from '@/components/ui/Button';
import { ToastNotification } from '@/components/ui/ToastNotification';
import { IzinCutiTable } from '@/components/izin-cuti/IzinCutiTable';
import { IzinCutiFormModal } from '@/components/izin-cuti/IzinCutiFormModal';
import { ExtendIzinCutiModal } from '@/components/izin-cuti/ExtendIzinCutiModal';
import {
  ConfirmIzinCutiModal,
  IzinCutiActionType,
} from '@/components/izin-cuti/ConfirmIzinCutiModal';
import { Plus } from 'lucide-react';

export default function IzinCutiPage() {
  const {
    list,
    pegawaiList,
    loading,
    error,
    setError,
    isModalOpen,
    editingId,
    formData,
    setFormData,
    submitting,
    handleOpenModal,
    handleSubmit,
    handleBatal,
    extendTarget,
    setExtendTarget,
    extendedEndDate,
    setExtendedEndDate,
    actionSubmitting,
    handleOpenExtend,
    handleCloseModal,
    handleExtend,
    handleSelesai,
  } = useIzinCuti();

  const [confirmState, setConfirmState] = useState<{
    target: IzinCuti;
    action: IzinCutiActionType;
  } | null>(null);

  const handleConfirmAction = async () => {
    if (!confirmState) return;
    if (confirmState.action === 'BATAL') {
      await handleBatal(confirmState.target.id);
    } else {
      await handleSelesai(confirmState.target.id);
    }
    setConfirmState(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm font-medium text-slate-600">
        Memuat data pengajuan izin/cuti...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">Izin & Cuti</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Riwayat dan pencatatan permohonan izin, cuti, atau sakit pegawai
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          <Plus className="mr-1.5 h-4 w-4" /> Catat Izin/Cuti
        </Button>
      </div>

      {/* Tabel Data */}
      <IzinCutiTable
        data={list}
        actionSubmitting={actionSubmitting}
        onEdit={handleOpenModal}
        onOpenExtend={handleOpenExtend}
        onSelesai={(item) => setConfirmState({ target: item, action: 'SELESAI' })}
        onBatal={(item) => setConfirmState({ target: item, action: 'BATAL' })}
      />

      {/* Wrapper !mt-0 menjaga posisi fixed modal & toast tetap presisi */}
      <div className="!mt-0">
        {/* Modal Tambah / Edit Izin & Cuti */}
        <IzinCutiFormModal
          isOpen={isModalOpen}
          editingId={editingId}
          pegawaiList={pegawaiList}
          formData={formData}
          setFormData={setFormData}
          submitting={submitting}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />

        {/* Modal Perpanjang Tanggal Selesai */}
        <ExtendIzinCutiModal
          target={extendTarget}
          extendedEndDate={extendedEndDate}
          setExtendedEndDate={setExtendedEndDate}
          submitting={actionSubmitting}
          onClose={() => setExtendTarget(null)}
          onSubmit={handleExtend}
        />

        {/* Modal Konfirmasi Batalkan / Tandai Selesai */}
        <ConfirmIzinCutiModal
          target={confirmState?.target ?? null}
          actionType={confirmState?.action ?? 'BATAL'}
          loading={actionSubmitting}
          onClose={() => !actionSubmitting && setConfirmState(null)}
          onConfirm={handleConfirmAction}
        />

        {/* Notifikasi Error Melayang */}
        <ToastNotification
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      </div>
    </div>
  );
}