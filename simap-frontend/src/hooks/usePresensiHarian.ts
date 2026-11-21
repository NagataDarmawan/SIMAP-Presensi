'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { presensiHarianService } from '@/services/presensiHarian.service';
import {
  PresensiHarianItem,
  PresensiHarianSummary,
  CreateManualPresensiPayload,
  KoreksiPresensiHarianPayload,
} from '@/types/presensiHarian';

export type HarianTabFilter = 'ALL' | 'BELUM' | 'SUDAH';

const HADIR_FISIK_STATUSES = new Set(['HADIR', 'TERLAMBAT']);

function getTodayJakartaDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

const EMPTY_SUMMARY: PresensiHarianSummary = {
  total_terjadwal: 0,
  sudah_presensi: 0,
  belum_presensi: 0,
  lewat_batas_pulang: 0,
};

export function usePresensiHarian() {
  const [tanggal, setTanggalState] = useState<string>(getTodayJakartaDate);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTabState] = useState<HarianTabFilter>('BELUM');
  const [onlyBelumPulang, setOnlyBelumPulang] = useState(false);

  const [items, setItems] = useState<PresensiHarianItem[]>([]);
  const [summary, setSummary] = useState<PresensiHarianSummary>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [processingAutoAlpha, setProcessingAutoAlpha] = useState(false);

  const [toast, setToast] = useState<{
    message: string | null;
    type: 'success' | 'error';
  }>({ message: null, type: 'success' });

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: null }));
  }, []);

  const setTanggal = useCallback((nextDate: string) => {
    setLoading(true);
    setTanggalState(nextDate);
  }, []);

  const setActiveTab = useCallback((nextTab: HarianTabFilter) => {
    setActiveTabState(nextTab);
    if (nextTab !== 'SUDAH') {
      setOnlyBelumPulang(false);
    }
  }, []);

  const fetchHarian = useCallback(async (targetDate: string) => {
    setLoading(true);
    try {
      const data = await presensiHarianService.getHarian(targetDate);
      setItems(data.items || []);
      setSummary(data.summary || EMPTY_SUMMARY);
    } catch (err) {
      setToast({
        message: getErrorMessage(err, 'Gagal memuat data presensi harian.'),
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadInitialHarian = async () => {
      try {
        const data = await presensiHarianService.getHarian(tanggal);
        if (!active) return;
        setItems(data.items || []);
        setSummary(data.summary || EMPTY_SUMMARY);
      } catch (err) {
        if (!active) return;
        setToast({
          message: getErrorMessage(err, 'Gagal memuat data presensi harian.'),
          type: 'error',
        });
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadInitialHarian();
    return () => {
      active = false;
    };
  }, [tanggal]);

  const belumPulangCount = useMemo(
    () =>
      items.filter(
        (item) =>
          item.sudah_presensi &&
          HADIR_FISIK_STATUSES.has(item.status) &&
          !item.jam_pulang
      ).length,
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (activeTab === 'BELUM' && item.sudah_presensi) return false;
      if (activeTab === 'SUDAH' && !item.sudah_presensi) return false;
      if (
        activeTab === 'SUDAH' &&
        onlyBelumPulang &&
        (!HADIR_FISIK_STATUSES.has(item.status) || Boolean(item.jam_pulang))
      ) {
        return false;
      }
      if (!query) return true;
      return (
        item.nama.toLowerCase().includes(query) ||
        item.kode_pegawai.toLowerCase().includes(query) ||
        (item.jabatan && item.jabatan.toLowerCase().includes(query))
      );
    });
  }, [items, activeTab, onlyBelumPulang, searchQuery]);

  const submitManual = useCallback(
    async (payload: CreateManualPresensiPayload) => {
      try {
        const res = await presensiHarianService.createManual(payload);
        setToast({
          message: res.message || 'Presensi manual berhasil disimpan.',
          type: 'success',
        });
        await fetchHarian(tanggal);
      } catch (err) {
        const msg = getErrorMessage(err, 'Gagal menyimpan presensi manual.');
        setToast({ message: msg, type: 'error' });
        throw new Error(msg);
      }
    },
    [tanggal, fetchHarian]
  );

  const submitCorrection = useCallback(
    async (absensiId: number, namaPegawai: string, payload: KoreksiPresensiHarianPayload) => {
      try {
        await presensiHarianService.correct(absensiId, payload);
        setToast({
          message: `Data presensi ${namaPegawai} berhasil dikoreksi.`,
          type: 'success',
        });
        await fetchHarian(tanggal);
      } catch (err) {
        const msg = getErrorMessage(err, 'Gagal menyimpan koreksi presensi.');
        setToast({ message: msg, type: 'error' });
        throw new Error(msg);
      }
    },
    [tanggal, fetchHarian]
  );

  const runAutoAlpha = useCallback(
    async (force = true) => {
      setProcessingAutoAlpha(true);
      try {
        const res = await presensiHarianService.autoAlpha(tanggal, force);
        setToast({
          message: res.message || 'Proses penandaan ALPHA selesai.',
          type: 'success',
        });
        await fetchHarian(tanggal);
      } catch (err) {
        setToast({
          message: getErrorMessage(err, 'Gagal memproses status ALPHA.'),
          type: 'error',
        });
      } finally {
        setProcessingAutoAlpha(false);
      }
    },
    [tanggal, fetchHarian]
  );

  return {
    tanggal,
    setTanggal,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    onlyBelumPulang,
    setOnlyBelumPulang,
    belumPulangCount,
    summary,
    filteredItems,
    loading,
    processingAutoAlpha,
    toast,
    closeToast,
    submitManual,
    submitCorrection,
    runAutoAlpha,
  };
}