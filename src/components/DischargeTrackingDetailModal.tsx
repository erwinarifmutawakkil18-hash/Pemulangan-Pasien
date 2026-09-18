import React from 'react';
import { 
  X, Printer, CheckCircle2, Clock, FileCheck2, ShieldCheck, 
  Building2, User, Stethoscope, DoorOpen, CreditCard, Receipt, ArrowRight
} from 'lucide-react';
import { PatientDischarge } from '../types';

interface DischargeTrackingDetailModalProps {
  patient: PatientDischarge;
  onClose: () => void;
}

export const DischargeTrackingDetailModal: React.FC<DischargeTrackingDetailModalProps> = ({
  patient,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const isTppDone = patient.statusAlur === 'menunggu_billing' || patient.statusAlur === 'selesai';
  const isBillingDone = patient.statusAlur === 'selesai';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden print:border-none print:shadow-none print:max-w-none print:max-h-none">
        
        {/* Header - Not printed */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm px-2.5 py-0.5 bg-teal-500/20 text-teal-300 font-bold rounded-lg border border-teal-500/30">
              RM: {patient.noRm}
            </span>
            <div>
              <h2 className="text-base font-bold">{patient.namaPasien}</h2>
              <p className="text-xs text-slate-400">Pelacakan Status & Lembar Pemulangan Pasien</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Bukti
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Printable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800 print:p-8">
          
          {/* Hospital Header (Print Only or Formal) */}
          <div className="border-b-2 border-slate-800 pb-3 mb-4 hidden print:block">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold">RUMAH SAKIT SEHAT SEJAHTERA</h1>
                <p className="text-[11px] text-slate-600">Instalasi Rawat Inap, TPP & Informasi, dan Kasir Billing</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold border border-slate-700 px-2 py-0.5 uppercase">
                  SLIP BUKTI PEMULANGAN PASIEN
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Status Realtime */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 print:bg-white print:border-slate-300">
            <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] block mb-3">
              Progres Alur Pemulangan (3 Tahap):
            </span>

            <div className="grid grid-cols-3 gap-2 relative">
              
              {/* Step 1: Ruangan */}
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold mb-1 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 text-xs">1. Ruangan</span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">Selesai Diinput</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{patient.waktuInputRuangan}</span>
              </div>

              {/* Step 2: TPP */}
              <div className={`flex flex-col items-center text-center p-2 rounded-xl border ${
                isTppDone 
                  ? 'bg-white border-slate-200' 
                  : 'bg-sky-50/50 border-sky-300 ring-2 ring-sky-400/20'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
                  isTppDone 
                    ? 'bg-sky-600 text-white' 
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {isTppDone ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <span className="font-bold text-slate-900 text-xs">2. TPP & Informasi</span>
                <span className={`text-[10px] font-semibold mt-0.5 ${
                  isTppDone ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {isTppDone ? 'Tervalidasi' : 'Menunggu Validasi'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {patient.tppData?.validatedAt || '-'}
                </span>
              </div>

              {/* Step 3: Billing */}
              <div className={`flex flex-col items-center text-center p-2 rounded-xl border ${
                isBillingDone 
                  ? 'bg-white border-slate-200' 
                  : isTppDone 
                    ? 'bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-400/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
                  isBillingDone 
                    ? 'bg-emerald-600 text-white' 
                    : isTppDone 
                      ? 'bg-slate-300 text-slate-700' 
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {isBillingDone ? <ShieldCheck className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <span className="font-bold text-slate-900 text-xs">3. Kasir Billing</span>
                <span className={`text-[10px] font-semibold mt-0.5 ${
                  isBillingDone ? 'text-emerald-700' : isTppDone ? 'text-amber-700' : 'text-slate-400'
                }`}>
                  {isBillingDone ? 'Finalisasi Selesai' : isTppDone ? 'Menunggu Kasir' : 'Menunggu TPP'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {patient.billingData?.finalizedAt || '-'}
                </span>
              </div>

            </div>
          </div>

          {/* Section 1: Data Ruangan Perawatan */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-teal-800 text-xs flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-600" />
                1. Data Input Ruangan Rawat Inap
              </span>
              <span className="text-[10px] text-slate-500 font-mono">{patient.waktuInputRuangan}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-slate-500 block text-[11px]">No. Rekam Medis:</span>
                <strong className="font-mono text-sm text-slate-900">{patient.noRm}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Nama Pasien:</span>
                <strong className="text-sm text-slate-900">{patient.namaPasien}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Ruangan Rawat:</span>
                <span className="font-semibold text-slate-800">{patient.ruangan}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block text-[11px]">Dokter DPJP:</span>
                <span className="font-semibold text-slate-800">{patient.dpjp}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Cara Keluar:</span>
                <span className="inline-block font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-800">
                  {patient.caraKeluar}
                </span>
              </div>
              {patient.petugasRuangan && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Petugas Ruangan:</span>
                  <span className="text-slate-700">{patient.petugasRuangan}</span>
                </div>
              )}
              {patient.catatanRuangan && (
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[11px]">Catatan Ruangan:</span>
                  <span className="text-slate-700 italic">{patient.catatanRuangan}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Data TPP & Informasi */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-sky-800 text-xs flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-sky-600" />
                2. Data Validasi TPP & Informasi
              </span>
              {patient.tppData?.validatedAt ? (
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Divalidasi ({patient.tppData.validatedAt})
                </span>
              ) : (
                <span className="text-[10px] text-amber-700 font-semibold">Belum Divalidasi</span>
              )}
            </div>

            {patient.tppData ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">Pembiayaan:</span>
                  <strong className="text-slate-900">{patient.tppData.pembiayaan}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Hak Kelas:</span>
                  <strong className="text-slate-900">{patient.tppData.hakKelas}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Naik Kelas:</span>
                  <span className={`font-bold ${patient.tppData.naikKelas ? 'text-amber-700' : 'text-slate-700'}`}>
                    {patient.tppData.naikKelas ? `Ya (${patient.tppData.kelasTingkat || 'Ya'})` : 'Tidak'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Titip Kelas:</span>
                  <span className={`font-bold ${patient.tppData.titipKelas ? 'text-purple-700' : 'text-slate-700'}`}>
                    {patient.tppData.titipKelas ? `Ya (${patient.tppData.alasanTitip || 'Ya'})` : 'Tidak'}
                  </span>
                </div>
                {patient.tppData.validatedBy && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[11px]">Petugas TPP:</span>
                    <span className="text-slate-700">{patient.tppData.validatedBy}</span>
                  </div>
                )}
                {patient.tppData.catatanTpp && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[11px]">Catatan / No. SEP:</span>
                    <span className="text-slate-700 font-medium">{patient.tppData.catatanTpp}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400 italic py-2">
                Menunggu pemeriksaan dan input data penjaminan dari TPP & Informasi.
              </p>
            )}
          </div>

          {/* Section 3: Data Billing / Kasir */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-emerald-800 text-xs flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-600" />
                3. Data Finalisasi Kasir / Billing
              </span>
              {patient.billingData?.finalizedAt ? (
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selesai ({patient.billingData.finalizedAt})
                </span>
              ) : (
                <span className="text-[10px] text-amber-700 font-semibold">Menunggu Billing</span>
              )}
            </div>

            {patient.billingData ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <span className="text-slate-500 block text-[11px]">No. Kuitansi:</span>
                  <strong className="font-mono text-slate-900">{patient.billingData.nomorKuitansi || '-'}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Petugas Kasir:</span>
                  <span className="font-semibold text-slate-800">{patient.billingData.finalizedBy || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Status:</span>
                  <span className="font-bold text-emerald-700">Lunas / Difinalisasi</span>
                </div>
                {patient.billingData.catatanBilling && (
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-slate-500 block text-[11px]">Keterangan Billing:</span>
                    <span className="text-slate-700">{patient.billingData.catatanBilling}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-400 italic py-2">
                Menunggu penyelesaian dan klik finalisasi pemulangan oleh bagian Billing / Kasir.
              </p>
            )}
          </div>

          {/* Tanda Tangan Ringkas (Khusus Print) */}
          <div className="hidden print:grid grid-cols-3 gap-4 text-center pt-6 text-xs">
            <div>
              <p className="text-slate-600 mb-12">Petugas Ruangan</p>
              <p className="font-bold text-slate-800">{patient.petugasRuangan || '(................................)'}</p>
            </div>
            <div>
              <p className="text-slate-600 mb-12">Petugas TPP & Informasi</p>
              <p className="font-bold text-slate-800">{patient.tppData?.validatedBy || '(................................)'}</p>
            </div>
            <div>
              <p className="text-slate-600 mb-12">Petugas Billing / Kasir</p>
              <p className="font-bold text-slate-800">{patient.billingData?.finalizedBy || '(................................)'}</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
