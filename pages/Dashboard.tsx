import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Role, Division, EventStatus, getComputedStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Calendar, TrendingUp, Award, Clock, MapPin, CheckCircle2, Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { users: allUsers, events, currentUser, registerForEvent } = useData();
  const { showToast } = useToast();
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  // Exclude 'Umum' division from dashboard metrics
  const activeUsers = allUsers.filter(u => u.division !== Division.GENERAL);

  const totalMembers = activeUsers.length;
  const totalEvents = events.filter(e => getComputedStatus(e) === EventStatus.ONGOING || getComputedStatus(e) === EventStatus.UPCOMING).length;
  const activeMembers = activeUsers.filter(u => u.status === 'Aktif').length;
  const attendanceRate = totalMembers > 0 ? Math.round((activeUsers.filter(u => events.some(e => e.attendees.includes(u.id))).length / totalMembers) * 100) : 0;

  const divisionData = Object.values(Division)
    .filter(d => d !== Division.GENERAL)
    .map(div => ({
      name: div,
      count: activeUsers.filter(u => u.division === div).length
    }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1'];
  
  const eventStatusData = [
    { name: 'Akan Datang', value: events.filter(e => getComputedStatus(e) === EventStatus.UPCOMING).length },
    { name: 'Berlangsung', value: events.filter(e => getComputedStatus(e) === EventStatus.ONGOING).length },
    { name: 'Selesai', value: events.filter(e => getComputedStatus(e) === EventStatus.COMPLETED).length },
    { name: 'Dibatalkan', value: events.filter(e => getComputedStatus(e) === EventStatus.CANCELLED).length },
  ].filter(d => d.value > 0);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
      </div>
    </div>
  );

  const handleRegisterEvent = async (eventId: string) => {
    setLoadingEventId(eventId);
    try {
      await registerForEvent(eventId);
      showToast('Berhasil mendaftar ke kegiatan!', 'success');
    } catch (error) {
      showToast('Gagal mendaftar ke kegiatan.', 'error');
    } finally {
      setLoadingEventId(null);
    }
  };

  // MEMBER VIEW
  if (currentUser?.role === Role.MEMBER) {
    const myEvents = events.filter(e => 
      e.attendees.includes(currentUser.id)
    );
    
    const availableEvents = events.filter(e => 
      getComputedStatus(e) === EventStatus.UPCOMING && 
      !e.attendees.includes(currentUser.id) &&
      (e.division === Division.GENERAL || e.division === currentUser.division)
    );

    return (
      <div className="space-y-8">
        <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
           <h1 className="text-2xl font-bold text-slate-900 mb-2">Selamat Datang, {currentUser.name}! 👋</h1>
           <p className="text-slate-500">
             Anda tergabung dalam divisi <span className="font-semibold text-blue-600">{currentUser.division}</span>. 
             Berikut adalah ringkasan kegiatan Anda.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registered Events */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <CheckCircle2 className="mr-2 text-green-600" size={20} />
              Kegiatan Anda (Terdaftar)
            </h2>
            {myEvents.length > 0 ? (
              myEvents.map(event => (
                <div key={event.id} className="bg-white p-5 rounded-xl border border-green-100 shadow-sm hover:border-green-200 transition-colors">
                   <div className="flex justify-between items-start mb-2">
                     <div className="flex gap-2 flex-wrap">
                       <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-md">Terdaftar</span>
                       <span className={`text-xs font-semibold px-2 py-1 rounded-md ${event.division === Division.GENERAL ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                         Terbuka: {event.division === Division.GENERAL ? 'Semua Divisi' : `Divisi ${event.division}`}
                       </span>
                     </div>
                     <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{event.date}</span>
                   </div>
                   <h3 className="font-bold text-slate-900 mb-1">{event.title}</h3>
                   <div className="flex items-center gap-3 text-sm text-slate-500 mt-2">
                      <span className="flex items-center"><Clock size={14} className="mr-1"/> {event.time}</span>
                      <span className="flex items-center"><MapPin size={14} className="mr-1"/> {event.location}</span>
                   </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 text-center text-slate-500 text-sm">
                Belum ada kegiatan yang diikuti.
              </div>
            )}
          </div>

          {/* Available Events */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <Calendar className="mr-2 text-blue-600" size={20} />
              Kegiatan Lainnya
            </h2>
            {availableEvents.length > 0 ? (
              availableEvents.map(event => (
                <div key={event.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                   <div className="flex justify-between items-start mb-2">
                     <div className="flex gap-2 flex-wrap">
                       {/* Contextual Badge (Terdaftar vs Division) */}
                       {event.attendees.includes(currentUser.id) ? (
                         <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-md">Terdaftar</span>
                       ) : null}
                       
                       <span className={`text-xs font-semibold px-2 py-1 rounded-md ${event.division === Division.GENERAL ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                         Terbuka: {event.division === Division.GENERAL ? 'Semua Divisi' : `Divisi ${event.division}`}
                       </span>
                     </div>
                     <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{event.date}</span>
                   </div>
                   <h3 className="font-bold text-slate-900 mb-1">{event.title}</h3>
                   <p className="text-sm text-slate-600 line-clamp-2 mb-3">{event.description}</p>
                   <button 
                     onClick={() => handleRegisterEvent(event.id)}
                     disabled={loadingEventId === event.id}
                     className="w-full py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-lg text-sm transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                     {loadingEventId === event.id ? (
                       <>
                         <Loader2 className="animate-spin mr-2" size={16} />
                         Memproses...
                       </>
                     ) : (
                       'Gabung Kegiatan'
                     )}
                   </button>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 text-center text-slate-500 text-sm">
                Tidak ada kegiatan baru saat ini.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ADMIN VIEW
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Beranda</h1>
        <span className="text-sm text-slate-500">Selamat datang, {currentUser?.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Anggota" value={totalMembers} icon={Users} color="bg-blue-600" />
        <StatCard title="Kegiatan Aktif" value={totalEvents} icon={Calendar} color="bg-indigo-600" />
        <StatCard title="Tingkat Kehadiran" value={`${attendanceRate}%`} icon={TrendingUp} color="bg-green-600" />
        <StatCard title="Status Aktif" value={activeMembers} icon={Award} color="bg-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members per Division Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Anggota per Divisi</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={divisionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Status Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Distribusi Status Kegiatan</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {eventStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {eventStatusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};