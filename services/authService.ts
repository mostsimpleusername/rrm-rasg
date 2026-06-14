import { supabase } from './supabaseClient';
import { mapProfileToUser } from './mappers';
import { User } from '../types';
import type { AuthChangeEvent, Session, Subscription } from '@supabase/supabase-js';

/**
 * Sign up a new user with email, password, and name.
 * The name is stored in `raw_user_meta_data` so the `handle_new_user`
 * trigger can populate the `profiles` table automatically.
 */
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: 'https://rrm-rasg.vercel.app',
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in with email and password.
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get the current session (if any).
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

/**
 * Fetch a user's profile from the `profiles` table and map it
 * to the app's `User` interface.
 */
export async function getProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return mapProfileToUser(data);
}

/**
 * Subscribe to auth state changes (sign in, sign out, token refresh, etc.)
 */
export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): Subscription {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
  return subscription;
}
