import React, { useState } from 'react';
import { X, UserPlus, AlertCircle, Building2, User, Stethoscope, DoorOpen } from 'lucide-react';
import { 
  PatientDischarge, DAFTAR_RUANGAN, DAFTAR_DPJP, DAFTAR_CARA_KELUAR, CaraKeluar, RuanganItem 
} from '../types';

interface RuanganInputModalProps {
  ruanganAwal?: string;
  ruanganList?: RuanganItem[];
  dpjpList?: string[];
  caraKeluarList?: string[];
  onClose: () => void;
  onSubmit: (newPatient: PatientDischarge) => void;
}

export const RuanganInputModal: React.FC<RuanganInputModalProps> = ({
  ruanganAwal,
  ruanganList,
  dpjpList,
  caraKeluarList,
  onClose,
  onSubmit,
}) => {
  const activeRooms = ruanganList ? ruanganList.filter(r => r.aktif).map(r => r.nama) : DAFTAR_RUANGAN;
  const activeDpjps = dpjpList || DAFTAR_DPJP;
  const activeCaraKeluar = caraKeluarList || DAFTAR_CARA_KELUAR;

  const [noRm, setNoRm] = useState('');
  const [namaPasien, setNamaPasien] = useState('');
  const [ruangan, setRuangan] = useState(ruanganAwal || activeRooms[0] || 'Ruang Rawat');
  const [dpjp, setDpjp] = useState(activeDpjps[0] || 'dr. DPJP');
  const [caraKeluar, setCaraKeluar] = useState<CaraKeluar>((activeCaraKeluar[0] as CaraKeluar) || 'Persetujuan Dokter / Sembuh');
  const [petugasRuangan, setPetugasRuangan] = useState('');
  const [catatanRuangan, setCatatanRuangan] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRmChange = (val: string) => {
    // Only allow numbers and max 6 digits
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setNoRm(cleaned);
    if (cleaned.length > 0 && cleaned.length < 6) {
      setErrorMsg('Nomor Rekam Medis harus terdiri dari tepat 6 digit angka.');
    } else {
      setErrorMsg('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noRm.length !== 6) {
      setErrorMsg('No. RM wajib 6 digit angka.');
      return;
    }
    if (!namaPasien.trim()) {
      setErrorMsg('Nama pasien wajib diisi.');
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newPatient: PatientDischarge = {
      id: `pt-${Date.now()}`,
      noRm,
      namaPasien: namaPasien.trim(),
      ruangan,
      dpjp,
      caraKeluar,
      waktuInputRuangan: formattedDate,
      petugasRuangan: petugasRuangan.trim() || 'Perawat Ruangan',
      statusAlur: 'menunggu_tpp',
      catatanRuangan: catatanRuangan.trim() || undefined,
    };

    onSubmit(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-800 rounded-xl">
              <UserPlus className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <h2 className="text-base font-bold">Input Pasien Pulang (Ruangan)</h2>
              <p className="text-xs text-teal-100">Kirim data pemulangan pasien ke TPP & Informasi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-teal-200 hover:text-white hover:bg-teal-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. No RM (6 digit) & 2. Nama Pasien */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block font-bold text-slate-700 mb-1">
                1. No. RM (6 Digit) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={noRm}
                onChange={(e) => handleRmChange(e.target.value)}
                placeholder="021458"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono text-sm tracking-widest focus:outline-teal-600 focus:bg-white font-bold text-center"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block text-center">
                {noRm.length} / 6 Digit
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                2. Nama Pasien <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={namaPasien}
                onChange={(e) => setNamaPasien(e.target.value)}
                placeholder="Nama Lengkap Pasien"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-teal-600 focus:bg-white text-sm"
              />
            </div>
          </div>

          {/* 3. Ruangan (Dropdown) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              3. Ruangan Rawat Inap <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={ruangan}
                onChange={(e) => setRuangan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-teal-600 focus:bg-white"
              >
                {activeRooms.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. DPJP (Dropdown) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              4. Dokter Penanggung Jawab (DPJP) <span className="text-red-500">*</span>
            </label>
            <select
              value={dpjp}
              onChange={(e) => setDpjp(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-teal-600 focus:bg-white"
            >
              {activeDpjps.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Cara Keluar (Dropdown) */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              5. Cara Keluar <span className="text-red-500">*</span>
            </label>
            <select
              value={caraKeluar}
              onChange={(e) => setCaraKeluar(e.target.value as CaraKeluar)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium focus:outline-teal-600 focus:bg-white"
            >
              {activeCaraKeluar.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Optional: Petugas & Catatan Ruangan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Petugas Perawat Penginput:
              </label>
              <input
                type="text"
                value={petugasRuangan}
                onChange={(e) => setPetugasRuangan(e.target.value)}
                placeholder="cth: Ns. Siti Aminah, S.Kep"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:outline-teal-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 mb-1">
                Catatan Tambahan Ruangan:
              </label>
              <input
                type="text"
                value={catatanRuangan}
                onChange={(e) => setCatatanRuangan(e.target.value)}
                placeholder="cth: Surat kontrol sudah diberikan"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-slate-800 focus:outline-teal-600"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              * Data akan langsung masuk ke antrean validasi TPP & Informasi
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition shadow-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                Kirim ke TPP & Informasi
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
