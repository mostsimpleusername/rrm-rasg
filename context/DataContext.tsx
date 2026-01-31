import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Event, Role, Division, EventStatus } from '../types';

// Mock Data
const MOCK_USERS: User[] = [
  { id: '1', name: 'Akmal Admin', email: 'admin@org.com', role: Role.SUPER_ADMIN, division: Division.GENERAL, status: 'Aktif', joinDate: '2023-01-01' },
  { id: '2', name: 'Bowo SDM', email: 'wit@org.com', role: Role.DIVISION_ADMIN, division: Division.HR, status: 'Aktif', joinDate: '2023-02-15' },
  { id: '3', name: 'Raka Anggota', email: 'fufu@org.com', role: Role.MEMBER, division: Division.RISTEK, status: 'Aktif', joinDate: '2023-03-10' },
  { id: '4', name: 'Mulyo Tech', email: 'mul@org.com', role: Role.MEMBER, division: Division.RISTEK, status: 'Menunggu', joinDate: '2023-11-05' },
];

const MOCK_EVENTS: Event[] = [
  { id: '101', title: 'Kick Off Moment 2026', description: 'Saatnya kita memulai perjalanan besar di tahun 2026 melalui Kick Off Moment 2026. Acara ini menjadi momentum awal untuk menyatukan visi, energi, dan langkah perjuangan kita bersama 🤝', date: '2026-02-01', time: '08:30', location: 'Dapur Kadtenjo', division: Division.HR, status: EventStatus.UPCOMING, attendees: ['1', '3'], maxParticipants: 100 },
  { id: '102', title: 'Workshop Kesehatan Mental', description: 'Belajar menjaga kesehatan mental yang baik.', date: '2023-12-10', time: '14:00', location: 'Ruang 303', division: Division.KESEHATAN, status: EventStatus.COMPLETED, attendees: ['1', '2', '3'], maxParticipants: 50 },
];

interface DataContextType {
  currentUser: User | null;
  users: User[];
  events: Event[];
  login: (email: string) => boolean;
  logout: () => void;
  register: (name: string, email: string) => void;
  addEvent: (event: Omit<Event, 'id' | 'attendees'>) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  registerForEvent: (eventId: string) => void;
  updateUserStatus: (userId: string, status: User['status'], role?: Role) => void;
  updateUserProfile: (userId: string, data: Partial<User>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);

  // Simulate session persistence
  useEffect(() => {
    const savedUserId = localStorage.getItem('orgSync_userId');
    if (savedUserId) {
      const user = users.find(u => u.id === savedUserId);
      if (user) setCurrentUser(user);
    }
  }, []);

  const login = (email: string): boolean => {
    const user = users.find(u => u.email === email && u.status === 'Aktif');
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('orgSync_userId', user.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('orgSync_userId');
  };

  const register = (name: string, email: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: Role.MEMBER,
      division: Division.GENERAL, // Default
      status: 'Menunggu', // Needs approval
      joinDate: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
  };

  const addEvent = (eventData: Omit<Event, 'id' | 'attendees'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      attendees: [],
    };
    setEvents([newEvent, ...events]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const registerForEvent = (eventId: string) => {
    if (!currentUser) return;
    setEvents(events.map(e => {
      if (e.id === eventId) {
        const isAttending = e.attendees.includes(currentUser.id);
        if (isAttending) return e; // Already registered
        return { ...e, attendees: [...e.attendees, currentUser.id] };
      }
      return e;
    }));
  };

  const updateUserStatus = (userId: string, status: User['status'], role?: Role) => {
    setUsers(prevUsers => {
      const newUsers = prevUsers.map(u => {
        if (u.id === userId) {
          return { ...u, status, ...(role ? { role } : {}) };
        }
        return u;
      });
      return newUsers;
    });
  };

  const updateUserProfile = (userId: string, data: Partial<User>) => {
    setUsers(prevUsers => {
      const newUsers = prevUsers.map(u => {
        if (u.id === userId) {
          const updated = { ...u, ...data };
          if (currentUser?.id === userId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      });
      return newUsers;
    });
  };

  return (
    <DataContext.Provider value={{
      currentUser, users, events,
      login, logout, register,
      addEvent, updateEvent, deleteEvent, registerForEvent, updateUserStatus, updateUserProfile
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};