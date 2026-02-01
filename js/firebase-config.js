// firebase-config.js - Firebase configuration and initialization
// Firebase Web SDK v9 compat version (no modules)

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAaaqyV5JcH7N3CWQpNAjGo7YT76S11nU",
  authDomain: "world-spa-3b7ef.firebaseapp.com",
  projectId: "world-spa-3b7ef",
  storageBucket: "world-spa-3b7ef.firebasestorage.app",
  messagingSenderId: "635731087930",
  appId: "1:635731087930:web:9866131dfbc5831d909b03",
  measurementId: "G-3WT5DZ51DX"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Export Firebase instances to window
window.firebaseDB = db;
window.firebaseApp = app;

console.log('🔥 Firebase initialized successfully');

// Helper function to get services collection
function getServicesCollection() {
  return window.firebaseDB.collection('services');
}

// Helper function to listen to real-time updates
function listenToServices(callback) {
  // We grab by ID but string sorting is unreliable for numbers (1, 10, 2)
  const servicesQuery = getServicesCollection().orderBy('id', 'asc');

  return servicesQuery.onSnapshot((snapshot) => {
    const services = [];
    snapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() });
    });

    // Client-side numerical sort to ensure 1, 2, 3... 10... 27 order
    services.sort((a, b) => {
      return (parseInt(a.id) || 0) - (parseInt(b.id) || 0);
    });

    callback(services);
  }, (error) => {
    console.error('❌ Firebase listener error:', error);
    callback([]);
  });
}

// Helper function to listen to real-time updates for Salon services
function listenToSalon(callback) {
  const salonQuery = window.firebaseDB.collection('salon').orderBy('id', 'asc');

  return salonQuery.onSnapshot((snapshot) => {
    const services = [];
    snapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() });
    });

    // Client-side sort similar to main services
    services.sort((a, b) => {
      // IDs are strings "salon-1", "salon-2". Extract number.
      const numA = parseInt(a.id.replace('salon-', '')) || 0;
      const numB = parseInt(b.id.replace('salon-', '')) || 0;
      return numA - numB;
    });

    callback(services);
  }, (error) => {
    console.error('❌ Firebase Salon listener error:', error);
    callback([]);
  });
}

// Export helper functions
window.getServicesCollection = getServicesCollection;
window.listenToServices = listenToServices;
window.listenToSalon = listenToSalon;

// Migration function - run this in console to migrate data
window.migrateToFirestore = async function () {
  console.log('🔥 Starting migration to Firestore...');

  try {
    // Check if Firebase is initialized
    if (!window.firebaseDB) {
      console.error('❌ Firebase not initialized');
      return;
    }

    // Get existing services data from Firebase (already migrated)
    const services = window.allServices || [];

    if (services.length === 0) {
      console.error('❌ No services data found. Firebase may not be loaded yet.');
      return;
    }

    console.log(`📊 Found ${services.length} services to migrate`);

    // Add categories to services
    const categorizedServices = services.map((service) => {
      let category = 'packages';

      if (service.title.en.includes('Hammam')) {
        category = 'hammam';
      } else if (service.title.en.includes('Massage') && !service.title.en.includes('Hammam')) {
        category = 'massages';
      } else if (service.title.en.includes('Scrub') || service.title.en.includes('Salt') || service.title.en.includes('Chocolate')) {
        category = 'scrubs';
      } else if (service.title.en.includes('VIP') || service.title.en.includes('Cleopatra')) {
        category = 'packages';
      }

      return {
        ...service,
        category: category
      };
    });

    // Upload to Firestore
    for (const service of categorizedServices) {
      try {
        await getServicesCollection().doc(service.id).set(service);
        console.log(`✅ Migrated: ${service.title.en} (${service.category})`);
      } catch (error) {
        console.error(`❌ Failed to migrate ${service.title.en}:`, error);
      }
    }

    console.log('🎉 Migration completed!');

    // Test the data by fetching it back
    console.log('🧪 Testing Firestore data...');
    const querySnapshot = await getServicesCollection().get();
    console.log(`✅ Found ${querySnapshot.docs.length} services in Firestore`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

console.log('🚀 Migration ready! Run migrateToFirestore() in console to start.');
