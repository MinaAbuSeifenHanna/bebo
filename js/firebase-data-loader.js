// firebase-data-loader.js

window.allServices = [];
window.rawServices = []; // Source of truth
window.isFirebaseLoaded = false;

// 1. محاولة تحميل البيانات من الذاكرة المحلية فوراً (Caching)
function loadFromCache() {
    const cachedData = localStorage.getItem('spa_services_cache');
    if (cachedData) {
        try {
            window.rawServices = JSON.parse(cachedData);
            window.allServices = [...window.rawServices]; // Initial copy
            window.isFirebaseLoaded = true;
            console.log("⚡ Instant Load: Data retrieved from LocalStorage");

            // تحديث الواجهة فوراً بالبيانات المخزنة
            triggerUIRender();
        } catch (e) {
            console.error("❌ Cache parsing error", e);
        }
    }
}

// 2. دالة جلب البيانات الحية من Firebase
function initializeFirebaseData() {
    console.log('🔥 Connecting to Firestore...');

    if (!window.firebaseDB || !window.listenToServices || !window.listenToSalon) {
        console.warn('⏳ Firebase not ready yet, retrying in 500ms...');
        setTimeout(initializeFirebaseData, 500);
        return;
    }

    let spaServices = [];
    let salonServices = [];

    // Helper to merge and update
    const updateGlobalState = () => {
        // Merge both arrays
        const combined = [...spaServices, ...salonServices];

        if (combined.length > 0) {
            console.log(`✅ Live Sync: Total ${combined.length} items (Spa: ${spaServices.length}, Salon: ${salonServices.length})`);

            // معالجة التصنيفات
            const processedServices = combined.map(service => ({
                ...service,
                category: service.category ? service.category.toLowerCase() : 'packages'
            }));

            // تحديث المتغير العام والذاكرة المحلية
            window.rawServices = processedServices;
            window.allServices = [...processedServices];
            localStorage.setItem('spa_services_cache', JSON.stringify(processedServices));
            window.isFirebaseLoaded = true;

            // Dispatch Custom Event
            const event = new CustomEvent('services-loaded', { detail: { services: processedServices } });
            window.dispatchEvent(event);

            // تحديث الواجهة فوراً (Legacy Support)
            triggerUIRender();
        }
    };

    // استخدام الـ Listener (Realtime) لجلب البيانات
    window.listenToServices((services) => {
        spaServices = services || [];
        updateGlobalState();
    });

    // Listen to Salon Data
    window.listenToSalon((services) => {
        salonServices = services || [];
        updateGlobalState();
    });
}

// 3. دالة موحدة لتحديث كل أجزاء الموقع
function triggerUIRender() {
    if (typeof updateAllServices === 'function') {
        // Ensure languages are processed first!
        updateAllServices();
    }

    if (typeof renderAllSections === 'function') {
        console.log("🎨 Triggering Render All Sections");
        renderAllSections();
    }

    if (typeof updateCartCounter === 'function') updateCartCounter();

    // لو إحنا في صفحة التفاصيل، نحدث بيانات الخدمة المعروضة
    if (typeof renderServiceDetails === 'function') renderServiceDetails();
}

// تشغيل النظام
document.addEventListener('DOMContentLoaded', function () {
    // الخطوة الأولى: حمل من الذاكرة (سرعة)
    loadFromCache();

    // الخطوة الثانية: اتصل بالفايربيز (دقة ومزامنة)
    initializeFirebaseData();
});