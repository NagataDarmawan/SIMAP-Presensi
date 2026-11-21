'use client';

import { useState, useEffect, useCallback } from 'react';
import { izinCutiService } from '@/services/izinCuti.service';
import { pegawaiService } from '@/services/pegawai.service';
import { CreateIzinCutiDto, IzinCuti } from '@/types/izin-cuti';
import { Pegawai } from '@/types/pegawai';

function getTodayIso(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
}

function getNextDateIso(dateStr: string): string {
  const baseDate = dateStr.split('T')[0];
  const nextDate = new Date(`${baseDate}T00:00:00Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  return nextDate.toISOString().split('T')[0];
}

function createInitialFormState(defaultPegawaiId = 0): CreateIzinCutiDto {
  const today = getTodayIso();
  return {
    pegawai_id: defaultPegawaiId,
    jenis: 'IZIN',
    tanggal_mulai: today,
    tanggal_selesai: today,
    alasan: '',
  };
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
}

export function useIzinCuti() {
  const [list, setList] = useState<IzinCuti[]>([]);
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateIzinCutiDto>(createInitialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [extendTarget, setExtendTarget] = useState<IzinCuti | null>(null);
  const [extendedEndDate, setExtendedEndDate] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      const [resIzin, resPegawai] = await Promise.all([
        izinCutiService.getAll(),
        pegawaiService.getAll(),
      ]);
      if (resIzin?.success) setList(resIzin.data || []);
      if (resPegawai?.success) setPegawaiList(resPegawai.data || []);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengambil data pengajuan izin/cuti.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      try {
        const [resIzin, resPegawai] = await Promise.all([
          izinCutiService.getAll(),
          pegawaiService.getAll(),
        ]);
        if (!active) return;
        if (resIzin?.success) setList(resIzin.data || []);
        if (resPegawai?.success) setPegawaiList(resPegawai.data || []);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err, 'Gagal mengambil data pengajuan izin/cuti.'));
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadInitialData();
    return () => {
      active = false;
    };
  }, []);

  const handleOpenModal = (item?: IzinCuti) => {
    setEditingId(item?.id ?? null);

    if (item) {
      setFormData({
        pegawai_id: item.pegawai_id,
        jenis: item.jenis,
        tanggal_mulai: item.tanggal_mulai.split('T')[0],
        tanggal_selesai: item.tanggal_selesai.split('T')[0],
        alasan: item.alasan || '',
      });
    } else {
      const defaultPegawaiId = pegawaiList.length > 0 ? pegawaiList[0].id : 0;
      setFormData(createInitialFormState(defaultPegawaiId));
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pegawai_id) {
      setError('Silakan pilih pegawai.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      if (editingId === null) {
        await izinCutiService.create(formData);
      } else {
        await izinCutiService.update(editingId, formData);
      }
      setEditingId(null);
      setIsModalOpen(false);
      await refreshData();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          editingId === null
            ? 'Gagal mencatat pengajuan izin/cuti.'
            : 'Gagal mengedit pengajuan izin/cuti.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBatal = async (id: number) => {
    setActionSubmitting(true);
    setError(null);
    try {
      await izinCutiService.cancel(id);
      await refreshData();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal membatalkan pengajuan.'));
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleOpenExtend = (item: IzinCuti) => {
    setExtendTarget(item);
    setExtendedEndDate(getNextDateIso(item.tanggal_selesai));
  };

  const handleExtend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendTarget) return;

    setActionSubmitting(true);
    setError(null);
    try {
      await izinCutiService.extend(extendTarget.id, extendedEndDate);
      setExtendTarget(null);
      await refreshData();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memperpanjang pengajuan.'));
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleSelesai = async (id: number) => {
    setActionSubmitting(true);
    setError(null);
    try {
      await izinCutiService.complete(id);
      await refreshData();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyelesaikan pengajuan.'));
    } finally {
      setActionSubmitting(false);
    }
  };

  return {
    list,
    pegawaiList,
    loading,
    error,
    setError,
    isModalOpen,
    setIsModalOpen,
    editingId,
    formData,
    setFormData,
    submitting,
    extendTarget,
    setExtendTarget,
    extendedEndDate,
    setExtendedEndDate,
    actionSubmitting,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleBatal,
    handleOpenExtend,
    handleExtend,
    handleSelesai,
  };
}