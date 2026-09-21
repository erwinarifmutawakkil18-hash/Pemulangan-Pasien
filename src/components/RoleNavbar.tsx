import React from 'react';
import { 
  Building2, CreditCard, Receipt, Users, Plus, 
  Search, RefreshCw, Filter, CheckCircle2, Clock, AlertCircle,
  Shield, Settings, Calendar, LogOut, UserCheck, Sparkles, Globe, Eye,
  KeyRound
} from 'lucide-react';
import { RoleType, DAFTAR_RUANGAN, RuanganItem, AuthUser, DAFTAR_BANGSAL } from '../types';

export type ScopeMode = 'own' | 'all';

interface RoleNavbarProps {
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onOpenChangePin?: () => void;
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
  selectedDate: string;
  onDateChange: (date: string) => void;
  countPasienTanggal: number;
  scopeMode: ScopeMode;
  onScopeModeChange: (mode: ScopeMode) => void;
  supabaseStatus?: 'connecting' | 'connected' | 'error';
  isSyncing?: boolean;
  onManualSyncSupabase?: () => void;
}

export const RoleNavbar: React.FC<RoleNavbarProps> = ({
  currentUser,
  onLogout,
  onOpenChangePin,
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
  selectedDate,
  onDateChange,
  countPasienTanggal,
  scopeMode,
  onScopeModeChange,
  supabaseStatus,
  isSyncing,
  onManualSyncSupabase,
}) => {
  const displayRuangan = ruanganList ? ruanganList.filter(r => r.aktif).map(r => r.nama) : DAFTAR_RUANGAN;
  const userRole = currentUser?.role || activeRole;

  return (
    <div className="space-y-4">
      {/* Brand & Global Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-200 pb-3.5">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            RS
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Sistem Pemulangan Pasien
            </h1>
            <p className="text-xs text-slate-500">
              Ruang Rawat Inap &bull; TPP & Informasi &bull; Billing
            </p>
          </div>
        </div>

        {/* User Info & Actions Bar */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Active User Badge */}
          {currentUser && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className={`p-1.5 rounded-lg ${
                currentUser.role === 'ruangan' ? 'bg-teal-100 text-teal-800' :
                currentUser.role === 'tpp' ? 'bg-sky-100 text-sky-800' :
                currentUser.role === 'billing' ? 'bg-emerald-100 text-emerald-800' :
                'bg-indigo-100 text-indigo-800'
              }`}>
                {currentUser.role === 'ruangan' && <Building2 className="w-3.5 h-3.5" />}
                {currentUser.role === 'tpp' && <CreditCard className="w-3.5 h-3.5" />}
                {currentUser.role === 'billing' && <Receipt className="w-3.5 h-3.5" />}
                {currentUser.role === 'admin' && <Shield className="w-3.5 h-3.5" />}
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>{currentUser.namaLengkap}</span>
                  {currentUser.bangsalId && (
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                      R. {DAFTAR_BANGSAL.find(b => b.id === currentUser.bangsalId)?.nama || ''}
                    </span>
                  )}
                  {currentUser.ruangan && !currentUser.bangsalId && (
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                      {currentUser.ruangan}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 capitalize">
                  {currentUser.role === 'ruangan' ? (currentUser.bangsalId ? `Akun R. ${DAFTAR_BANGSAL.find(b => b.id === currentUser.bangsalId)?.nama}` : 'Rawat Inap') :
                   currentUser.role === 'tpp' ? 'TPP & Informasi' :
                   currentUser.role === 'billing' ? 'Billing & Kasir' : 'Administrator'}
                </div>
              </div>
            </div>
          )}

          {/* Logout & User Options */}
          {currentUser && onOpenChangePin && (
            <button
              onClick={onOpenChangePin}
              title="Ganti PIN / Password akun ini"
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl transition border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Ganti PIN</span>
            </button>
          )}

          {/* Supabase Status Indicator */}
          {supabaseStatus && (
            <button
              onClick={onManualSyncSupabase}
              disabled={isSyncing}
              title={`Status Cloud Database: ${
                supabaseStatus === 'connected'
                  ? 'Terhubung ke Supabase (Klik untuk sinkronkan data)'
                  : supabaseStatus === 'connecting'
                  ? 'Sedang menghubungi Supabase...'
                  : 'Mode Offline / Gagal terhubung (Klik untuk mencoba ulang)'
              }`}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition shadow-2xs ${
                supabaseStatus === 'connected'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  : supabaseStatus === 'connecting'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  supabaseStatus === 'connected'
                    ? 'bg-emerald-500 ring-2 ring-emerald-200'
                    : supabaseStatus === 'connecting'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
              <span className="hidden sm:inline">
                {isSyncing ? 'Sinkron...' : supabaseStatus === 'connected' ? 'Supabase' : 'Offline'}
              </span>
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-teal-700' : 'text-slate-400'}`} />
            </button>
          )}

          {/* Reset Data Helper */}
          <button
            onClick={onResetData}
            title="Reset ke data contoh rumah sakit"
            className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition border border-slate-200 text-xs font-medium flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Tombol Input Pasien Pulang: HANYA untuk Ruangan dan Admin */}
          {(userRole === 'ruangan' || userRole === 'admin') && (
            <button
              id="open-input-ruangan-btn"
              onClick={onOpenInputRuangan}
              className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Input Pasien Pulang</span>
            </button>
          )}

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Keluar dari sesi ini dan ganti unit / akun"
              className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 hover:border-red-200 rounded-xl transition border border-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500 hover:text-red-600" />
              <span>Ganti Akun</span>
            </button>
          )}

        </div>
      </div>

      {/* Role Notice & Tab Navigation */}
      {userRole === 'admin' ? (
        /* Jika Admin: Tetap sediakan Tab Switcher untuk supervisi dan menu Admin */
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-1.5">
          <button
            id="role-tab-monitor"
            onClick={() => onRoleChange('monitor')}
            className={`flex-1 min-w-[120px] px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition text-xs font-bold ${
              activeRole === 'monitor'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Supervisi Monitoring ({totalPasien})</span>
          </button>

          <button
            id="role-tab-ruangan"
            onClick={() => onRoleChange('ruangan')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition text-xs font-semibold ${
              activeRole === 'ruangan'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Simulasi Ruangan</span>
          </button>

          <button
            id="role-tab-tpp"
            onClick={() => onRoleChange('tpp')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition text-xs font-semibold ${
              activeRole === 'tpp'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Simulasi TPP ({countMenungguTpp})</span>
          </button>

          <button
            id="role-tab-billing"
            onClick={() => onRoleChange('billing')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition text-xs font-semibold ${
              activeRole === 'billing'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Simulasi Billing ({countMenungguBilling})</span>
          </button>

          <button
            id="role-tab-admin"
            onClick={() => onRoleChange('admin')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition text-xs font-bold border ${
              activeRole === 'admin'
                ? 'bg-indigo-800 text-white border-indigo-700 shadow-xs'
                : 'border-slate-200 hover:bg-indigo-50 text-indigo-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Pengaturan Master</span>
          </button>
        </div>
      ) : (
        /* Untuk Petugas Ruangan, TPP, atau Billing: Tampilkan Banner Khusus Peran dengan Switch Fokus R. vs Pantau Semua Ruangan */
        <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          userRole === 'ruangan' ? 'bg-teal-50/80 border-teal-200 text-teal-950 shadow-2xs' :
          userRole === 'tpp' ? 'bg-sky-50/80 border-sky-200 text-sky-950 shadow-2xs' :
          'bg-emerald-50/80 border-emerald-200 text-emerald-950 shadow-2xs'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl shrink-0 ${
              userRole === 'ruangan' ? 'bg-teal-600 text-white' :
              userRole === 'tpp' ? 'bg-sky-600 text-white' :
              'bg-emerald-600 text-white'
            }`}>
              {userRole === 'ruangan' && <Building2 className="w-4 h-4" />}
              {userRole === 'tpp' && <CreditCard className="w-4 h-4" />}
              {userRole === 'billing' && <Receipt className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-bold flex items-center gap-2 flex-wrap">
                <span>Unit Kerja: {
                  userRole === 'ruangan' 
                    ? (currentUser?.bangsalId 
                        ? `R. ${DAFTAR_BANGSAL.find(b => b.id === currentUser.bangsalId)?.nama || ''}`
                        : (currentUser?.ruangan || 'R. Rawat Inap'))
                    : userRole === 'tpp' ? 'TPP & Informasi (Admisi & Jaminan)' 
                    : 'Billing (Kasir & Pelunasan)'
                }</span>
                {userRole === 'ruangan' && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    scopeMode === 'own'
                      ? 'bg-teal-600 text-white border-teal-700'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}>
                    {scopeMode === 'own' ? 'Mode: Fokus R. Sendiri' : 'Mode: Pantau Semua Ruang RS'}
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-85 mt-0.5">
                {userRole === 'ruangan' && (
                  currentUser?.bangsalId
                    ? (scopeMode === 'own'
                        ? `Menampilkan khusus data & alur pemulangan pasien di R. ${DAFTAR_BANGSAL.find(b => b.id === currentUser.bangsalId)?.nama}.`
                        : `Mode supervisi aktif: Anda sedang melihat alur proses pemulangan pasien dari seluruh ruangan RS.`)
                    : 'Berwenang menginput pasien rencana pulang rawat inap.'
                )}
                {userRole === 'tpp' && 'Memvalidasi jenis pembiayaan (BPJS/Umum/Asuransi) & hak kelas pasien rawat inap seluruh RS.'}
                {userRole === 'billing' && 'Memverifikasi rincian tagihan billing & menerbitkan kuitansi pelunasan pasien RS.'}
              </p>
            </div>
          </div>

          {/* Scope Selector: Khusus untuk Ruangan agar bisa fokus ke R. nya ATAU melihat seluruh data ruang lain */}
          {userRole === 'ruangan' && currentUser?.bangsalId ? (
            <div className="flex items-center bg-white/90 p-1 rounded-xl border border-teal-200 shadow-2xs self-start sm:self-center shrink-0">
              <button
                type="button"
                id="btn-scope-own"
                onClick={() => onScopeModeChange('own')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  scopeMode === 'own'
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-teal-800 hover:bg-teal-50/60'
                }`}
                title={`Fokus monitoring hanya untuk pasien di R. ${DAFTAR_BANGSAL.find(b => b.id === currentUser.bangsalId)?.nama}`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Fokus R. {DAFTAR_BANGSAL.find(b => b.id === currentUser.bangsalId)?.nama}</span>
              </button>
              
              <button
                type="button"
                id="btn-scope-all"
                onClick={() => onScopeModeChange('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  scopeMode === 'all'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Lihat proses alur pemulangan secara keseluruhan dari data ruang lain"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Lihat Seluruh Ruang RS</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-semibold opacity-90 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Monitoring Terpadu Aktif</span>
            </div>
          )}
        </div>
      )}

      {/* Status Process Cards / Quick Filter Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Pasien Pulang Tanggal Ini */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('all')}
          className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
            statusFilter === 'all'
              ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div>
            <div className="flex items-center gap-1 text-[11px] font-medium opacity-80">
              <Calendar className="w-3 h-3 shrink-0" />
              <span>Pasien Pulang</span>
            </div>
            <div className="text-xs font-bold mt-0.5">
              {selectedDate ? new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Hari Ini'}
            </div>
          </div>
          <span className={`text-base font-bold px-2 py-0.5 rounded-lg ${
            statusFilter === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-800'
          }`}>
            {countPasienTanggal}
          </span>
        </button>

        {/* 1. Belum Validasi TPP */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('menunggu_tpp')}
          className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
            statusFilter === 'menunggu_tpp'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-2 ring-amber-300'
              : countMenungguTpp > 0
                ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-100/70 text-amber-950'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div>
            <div className="flex items-center gap-1 text-[11px] font-medium opacity-90">
              <Clock className="w-3 h-3 shrink-0" />
              <span>Belum Validasi TPP</span>
            </div>
            <div className="text-xs font-bold mt-0.5">Antrean Admisi</div>
          </div>
          <span className={`text-base font-bold px-2 py-0.5 rounded-lg ${
            statusFilter === 'menunggu_tpp' 
              ? 'bg-amber-800 text-amber-100' 
              : countMenungguTpp > 0 
                ? 'bg-amber-200/90 text-amber-950' 
                : 'bg-slate-100 text-slate-700'
          }`}>
            {countMenungguTpp}
          </span>
        </button>

        {/* 2. Antre Billing */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('menunggu_billing')}
          className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
            statusFilter === 'menunggu_billing'
              ? 'bg-sky-600 text-white border-sky-600 shadow-xs ring-2 ring-sky-300'
              : countMenungguBilling > 0
                ? 'bg-sky-50/70 border-sky-300 hover:bg-sky-100/70 text-sky-950'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div>
            <div className="flex items-center gap-1 text-[11px] font-medium opacity-90">
              <Receipt className="w-3 h-3 shrink-0" />
              <span>Antre Billing</span>
            </div>
            <div className="text-xs font-bold mt-0.5">Verifikasi Kasir</div>
          </div>
          <span className={`text-base font-bold px-2 py-0.5 rounded-lg ${
            statusFilter === 'menunggu_billing' 
              ? 'bg-sky-800 text-sky-100' 
              : countMenungguBilling > 0 
                ? 'bg-sky-200/90 text-sky-950' 
                : 'bg-slate-100 text-slate-700'
          }`}>
            {countMenungguBilling}
          </span>
        </button>

        {/* 3. Selesai */}
        <button
          type="button"
          onClick={() => onStatusFilterChange('selesai')}
          className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
            statusFilter === 'selesai'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-300'
              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
          }`}
        >
          <div>
            <div className="flex items-center gap-1 text-[11px] font-medium opacity-90">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Selesai</span>
            </div>
            <div className="text-xs font-bold mt-0.5">Tuntas</div>
          </div>
          <span className={`text-base font-bold px-2 py-0.5 rounded-lg ${
            statusFilter === 'selesai' ? 'bg-emerald-900 text-emerald-100' : 'bg-slate-100 text-slate-700'
          }`}>
            {countSelesai}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
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

        {/* Date Filter & Ruangan Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tanggal Pulang */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 font-medium whitespace-nowrap">Tanggal:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => onDateChange('')}
                title="Tampilkan semua tanggal"
                className="text-[10px] text-slate-400 hover:text-red-600 font-bold ml-1 px-1 rounded hover:bg-slate-200"
              >
                &times;
              </button>
            )}
          </div>

          {/* Ruangan Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 font-medium whitespace-nowrap">Ruangan:</span>
            <select
              value={selectedRuangan}
              onChange={(e) => onRuanganChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none max-w-[170px] truncate cursor-pointer"
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
    </div>
  );
};
