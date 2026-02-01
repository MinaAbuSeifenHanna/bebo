import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// إعداد المسارات لتعمل في أي مكان
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// تأكد أن الملفات موجودة في نفس مجلد السكريبت (مجلد js)
const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');
const dataPath = join(__dirname, 'service.json');

// تحميل المفتاح
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadData() {
  try {
    const data = JSON.parse(readFileSync(dataPath, 'utf8'));
    const collectionName = 'services';

    for (const item of data) {
      await db.collection(collectionName).doc(item.id.toString()).set(item);
      console.log(`✅ Uploaded: ${item.id}`);
    }
    console.log('🚀 Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

uploadData();