// ============================================
// PASTE THIS ENTIRE CODE INTO BROWSER CONSOLE
// ============================================
// Open browser console (F12) and paste this entire code block

(async function updateServicesWithEnglish() {
    console.log('🌐 Starting to update services with English data...');

    // Check if Firebase is initialized
    if (!window.firebaseDB || !window.getServicesCollection) {
        console.error('❌ Firebase not initialized. Please wait for the page to load completely.');
        return;
    }

    // English services data
    const englishServices = [
        { "id": "1", "title": "Cleopatra VIP", "image": "assets/images/1.webp", "category": "packages", "time": "3 Hrs", "salary": "43 €", "after_disc": "35 €", "details": { "1": { "Sauna - Jacuzzi - Steam Bath": "Full thermal relaxation." }, "2": { "Hair Bath (Oil/Cream)": "Deep scalp nourishment." }, "3": { "Peeling & Foam Massage": "Traditional Kessa scrub with soap foam." }, "4": { "Full Body Chocolate Mask": "Antioxidant skin treatment." }, "5": { "Full Body Coconut Mask": "Tropical hydration." }, "6": { "Face Mask": "Facial revitalization." }, "7": { "Full Body Massage (60 Mins)": "Stress relief massage." } } },
        { "id": "2", "title": "Damascus Hammam and Massage", "image": "assets/images/2.webp", "category": "packages", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Sauna/Steam", "2": "Peeling with Loofah", "3": "Face Mask", "4": "Full Body Massage (50 Mins)" } },
        { "id": "3", "title": "Turkish Hammam and Massage", "image": "assets/images/3.png", "category": "packages", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Sauna/Steam", "2": "Kessa Mitten Peeling", "3": "Foam Massage", "4": "Full Body Massage (50 Mins)" } },
        { "id": "4", "title": "Moroccan Hammam and Massage", "image": "assets/images/4.png", "category": "packages", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Sauna/Steam", "2": "Moroccan Soap Peeling", "3": "Full Body Massage (50 Mins)" } },
        { "id": "5", "title": "Damascus Hammam", "image": "assets/images/5.png", "category": "hammam", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Sauna/Steam", "2": "Peeling with Loofah & Soap" } },
        { "id": "6", "title": "Turkish Hammam", "image": "assets/images/6.png", "category": "hammam", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Sauna/Steam", "2": "Kessa Mitten & Foam Massage" } },
        { "id": "7", "title": "Moroccan Hammam", "image": "assets/images/7.png", "category": "hammam", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Sauna/Steam", "2": "Moroccan Soap & Mitten" } },
        { "id": "8", "title": "Aroma Massage", "image": "assets/images/8.png", "category": "massages", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Essential Oils", "2": "Relaxation focus" } },
        { "id": "9", "title": "Medical Massage", "image": "assets/images/9.png", "category": "massages", "time": "60 Mins", "salary": "25 €", "after_disc": "20 €", "details": { "1": "Outcome-based therapy", "2": "Targeted muscle relief" } },
        { "id": "10", "title": "Classic Massage", "image": "assets/images/10.png", "category": "massages", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Swedish techniques", "2": "Long gliding strokes" } },
        { "id": "11", "title": "Sports Massage", "image": "assets/images/11.webp", "category": "massages", "time": "60 Mins", "salary": "25 €", "after_disc": "20 €", "details": { "1": "Muscle recovery", "2": "Flexibility focus" } },
        { "id": "12", "title": "Hot Stone Massage", "image": "assets/images/12.webp", "category": "massages", "time": "60 Mins", "salary": "25 €", "after_disc": "20 €", "details": { "1": "Heated smooth stones", "2": "Deep heat penetration" } },
        { "id": "13", "title": "Anti Cellulite Massage", "image": "assets/images/13.webp", "category": "massages", "time": "60 Mins", "salary": "25 €", "after_disc": "20 €", "details": { "1": "Fat tissue targeting", "2": "Skin smoothing" } },
        { "id": "14", "title": "Deep Tissue Massage", "image": "assets/images/14.png", "category": "massages", "time": "60 Mins", "salary": "25 €", "after_disc": "20 €", "details": { "1": "Connective tissue focus", "2": "Intense pressure" } },
        { "id": "15", "title": "Foot Massage", "image": "assets/images/15.png", "category": "massages", "time": "30 Mins", "salary": "15 €", "after_disc": "10 €", "details": { "1": "Reflex points", "2": "Tension release" } },
        { "id": "16", "title": "Full Back Massage", "image": "assets/images/16.png", "category": "massages", "time": "30 Mins", "salary": "15 €", "after_disc": "10 €", "details": { "1": "Back & Shoulder focus", "2": "Sedentary relief" } },
        { "id": "17", "title": "Salt Body Scrub and Massage", "image": "assets/images/17.png", "category": "packages", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Sea salt exfoliation", "2": "Full body massage" } },
        { "id": "18", "title": "Salt Body Scrub", "image": "assets/images/18.png", "category": "scrubs", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Deep skin cleansing" } },
        { "id": "19", "title": "Coconut Body Scrub and Massage", "image": "assets/images/19.png", "category": "packages", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Coconut exfoliation", "2": "Hydrating massage" } },
        { "id": "20", "title": "Coconut Body Scrub", "image": "assets/images/20.png", "category": "scrubs", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Tropical skin softening" } },
        { "id": "21", "title": "Clay Body Scrub and Massage", "image": "assets/images/21.webp", "category": "packages", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Mineral clay scrub", "2": "Full massage" } },
        { "id": "22", "title": "Clay Body Scrub", "image": "assets/images/22.webp", "category": "scrubs", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Detoxifying clay" } },
        { "id": "23", "title": "Coffee Body Scrub and Massage", "image": "assets/images/23.png", "category": "packages", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Caffeine exfoliation", "2": "Invigorating massage" } },
        { "id": "24", "title": "Coffee Body Scrub", "image": "assets/images/24.png", "category": "scrubs", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Anti-cellulite coffee scrub" } },
        { "id": "25", "title": "Honey Body Scrub and Massage", "image": "assets/images/25.png", "category": "packages", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Honey & Sugar scrub", "2": "Nourishing massage" } },
        { "id": "26", "title": "Chocolate Body Scrub and Massage", "image": "assets/images/26.png", "category": "packages", "time": "2 Hrs", "salary": "34 €", "after_disc": "25 €", "details": { "1": "Cocoa scrub", "2": "Relaxing massage" } },
        { "id": "27", "title": "Chocolate Body Scrub", "image": "assets/images/27.png", "category": "scrubs", "time": "60 Mins", "salary": "20 €", "after_disc": "15 €", "details": { "1": "Sweet skin revitalization" } }
    ];

    const servicesRef = window.getServicesCollection();

    for (const service of englishServices) {
        try {
            const serviceDoc = servicesRef.doc(service.id);
            const docSnapshot = await serviceDoc.get();

            const updateData = {
                id: service.id,
                image: service.image,
                salary: service.salary,
                after_disc: service.after_disc,
                category: service.category,
                title: { en: service.title },
                time: { en: service.time },
                details: { en: service.details }
            };

            if (docSnapshot.exists) {
                const existingData = docSnapshot.data();

                if (existingData.title && typeof existingData.title === 'object' && !Array.isArray(existingData.title)) {
                    updateData.title = { ...existingData.title, en: service.title };
                }
                if (existingData.time && typeof existingData.time === 'object' && !Array.isArray(existingData.time)) {
                    updateData.time = { ...existingData.time, en: service.time };
                }
                if (existingData.details && typeof existingData.details === 'object' && !Array.isArray(existingData.details)) {
                    const hasLanguageKeys = Object.keys(existingData.details).some(key =>
                        ['en', 'ar', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'pl', 'cs', 'lv', 'zh'].includes(key)
                    );
                    if (hasLanguageKeys) {
                        updateData.details = { ...existingData.details, en: service.details };
                    }
                }

                const completeData = {
                    id: service.id,
                    image: service.image,
                    salary: service.salary,
                    after_disc: service.after_disc,
                    category: service.category,
                    title: updateData.title,
                    time: updateData.time,
                    details: updateData.details
                };

                const validFields = ['id', 'image', 'salary', 'after_disc', 'category', 'title', 'time', 'details'];
                Object.keys(existingData).forEach(key => {
                    if (!validFields.includes(key) && !key.startsWith('_')) {
                        completeData[key] = existingData[key];
                    }
                });

                await serviceDoc.set(completeData);
                console.log(`✅ Updated service ${service.id} (${service.title})`);
            } else {
                await serviceDoc.set(updateData);
                console.log(`✅ Created service ${service.id} (${service.title})`);
            }
        } catch (error) {
            console.error(`❌ Error updating service ${service.id}:`, error.message || error);
        }
    }

    console.log('✅ All services updated successfully!');
})();

