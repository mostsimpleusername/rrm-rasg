import { supabase } from './supabaseClient';
import { mapProfileToUser, mapUserUpdateToProfile, mapRoleToDbRole } from './mappers';
import { User, Role } from '../types';

/**
 * Fetch all user profiles and map them to the app's User interface.
 */
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

  return (data ?? []).map(mapProfileToUser);
}

/**
 * Update a user's status and optionally their role.
 */
export async function updateUserStatus(
  userId: string,
  status: User['status'],
  role?: Role
): Promise<User> {
  const updateData: Record<string, any> = { status };
  if (role) {
    updateData.role = mapRoleToDbRole(role);
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user status:', error);
    throw error;
  }

  return mapProfileToUser(data);
}

/**
 * Update profile fields for a user.
 * Maps app-level field names (camelCase) to DB column names (snake_case).
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<User>
): Promise<User> {
  const dbData = mapUserUpdateToProfile(data);

  const { data: updated, error } = await supabase
    .from('profiles')
    .update(dbData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }

  return mapProfileToUser(updated);
}
