export function getStatusBadgeClass(status?: string): string {
  switch (status?.toUpperCase()) {
    case 'HADIR':
      return 'badge-hadir';
    case 'TERLAMBAT':
      return 'badge-terlambat';
    case 'IZIN':
      return 'badge-izin';
    case 'SAKIT':
      return 'badge-sakit';
    case 'CUTI':
      return 'badge-cuti';
    case 'ALPA':
    case 'ALPHA':
      return 'badge-alpha';
    default:
      return 'border border-slate-200 bg-slate-100 text-slate-700';
  }
}