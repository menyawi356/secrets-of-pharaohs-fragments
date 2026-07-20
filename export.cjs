const admin = require('firebase-admin');
const XLSX = require('xlsx');
const serviceAccount = require('./serviceAccountKey.json'); // download from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function exportToExcel() {
  const snapshot = await db.collection('registrations').get();

  const rows = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Registrations');
  XLSX.writeFile(wb, 'registrations.xlsx');

  console.log(`Exported ${rows.length} registrations`);
}

exportToExcel();