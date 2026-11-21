'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { absensiService } from '@/services/absensi.service';
import { ScanResultData } from '@/types/absensi';
import { playSuccessBeep, playErrorBeep, speakText } from '@/utils/audio';

type JenisAbsensi = 'MASUK' | 'PULANG';

function getScanErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err !== null) {
    const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
    const rawMsg =
      axiosErr.response?.data?.message || axiosErr.message || 'Gagal memproses QR Code presensi.';
    return rawMsg.replace(/^Pegawai\s+/i, '');
  }
  return 'Gagal memproses QR Code presensi.';
}

export function useScanAbsensi() {
  const [jenisAbsensi, setJenisAbsensi] = useState<JenisAbsensi>('MASUK');
  const [kodeQrInput, setKodeQrInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ScanResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useVoice, setUseVoice] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanningLock = useRef(false);
  const jenisAbsensiRef = useRef<JenisAbsensi>('MASUK');
  const useVoiceRef = useRef(true);
  const scannerElementId = 'interactive-qr-scanner';

  useEffect(() => {
    jenisAbsensiRef.current = jenisAbsensi;
  }, [jenisAbsensi]);

  useEffect(() => {
    useVoiceRef.current = useVoice;
  }, [useVoice]);

  const processAbsen = useCallback(async (rawToken: string) => {
    const cleanToken = rawToken.trim().replace(/[\r\n]/g, '');
    if (!cleanToken || isScanningLock.current) return;

    isScanningLock.current = true;
    setSubmitting(true);
    setError(null);
    setResult(null);

    const currentJenis = jenisAbsensiRef.current;

    try {
      const res = await absensiService.scan({ kode_qr: cleanToken, jenis: currentJenis });
      const data = (res?.data ?? res) as unknown as ScanResultData | null;

      if (data) {
        setResult(data);
        setKodeQrInput('');
        playSuccessBeep();

        const namaPegawai = data.pegawai || '';
        const jenisText = currentJenis === 'MASUK' ? 'masuk' : 'pulang';
        const waktuCatat = data.jam_masuk || data.jam_pulang || '';

        speakText(
          `${namaPegawai}, absen ${jenisText} berhasil dicatat pada pukul ${waktuCatat}`,
          useVoiceRef.current
        );
      }
    } catch (err) {
      const msg = getScanErrorMessage(err);
      setError(msg);
      playErrorBeep();
      speakText(`Akses ditolak. ${msg}`, useVoiceRef.current);
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        isScanningLock.current = false;
      }, 2000);
    }
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setResult(null);
    setIsCameraActive(true);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerElementId);
      }

      await scannerRef.current.start(
        { facingMode: 'user' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (!isScanningLock.current) {
            setKodeQrInput(decodedText);
            await processAbsen(decodedText);
          }
        },
        undefined
      );
    } catch {
      setError('Tidak dapat mengakses kamera. Periksa izin akses browser Anda.');
      setIsCameraActive(false);
    }
  }, [processAbsen]);

  const stopCamera = useCallback(async () => {
    try {
      if (scannerRef.current?.isScanning) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      }
    } catch (err) {
      console.error('Gagal mematikan kamera:', err);
    } finally {
      setIsCameraActive(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return {
    jenisAbsensi,
    setJenisAbsensi,
    kodeQrInput,
    setKodeQrInput,
    submitting,
    result,
    error,
    useVoice,
    setUseVoice,
    isCameraActive,
    scannerElementId,
    startCamera,
    stopCamera,
    processAbsen,
  };
}