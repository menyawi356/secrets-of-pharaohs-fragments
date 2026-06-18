import { db } from './firebase';
import {
  doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp, onSnapshot
} from 'firebase/firestore';

// ─── CONFIG ─────────────────────────────────────────────────────────────────
// Master override code: typed into the "Team Name" field on the login page.
// Bypasses BOTH the team/email check and the exam time window.
// Change this if you suspect it has leaked.
export const MASTER_CODE = '106060';

// Firestore doc that stores when the exam window opens. Editable live from
// the Admin Dashboard — no redeploy needed.
const CONFIG_DOC = doc(db, 'exam_config', 'main');
export const EXAM_DURATION_MINUTES = 75;

function normTeamKey(name) {
  return (name || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');
}
function normEmail(email) {
  return (email || '').toString().trim().toLowerCase();
}

// ─── EXAM WINDOW ────────────────────────────────────────────────────────────

// Reads the configured start time. Returns null if not set yet.
export async function getExamConfig() {
  const snap = await getDoc(CONFIG_DOC);
  if (!snap.exists()) return { startTime: null };
  const data = snap.data();
  return { startTime: data.startTime ? data.startTime.toDate() : null };
}

// Subscribe to live changes (used so the login page updates immediately if
// the admin sets/changes the start time while someone is sitting on the page).
export function subscribeExamConfig(callback) {
  return onSnapshot(CONFIG_DOC, (snap) => {
    if (!snap.exists()) {
      callback({ startTime: null });
    } else {
      const data = snap.data();
      callback({ startTime: data.startTime ? data.startTime.toDate() : null });
    }
  });
}

// Admin-only write: set the exam start time (Date object).
export async function setExamStartTime(date) {
  await setDoc(CONFIG_DOC, { startTime: date }, { merge: true });
}

// Returns 'not_started' | 'open' | 'closed'
export function getExamWindowStatus(startTime) {
  if (!startTime) return 'not_started';
  const now = new Date();
  const end = new Date(startTime.getTime() + EXAM_DURATION_MINUTES * 60 * 1000);
  if (now < startTime) return 'not_started';
  if (now > end) return 'closed';
  return 'open';
}

// ─── TEAM LOGIN ─────────────────────────────────────────────────────────────

/**
 * Attempts to log a team in.
 * Returns { success: true, team, isAdmin } or { success: false, error }.
 */
export async function teamLogin(teamNameInput, emailInput) {
  const teamNameRaw = (teamNameInput || '').toString().trim();
  const email = normEmail(emailInput);

  // Master override: typed as the "team name", bypasses everything.
  if (teamNameRaw === MASTER_CODE) {
    return { success: true, isAdmin: true, team: { team_name: 'ADMIN', team_key: 'admin' } };
  }

  if (!teamNameRaw) {
    return { success: false, error: 'Please enter your team name.' };
  }
  if (!email) {
    return { success: false, error: 'Please enter your email.' };
  }

  // Check the exam window before doing anything else (admin code above
  // already bypassed this check by returning early).
  const { startTime } = await getExamConfig();
  const status = getExamWindowStatus(startTime);
  if (status === 'not_started') {
    return { success: false, error: 'The exam has not started yet. Please wait for the start time to be announced.' };
  }
  if (status === 'closed') {
    return { success: false, error: 'The exam login window has closed. No further entries are accepted.' };
  }

  const teamKey = normTeamKey(teamNameRaw);
  const ref = doc(db, 'teams', encodeURIComponent(teamKey));
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return { success: false, error: 'Team not found. Please check your team name and try again.' };
  }

  const team = snap.data();
  if (!team.emails || !team.emails.includes(email)) {
    return { success: false, error: 'That email does not match any member of this team.' };
  }

  return { success: true, isAdmin: false, team };
}

// ─── PROGRESS TRACKING ──────────────────────────────────────────────────────

/**
 * Marks a question as answered/unanswered for a team. Stored at
 * progress/{team_key} as a map of { [questionId]: { status, answeredAt } }
 */
export async function saveQuestionProgress(teamKey, questionId, status) {
  const ref = doc(db, 'progress', encodeURIComponent(teamKey));
  await setDoc(ref, {
    team_key: teamKey,
    updated_at: serverTimestamp(),
    answers: {
      [questionId]: { status, answeredAt: serverTimestamp() }
    }
  }, { merge: true });
}

export async function getTeamProgress(teamKey) {
  const ref = doc(db, 'progress', encodeURIComponent(teamKey));
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Live subscription to ALL teams' progress, for the admin dashboard.
export function subscribeAllProgress(callback) {
  return onSnapshot(collection(db, 'progress'), (snap) => {
    const all = {};
    snap.forEach(d => { all[d.id] = d.data(); });
    callback(all);
  });
}
