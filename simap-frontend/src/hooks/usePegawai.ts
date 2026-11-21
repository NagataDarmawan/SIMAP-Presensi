'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { pegawaiService } from '@/services/pegawai.service';
import { api } from '@/lib/axios';
import { Pegawai, CreatePegawaiDto } from '@/types/pegawai';

export interface JadwalOption {
  id: number;
  nama_jadwal: string;
}

function getTodayIso(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
}

function createInitialFormState(defaultJadwalId = 0): CreatePegawaiDto {
  return {
    nama: '',
    jenis_kelamin: 'Laki-laki',
    alamat: '',
    no_telepon: '',
    jabatan: '',
    tanggal_masuk: getTodayIso(),
    jadwal_kerja_id: defaultJadwalId,
  };
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return fallback;
}

export function usePegawai() {
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [jadwalOptions, setJadwalOptions] = useState<JadwalOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPegawai, setEditingPegawai] = useState<Pegawai | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreatePegawaiDto>(createInitialFormState);

  const refreshData = useCallback(async () => {
    try {
      const [resPegawai, resJadwal] = await Promise.all([
        pegawaiService.getAll(),
        api.get('/jadwal'),
      ]);
      if (resPegawai?.success) setPegawaiList(resPegawai.data || []);
      if (resJadwal?.data?.success) setJadwalOptions(resJadwal.data.data || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengambil data dari server.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadInitialData = async () => {
      try {
        const [resPegawai, resJadwal] = await Promise.all([
          pegawaiService.getAll(),
          api.get('/jadwal'),
        ]);
        if (!active) return;
        if (resPegawai?.success) setPegawaiList(resPegawai.data || []);
        if (resJadwal?.data?.success) setJadwalOptions(resJadwal.data.data || []);
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err, 'Gagal mengambil data dari server.'));
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadInitialData();
    return () => {
      active = false;
    };
  }, []);

  const getJadwalNama = useCallback(
    (jadwalId: number) => {
      const found = jadwalOptions.find((j) => j.id === jadwalId);
      return found ? found.nama_jadwal : `Jadwal #${jadwalId}`;
    },
    [jadwalOptions]
  );

  const filteredPegawai = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return pegawaiList.filter((item) => {
      const matchesSearch =
        item.nama.toLowerCase().includes(query) ||
        item.kode_pegawai.toLowerCase().includes(query) ||
        (item.jabatan && item.jabatan.toLowerCase().includes(query));
      const matchesStatus = statusFilter ? item.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [pegawaiList, searchQuery, statusFilter]);

  const handleOpenModal = (pegawai?: Pegawai) => {
    const defaultJadwalId = jadwalOptions.length > 0 ? jadwalOptions[0].id : 0;
    if (pegawai) {
      setEditingPegawai(pegawai);
      setFormData({
        kode_pegawai: pegawai.kode_pegawai,
        nama: pegawai.nama,
        jenis_kelamin: pegawai.jenis_kelamin,
        alamat: pegawai.alamat || '',
        no_telepon: pegawai.no_telepon || '',
        jabatan: pegawai.jabatan || '',
        tanggal_masuk: pegawai.tanggal_masuk ? pegawai.tanggal_masuk.split('T')[0] : '',
        jadwal_kerja_id: pegawai.jadwal_kerja_id || defaultJadwalId,
      });
    } else {
      setEditingPegawai(null);
      setFormData(createInitialFormState(defaultJadwalId));
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jadwal_kerja_id) {
      setError('Silakan pilih jadwal kerja yang valid.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      if (editingPegawai) {
        await pegawaiService.update(editingPegawai.id, formData);
      } else {
        const createPayload: CreatePegawaiDto = {
          nama: formData.nama,
          jenis_kelamin: formData.jenis_kelamin,
          alamat: formData.alamat,
          no_telepon: formData.no_telepon,
          jabatan: formData.jabatan,
          tanggal_masuk: formData.tanggal_masuk,
          jadwal_kerja_id: formData.jadwal_kerja_id,
        };
        await pegawaiService.create(createPayload);
      }
      setIsModalOpen(false);
      await refreshData();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan data pegawai.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (pegawai: Pegawai) => {
    const targetStatus = pegawai.status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF';
    setError(null);

    try {
      await pegawaiService.updateStatus(pegawai.id, targetStatus);
      await refreshData();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengubah status pegawai.'));
    }
  };

  const handleDelete = async (pegawai: Pegawai) => {
    setError(null);

    try {
      await pegawaiService.delete(pegawai.id);
      await refreshData();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus data pegawai.'));
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
    statusFilter,
    setStatusFilter,
    filteredPegawai,
    jadwalOptions,
    isModalOpen,
    setIsModalOpen,
    editingPegawai,
    formData,
    setFormData,
    submitting,
    getJadwalNama,
    handleOpenModal,
    handleSubmit,
    handleToggleStatus,
    handleDelete,
  };
}