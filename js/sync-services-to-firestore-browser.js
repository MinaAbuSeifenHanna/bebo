// sync-services-to-firestore-browser.js
// Browser version - Syncs local services.json data to Firestore
// Uses Firebase Firestore Web SDK v9+ (modular)
// Run this in browser console after loading your website

/**
 * Syncs services.json data to Firestore (Browser version)
 * This function will:
 * 1. Fetch services.json from the server
 * 2. Delete all existing documents in the services collection
 * 3. Upload all services from the JSON file
 */
window.syncServicesToFirestore = async function() {
    console.log('🔄 Starting sync: services.json → Firestore (Browser)');
    
    try {
        // Check if Firebase is initialized
        if (!window.firebaseDB || !window.getServicesCollection) {
            console.error('❌ Firebase not initialized. Please wait for the page to load completely.');
            return;
        }

        // Step 1: Load services.json
        console.log('📂 Loading services.json...');
        const response = await fetch('js/service.json');
        if (!response.ok) {
            throw new Error(`Failed to load services.json: ${response.statusText}`);
        }
        
        const services = await response.json();
        
        if (!Array.isArray(services)) {
            throw new Error('services.json must contain an array');
        }
        
        console.log(`📊 Found ${services.length} services to sync`);

        const servicesRef = window.getServicesCollection();

        // Step 2: Delete all existing documents
        console.log('🗑️  Deleting all existing documents...');
        const existingDocs = await servicesRef.get();
        const deletePromises = [];
        
        existingDocs.forEach((docSnapshot) => {
            deletePromises.push(docSnapshot.ref.delete());
        });
        
        await Promise.all(deletePromises);
        console.log(`✅ Deleted ${deletePromises.length} existing document(s)`);

        // Step 3: Upload all services from JSON
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
                const serviceDoc = servicesRef.doc(service.id.toString());
                
                // Upload the service (image paths remain as strings)
                await serviceDoc.set(service);
                
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
        
    } catch (error) {
        console.error('❌ Sync failed:', error.message);
        console.error(error);
    }
};

console.log('🚀 Sync function ready! Run syncServicesToFirestore() in console to start.');

