import React from 'react';
import { 
  Building2, CreditCard, Receipt, Users, Plus, 
  Search, RefreshCw, Filter, CheckCircle2, Clock, AlertCircle,
  Shield, Settings
} from 'lucide-react';
import { RoleType, DAFTAR_RUANGAN, RuanganItem } from '../types';

interface RoleNavbarProps {
  activeRole: RoleType | 'monitor';
  onRoleChange: (role: RoleType | 'monitor') => void;
  selectedRuangan: string;
  onRuanganChange: (ruangan: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenInputRuangan: () => void;
  onResetData: () => void;
  countMenungguTpp: number;
  countMenungguBilling: number;
  countSelesai: number;
  totalPasien: number;
  ruanganList?: RuanganItem[];
  statusFilter: 'all' | 'menunggu_tpp' | 'menunggu_billing' | 'selesai';
  onStatusFilterChange: (status: 'all' | 'menunggu_tpp' | 'menunggu_billing' | 'selesai') => void;
}

export const RoleNavbar: React.FC<RoleNavbarProps> = ({
  activeRole,
  onRoleChange,
  selectedRuangan,
  onRuanganChange,
  searchQuery,
  onSearchChange,
  onOpenInputRuangan,
  onResetData,
  countMenungguTpp,
  countMenungguBilling,
  countSelesai,
  totalPasien,
  ruanganList,
  statusFilter,
  onStatusFilterChange,
}) => {
  const displayRuangan = ruanganList ? ruanganList.filter(r => r.aktif).map(r => r.nama) : DAFTAR_RUANGAN;

  return (
    <div className="space-y-4">
      {/* Brand & Global Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-teal-700/20">
            RS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Sistem Pemulangan Pasien Rawat Inap
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
                Alur 3 Level
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Integrasi Ruangan Rawat Inap ➔ TPP & Informasi ➔ Kasir Billing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onResetData}
            title="Reset ke data contoh"
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition border border-slate-200 text-xs font-medium flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Data</span>
          </button>

          <button
            id="open-input-ruangan-btn"
            onClick={onOpenInputRuangan}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Pasien Pulang (Ruangan)</span>
          </button>
        </div>
      </div>

      {/* Role Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
        
        {/* Tab 1: Ruangan Rawat Inap */}
        <button
          id="role-tab-ruangan"
          onClick={() => onRoleChange('ruangan')}
          className={`flex-1 min-w-[170px] p-3 rounded-xl flex items-center justify-between transition ${
            activeRole === 'ruangan'
              ? 'bg-teal-700 text-white font-bold shadow-xs'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${activeRole === 'ruangan' ? 'bg-teal-800 text-teal-200' : 'bg-teal-50 text-teal-700'}`}>
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold">1. Ruang Rawat Inap</span>
              <span className={`text-[10px] block ${activeRole === 'ruangan' ? 'text-teal-200' : 'text-slate-400'}`}>
                Input data & pantau status
              </span>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            activeRole === 'ruangan' ? 'bg-teal-800 text-teal-100' : 'bg-slate-100 text-slate-700'
          }`}>
            {totalPasien}
          </span>
        </button>

        {/* Tab 2: TPP dan Informasi */}
        <button
          id="role-tab-tpp"
          onClick={() => onRoleChange('tpp')}
          className={`flex-1 min-w-[170px] p-3 rounded-xl flex items-center justify-between transition ${
            activeRole === 'tpp'
              ? 'bg-sky-700 text-white font-bold shadow-xs'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${activeRole === 'tpp' ? 'bg-sky-800 text-sky-200' : 'bg-sky-50 text-sky-700'}`}>
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold">2. TPP & Informasi</span>
              <span className={`text-[10px] block ${activeRole === 'tpp' ? 'text-sky-200' : 'text-slate-400'}`}>
                Pembiayaan & Hak Kelas
              </span>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            activeRole === 'tpp' 
              ? 'bg-sky-800 text-sky-100' 
              : countMenungguTpp > 0 
                ? 'bg-amber-100 text-amber-800 animate-pulse' 
                : 'bg-slate-100 text-slate-600'
          }`}>
            {countMenungguTpp} Antre
          </span>
        </button>

        {/* Tab 3: Billing / Kasir */}
        <button
          id="role-tab-billing"
          onClick={() => onRoleChange('billing')}
          className={`flex-1 min-w-[170px] p-3 rounded-xl flex items-center justify-between transition ${
            activeRole === 'billing'
              ? 'bg-emerald-700 text-white font-bold shadow-xs'
              : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${activeRole === 'billing' ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-50 text-emerald-700'}`}>
              <Receipt className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold">3. Billing / Kasir</span>
              <span className={`text-[10px] block ${activeRole === 'billing' ? 'text-emerald-200' : 'text-slate-400'}`}>
                Finalisasi pemulangan
              </span>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            activeRole === 'billing' 
              ? 'bg-emerald-800 text-emerald-100' 
              : countMenungguBilling > 0 
                ? 'bg-amber-100 text-amber-800 animate-pulse' 
                : 'bg-slate-100 text-slate-600'
          }`}>
            {countMenungguBilling} Antre
          </span>
        </button>

        {/* Tab 4: Monitor Terpadu */}
        <button
          id="role-tab-monitor"
          onClick={() => onRoleChange('monitor')}
          className={`p-3 rounded-xl flex items-center gap-2 transition ${
            activeRole === 'monitor'
              ? 'bg-slate-800 text-white font-bold'
              : 'hover:bg-slate-50 text-slate-600'
          }`}
          title="Lihat semua data dan rekap alur terpadu"
        >
          <Users className="w-4 h-4" />
          <span className="text-xs font-bold">Semua Alur</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded font-bold">
            {countSelesai} Selesai
          </span>
        </button>

        {/* Tab 5: Administrator Master & Hak Akses */}
        <button
          id="role-tab-admin"
          onClick={() => onRoleChange('admin')}
          className={`p-3 rounded-xl flex items-center gap-2 transition border ${
            activeRole === 'admin'
              ? 'bg-indigo-800 text-white font-bold border-indigo-700 shadow-xs'
              : 'border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-semibold'
          }`}
          title="Pengaturan Master Dropdown dan Hak Akses Ruangan"
        >
          <Shield className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold">Admin Master</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-200/80 text-indigo-900 font-bold">
            PIN
          </span>
        </button>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="search-patient-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari No. RM (6 Digit), Nama, DPJP..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-teal-600 focus:bg-white"
          />
        </div>

        {/* Quick Status Filter Tabs (Memisahkan pasien belum tervalidasi TPP) */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <button
            type="button"
            onClick={() => onStatusFilterChange('all')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({totalPasien})
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange('menunggu_tpp')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 border ${
              statusFilter === 'menunggu_tpp'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-300'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
            title="Tampilkan hanya pasien yang belum tervalidasi TPP & Informasi"
          >
            <Clock className="w-3 h-3" />
            <span>Belum Validasi TPP</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              statusFilter === 'menunggu_tpp' ? 'bg-amber-800 text-amber-100' : 'bg-amber-200 text-amber-900'
            }`}>
              {countMenungguTpp}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange('menunggu_billing')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border ${
              statusFilter === 'menunggu_billing'
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
            }`}
          >
            <span>Antre Billing</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              statusFilter === 'menunggu_billing' ? 'bg-sky-800 text-sky-100' : 'bg-sky-200 text-sky-900'
            }`}>
              {countMenungguBilling}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onStatusFilterChange('selesai')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border ${
              statusFilter === 'selesai'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Selesai</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              statusFilter === 'selesai' ? 'bg-emerald-900 text-emerald-100' : 'bg-emerald-200 text-emerald-900'
            }`}>
              {countSelesai}
            </span>
          </button>
        </div>

        {/* Ruangan Filter (Important when in Ruangan level or all) */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Ruangan:</span>
          <select
            value={selectedRuangan}
            onChange={(e) => onRuanganChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-teal-600 max-w-[210px] truncate"
          >
            <option value="all">Semua Ruangan</option>
            {displayRuangan.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
};
