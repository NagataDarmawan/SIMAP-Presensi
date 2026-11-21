'use client';

import { Pegawai } from '@/types/pegawai';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  User,
  Briefcase,
  Phone,
  Clock,
  Calendar,
  MapPin,
  Pencil,
  UserX,
  UserCheck,
  Trash2,
} from 'lucide-react';

interface PegawaiCardProps {
  item: Pegawai;
  jadwalNama: string;
  onEdit: (pegawai: Pegawai) => void;
  onToggleStatus: (pegawai: Pegawai) => void;
  onDelete: (pegawai: Pegawai) => void;
}

export const PegawaiCard = ({
  item,
  jadwalNama,
  onEdit,
  onToggleStatus,
  onDelete,
}: PegawaiCardProps) => {
  const isAktif = item.status === 'AKTIF';

  return (
    <Card className="group flex flex-col justify-between space-y-4 border border-slate-200/80 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="space-y-3.5">
        {/* Card Header: Satu Kesatuan Avatar + Nama (Max 2 Baris) + Kode, & Status di Pojok Kanan */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex min-w-0 items-start space-x-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200/60 bg-gradient-to-br from-[var(--brand-light)] to-blue-100 text-base font-extrabold text-[var(--brand)] shadow-2xs">
              {item.nama.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3
                className="line-clamp-2 text-[15px] font-bold leading-snug text-slate-900"
                title={item.nama}
              >
                {item.nama}
              </h3>
              <p className="mt-1 font-mono text-xs font-semibold tracking-wider text-slate-500">
                {item.kode_pegawai}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              isAktif
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isAktif ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            {item.status || 'AKTIF'}
          </span>
        </div>

        {/* Informasi Detail */}
        <div className="space-y-2.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
          {/* 1. Jenis Kelamin (Di atas Jabatan) */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-slate-500">
              <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>Jenis Kelamin</span>
            </span>
            <span className="font-semibold text-slate-800">
              {item.jenis_kelamin || '-'}
            </span>
          </div>

          {/* 2. Jabatan */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-slate-500">
              <Briefcase className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>Jabatan</span>
            </span>
            <span className="truncate font-semibold text-slate-800">
              {item.jabatan || '-'}
            </span>
          </div>

          {/* 3. No. Telepon */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-slate-500">
              <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>No. Telepon</span>
            </span>
            <span className="font-medium text-slate-700">
              {item.no_telepon || '-'}
            </span>
          </div>

          {/* 4. Jadwal Kerja */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-slate-500">
              <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>Jadwal Kerja</span>
            </span>
            <span className="truncate font-medium text-slate-700">
              {jadwalNama}
            </span>
          </div>

          {/* 5. Tanggal Masuk */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-slate-500">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>Tgl Masuk</span>
            </span>
            <span className="font-medium text-slate-700">
              {item.tanggal_masuk ? item.tanggal_masuk.split('T')[0] : '-'}
            </span>
          </div>

          {/* 6. Alamat */}
          <div className="flex items-start gap-2 pt-0.5">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span
              className="line-clamp-2 leading-relaxed text-slate-600"
              title={item.alamat || '-'}
            >
              <strong className="font-medium text-slate-500">Alamat:</strong>{' '}
              {item.alamat || '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-1.5 border-t border-slate-100 pt-3">
        <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
          <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
        </Button>
        <Button
          size="sm"
          variant={isAktif ? 'secondary' : 'primary'}
          onClick={() => onToggleStatus(item)}
        >
          {isAktif ? (
            <>
              <UserX className="mr-1 h-3.5 w-3.5 text-amber-600" /> Nonaktifkan
            </>
          ) : (
            <>
              <UserCheck className="mr-1 h-3.5 w-3.5" /> Aktifkan
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete(item)}
          title="Hapus Pegawai Permanen"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
};