// simple-migration.js - Simple script to migrate data to Firestore
// Run this in the browser console on your website

// Make migration function globally available immediately
window.migrateToFirestore = async function () {
  console.log('🔥 Starting migration to Firestore...');

  try {
    // Check if Firebase is initialized
    if (!window.firebaseDB) {
      console.error('❌ Firebase not initialized. Load the website first.');
      return;
    }

    // Get existing services data from Firebase (already migrated)
    const services = window.allServices || [];

    if (services.length === 0) {
      console.error('❌ No services data found. Make sure Firebase is loaded.');
      return;
    }

    console.log(`📊 Found ${services.length} services to migrate`);

    // Add categories to services
    // Add categories to services
    const categorizedServices = services.map((service) => {
      let category = 'packages';

      // Safe access to English title
      let titleEn = '';
      if (typeof service.title === 'string') {
        titleEn = service.title;
      } else if (service.title && service.title.en) {
        titleEn = service.title.en;
      }

      if (titleEn.includes('Hammam')) {
        category = 'hammam';
      } else if (titleEn.includes('Massage') && !titleEn.includes('Hammam')) {
        category = 'massages';
      } else if (titleEn.includes('Scrub') || titleEn.includes('Salt') || titleEn.includes('Chocolate') || titleEn.includes('Clay') || titleEn.includes('Coffee') || titleEn.includes('Honey') || titleEn.includes('Coconut')) {
        category = 'scrubs';
      } else if (titleEn.includes('VIP') || titleEn.includes('Cleopatra')) {
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
        await window.getServicesCollection().doc(service.id).set(service);
        console.log(`✅ Migrated: ${service.title.en} (${service.category})`);
      } catch (error) {
        console.error(`❌ Failed to migrate ${service.title.en}:`, error);
      }
    }

    console.log('🎉 Migration completed!');

    // Test the data by fetching it back
    console.log('🧪 Testing Firestore data...');
    const querySnapshot = await window.getServicesCollection().get();
    console.log(`✅ Found ${querySnapshot.docs.length} services in Firestore`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

console.log('🚀 Migration ready! Run migrateToFirestore() in console to start.');
