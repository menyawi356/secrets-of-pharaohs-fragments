# What changed — Exam Login & Timer

## 1. Login is now required for /competition
`/competition` is wrapped in `ProtectedRoute`. Anyone not logged in is
redirected to `/login`.

## 2. New login: Team Name + Email (no more magic link)
`src/pages/Login.jsx` was rewritten. A team logs in with:
- **Team Name** (must match a team imported from your spreadsheet)
- **Email** (must match the leader's, member2's, or member3's email for that team)

The old Firebase magic-link login (`auth.js`, `AuthContext.jsx`) is still in
the repo but no longer used by the login page. I left it in place rather
than deleting it, in case you use it elsewhere — it's safe to remove later
if not.

## 3. Importing your 964 teams
Run `import-teams.cjs` once to load `registrations_final_v2.xlsx` into a new
Firestore `teams` collection (separate from your existing `registrations`
collection, so nothing about your current admin dashboard data is touched):

```bash
npm install firebase-admin xlsx
# Download serviceAccountKey.json from Firebase Console > Project Settings
#   > Service Accounts > Generate new private key, save next to this script
node import-teams.cjs registrations_final_v2.xlsx
```

Re-run it any time your registration list changes — it overwrites by team
name, so it's safe to re-run.

Both "✓ VALID" and "⚠ SUSPICIOUS" teams were imported, per your choice — all
964 teams can log in. There were 8 duplicate team names and 1 blank row in
the sheet (the blank row was skipped on import); you may want to resolve the
duplicates by renaming one of each pair before the real exam, since whichever
import wins, the email-match logic still works correctly for both sets of
members as long as the emails differ.

## 4. 75-minute exam window, set live from the Admin Dashboard
Open the Competition page and type `20202062055` (the existing admin
keypress code) to open the dashboard, then go to the new **"Exam Timer"**
tab. Set a date + time there — this is the moment the **whole exam opens
for everyone**, and it automatically closes 75 minutes later. No redeploy
needed; it's stored in a `exam_config` Firestore doc and updates live.

The login page shows participants a live countdown to opening, and once
open, a countdown to closing. After closing, no new logins are accepted.
Already-logged-in teams also see a 75-minute countdown banner on the
Competition page itself and are automatically logged out when time's up.

## 5. Master override code: 106060
Typing `106060` into the **Team Name** field (email can be left blank) logs
you in as an unrestricted admin session — bypassing both the team/email
check and the time window entirely, so you can always get in to test or
monitor, even before the window opens or after it closes.

## 6. Per-question answered/unanswered tracking
Every time a team submits an answer (right or wrong), it's saved to a new
`progress` Firestore collection. The Admin Dashboard's new **"Progress"**
tab shows, per team: how many of the 45 questions are answered, how many
correct, and which question IDs are still untouched.

---

## Things you should know before the real exam (not changed, flagging for you)

1. **Quiz answers are visible in the browser's source.**
   `src/data/storyData.json` ships the correct answer for every question to
   every participant's browser. Anyone moderately technical can open dev
   tools and read every answer before the exam starts. This was already
   true before my changes — I didn't touch storyData.json. If you want this
   fixed (e.g. moving answer-checking server-side via a Cloud Function), let
   me know and I can help with a follow-up.

2. **No real backend authentication for admin actions.**
   The "admin" mechanisms (the `20202062055` keypress code, and the new
   `106060` master login code) are both just values checked in the browser.
   Anyone who reads the deployed JS bundle can find them. Likewise, the new
   `teams`, `progress`, and `exam_config` Firestore collections currently
   allow open writes (see `firestore.rules`) because there's no real signed-in
   admin account to restrict writes to. In practice this means a
   sufficiently curious participant could, in theory, open dev tools and
   write directly to Firestore — e.g. mark their own questions "correct," or
   change the exam start time. This mirrors the security model already
   present in the app (the existing admin code has the same property), so
   I haven't introduced a new weakness, but you should know the limit of
   what this protects against: it deters casual users, not a determined
   technical one. If this matters for your event (e.g. real prizes/rankings
   at stake), the fix is adding real Firebase Auth + custom claims for the
   admin and Cloud Functions for grading — happy to help if you want that.

3. **Duplicate team names (8 pairs) and 1 blank row** exist in the
   spreadsheet; consider asking those teams to confirm/rename before exam day.
