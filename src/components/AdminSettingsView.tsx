import React, { useState } from 'react';
import { 
  Shield, Settings, Plus, Trash2, Edit2, Check, X, 
  Building2, UserCheck, Stethoscope, DoorOpen, CreditCard, 
  Lock, Unlock, KeyRound, AlertTriangle, Layers, CheckCircle2
} from 'lucide-react';
import { 
  MasterSettings, RuanganItem, KategoriRuangan 
} from '../types';

interface AdminSettingsViewProps {
  settings: MasterSettings;
  onSaveSettings: (newSettings: MasterSettings) => void;
  onCloseAdmin: () => void;
}

const KATEGORI_RUANGAN_OPTIONS: KategoriRuangan[] = [
  'Rawat Inap Reguler',
  'VIP / VVIP',
  'Perawatan Intensif (ICU/ICCU/PICU/NICU)',
  'Kebidanan / Bersalin',
  'Isolasi Khusus'
];

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({
  settings,
  onSaveSettings,
  onCloseAdmin,
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Admin Sub-Tab
  const [adminTab, setAdminTab] = useState<'ruangan' | 'dpjp' | 'carakeluar' | 'pembiayaan' | 'hakkelas' | 'keamanan'>('ruangan');

  // Working copy of master settings
  const [localSettings, setLocalSettings] = useState<MasterSettings>(settings);

  // New item inputs
  const [newRuanganNama, setNewRuanganNama] = useState('');
  const [newRuanganKategori, setNewRuanganKategori] = useState<KategoriRuangan>('Rawat Inap Reguler');
  const [newRuanganLantai, setNewRuanganLantai] = useState('');

  const [newDpjp, setNewDpjp] = useState('');
  const [newCaraKeluar, setNewCaraKeluar] = useState('');
  const [newPembiayaan, setNewPembiayaan] = useState('');
  const [newHakKelas, setNewHakKelas] = useState('');

  // New PIN input
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');

  // Handle PIN verification
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin === localSettings.adminPin) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('PIN Admin salah! (Default PIN: 1234)');
    }
  };

  // Add Ruangan
  const handleAddRuangan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuanganNama.trim()) return;
    const item: RuanganItem = {
      id: `rng-${Date.now()}`,
      nama: newRuanganNama.trim(),
      kategori: newRuanganKategori,
      lantai: newRuanganLantai.trim() || undefined,
      aktif: true,
    };
    const updated = {
      ...localSettings,
      daftarRuangan: [...localSettings.daftarRuangan, item],
    };
    setLocalSettings(updated);
    onSaveSettings(updated);
    setNewRuanganNama('');
    setNewRuanganLantai('');
  };

  // Toggle Ruangan Aktif
  const handleToggleRuangan = (id: string) => {
    const updated = {
      ...localSettings,
      daftarRuangan: localSettings.daftarRuangan.map((r) =>
        r.id === id ? { ...r, aktif: !r.aktif } : r
      ),
    };
    setLocalSettings(updated);
    onSaveSettings(updated);
  };

  // Delete Ruangan
  const handleDeleteRuangan = (id: string) => {
    if (window.confirm('Hapus ruangan ini dari pilihan master?')) {
      const updated = {
        ...localSettings,
        daftarRuangan: localSettings.daftarRuangan.filter((r) => r.id !== id),
      };
      setLocalSettings(updated);
      onSaveSettings(updated);
    }
  };

  // Helper Add to Array
  const handleAddStringItem = (
    key: 'daftarDpjp' | 'daftarCaraKeluar' | 'daftarPembiayaan' | 'daftarHakKelas',
    val: string,
    setter: (v: string) => void
  ) => {
    if (!val.trim()) return;
    if (localSettings[key].includes(val.trim())) {
      alert('Pilihan ini sudah ada.');
      return;
    }
    const updated = {
      ...localSettings,
      [key]: [...localSettings[key], val.trim()],
    };
    setLocalSettings(updated);
    onSaveSettings(updated);
    setter('');
  };

  // Helper Delete from Array
  const handleDeleteStringItem = (
    key: 'daftarDpjp' | 'daftarCaraKeluar' | 'daftarPembiayaan' | 'daftarHakKelas',
    index: number
  ) => {
    if (window.confirm('Hapus opsi dropdown ini?')) {
      const list = [...localSettings[key]];
      list.splice(index, 1);
      const updated = {
        ...localSettings,
        [key]: list,
      };
      setLocalSettings(updated);
      onSaveSettings(updated);
    }
  };

  // Change PIN
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      alert('PIN minimal 4 digit.');
      return;
    }
    if (newPin !== confirmPin) {
      alert('Konfirmasi PIN tidak cocok.');
      return;
    }
    const updated = {
      ...localSettings,
      adminPin: newPin,
    };
    setLocalSettings(updated);
    onSaveSettings(updated);
    setNewPin('');
    setConfirmPin('');
    setSecuritySuccess('PIN Admin berhasil diperbarui!');
    setTimeout(() => setSecuritySuccess(''), 3000);
  };

  // Toggle Security Mode
  const handleToggleKunciAkses = () => {
    const updated = {
      ...localSettings,
      kunciAksesRuangan: !localSettings.kunciAksesRuangan,
    };
    setLocalSettings(updated);
    onSaveSettings(updated);
  };

  // PIN Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm text-center">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-700 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <KeyRound className="w-7 h-7" />
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-1">Akses Pengaturan Master Admin</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Area ini khusus untuk Administrator rumah sakit dalam mengatur daftar pilihan dropdown (Ruangan, DPJP, Penjamin) dan hak akses.
        </p>

        <form onSubmit={handleVerifyPin} className="space-y-4 text-left">
          {pinError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{pinError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Masukkan PIN Keamanan Admin:
            </label>
            <input
              type="password"
              autoFocus
              maxLength={8}
              value={inputPin}
              onChange={(e) => setInputPin(e.target.value)}
              placeholder="Ketik PIN (Default: 1234)"
              className="w-full text-center text-lg tracking-widest font-mono p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-indigo-600 focus:bg-white font-bold"
            />
            <span className="text-[11px] text-slate-400 block text-center mt-1">
              PIN Bawaan Pabrik: <strong>1234</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onCloseAdmin}
              className="flex-1 py-2.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition"
            >
              Kembali
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <Unlock className="w-4 h-4" />
              Buka Akses Admin
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      
      {/* Header Admin */}
      <div className="px-6 py-4 bg-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-800 rounded-xl">
            <Settings className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">Panel Master & Hak Akses Administrator</h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-700 text-[10px] font-bold text-indigo-200">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-indigo-200">
              Kelola master pilihan dropdown seluruh level & aturan hak akses ruangan
            </p>
          </div>
        </div>

        <button
          onClick={onCloseAdmin}
          className="px-3.5 py-1.5 bg-indigo-800 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition self-start sm:self-center"
        >
          Tutup Mode Admin
        </button>
      </div>

      {/* Sub-Tabs Nav */}
      <div className="border-b border-slate-200 bg-slate-50/70 p-2 flex flex-wrap gap-1 text-xs">
        
        <button
          onClick={() => setAdminTab('ruangan')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
            adminTab === 'ruangan'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Master Ruangan ({localSettings.daftarRuangan.length})
        </button>

        <button
          onClick={() => setAdminTab('dpjp')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
            adminTab === 'dpjp'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          Master Dokter DPJP ({localSettings.daftarDpjp.length})
        </button>

        <button
          onClick={() => setAdminTab('carakeluar')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
            adminTab === 'carakeluar'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DoorOpen className="w-4 h-4" />
          Cara Keluar ({localSettings.daftarCaraKeluar.length})
        </button>

        <button
          onClick={() => setAdminTab('pembiayaan')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
            adminTab === 'pembiayaan'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Pembiayaan TPP ({localSettings.daftarPembiayaan.length})
        </button>

        <button
          onClick={() => setAdminTab('hakkelas')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
            adminTab === 'hakkelas'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Hak Kelas ({localSettings.daftarHakKelas.length})
        </button>

        <button
          onClick={() => setAdminTab('keamanan')}
          className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition ${
            adminTab === 'keamanan'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          Hak Akses & PIN
        </button>

      </div>

      {/* Tab Contents */}
      <div className="p-6 text-xs text-slate-800">
        
        {/* 1. MASTER RUANGAN DENGAN KATEGORI */}
        {adminTab === 'ruangan' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Pengaturan Master Ruangan Rawat Inap</h3>
                <p className="text-slate-500">
                  Tambah dan kelompokkan berbagai jenis ruangan (Reguler, VIP/VVIP, Intensif ICU/PICU, Kebidanan, Isolasi).
                </p>
              </div>
            </div>

            {/* Form Tambah Ruangan Baru */}
            <form onSubmit={handleAddRuangan} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 text-xs block">
                + Tambah Ruangan Rawat Inap Baru:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-medium text-slate-600 mb-1">Nama Ruangan:</label>
                  <input
                    type="text"
                    required
                    value={newRuanganNama}
                    onChange={(e) => setNewRuanganNama(e.target.value)}
                    placeholder="cth: Ruang Cempaka (Kelas 2)"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 focus:outline-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-600 mb-1">Jenis / Kategori:</label>
                  <select
                    value={newRuanganKategori}
                    onChange={(e) => setNewRuanganKategori(e.target.value as KategoriRuangan)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 focus:outline-indigo-600 font-medium"
                  >
                    {KATEGORI_RUANGAN_OPTIONS.map((kat) => (
                      <option key={kat} value={kat}>
                        {kat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-600 mb-1">Lantai / Lokasi Gedung:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRuanganLantai}
                      onChange={(e) => setNewRuanganLantai(e.target.value)}
                      placeholder="cth: Lantai 3 Gedung B"
                      className="w-full bg-white border border-slate-300 rounded-xl p-2 focus:outline-indigo-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl whitespace-nowrap transition flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Tambah
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* List Ruangan Berdasarkan Kategori */}
            <div className="space-y-4">
              {KATEGORI_RUANGAN_OPTIONS.map((kategori) => {
                const roomsInKat = localSettings.daftarRuangan.filter((r) => r.kategori === kategori);
                if (roomsInKat.length === 0) return null;

                return (
                  <div key={kategori} className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-100/80 px-4 py-2 font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                        {kategori}
                      </span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {roomsInKat.length} Ruangan
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100 bg-white">
                      {roomsInKat.map((room) => (
                        <div key={room.id} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50 transition">
                          <div>
                            <strong className="text-slate-900 block text-xs">{room.nama}</strong>
                            <span className="text-[11px] text-slate-400">
                              {room.lantai || 'Lantai tidak disetel'} • {room.aktif ? 'Aktif di Dropdown' : 'Dinonaktifkan'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleRuangan(room.id)}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                                room.aktif
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {room.aktif ? 'Aktif' : 'Nonaktif'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteRuangan(room.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hapus Ruangan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. MASTER DOKTER DPJP */}
        {adminTab === 'dpjp' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Master Dokter Penanggung Jawab Pelayanan (DPJP)</h3>
              <p className="text-slate-500">
                Pilihan dokter spesialis dan umum yang muncul pada dropdown saat ruangan menginput pasien pulang.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDpjp}
                onChange={(e) => setNewDpjp(e.target.value)}
                placeholder="cth: dr. Firman Syah, Sp.A (Anak)"
                className="flex-1 bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-600"
              />
              <button
                type="button"
                onClick={() => handleAddStringItem('daftarDpjp', newDpjp, setNewDpjp)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Tambah Dokter
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
              {localSettings.daftarDpjp.map((dpjp, idx) => (
                <div key={idx} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <span className="font-semibold text-slate-800">{dpjp}</span>
                  <button
                    onClick={() => handleDeleteStringItem('daftarDpjp', idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. MASTER CARA KELUAR */}
        {adminTab === 'carakeluar' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Master Pilihan Cara Keluar Pasien</h3>
              <p className="text-slate-500">
                Kondisi kepulangan pasien (sembuh, membaik, APS, rujuk, meninggal).
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCaraKeluar}
                onChange={(e) => setNewCaraKeluar(e.target.value)}
                placeholder="cth: Isolasi Mandiri / Pindah Faskes Pratama"
                className="flex-1 bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-600"
              />
              <button
                type="button"
                onClick={() => handleAddStringItem('daftarCaraKeluar', newCaraKeluar, setNewCaraKeluar)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Tambah Pilihan
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
              {localSettings.daftarCaraKeluar.map((item, idx) => (
                <div key={idx} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <span className="font-semibold text-slate-800">{item}</span>
                  <button
                    onClick={() => handleDeleteStringItem('daftarCaraKeluar', idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. MASTER PEMBIAYAAN TPP */}
        {adminTab === 'pembiayaan' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Master Pilihan Pembiayaan / Penjamin (TPP & Informasi)</h3>
              <p className="text-slate-500">
                Jenis penjamin yang divalidasi oleh petugas TPP (BPJS, Umum, Asuransi Swasta, dll).
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newPembiayaan}
                onChange={(e) => setNewPembiayaan(e.target.value)}
                placeholder="cth: BPJS Ketenagakerjaan (Kecelakaan Kerja)"
                className="flex-1 bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-600"
              />
              <button
                type="button"
                onClick={() => handleAddStringItem('daftarPembiayaan', newPembiayaan, setNewPembiayaan)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Tambah Penjamin
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
              {localSettings.daftarPembiayaan.map((item, idx) => (
                <div key={idx} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <span className="font-semibold text-slate-800">{item}</span>
                  <button
                    onClick={() => handleDeleteStringItem('daftarPembiayaan', idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. MASTER HAK KELAS */}
        {adminTab === 'hakkelas' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Master Hak Kelas Pasien</h3>
              <p className="text-slate-500">
                Tingkatan hak kepesertaan pasien (Kelas 1, 2, 3, VIP, VVIP, Presidential).
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newHakKelas}
                onChange={(e) => setNewHakKelas(e.target.value)}
                placeholder="cth: Presidential Suite"
                className="flex-1 bg-white border border-slate-300 rounded-xl p-2.5 focus:outline-indigo-600"
              />
              <button
                type="button"
                onClick={() => handleAddStringItem('daftarHakKelas', newHakKelas, setNewHakKelas)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Tambah Kelas
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
              {localSettings.daftarHakKelas.map((item, idx) => (
                <div key={idx} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <span className="font-semibold text-slate-800">{item}</span>
                  <button
                    onClick={() => handleDeleteStringItem('daftarHakKelas', idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. HAK AKSES & PENGATURAN KEAMANAN */}
        {adminTab === 'keamanan' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Pengaturan Hak Akses & PIN Admin</h3>
              <p className="text-slate-500">
                Atur perlindungan keamanan aplikasi dan pembatasan wewenang antar ruangan.
              </p>
            </div>

            {securitySuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{securitySuccess}</span>
              </div>
            )}

            {/* Ubah PIN Admin */}
            <form onSubmit={handleChangePin} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 block text-xs">Ubah PIN Keamanan Admin:</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">PIN Baru (Min 4 digit):</label>
                  <input
                    type="password"
                    required
                    maxLength={8}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="PIN Baru"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono tracking-widest text-center focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Konfirmasi PIN Baru:</label>
                  <input
                    type="password"
                    required
                    maxLength={8}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Ulangi PIN"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono tracking-widest text-center focus:outline-indigo-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Simpan PIN Baru
              </button>
            </form>

            {/* Aturan Pembatasan Ruangan */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-800 block text-xs">Kunci Filter Ruangan di Nurse Station</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Jika diaktifkan, komputer perawat akan terkunci pada ruangan yang dipilih saat memulai shift.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleKunciAkses}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                  localSettings.kunciAksesRuangan
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {localSettings.kunciAksesRuangan ? 'Aktif (Terkunci)' : 'Bebas Pilih'}
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
