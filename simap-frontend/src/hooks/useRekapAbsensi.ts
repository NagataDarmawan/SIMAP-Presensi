'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';

export interface RekapData {
  id: number;
  nama: string;
  kode_pegawai: string;
  tanggal: string;
  jam_masuk: string;
  jam_pulang: string;
  status: string;
}

export function useRekapAbsensi() {
  const [rekap, setRekap] = useState<RekapData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRekap = async () => {
      try {
        const res = await api.get('/rekap');
        if (isMounted && res.data && res.data.success) {
          setRekap(res.data.data || []);
        }
      } catch (err) {
        console.error('Gagal mengambil rekap absensi:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRekap();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return {
    rekap,
    loading,
    handlePrint,
  };
}