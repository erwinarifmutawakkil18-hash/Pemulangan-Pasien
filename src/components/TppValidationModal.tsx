import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, FileText, ArrowRight, Building, User, CreditCard } from 'lucide-react';
import { 
  PatientDischarge, DAFTAR_PEMBIAYAAN, DAFTAR_HAK_KELAS, 
  PembiayaanType, HakKelasType, TppValidationData 
} from '../types';

interface TppValidationModalProps {
  patient: PatientDischarge;
  pembiayaanList?: string[];
  hakKelasList?: string[];
  onClose: () => void;
  onValidate: (patientId: string, tppData: TppValidationData) => void;
}

export const TppValidationModal: React.FC<TppValidationModalProps> = ({
  patient,
  pembiayaanList,
  hakKelasList,
  onClose,
  onValidate,
}) => {
  const activePembiayaan = pembiayaanList || DAFTAR_PEMBIAYAAN;
  const activeHakKelas = hakKelasList || DAFTAR_HAK_KELAS;

  const [pembiayaan, setPembiayaan] = useState<PembiayaanType>(
    patient.tppData?.pembiayaan || (activePembiayaan[0] as PembiayaanType)
  );
  const [hakKelas, setHakKelas] = useState<HakKelasType>(
    patient.tppData?.hakKelas || (activeHakKelas[1] as HakKelasType) || (activeHakKelas[0] as HakKelasType)
  );
  const [naikKelas, setNaikKelas] = useState<boolean>(patient.tppData?.naikKelas || false);
  const [kelasTingkat, setKelasTingkat] = useState<string>(
    patient.tppData?.kelasTingkat || 'Naik ke VIP'
  );
  const [titipKelas, setTitipKelas] = useState<boolean>(patient.tppData?.titipKelas || false);
  const [alasanTitip, setAlasanTitip] = useState<string>(
    patient.tppData?.alasanTitip || 'Kamar kelas hak penuh'
  );
  const [petugasTpp, setPetugasTpp] = useState<string>(
    patient.tppData?.validatedBy || 'Petugas TPP & Informasi'
  );
  const [catatanTpp, setCatatanTpp] = useState<string>(
    patient.tppData?.catatanTpp || ''
  );

  const handleSaveValidation = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const data: TppValidationData = {
      pembiayaan,
      hakKelas,
      naikKelas,
      kelasTingkat: naikKelas ? kelasTingkat : undefined,
      titipKelas,
      alasanTitip: titipKelas ? alasanTitip : undefined,
      validatedAt: formattedDate,
      validatedBy: petugasTpp.trim() || 'Petugas TPP & Informasi',
      catatanTpp: catatanTpp.trim() || undefined,
    };

    onValidate(patient.id, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-sky-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-800 rounded-xl">
              <CreditCard className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">Validasi TPP & Informasi</h2>
              <p className="text-xs text-sky-100">Verifikasi pembiayaan, hak kelas, naik kelas & titip kelas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-sky-200 hover:text-white hover:bg-sky-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Ringkas dari Ruangan */}
        <div className="px-6 py-3.5 bg-sky-50/70 border-b border-sky-100 text-xs">
          <span className="font-bold text-sky-900 uppercase tracking-wide text-[10px] block mb-1">
            Data Masuk dari Ruangan:
          </span>
          <div className="grid grid-cols-2 gap-2 text-slate-700">
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

        {/* Form Input TPP */}
        <form onSubmit={handleSaveValidation} className="p-6 space-y-4 text-xs">
          
          {/* 1. Pembiayaan (Dropdown) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              1. Pembiayaan (Penjamin) <span className="text-red-500">*</span>
            </label>
            <select
              value={pembiayaan}
              onChange={(e) => setPembiayaan(e.target.value as PembiayaanType)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-sky-600 focus:bg-white"
            >
              {activePembiayaan.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Hak Kelas (Kelas 1 - 3, VVIP, VIP) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              2. Hak Kelas Pasien <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {activeHakKelas.map((hk) => {
                const isSelected = hakKelas === hk;
                return (
                  <button
                    key={hk}
                    type="button"
                    onClick={() => setHakKelas(hk as HakKelasType)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold text-center border transition ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {hk}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Naik Kelas (Ya / Tidak) */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-800 block">3. Naik Kelas Rawat?</label>
                <span className="text-[11px] text-slate-500">Apakah pasien dirawat di atas hak kelasnya</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNaikKelas(false)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                    !naikKelas
                      ? 'bg-slate-800 text-white'
                      : 'bg-white border border-slate-300 text-slate-600'
                  }`}
                >
                  Tidak
                </button>
                <button
                  type="button"
                  onClick={() => setNaikKelas(true)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                    naikKelas
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-600'
                  }`}
                >
                  Ya
                </button>
              </div>
            </div>

            {naikKelas && (
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-slate-600 font-medium mb-1">
                  Keterangan Naik Kelas:
                </label>
                <input
                  type="text"
                  value={kelasTingkat}
                  onChange={(e) => setKelasTingkat(e.target.value)}
                  placeholder="cth: Naik ke VIP / Ada selisih iur biaya"
                  className="w-full bg-white border border-amber-300 rounded-lg p-2 text-slate-800 focus:outline-amber-600"
                />
              </div>
            )}
          </div>

          {/* 4. Titip Kelas (Ya / Tidak) */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-800 block">4. Titip Kelas?</label>
                <span className="text-[11px] text-slate-500">Pasien dititipkan sementara karena kamar penuh</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTitipKelas(false)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                    !titipKelas
                      ? 'bg-slate-800 text-white'
                      : 'bg-white border border-slate-300 text-slate-600'
                  }`}
                >
                  Tidak
                </button>
                <button
                  type="button"
                  onClick={() => setTitipKelas(true)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                    titipKelas
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-600'
                  }`}
                >
                  Ya
                </button>
              </div>
            </div>

            {titipKelas && (
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-slate-600 font-medium mb-1">
                  Keterangan Titip Kelas:
                </label>
                <input
                  type="text"
                  value={alasanTitip}
                  onChange={(e) => setAlasanTitip(e.target.value)}
                  placeholder="cth: Dititipkan di Ruang Melati karena kamar asal penuh"
                  className="w-full bg-white border border-purple-300 rounded-lg p-2 text-slate-800 focus:outline-purple-600"
                />
              </div>
            )}
          </div>

          {/* Catatan TPP / No. SEP BPJS (Nama Petugas Dihilangkan) */}
          <div className="pt-1">
            <label className="block font-semibold text-slate-600 mb-1">
              Catatan TPP / No. SEP BPJS:
            </label>
            <input
              type="text"
              value={catatanTpp}
              onChange={(e) => setCatatanTpp(e.target.value)}
              placeholder="cth: SEP sudah terbit / berkas lengkap"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-sky-600"
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
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition shadow-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Validasi & Lanjutkan ke Billing
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
