import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Event, Role } from '../types';
import * as authService from '../services/authService';
import * as userService from '../services/userService';
import * as eventService from '../services/eventService';

interface DataContextType {
  currentUser: User | null;
  users: User[];
  events: Event[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  addEvent: (event: Omit<Event, 'id' | 'attendees'>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  registerForEvent: (eventId: string) => Promise<void>;
  updateUserStatus: (userId: string, status: User['status'], role?: Role) => Promise<void>;
  updateUserProfile: (userId: string, data: Partial<User>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetch all data from Supabase (users + events).
   * Called on initial load and after mutations.
   */
  const refreshData = useCallback(async () => {
    try {
      const [fetchedUsers, fetchedEvents] = await Promise.all([
        userService.getUsers(),
        eventService.getEvents(),
      ]);
      setUsers(fetchedUsers);
      setEvents(fetchedEvents);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  }, []);

  /**
   * On mount: check for an existing session, load user profile,
   * and subscribe to auth state changes.
   */
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const session = await authService.getCurrentSession();
        if (session?.user && isMounted) {
          const profile = await authService.getProfile(session.user.id);
          if (profile && isMounted) {
            setCurrentUser(profile);
            await refreshData();
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth state changes (sign in/out, token refresh)
    const subscription = authService.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await authService.getProfile(session.user.id);
        if (profile && isMounted) {
          setCurrentUser(profile);
          await refreshData();
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setUsers([]);
        setEvents([]);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [refreshData]);

  /**
   * Login with email and password.
   * Returns true on success, false on failure.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    const { user } = await authService.signIn(email, password);
    if (user) {
      const profile = await authService.getProfile(user.id);
      if (profile) {
        // Check if the user's account is active
        if (profile.status === 'Menunggu') {
          await authService.signOut();
          throw new Error('Akun Anda sedang menunggu persetujuan admin.');
        }
        if (profile.status === 'Nonaktif') {
          await authService.signOut();
          throw new Error('Akun Anda telah dinonaktifkan.');
        }
        if (profile.status !== 'Aktif') {
          await authService.signOut();
          return false;
        }
        
        setCurrentUser(profile);
        await refreshData();
        return true;
      }
    }
    return false;
  };

  /**
   * Logout the current user.
   */
  const logout = async () => {
    try {
      await authService.signOut();
      setCurrentUser(null);
      setUsers([]);
      setEvents([]);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  /**
   * Register a new user. After signup, the `handle_new_user` trigger
   * in PostgreSQL automatically creates a profiles row.
   */
  const register = async (name: string, email: string, password: string) => {
    try {
      await authService.signUp(email, password, name);
      // Don't log them in — their status will be 'Menunggu' until an admin approves
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  /**
   * Create a new event. Only admins should call this.
   */
  const addEvent = async (eventData: Omit<Event, 'id' | 'attendees'>) => {
    if (!currentUser) return;
    try {
      const newEvent = await eventService.createEvent(eventData, currentUser.id);
      setEvents(prev => [newEvent, ...prev]);
    } catch (err) {
      console.error('Error adding event:', err);
      throw err;
    }
  };

  /**
   * Update an existing event.
   */
  const updateEventHandler = async (updatedEvent: Event) => {
    try {
      const result = await eventService.updateEvent(updatedEvent);
      setEvents(prev => prev.map(e => e.id === result.id ? result : e));
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    }
  };

  /**
   * Delete an event.
   */
  const deleteEventHandler = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  /**
   * Register the current user for an event.
   * Optimistically updates local state, then confirms with the server.
   */
  const registerForEventHandler = async (eventId: string) => {
    if (!currentUser) return;
    try {
      await eventService.registerForEvent(eventId, currentUser.id);
      // Optimistic update
      setEvents(prev =>
        prev.map(e => {
          if (e.id === eventId && !e.attendees.includes(currentUser.id)) {
            return { ...e, attendees: [...e.attendees, currentUser.id] };
          }
          return e;
        })
      );
    } catch (err) {
      console.error('Error registering for event:', err);
      // Revert on error
      await refreshData();
    }
  };

  /**
   * Update a user's status (and optionally role). Used by admins
   * to approve/reject members.
   */
  const updateUserStatusHandler = async (
    userId: string,
    status: User['status'],
    role?: Role
  ) => {
    try {
      const updated = await userService.updateUserStatus(userId, status, role);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (err) {
      console.error('Error updating user status:', err);
      throw err;
    }
  };

  /**
   * Update profile fields for a user.
   */
  const updateUserProfileHandler = async (userId: string, data: Partial<User>) => {
    try {
      const updated = await userService.updateUserProfile(userId, data);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      // If the current user updated their own profile, update that too
      if (currentUser?.id === userId) {
        setCurrentUser(updated);
      }
    } catch (err) {
      console.error('Error updating user profile:', err);
      throw err;
    }
  };

  return (
    <DataContext.Provider value={{
      currentUser,
      users,
      events,
      isLoading,
      login,
      logout,
      register,
      addEvent,
      updateEvent: updateEventHandler,
      deleteEvent: deleteEventHandler,
      registerForEvent: registerForEventHandler,
      updateUserStatus: updateUserStatusHandler,
      updateUserProfile: updateUserProfileHandler,
      refreshData,
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