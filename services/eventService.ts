import { supabase } from './supabaseClient';
import { mapDbEventToEvent, mapEventToDbEvent } from './mappers';
import { Event } from '../types';

/**
 * Fetch all events with their attendees.
 * Uses Supabase's relation syntax to also pull event_attendees in a single query.
 */
export async function getEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*, event_attendees(user_id)')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return (data ?? []).map(mapDbEventToEvent);
}

/**
 * Fetch a single event by ID, with attendees.
 */
export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*, event_attendees(user_id)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }

  return mapDbEventToEvent(data);
}

/**
 * Create a new event. Attendees are managed separately via event_attendees.
 */
export async function createEvent(
  eventData: Omit<Event, 'id' | 'attendees'>,
  createdBy: string
): Promise<Event> {
  const dbData = {
    ...mapEventToDbEvent(eventData),
    created_by: createdBy,
  };

  const { data, error } = await supabase
    .from('events')
    .insert(dbData)
    .select('*, event_attendees(user_id)')
    .single();

  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }

  return mapDbEventToEvent(data);
}

/**
 * Update an existing event by ID.
 */
export async function updateEvent(event: Event): Promise<Event> {
  const dbData = mapEventToDbEvent(event);

  const { data, error } = await supabase
    .from('events')
    .update(dbData)
    .eq('id', event.id)
    .select('*, event_attendees(user_id)')
    .single();

  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }

  return mapDbEventToEvent(data);
}

/**
 * Delete an event by ID.
 */
export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
}

/**
 * Register a user for an event (add to event_attendees).
 */
export async function registerForEvent(
  eventId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('event_attendees')
    .insert({
      event_id: eventId,
      user_id: userId,
    });

  if (error) {
    // Ignore unique constraint violation (already registered)
    if (error.code === '23505') {
      console.warn('User is already registered for this event');
      return;
    }
    console.error('Error registering for event:', error);
    throw error;
  }
}

/**
 * Unregister a user from an event (remove from event_attendees).
 */
export async function unregisterFromEvent(
  eventId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from('event_attendees')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error unregistering from event:', error);
    throw error;
  }
}
