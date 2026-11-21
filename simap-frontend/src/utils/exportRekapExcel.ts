import { RekapPegawai, RekapGlobalSummary, DateRangeFilter } from '@/types/rekap';

export function exportRekapToExcel(
  data: RekapPegawai[],
  summary: RekapGlobalSummary | null,
  filter: DateRangeFilter
): void {
  if (data.length === 0) return;

  const rowsHtml = data
    .map(
      (item, index) => `
        <tr>
          <td align="center" style="text-align: center;">${index + 1}</td>
          <td align="center" style="text-align: center;">${item.kode_pegawai}</td>
          <td>${item.nama}</td>
          <td>${item.jabatan || '-'}</td>
          <td align="center" style="text-align: center;">${item.total_hadir}</td>
          <td align="center" style="text-align: center;">${item.total_terlambat}</td>
          <td align="center" style="text-align: center;">${item.total_izin}</td>
          <td align="center" style="text-align: center;">${item.total_sakit}</td>
          <td align="center" style="text-align: center;">${item.total_cuti}</td>
          <td align="center" style="text-align: center;">${item.total_alpha}</td>
          <td align="center" style="text-align: center;">${item.total_menit_terlambat}</td>
        </tr>
      `
    )
    .join('');

  const htmlTable = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <style>
        table { border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt; }
        th, td { border: 1px solid #cbd5e1; padding: 6px 10px; vertical-align: middle; }
        th { background-color: #1e3a8a; color: #ffffff; font-weight: bold; text-align: center; }
        .title { font-size: 14pt; font-weight: bold; border: none; text-align: center; }
        .subtitle { font-size: 10pt; color: #475569; border: none; text-align: center; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="11" align="center" class="title" style="text-align: center; font-size: 14pt; font-weight: bold; border: none;">
            LAPORAN REKAPITULASI PRESENSI PEGAWAI - SIMAP
          </td>
        </tr>
        <tr>
          <td colspan="11" align="center" class="subtitle" style="text-align: center; font-size: 10pt; color: #475569; border: none;">
            Periode: ${filter.startDate} s/d ${filter.endDate}
          </td>
        </tr>
        <tr>
          <td colspan="11" align="center" class="subtitle" style="text-align: center; font-size: 10pt; color: #475569; border: none;">
            Total Hadir: ${summary?.total_hadir ?? 0} | Total Terlambat: ${summary?.total_terlambat ?? 0} (${summary?.total_menit_terlambat ?? 0} mnt) | Izin: ${summary?.total_izin ?? 0} | Sakit: ${summary?.total_sakit ?? 0} | Cuti: ${summary?.total_cuti ?? 0}
          </td>
        </tr>
        <tr><td colspan="11" style="border: none;"></td></tr>
        <thead>
          <tr>
            <th>No</th>
            <th>Kode Pegawai</th>
            <th>Nama Pegawai</th>
            <th>Jabatan</th>
            <th>Hadir (Hari)</th>
            <th>Terlambat (Kali)</th>
            <th>Izin (Hari)</th>
            <th>Sakit (Hari)</th>
            <th>Cuti (Hari)</th>
            <th>Alpha (Hari)</th>
            <th>Total Menit Terlambat</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlTable], {
    type: 'application/vnd.ms-excel;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Rekap_Presensi_${filter.startDate}_sd_${filter.endDate}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}