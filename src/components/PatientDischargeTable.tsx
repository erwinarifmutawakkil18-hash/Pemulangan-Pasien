import React from 'react';
import { 
  CheckCircle2, Clock, Eye, FileEdit, ShieldCheck, 
  ArrowRight, AlertCircle, Building2, User, Stethoscope, DoorOpen, CreditCard, Receipt
} from 'lucide-react';
import { PatientDischarge, RoleType } from '../types';

interface PatientDischargeTableProps {
  patients: PatientDischarge[];
  activeRole: RoleType | 'monitor';
  onSelectPatientDetail: (patient: PatientDischarge) => void;
  onOpenTppModal: (patient: PatientDischarge) => void;
  onOpenBillingModal: (patient: PatientDischarge) => void;
}

export const PatientDischargeTable: React.FC<PatientDischargeTableProps> = ({
  patients,
  activeRole,
  onSelectPatientDetail,
  onOpenTppModal,
  onOpenBillingModal,
}) => {
  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Tidak ada data pasien yang sesuai</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Belum ada data pasien pulang untuk kriteria filter ini. Silakan klik tombol 
          <strong> "+ Input Pasien Pulang (Ruangan)"</strong> untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">No. RM & Nama Pasien</th>
              <th className="py-3 px-4">Ruangan & DPJP</th>
              <th className="py-3 px-4">Cara Keluar</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Data TPP (Jaminan & Kelas)</th>
              <th className="py-3 px-4 text-center">Aksi / Proses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((patient) => {
              const isWaitingTpp = patient.statusAlur === 'menunggu_tpp';
              const isTppDone = patient.statusAlur === 'menunggu_billing' || patient.statusAlur === 'selesai';
              const isBillingDone = patient.statusAlur === 'selesai';

              return (
                <tr 
                  key={patient.id} 
                  className={`transition group ${
                    isWaitingTpp
                      ? 'bg-amber-50/70 hover:bg-amber-100/60 border-l-4 border-l-amber-500 shadow-2xs'
                      : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                  }`}
                >
                  
                  {/* No. RM (6 Digit) & Nama Pasien */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-2.5">
                      <span className={`font-mono text-xs px-2 py-0.5 rounded-md font-bold border tracking-wider shrink-0 ${
                        isWaitingTpp
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-teal-50 text-teal-800 border-teal-200'
                      }`}>
                        {patient.noRm}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`font-bold block text-sm transition ${
                            isWaitingTpp ? 'text-amber-950 group-hover:text-amber-800' : 'text-slate-900 group-hover:text-teal-700'
                          }`}>
                            {patient.namaPasien}
                          </span>

                          {/* Pembeda Khusus: Badge Menunggu Validasi TPP */}
                          {isWaitingTpp && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/90 text-amber-900 border border-amber-400/60 animate-pulse">
                              <AlertCircle className="w-3 h-3 text-amber-700" />
                              Antrean TPP
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 block flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Diinput: {patient.waktuInputRuangan}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Ruangan & DPJP */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block">
                      {patient.ruangan}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate max-w-[220px]" title={patient.dpjp}>
                      {patient.dpjp}
                    </span>
                  </td>

                  {/* Cara Keluar */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-medium rounded-md text-[11px] inline-block">
                      {patient.caraKeluar}
                    </span>
                  </td>

                  {/* Status Alur 3 Level (Ruangan -> TPP -> Billing) */}
                  <td className="py-3.5 px-4 min-w-[200px]">
                    <div className="space-y-1.5">
                      {/* Step Indicator Badges */}
                      <div className="flex items-center gap-1 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-bold flex items-center gap-0.5" title="Selesai Diinput Ruangan">
                          <CheckCircle2 className="w-3 h-3 text-teal-600" /> Ruangan
                        </span>
                        
                        <ArrowRight className="w-2.5 h-2.5 text-slate-300" />

                        <span className={`px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 ${
                          isTppDone 
                            ? 'bg-sky-100 text-sky-800' 
                            : 'bg-amber-100 text-amber-800 ring-1 ring-amber-300 animate-pulse'
                        }`} title="Validasi TPP & Informasi">
                          {isTppDone ? <CheckCircle2 className="w-3 h-3 text-sky-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                          TPP
                        </span>

                        <ArrowRight className="w-2.5 h-2.5 text-slate-300" />

                        <span className={`px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 ${
                          isBillingDone 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isTppDone 
                              ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300 animate-pulse' 
                              : 'bg-slate-100 text-slate-400'
                        }`} title="Finalisasi Billing">
                          {isBillingDone ? <ShieldCheck className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-slate-400" />}
                          Billing
                        </span>
                      </div>

                      {/* Status Text Summary */}
                      <div className="text-[11px]">
                        {patient.statusAlur === 'menunggu_tpp' && (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Menunggu Validasi TPP & Informasi
                          </span>
                        )}
                        {patient.statusAlur === 'menunggu_billing' && (
                          <span className="text-sky-700 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Divalidasi TPP ➔ Menunggu Billing
                          </span>
                        )}
                        {patient.statusAlur === 'selesai' && (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Pemulangan Selesai (Final)
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Data TPP (Jaminan & Hak Kelas, Naik/Titip) */}
                  <td className="py-3.5 px-4 min-w-[180px]">
                    {patient.tppData ? (
                      <div className="space-y-0.5 text-[11px]">
                        <div className="font-bold text-slate-800">
                          {patient.tppData.pembiayaan} ({patient.tppData.hakKelas})
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {patient.tppData.naikKelas && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold" title={patient.tppData.kelasTingkat}>
                              Naik Kelas
                            </span>
                          )}
                          {patient.tppData.titipKelas && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-semibold" title={patient.tppData.alasanTitip}>
                              Titip Kelas
                            </span>
                          )}
                          {!patient.tppData.naikKelas && !patient.tppData.titipKelas && (
                            <span className="text-[10px] text-slate-400">Sesuai Hak Kelas</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100/90 border border-amber-300 text-amber-900 text-[11px] font-bold">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Menunggu Input TPP</span>
                      </div>
                    )}
                  </td>

                  {/* Aksi Sesuai Peran */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      
                      {/* Button TPP: Input / Edit */}
                      {(activeRole === 'tpp' || activeRole === 'monitor' || activeRole === 'admin') && (
                        patient.statusAlur === 'menunggu_tpp' ? (
                          <button
                            onClick={() => onOpenTppModal(patient)}
                            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Validasi TPP
                          </button>
                        ) : (
                          <button
                            onClick={() => onOpenTppModal(patient)}
                            className="px-2 py-1 bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-700 border border-slate-200 rounded-lg text-xs font-semibold transition"
                            title="Edit Data TPP"
                          >
                            <FileEdit className="w-3 h-3" />
                          </button>
                        )
                      )}

                      {/* Button Billing: Finalisasi */}
                      {(activeRole === 'billing' || activeRole === 'monitor' || activeRole === 'admin') && (
                        patient.statusAlur === 'menunggu_billing' ? (
                          <button
                            onClick={() => onOpenBillingModal(patient)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Finalisasi Billing
                          </button>
                        ) : patient.statusAlur === 'menunggu_tpp' ? (
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded">
                            Tunggu TPP
                          </span>
                        ) : (
                          <button
                            onClick={() => onOpenBillingModal(patient)}
                            className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 rounded-lg text-xs font-semibold transition"
                            title="Rincian Billing"
                          >
                            <FileEdit className="w-3 h-3" />
                          </button>
                        )
                      )}

                      {/* Tombol Pantau / Detail (Tersedia untuk semua level) */}
                      <button
                        onClick={() => onSelectPatientDetail(patient)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                        title="Lihat Rincian & Lembar Pemulangan Pasien"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Detail</span>
                      </button>

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
