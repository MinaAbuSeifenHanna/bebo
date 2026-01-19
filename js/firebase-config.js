// firebase-config.js - Firebase configuration and initialization
// Firebase Web SDK v9 compat version (no modules)

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0v1ltLw4J_6cpxNNQo65iBRubPekOSdQ",
  authDomain: "bebospa-f75b7.firebaseapp.com",
  projectId: "bebospa-f75b7",
  storageBucket: "bebospa-f75b7.firebasestorage.app",
  messagingSenderId: "395454882182",
  appId: "1:395454882182:web:d290d21e237f4c8f40cc07",
  measurementId: "G-YZZL9ZGS7H"
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
  const servicesQuery = getServicesCollection().orderBy('id', 'asc');
  
  return servicesQuery.onSnapshot((snapshot) => {
    const services = [];
    snapshot.forEach((doc) => {
      services.push({ id: doc.id, ...doc.data() });
    });
    callback(services);
  }, (error) => {
    console.error('❌ Firebase listener error:', error);
    callback([]);
  });
}

// Export helper functions
window.getServicesCollection = getServicesCollection;
window.listenToServices = listenToServices;

// Migration function - run this in console to migrate data
window.migrateToFirestore = async function() {
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
