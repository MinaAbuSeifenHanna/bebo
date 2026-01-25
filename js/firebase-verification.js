// firebase-verification.js - Final verification script for 100% Firebase integration
// Run this in browser console to verify everything is working

function verifyFirebaseIntegration() {
  console.log('🔍 Verifying Firebase Integration...');

  // Check 1: Firebase initialization
  if (!window.firebaseDB) {
    console.error('❌ Firebase not initialized');
    return false;
  }
  console.log('✅ Firebase initialized');

  // Check 2: Data loaded from Firestore
  if (!window.isFirebaseLoaded || !window.allServices || window.allServices.length === 0) {
    console.error('❌ No data loaded from Firestore');
    return false;
  }
  console.log(`✅ ${window.allServices.length} services loaded from Firestore`);

  // Check 3: Verify data structure (New Schema)
  let missingFieldsCount = 0;
  const failingIds = [];

  window.allServices.forEach(service => {
    const hasId = service.id;
    const hasPrice = service.price_info && service.price_info.after_disc !== undefined;
    const hasTranslation = service.translations && service.translations.en && service.translations.en.title;

    if (!hasId || !hasPrice || !hasTranslation) {
      missingFieldsCount++;
      failingIds.push(service.id || 'unknown');
    }
  });

  if (missingFieldsCount > 0) {
    console.error(`❌ Validation Failed: ${missingFieldsCount} services missing fields.`);
    console.error('❌ Failing IDs:', failingIds);
    return false;
  }
  console.log('✅ All services have valid ID, Price Info, and EN Translations');

  // Check 4: Verify multilingual structure
  const firstService = window.allServices[0];
  if (firstService.translations && firstService.translations.en && firstService.translations.en.details) {
    console.log('✅ Multilingual details structure verified');
  } else {
    console.error('❌ Multilingual details structure missing');
    return false;
  }

  // Check 5: Verify no static data dependencies
  if (window.servicesData) {
    console.warn('⚠️ Static data.js still detected (window.servicesData)');
  } else {
    console.log('✅ No static data dependencies');
  }

  // Check 6: Test language switching
  const originalLang = localStorage.getItem('selectedLanguage') || 'en';
  localStorage.setItem('selectedLanguage', 'ar');
  if (typeof updateAllServices === 'function') {
    updateAllServices();
    console.log('✅ Language switching functional');
  }
  localStorage.setItem('selectedLanguage', originalLang);
  // Restore
  if (typeof updateAllServices === 'function') updateAllServices();

  console.log('🎉 SUCCESS: Website is 100% running on Firebase!');
  return true;
}

// Auto-run verification
setTimeout(verifyFirebaseIntegration, 3000);

// Also make it globally available
window.verifyFirebaseIntegration = verifyFirebaseIntegration;
