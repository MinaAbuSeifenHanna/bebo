// sync-services-to-firestore.js
// Syncs local services.json data to Firestore
// Uses Firebase Firestore Web SDK v9+ (modular)

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, deleteDoc, setDoc, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBC_JeNjLiTvVrIL-9XERpGigWmaYbnZB0",
    authDomain: "world-spa-c1e6e.firebaseapp.com",
    projectId: "world-spa-c1e6e",
    storageBucket: "world-spa-c1e6e.firebasestorage.app",
    messagingSenderId: "939154414480",
    appId: "1:939154414480:web:268a7add29eaa8b8ee3115",
    measurementId: "G-QV6W5DFCP9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Syncs services.json data to Firestore
 * @param {string} email - Firebase admin email (optional, uses env if not provided)
 * @param {string} password - Firebase admin password (optional, uses env if not provided)
 */
async function syncServicesToFirestore(email = null, password = null) {
    console.log('🔄 Starting sync: services.json → Firestore');

    try {
        // Authenticate
        const adminEmail = email || process.env.FIREBASE_EMAIL || 'admin@tech.com';
        const adminPassword = password || process.env.FIREBASE_PASSWORD || '12345678';

        console.log(`🔐 Authenticating with ${adminEmail}...`);
        await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        console.log('✅ Authenticated successfully');

        // Load services.json
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const servicesJsonPath = path.join(__dirname, 'service.json');

        console.log(`📂 Loading data from: ${servicesJsonPath}`);
        const jsonData = fs.readFileSync(servicesJsonPath, 'utf8');
        const services = JSON.parse(jsonData);

        if (!Array.isArray(services)) {
            throw new Error('services.json must contain an array');
        }

        console.log(`📊 Found ${services.length} services to sync`);

        // Get services collection reference
        const servicesRef = collection(db, 'services');

        // Step 1: Delete all existing documents
        console.log('🗑️  Deleting all existing documents...');
        const existingDocs = await getDocs(servicesRef);
        const deletePromises = [];

        existingDocs.forEach((docSnapshot) => {
            deletePromises.push(deleteDoc(doc(servicesRef, docSnapshot.id)));
        });

        await Promise.all(deletePromises);
        console.log(`✅ Deleted ${deletePromises.length} existing document(s)`);

        // Step 2: Upload all services from JSON
        console.log('📤 Uploading services to Firestore...');
        let successCount = 0;
        let errorCount = 0;

        for (const service of services) {
            try {
                // Validate that service has an id
                if (!service.id) {
                    console.warn(`⚠️  Skipping service without id:`, service);
                    errorCount++;
                    continue;
                }

                // Use the id field as the document ID
                const serviceDoc = doc(servicesRef, service.id.toString());

                // Upload the service (image paths remain as strings)
                await setDoc(serviceDoc, service);

                successCount++;
                const serviceTitle = service.translations?.en?.title || service.title || `Service ${service.id}`;
                console.log(`✅ Uploaded: ${service.id} - ${serviceTitle}`);
            } catch (error) {
                errorCount++;
                console.error(`❌ Error uploading service ${service.id}:`, error.message);
            }
        }

        console.log('\n📊 Sync Summary:');
        console.log(`   ✅ Successfully uploaded: ${successCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log(`   📝 Total processed: ${services.length}`);
        console.log('\n✅ Sync completed successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Sync failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Run the sync
// Usage: node --input-type=module js/sync-services-to-firestore.js
// Or with credentials: 
//   PowerShell: $env:FIREBASE_EMAIL="email"; $env:FIREBASE_PASSWORD="password"; node --input-type=module js/sync-services-to-firestore.js
//   Linux/Mac: FIREBASE_EMAIL=email FIREBASE_PASSWORD=password node --input-type=module js/sync-services-to-firestore.js

syncServicesToFirestore();

