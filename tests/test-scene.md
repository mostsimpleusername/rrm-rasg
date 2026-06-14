# Test Scene: RRM-RASG Manual Test Scenarios

This document provides a manual test scene for the RRM-RASG application with 18 test cases that match the current codebase behavior.

## Setup

- Run `supabase/schema.sql`
- Run `supabase/seed.sql`
- Recommended: run `supabase/seed_dummy.sql` for richer member and event data
- Start the app with `npm run dev`
- Use a brand-new email for signup testing on each run

## Test Data

- `admin@org.com` / `password123` -> Super Admin
- `wit@org.com` / `password123` -> Admin Divisi HR
- `fufu@org.com` / `password123` -> Anggota Ristek
- `kesehatan@org.com` / `password123` -> Admin Divisi Kesehatan
- `member1@org.com` / `password123` -> Anggota HR
- `member2@org.com` / `password123` -> Anggota Ristek
- `member3@org.com` / `password123` -> Anggota Kesehatan, status `Nonaktif`
- `new@org.com` / `password123` -> Anggota baru, status `Menunggu`
- `NEW_MEMBER_EMAIL` -> new email that has never been registered before
- `NEW_MEMBER_PASSWORD` -> password with at least 6 characters
- `INVALID_PASSWORD` -> any wrong password for negative login testing

## Notes

- This test scene assumes the seeded accounts above are working again
- The signup flow is included as part of the test run
- After signup, the new profile should remain in status `Menunggu` until approved by an admin

## Test Cases

| ID | Scenario | Preconditions | Steps | Expected Result |
| --- | --- | --- | --- | --- |
| TS-01 | Registration validation for short password | User is on login page | Switch to `Buat akun`, fill name and email, enter password shorter than 6 characters, submit | Registration is blocked and an error toast states password must be at least 6 characters |
| TS-02 | New registration success flow | `NEW_MEMBER_EMAIL` has never been registered | Switch to `Buat akun`, fill valid name, `NEW_MEMBER_EMAIL`, and `NEW_MEMBER_PASSWORD`, then submit | Success toast appears, form returns to login mode, and the new account awaits admin approval |
| TS-03 | Login blocked for pending user | TS-02 completed successfully | Login with `NEW_MEMBER_EMAIL` and `NEW_MEMBER_PASSWORD` | Login is rejected, user remains on login page, and an error toast mentions admin approval |
| TS-04 | Login validation for empty credentials | User is on login page | Click `Masuk` without email and password | Submission is blocked and an error toast asks the user to enter email and password |
| TS-05 | Login blocked for wrong password | `admin@org.com` exists | Enter `admin@org.com` and `INVALID_PASSWORD`, then submit | Login is rejected and the user remains on login page |
| TS-06 | Login success for active Super Admin | Seeded accounts are loaded | Login with `admin@org.com` and `password123` | User is logged in and admin menus including `Anggota` are visible |
| TS-07 | Login blocked for seeded pending user | Seeded dummy accounts are loaded | Login with `new@org.com` and `password123` | Login is rejected and an error toast mentions admin approval |
| TS-08 | Login blocked for seeded inactive user | Seeded dummy accounts are loaded | Login with `member3@org.com` and `password123` | Login is rejected and an error toast says account is disabled |
| TS-09 | Members page is visible for admins only | TS-06 completed successfully | Open `Anggota` page | Members management table is visible with search, division filter, and action buttons |
| TS-10 | Admin can approve newly registered user | TS-02 and TS-06 completed successfully | Open `Anggota`, find `NEW_MEMBER_EMAIL`, click approve, optionally adjust division and role, save | User status becomes `Aktif`, success toast appears, and the approved user remains in the list |
| TS-11 | Approved user can log in successfully | TS-10 completed successfully | Log out, then log in with `NEW_MEMBER_EMAIL` and `NEW_MEMBER_PASSWORD` | Login succeeds and the member dashboard loads |
| TS-12 | Member navigation is restricted | Log in as `fufu@org.com` or the approved test member | Observe sidebar after login | `Anggota` menu is not shown for member role |
| TS-13 | Division Admin only sees users from own division | Login as `wit@org.com` | Open `Anggota`, inspect list | Only users from division `HR` are shown |
| TS-14 | Admin can create a general event | Log in as `admin@org.com` | Open `Kegiatan`, click `Buat Kegiatan`, fill form with target `Semua Divisi (Umum)`, submit | Event is created, success toast appears, and the new event card is visible |
| TS-15 | Division Admin can create an event only for own division | Log in as `wit@org.com` | Open `Kegiatan`, create an event | Target division selector only allows the admin's own division and the event saves successfully |
| TS-16 | Member can join upcoming general or matching division event | Log in as `fufu@org.com` or another active seeded member, ensure an upcoming matching event exists | Open `Dashboard` or `Kegiatan`, click join and confirm | Registration succeeds, success toast appears, and the event shows as registered or attendee count increases |
| TS-17 | Member cannot join completed or cancelled event | Log in as an active member, ensure a `Selesai` or `Dibatalkan` event is visible | Open `Kegiatan` page and inspect action button | Join action is disabled and the event shows a non-joinable state such as `Selesai` or `Dibatalkan` |
| TS-18 | Event visibility differs by role | Log in once as `admin@org.com` and once as `fufu@org.com` | Compare visible event cards on `Kegiatan` | Admin sees all events; member only sees `Umum` events and events matching the member's division |

## Suggested Coverage Summary

- Authentication: TS-01 to TS-06
- Role and access control: TS-07 to TS-13
- Event management and participation: TS-14 to TS-18
