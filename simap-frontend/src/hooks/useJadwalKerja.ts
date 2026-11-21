'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { jadwalService } from '@/services/jadwal.service';
import { JadwalKerja, CreateJadwalDto } from '@/types/jadwal';

const initialFormState: CreateJadwalDto = {
  nama_jadwal: '',
  hari_kerja: 'Senin - Jumat',
  jam_masuk: '08:00',
  jam_pulang: '17:00',
  toleransi_terlambat: 15,
};

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
}

export function useJadwalKerja() {
  const [jadwalList, setJadwalList] = useState<JadwalKerja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState<JadwalKerja | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateJadwalDto>(initialFormState);

  const refreshJadwal = useCallback(async () => {
    try {
      const res = await jadwalService.getAll();
      if (res?.success) setJadwalList(res.data || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengambil data jadwal kerja.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      try {
        const res = await jadwalService.getAll();
        if (!active) return;
        if (res?.success) setJadwalList(res.data || []);
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err, 'Gagal mengambil data jadwal kerja.'));
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadInitialData();
    return () => {
      active = false;
    };
  }, []);

  const filteredJadwal = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return jadwalList.filter(
      (item) =>
        item.nama_jadwal.toLowerCase().includes(query) ||
        (item.hari_kerja && item.hari_kerja.toLowerCase().includes(query))
    );
  }, [jadwalList, searchQuery]);

  const handleOpenModal = (jadwal?: JadwalKerja) => {
    if (jadwal) {
      setEditingJadwal(jadwal);
      setFormData({
        nama_jadwal: jadwal.nama_jadwal,
        hari_kerja: jadwal.hari_kerja || 'Senin - Jumat',
        jam_masuk: jadwal.jam_masuk,
        jam_pulang: jadwal.jam_pulang,
        toleransi_terlambat: jadwal.toleransi_terlambat,
      });
    } else {
      setEditingJadwal(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingJadwal) {
        await jadwalService.update(editingJadwal.id, formData);
      } else {
        await jadwalService.create(formData);
      }
      setIsModalOpen(false);
      await refreshJadwal();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan data jadwal kerja.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    try {
      await jadwalService.delete(id);
      await refreshJadwal();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          'Jadwal tidak dapat dihapus karena sudah digunakan oleh pegawai.'
        )
      );
    }
  };

  return {
    loading,
    error,
    setError,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    filteredJadwal,
    isModalOpen,
    setIsModalOpen,
    editingJadwal,
    formData,
    setFormData,
    submitting,
    handleOpenModal,
    handleSubmit,
    handleDelete,
  };
}