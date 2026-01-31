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