export enum Role {
  SUPER_ADMIN = 'Super Admin',
  DIVISION_ADMIN = 'Admin Divisi',
  MEMBER = 'Anggota',
}

export enum Division {
  HR = 'HR',
  LINGKUNGAN = 'Lingkungan',
  MEDIA = 'Media',
  RISTEK = 'Ristek',
  KESEHATAN = 'Kesehatan',
  PENDIDIKAN = 'Pendidikan',
  GENERAL = 'Umum',
}

export enum EventStatus {
  UPCOMING = 'Akan Datang',
  ONGOING = 'Berlangsung',
  COMPLETED = 'Selesai',
  CANCELLED = 'Dibatalkan',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  division: Division;
  status: 'Aktif' | 'Nonaktif' | 'Menunggu';
  joinDate: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  division: Division;
  status: EventStatus;
  attendees: string[]; // User IDs
  maxParticipants?: number;
}

export interface DashboardStats {
  totalMembers: number;
  totalEvents: number;
  attendanceRate: number;
  membersPerDivision: { name: string; count: number }[];
}

export const getComputedStatus = (event: Event): EventStatus => {
  if (event.status === EventStatus.CANCELLED) return EventStatus.CANCELLED;
  
  const now = new Date();
  // Combine date and time
  const [hours, minutes] = event.time.split(':').map(Number);
  const eventStart = new Date(event.date);
  eventStart.setHours(hours, minutes, 0, 0);
  
  const eventEnd = new Date(eventStart.getTime() + 3 * 60 * 60 * 1000); // 3 hours duration

  if (now < eventStart) {
    return EventStatus.UPCOMING;
  } else if (now >= eventStart && now <= eventEnd) {
    return EventStatus.ONGOING;
  } else {
    return EventStatus.COMPLETED;
  }
};