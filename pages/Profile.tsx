import React from 'react';
import { useData } from '../context/DataContext';
import { Division, Role, EventStatus } from '../types';
import { Briefcase, Calendar, MapPin, Clock, Shield } from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, events, updateUserProfile } = useData();

  if (!currentUser) return null;

  const isAdmin = currentUser.role === Role.SUPER_ADMIN || currentUser.role === Role.DIVISION_ADMIN;
  
  const userEvents = events.filter(event => event.attendees.includes(currentUser.id));
  
  // Sort events: upcoming first, then others
  const sortedEvents = [...userEvents].sort((a, b) => {
     if (a.status === EventStatus.UPCOMING && b.status !== EventStatus.UPCOMING) return -1;
     if (a.status !== EventStatus.UPCOMING && b.status === EventStatus.UPCOMING) return 1;
     return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUserProfile(currentUser.id, { division: e.target.value as Division });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case EventStatus.UPCOMING: return 'bg-blue-100 text-blue-700';
      case EventStatus.ONGOING: return 'bg-green-100 text-green-700';
      case EventStatus.COMPLETED: return 'bg-slate-100 text-slate-700';
      case EventStatus.CANCELLED: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
          <p className="text-slate-500">Kelola informasi profil dan lihat riwayat kegiatan Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
                {currentUser.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-slate-500">{currentUser.email}</p>
              <div className="mt-3">
                 <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    currentUser.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                 }`}>
                   {currentUser.status}
                 </span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">Peran</p>
                  <p className="text-sm font-medium text-slate-900">{currentUser.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                  <Briefcase size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-400 font-medium uppercase">Divisi</p>
                  {isAdmin ? (
                    <select
                      value={currentUser.division}
                      onChange={handleDivisionChange}
                      className="mt-1 w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      {Object.values(Division).map((div) => (
                        <option key={div} value={div}>{div}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-slate-900">{currentUser.division}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase">Bergabung Sejak</p>
                  <p className="text-sm font-medium text-slate-900">{currentUser.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center">
                <Calendar className="mr-2 text-blue-600" size={20} />
                Kegiatan Saya
              </h3>
            </div>
            
            <div className="divide-y divide-slate-100">
              {sortedEvents.length > 0 ? (
                sortedEvents.map(event => (
                  <div key={event.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {event.division}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg">{event.title}</h4>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-500 mt-2">
                          <span className="flex items-center"><Calendar size={14} className="mr-1.5"/> {event.date}</span>
                          <span className="flex items-center"><Clock size={14} className="mr-1.5"/> {event.time}</span>
                          <span className="flex items-center"><MapPin size={14} className="mr-1.5"/> {event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                   <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 mb-4 text-slate-400">
                     <Calendar size={32} />
                   </div>
                   <h3 className="text-lg font-medium text-slate-900">Belum ada kegiatan</h3>
                   <p className="text-slate-500 mt-1">Anda belum mendaftar untuk kegiatan apapun.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
