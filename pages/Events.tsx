import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Event, Role, EventStatus, Division } from '../types';
import { CalendarPlus, MapPin, Calendar, Clock, Sparkles, Trash2, Edit2, Users } from 'lucide-react';
import { generateEventDescription } from '../services/geminiService';

export const Events: React.FC = () => {
  const { events, currentUser, addEvent, updateEvent, deleteEvent, registerForEvent } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [division, setDivision] = useState<Division>(Division.GENERAL);
  const [status, setStatus] = useState<EventStatus>(EventStatus.UPCOMING);

  const isAdmin = currentUser?.role === Role.SUPER_ADMIN || currentUser?.role === Role.DIVISION_ADMIN;

  const handleGenerateDescription = async () => {
    if (!title || !location) {
      alert("Harap masukkan judul dan lokasi terlebih dahulu.");
      return;
    }
    setIsGenerating(true);
    const aiDesc = await generateEventDescription(title, division, location);
    setDescription(aiDesc);
    setIsGenerating(false);
  };

  const handleEdit = (event: Event) => {
    setEditingEventId(event.id);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setDivision(event.division);
    setStatus(event.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEventId) {
      const originalEvent = events.find(e => e.id === editingEventId);
      if (originalEvent) {
        await updateEvent({
          ...originalEvent,
          title,
          description,
          date,
          time,
          location,
          division,
          status,
        });
      }
    } else {
      await addEvent({
        title,
        description,
        date,
        time,
        location,
        division,
        status,
        maxParticipants: 50,
      });
    }
    setIsModalOpen(false);
    resetForm();
  };


  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setLocation('');
    setDivision(Division.GENERAL);
    setStatus(EventStatus.UPCOMING);
    setEditingEventId(null);
  };

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case EventStatus.UPCOMING: return 'bg-blue-100 text-blue-700';
      case EventStatus.ONGOING: return 'bg-green-100 text-green-700';
      case EventStatus.COMPLETED: return 'bg-slate-100 text-slate-700';
      case EventStatus.CANCELLED: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kegiatan</h1>
          <p className="text-slate-500">Kelola dan jelajahi kegiatan organisasi yang akan datang</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            <CalendarPlus size={20} className="mr-2" />
            Buat Kegiatan
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  {event.division}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{event.title}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{event.description}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-slate-500">
                  <Calendar size={16} className="mr-2 text-slate-400" />
                  {event.date}
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <Clock size={16} className="mr-2 text-slate-400" />
                  {event.time}
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <MapPin size={16} className="mr-2 text-slate-400" />
                  {event.location}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center text-sm text-slate-500">
                  <Users size={16} className="mr-1.5" />
                  {event.attendees.length} / {event.maxParticipants || '∞'}
                </div>
                
                <div className="flex gap-2">
                  {isAdmin ? (
                    <>
                      <button 
                        onClick={() => handleEdit(event)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteEvent(event.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => registerForEvent(event.id)}
                      disabled={event.attendees.includes(currentUser?.id || '') || event.status !== EventStatus.UPCOMING}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        event.attendees.includes(currentUser?.id || '')
                          ? 'bg-green-50 text-green-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {event.attendees.includes(currentUser?.id || '') ? 'Terdaftar' : 'Gabung'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">{editingEventId ? 'Edit Kegiatan' : 'Buat Kegiatan Baru'}</h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul Kegiatan</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400"
                  placeholder="Contoh: Rapat Tahunan"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Waktu</label>
                  <input
                    required
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                  <input
                    required
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
                    placeholder="Ruang 101"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Divisi</label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value as Division)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {Object.values(Division).map(div => (
                      <option key={div} value={div}>{div}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  {Object.values(EventStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">Deskripsi</label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="text-xs flex items-center text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <Sparkles size={12} className="mr-1" />
                    {isGenerating ? 'Membuat...' : 'Buat dgn AI'}
                  </button>
                </div>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none placeholder:text-slate-400"
                  placeholder="Jelaskan kegiatan ini..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); resetForm(); }}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-50 font-medium rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  {editingEventId ? 'Simpan Perubahan' : 'Buat Kegiatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};