import React, { useState } from 'react';
import { X, CheckCircle2, Receipt, Building, User, CreditCard, ShieldCheck } from 'lucide-react';
import { PatientDischarge, BillingFinalizationData } from '../types';

interface BillingFinalizeModalProps {
  patient: PatientDischarge;
  onClose: () => void;
  onFinalize: (patientId: string, billingData: BillingFinalizationData) => void;
}

export const BillingFinalizeModal: React.FC<BillingFinalizeModalProps> = ({
  patient,
  onClose,
  onFinalize,
}) => {
  const [nomorKuitansi, setNomorKuitansi] = useState(
    patient.billingData?.nomorKuitansi || `KWT/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [petugasBilling, setPetugasBilling] = useState(
    patient.billingData?.finalizedBy || 'Kasir Billing'
  );
  const [catatanBilling, setCatatanBilling] = useState(
    patient.billingData?.catatanBilling || 'Administrasi biaya dan klaim lunas diselesaikan.'
  );

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const data: BillingFinalizationData = {
      finalizedAt: formattedDate,
      finalizedBy: petugasBilling.trim() || 'Kasir Billing',
      nomorKuitansi: nomorKuitansi.trim() || undefined,
      catatanBilling: catatanBilling.trim() || undefined,
    };

    onFinalize(patient.id, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-800 rounded-xl">
              <Receipt className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">Finalisasi Pemulangan (Billing / Kasir)</h2>
              <p className="text-xs text-emerald-100">Konfirmasi penyelesaian tagihan dan tutup berkas pemulangan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Data Lengkap dari Ruangan & TPP */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-4 text-xs">
          
          <div>
            <span className="font-bold text-slate-800 uppercase tracking-wide text-[10px] block mb-2">
              1. Identitas Pasien (Dari Ruangan)
            </span>
            <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-200 text-slate-700">
              <div>
                <span className="text-slate-500">No. RM:</span>{' '}
                <strong className="font-mono text-slate-900 text-sm">{patient.noRm}</strong>
              </div>
              <div>
                <span className="text-slate-500">Nama:</span>{' '}
                <strong className="text-slate-900">{patient.namaPasien}</strong>
              </div>
              <div>
                <span className="text-slate-500">Ruangan:</span>{' '}
                <span className="font-medium text-slate-800">{patient.ruangan}</span>
              </div>
              <div>
                <span className="text-slate-500">Cara Keluar:</span>{' '}
                <span className="font-medium text-slate-800">{patient.caraKeluar}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">DPJP:</span>{' '}
                <span className="font-medium text-slate-800">{patient.dpjp}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="font-bold text-sky-800 uppercase tracking-wide text-[10px] block mb-2">
              2. Data Validasi TPP & Informasi
            </span>
            <div className="grid grid-cols-2 gap-2 bg-sky-50/60 p-3 rounded-xl border border-sky-200 text-slate-700">
              <div>
                <span className="text-slate-500">Pembiayaan:</span>{' '}
                <strong className="text-sky-900">{patient.tppData?.pembiayaan || '-'}</strong>
              </div>
              <div>
                <span className="text-slate-500">Hak Kelas:</span>{' '}
                <strong className="text-sky-900">{patient.tppData?.hakKelas || '-'}</strong>
              </div>
              <div>
                <span className="text-slate-500">Naik Kelas:</span>{' '}
                <span className={`font-bold ${patient.tppData?.naikKelas ? 'text-amber-700' : 'text-slate-700'}`}>
                  {patient.tppData?.naikKelas ? `Ya (${patient.tppData.kelasTingkat || 'Ya'})` : 'Tidak'}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Titip Kelas:</span>{' '}
                <span className={`font-bold ${patient.tppData?.titipKelas ? 'text-purple-700' : 'text-slate-700'}`}>
                  {patient.tppData?.titipKelas ? `Ya (${patient.tppData.alasanTitip || 'Ya'})` : 'Tidak'}
                </span>
              </div>
              {patient.tppData?.catatanTpp && (
                <div className="col-span-2 text-[11px] text-slate-600 bg-white/70 p-1.5 rounded border border-sky-100">
                  <span className="font-semibold text-slate-700">Catatan TPP:</span> {patient.tppData.catatanTpp}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Input Form Billing */}
        <form onSubmit={handleFinalize} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nomor Kuitansi / Ref Billing:
              </label>
              <input
                type="text"
                value={nomorKuitansi}
                onChange={(e) => setNomorKuitansi(e.target.value)}
                placeholder="cth: KWT/2026/09/0123"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Petugas Kasir Billing:
              </label>
              <input
                type="text"
                value={petugasBilling}
                onChange={(e) => setPetugasBilling(e.target.value)}
                placeholder="Nama Petugas Kasir"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Catatan Penyelesaian Billing:
            </label>
            <textarea
              rows={2}
              value={catatanBilling}
              onChange={(e) => setCatatanBilling(e.target.value)}
              placeholder="cth: Lunas / Klaim disetujui / Kwitansi telah diserahkan ke keluarga"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-emerald-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-sm hover:shadow-md flex items-center gap-2 text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              Klik Finalisasi Pemulangan
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
