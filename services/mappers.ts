import { Role, Division, User, Event, EventStatus } from '../types';

// ─── Role Mappers ────────────────────────────────────────────────────────────

const dbRoleToRoleMap: Record<string, Role> = {
  super_admin: Role.SUPER_ADMIN,
  division_admin: Role.DIVISION_ADMIN,
  member: Role.MEMBER,
};

const roleToDbRoleMap: Record<Role, string> = {
  [Role.SUPER_ADMIN]: 'super_admin',
  [Role.DIVISION_ADMIN]: 'division_admin',
  [Role.MEMBER]: 'member',
};

/** Convert a DB `user_role` value to the app `Role` enum. */
export function mapDbRoleToRole(dbRole: string): Role {
  const role = dbRoleToRoleMap[dbRole];
  if (!role) {
    console.warn(`Unknown DB role "${dbRole}", defaulting to MEMBER`);
    return Role.MEMBER;
  }
  return role;
}

/** Convert an app `Role` enum value to the DB `user_role` string. */
export function mapRoleToDbRole(role: Role): string {
  const dbRole = roleToDbRoleMap[role];
  if (!dbRole) {
    console.warn(`Unknown app role "${role}", defaulting to "member"`);
    return 'member';
  }
  return dbRole;
}

// ─── Division Mappers ────────────────────────────────────────────────────────

/**
 * Convert a DB `division_type` value to the app `Division` enum.
 * Values match directly between DB and app.
 */
export function mapDbDivisionToDivision(dbDivision: string): Division {
  const values = Object.values(Division) as string[];
  if (values.includes(dbDivision)) {
    return dbDivision as Division;
  }
  console.warn(`Unknown DB division "${dbDivision}", defaulting to GENERAL`);
  return Division.GENERAL;
}

/**
 * Convert an app `Division` enum value to the DB `division_type` string.
 * Values match directly between DB and app.
 */
export function mapDivisionToDbDivision(division: Division): string {
  return division as string;
}

// ─── EventStatus Mappers ─────────────────────────────────────────────────────

/**
 * Convert a DB `event_status` value to the app `EventStatus` enum.
 * Values match directly between DB and app.
 */
export function mapDbStatusToEventStatus(dbStatus: string): EventStatus {
  const values = Object.values(EventStatus) as string[];
  if (values.includes(dbStatus)) {
    return dbStatus as EventStatus;
  }
  console.warn(`Unknown DB event status "${dbStatus}", defaulting to UPCOMING`);
  return EventStatus.UPCOMING;
}

// ─── Profile ↔ User Mappers ─────────────────────────────────────────────────

/** Convert a DB `profiles` row to the app `User` interface. */
export function mapProfileToUser(profile: any): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: mapDbRoleToRole(profile.role),
    division: mapDbDivisionToDivision(profile.division),
    status: profile.status as User['status'],
    joinDate: profile.join_date,
    avatar: profile.avatar_url ?? undefined,
  };
}

/**
 * Convert a partial app `User` update to a DB `profiles` column format.
 * Maps camelCase field names to snake_case DB column names and converts
 * enum values to their DB equivalents.
 */
export function mapUserUpdateToProfile(data: Partial<User>): Record<string, any> {
  const dbData: Record<string, any> = {};

  if (data.name !== undefined) dbData.name = data.name;
  if (data.email !== undefined) dbData.email = data.email;
  if (data.role !== undefined) dbData.role = mapRoleToDbRole(data.role);
  if (data.division !== undefined) dbData.division = mapDivisionToDbDivision(data.division);
  if (data.status !== undefined) dbData.status = data.status;
  if (data.joinDate !== undefined) dbData.join_date = data.joinDate;
  if (data.avatar !== undefined) dbData.avatar_url = data.avatar;

  return dbData;
}

// ─── Event Mappers ───────────────────────────────────────────────────────────

/**
 * Convert a DB `events` row (with nested `event_attendees`) to the app `Event` interface.
 * Expects `dbEvent.event_attendees` to be an array of `{ user_id: string }`.
 */
export function mapDbEventToEvent(dbEvent: any): Event {
  const attendees: string[] = Array.isArray(dbEvent.event_attendees)
    ? dbEvent.event_attendees.map((a: any) => a.user_id)
    : [];

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    date: dbEvent.date,
    time: dbEvent.time,
    location: dbEvent.location,
    division: mapDbDivisionToDivision(dbEvent.division),
    status: mapDbStatusToEventStatus(dbEvent.status),
    attendees,
    maxParticipants: dbEvent.max_participants ?? undefined,
  };
}

/**
 * Convert a partial app `Event` to DB `events` column format.
 * Strips out the `attendees` array (managed via `event_attendees` table).
 */
export function mapEventToDbEvent(event: Partial<Event>): Record<string, any> {
  const dbData: Record<string, any> = {};

  if (event.title !== undefined) dbData.title = event.title;
  if (event.description !== undefined) dbData.description = event.description;
  if (event.date !== undefined) dbData.date = event.date;
  if (event.time !== undefined) dbData.time = event.time;
  if (event.location !== undefined) dbData.location = event.location;
  if (event.division !== undefined) dbData.division = mapDivisionToDbDivision(event.division);
  if (event.status !== undefined) dbData.status = event.status;
  if (event.maxParticipants !== undefined) dbData.max_participants = event.maxParticipants;

  return dbData;
}
