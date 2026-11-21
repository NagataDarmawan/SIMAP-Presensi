'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Pegawai } from '@/types/pegawai';

interface IdCardProps {
  pegawai: Pegawai;
}

export function IdCardTemplate({ pegawai }: IdCardProps) {
  const kodeIdentitas = pegawai.kode_pegawai || pegawai.kode_qr;

  return (
    <div className="id-card-item relative flex h-[360px] w-[226px] break-inside-avoid flex-col justify-between overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-md print:border-slate-400 print:shadow-none">
      {/* Dekorasi Latar Belakang Lengkung Atas */}
      <div className="absolute -left-10 -top-24 h-40 w-72 -rotate-6 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700" />
      <div className="absolute -right-12 -top-16 h-32 w-48 rotate-12 rounded-full bg-blue-500/20 blur-md" />

      {/* Lubang Lanyard / Tali ID Card */}
      <div className="relative z-10 flex justify-center pt-2">
        <div className="h-2.5 w-11 rounded-full border border-slate-400/60 bg-slate-100 shadow-inner" />
      </div>

      {/* Header Kartu */}
      <div className="relative z-10 mt-1.5 px-4 text-center text-white">
        <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-blue-100">
          KARTU IDENTITAS PEGAWAI
        </p>
      </div>

      {/* Bagian Identitas Utama: Kode Pegawai, Nama, & Jabatan */}
      <div className="relative z-10 mt-4 px-4 text-center">
        <span className="inline-block rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-mono text-[11px] font-extrabold uppercase tracking-[0.15em] text-blue-800 shadow-2xs">
          {kodeIdentitas}
        </span>

        <h3 className="mt-2 line-clamp-2 text-[15px] font-extrabold uppercase leading-tight tracking-tight text-[var(--text-main)]">
          {pegawai.nama}
        </h3>

        <p className="mt-1 line-clamp-1 text-[11px] font-bold uppercase tracking-wide text-[var(--brand)]">
          {pegawai.jabatan || 'Staff Pegawai'}
        </p>

        <div className="mx-auto mt-2.5 h-0.5 w-12 rounded-full bg-slate-200" />
      </div>

      {/* Bagian Bawah: QR Code dengan Bingkai Sudut */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-3 pt-1">
        <div className="relative rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs">
          <span className="absolute -left-0.5 -top-0.5 h-2.5 w-2.5 rounded-tl-md border-l-2 border-t-2 border-[var(--brand)]" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-tr-md border-r-2 border-t-2 border-[var(--brand)]" />
          <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-bl-md border-b-2 border-l-2 border-[var(--brand)]" />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-br-md border-b-2 border-r-2 border-[var(--brand)]" />

          <QRCodeSVG
            value={kodeIdentitas}
            size={112}
            level="H"
            includeMargin={false}
          />
        </div>
        <span className="mt-1.5 text-[8px] font-semibold uppercase tracking-widest text-slate-400">
          Pindai Untuk Presensi
        </span>
      </div>

      {/* Footer Strip Warna ID Card */}
      <div className="relative z-10 flex h-2.5 w-full">
        <div className="h-full w-2/3 bg-slate-900" />
        <div className="h-full w-1/3 bg-[var(--brand)]" />
      </div>
    </div>
  );
}