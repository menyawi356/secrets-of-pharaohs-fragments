/**
 * Import teams from the registrations Excel file into Firestore.
 *
 * Run this ONCE (or whenever your registration list changes) from a machine
 * with Node installed:
 *
 *   1. npm install firebase-admin xlsx
 *   2. Download your Firebase service account key from:
 *      Firebase Console > Project Settings > Service Accounts > Generate new private key
 *      Save it next to this file as serviceAccountKey.json
 *   3. Put your registrations file next to this script (default name below)
 *   4. node import-teams.cjs
 *
 * This writes one document per team into the `teams` collection, keyed by
 * a normalized team name, with an `emails` array containing every member's
 * email (lowercased) so the login page can match on ANY team member's email.
 *
 * It does NOT touch the existing `registrations` collection used by the
 * admin dashboard — this is a separate collection used only for exam login.
 */
const admin = require('firebase-admin');
const XLSX = require('xlsx');
const serviceAccount = require('./serviceAccountKey.json');

const EXCEL_FILE = process.argv[2] || 'registrations_final_v2.xlsx';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

function norm(v) {
  return (v ?? '').toString().trim();
}
function normEmail(v) {
  return norm(v).toLowerCase();
}
// Same normalization the login page will use, so lookups match exactly.
function normTeamKey(name) {
  return norm(name).toLowerCase().replace(/\s+/g, ' ');
}

async function run() {
  const wb = XLSX.readFile(EXCEL_FILE);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

  let written = 0;
  let skipped = 0;
  const batchSize = 400; // Firestore batch limit is 500
  let batch = db.batch();
  let opsInBatch = 0;

  for (const r of rows) {
    const teamName = norm(r.team_name);
    if (!teamName) { skipped++; continue; }

    const emails = [r.leader_email, r.member2_email, r.member3_email]
      .map(normEmail)
      .filter(Boolean);

    const docData = {
      team_name: teamName,
      team_key: normTeamKey(teamName),
      emails,
      leader_name: norm(r.leader_name),
      leader_email: normEmail(r.leader_email),
      leader_school: norm(r.leader_school),
      leader_country: norm(r.leader_country),
      member2_name: norm(r.member2_name),
      member2_email: normEmail(r.member2_email),
      member3_name: norm(r.member3_name),
      member3_email: normEmail(r.member3_email),
      status: norm(r.STATUS || r.status),
      imported_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Doc ID = normalized team key so duplicates overwrite cleanly on re-import.
    const ref = db.collection('teams').doc(encodeURIComponent(docData.team_key));
    batch.set(ref, docData, { merge: true });
    opsInBatch++;
    written++;

    if (opsInBatch >= batchSize) {
      await batch.commit();
      batch = db.batch();
      opsInBatch = 0;
      console.log(`Committed ${written} so far...`);
    }
  }

  if (opsInBatch > 0) {
    await batch.commit();
  }

  console.log(`Done. Imported ${written} teams, skipped ${skipped} blank rows.`);
}

run().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
