import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Role, Division, User } from '../types';
import { CheckCircle2, XCircle, Search, Filter, Eye, X, Calendar, Clock, AlertCircle } from 'lucide-react';

export const Members: React.FC = () => {
  const { users, events, updateUserStatus, updateUserProfile, currentUser } = useData();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterDivision, setFilterDivision] = React.useState<string>('Semua');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToApprove, setUserToApprove] = useState<User | null>(null);
  const [actionUser, setActionUser] = useState<{ user: User, action: 'Nonaktifkan' | 'Tolak' } | null>(null);
  const [profileUpdates, setProfileUpdates] = useState<{ role?: Role, division?: Division } | null>(null);
  const [confirmProfileUpdate, setConfirmProfileUpdate] = useState<boolean>(false);

  if (currentUser?.role === Role.MEMBER) {
    return <div className="text-center p-10 text-slate-500">Akses Ditolak. Area khusus admin.</div>;
  }

  const filteredUsers = users.filter(user => {
    if (currentUser?.role === Role.DIVISION_ADMIN && user.division !== currentUser.division) {
      return false;
    }
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = filterDivision === 'Semua' || user.division === filterDivision;
    return matchesSearch && matchesDivision;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aktif': return 'bg-green-100 text-green-700';
      case 'Menunggu': return 'bg-yellow-100 text-yellow-700';
      case 'Nonaktif': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getMemberEvents = (userId: string) => {
    return events.filter(event => event.attendees.includes(userId));
  };

  const StatusBadge = ({ status }: { status: string }) => {
    let styles = '';
    let Icon = AlertCircle;
    
    switch (status) {
      case 'Aktif':
        styles = 'bg-green-100 text-green-800 border-green-200';
        Icon = CheckCircle2;
        break;
      case 'Menunggu':
        styles = 'bg-yellow-100 text-yellow-800 border-yellow-200';
        Icon = Clock;
        break;
      case 'Nonaktif':
        styles = 'bg-slate-100 text-slate-600 border-slate-200';
        Icon = XCircle;
        break;
      default:
        styles = 'bg-slate-100 text-slate-600 border-slate-200';
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
        <Icon size={14} className="mr-1.5" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Anggota</h1>
          <p className="text-slate-500">Lihat dan kelola anggota organisasi</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari anggota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
          >
            <option value="Semua">Semua Divisi</option>
            {Object.values(Division).map(div => (
              <option key={div} value={div}>{div}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Anggota</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Divisi</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Peran</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{user.division}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setProfileUpdates({ role: user.role, division: user.division });
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Lihat Detail"
                      >
                        <Eye size={20} />
                      </button>
                      {user.status === 'Menunggu' && (
                        <>
                          <button
                            onClick={() => setUserToApprove(user)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Setujui"
                          >
                            <CheckCircle2 size={20} />
                          </button>
                          <button
                            onClick={() => setActionUser({ user, action: 'Tolak' })}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Tolak"
                          >
                            <XCircle size={20} />
                          </button>
                        </>
                      )}
                      {user.status === 'Aktif' && user.id !== currentUser?.id && (
                         <button
                         onClick={() => setActionUser({ user, action: 'Nonaktifkan' })}
                         className="p-1 text-red-600 hover:bg-red-50 rounded"
                         title="Nonaktifkan"
                       >
                         <XCircle size={20} />
                       </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Tidak ditemukan anggota yang sesuai kriteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval Confirmation Modal */}
      {userToApprove && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Setujui Anggota</h3>
            </div>
            <p className="text-slate-500 mb-4 text-sm">
              Anda akan menyetujui akun <strong>{userToApprove.name}</strong>. Anda dapat menyesuaikan atribut di bawah ini sebelum menyetujui.
            </p>
            <div className="space-y-4 mb-6 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Divisi</label>
                {currentUser?.role === Role.SUPER_ADMIN ? (
                  <select
                    value={userToApprove.division}
                    onChange={(e) => setUserToApprove({ ...userToApprove, division: e.target.value as Division })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {Object.values(Division).map((div) => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 text-sm border border-slate-200 bg-slate-50 rounded text-slate-700 font-medium">
                    {userToApprove.division}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Peran</label>
                <select
                  value={userToApprove.role}
                  onChange={(e) => setUserToApprove({ ...userToApprove, role: e.target.value as Role })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  {Object.values(Role).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setUserToApprove(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm"
              >
                Batal
              </button>
              <button 
                onClick={async () => {
                  try {
                    await updateUserProfile(userToApprove.id, { 
                      division: userToApprove.division, 
                      role: userToApprove.role 
                    });
                    await updateUserStatus(userToApprove.id, 'Aktif');
                    setUserToApprove(null);
                  } catch (err) {
                    console.error("Failed to approve", err);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Setujui & Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white p-6 border-b border-slate-100 flex justify-between items-center z-10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                   <div className="flex items-center gap-2">
                     <h2 className="text-xl font-bold text-slate-900">{selectedUser.name}</h2>
                     <StatusBadge status={selectedUser.status} />
                   </div>
                   <p className="text-slate-500 text-sm">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Divisi</p>
                  {currentUser?.role === Role.SUPER_ADMIN ? (
                    <select
                      value={profileUpdates?.division || selectedUser.division}
                      onChange={(e) => setProfileUpdates({ ...profileUpdates, division: e.target.value as Division })}
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      {Object.values(Division).map((div) => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="font-medium text-slate-900">{selectedUser.division}</p>
                  )}
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Peran</p>
                  <select
                    value={profileUpdates?.role || selectedUser.role}
                    onChange={(e) => setProfileUpdates({ ...profileUpdates, role: e.target.value as Role })}
                    className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {Object.values(Role).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Status</p>
                  <StatusBadge status={selectedUser.status} />
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Tanggal Bergabung</p>
                  <p className="font-medium text-slate-900">{selectedUser.joinDate}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                  <Calendar className="mr-2 text-blue-600" size={20}/>
                  Riwayat Kegiatan
                </h3>
                
                <div className="space-y-3">
                   {getMemberEvents(selectedUser.id).length > 0 ? (
                      getMemberEvents(selectedUser.id).map(event => (
                        <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-200 transition-colors">
                           <div className="mb-2 sm:mb-0">
                             <h4 className="font-bold text-slate-900">{event.title}</h4>
                             <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                               <span className="flex items-center"><Calendar size={14} className="mr-1"/> {event.date}</span>
                               <span className="flex items-center"><Clock size={14} className="mr-1"/> {event.time}</span>
                             </div>
                           </div>
                           <div className="flex items-center gap-3">
                             <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
                               {event.division}
                             </span>
                             <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                event.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                                event.status === 'Akan Datang' ? 'bg-blue-100 text-blue-700' :
                                'bg-slate-100 text-slate-700'
                             }`}>
                               {event.status}
                             </span>
                           </div>
                        </div>
                      ))
                   ) : (
                      <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Calendar className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                        <p className="text-slate-500 text-sm">Belum ada kegiatan yang dihadiri.</p>
                      </div>
                   )}
                </div>

                {profileUpdates && (profileUpdates.role !== selectedUser.role || profileUpdates.division !== selectedUser.division) && (
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={() => setConfirmProfileUpdate(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action (Reject/Deactivate) Modal */}
      {actionUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border-t-4 border-red-500">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Konfirmasi Aksi</h3>
            <p className="text-slate-500 text-sm mb-6">
              Apakah Anda yakin ingin <strong>{actionUser.action.toLowerCase()}</strong> akun <strong>{actionUser.user.name}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setActionUser(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm"
              >
                Batal
              </button>
              <button 
                onClick={async () => {
                  await updateUserStatus(actionUser.user.id, 'Nonaktif');
                  setActionUser(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm"
              >
                Ya, {actionUser.action}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Profile Update Modal */}
      {confirmProfileUpdate && selectedUser && profileUpdates && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Simpan Perubahan</h3>
            <p className="text-slate-500 text-sm mb-6">
              Apakah Anda yakin ingin menyimpan perubahan profil untuk <strong>{selectedUser.name}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmProfileUpdate(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm"
              >
                Batal
              </button>
              <button 
                onClick={async () => {
                  await updateUserProfile(selectedUser.id, profileUpdates);
                  setSelectedUser({ ...selectedUser, ...profileUpdates });
                  setConfirmProfileUpdate(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};