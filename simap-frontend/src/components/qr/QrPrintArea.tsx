'use client';

import { Pegawai } from '@/types/pegawai';
import { PrintMode } from '@/hooks/useCetakQr';
import { IdCardTemplate } from './IdCardTemplate';

interface QrPrintAreaProps {
  pegawaiList: Pegawai[];
  printMode: PrintMode;
}

export function QrPrintArea({ pegawaiList, printMode }: QrPrintAreaProps) {
  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area,
          #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          #print-area.print-grid {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 16px !important;
            justify-content: flex-start !important;
            padding: 10mm !important;
          }
          #print-area.print-single {
            display: block !important;
            padding: 0 !important;
          }
          #print-area.print-single .single-page-wrapper {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100vh !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          #print-area.print-single .single-page-wrapper:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div
        id="print-area"
        className={`hidden ${printMode === 'single' ? 'print-single' : 'print-grid'}`}
      >
        {pegawaiList.map((pegawai) =>
          printMode === 'single' ? (
            <div key={pegawai.id} className="single-page-wrapper">
              <IdCardTemplate pegawai={pegawai} />
            </div>
          ) : (
            <IdCardTemplate key={pegawai.id} pegawai={pegawai} />
          )
        )}
      </div>
    </>
  );
}