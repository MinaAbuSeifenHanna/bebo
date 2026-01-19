// firebase-data-loader.js

window.allServices = [];
window.isFirebaseLoaded = false;

// 1. محاولة تحميل البيانات من الذاكرة المحلية فوراً (Caching)
function loadFromCache() {
    const cachedData = localStorage.getItem('spa_services_cache');
    if (cachedData) {
        try {
            window.allServices = JSON.parse(cachedData);
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

    if (!window.firebaseDB || !window.listenToServices) {
        console.warn('⏳ Firebase not ready yet, retrying in 500ms...');
        setTimeout(initializeFirebaseData, 500);
        return;
    }

    // استخدام الـ Listener (Realtime) لجلب البيانات
    const unsubscribe = window.listenToServices((services) => {
        if (services && services.length > 0) {
            console.log(`✅ Live Sync: Received ${services.length} services`);

            // معالجة التصنيفات
            const processedServices = services.map(service => ({
                ...service,
                category: service.category ? service.category.toLowerCase() : 'packages'
            }));

            // تحديث المتغير العام والذاكرة المحلية
            window.allServices = processedServices;
            localStorage.setItem('spa_services_cache', JSON.stringify(processedServices));
            window.isFirebaseLoaded = true;

            // Dispatch Custom Event
            const event = new CustomEvent('services-loaded', { detail: { services: processedServices } });
            window.dispatchEvent(event);
            console.log('📢 Event dispatched: services-loaded');

            // تحديث الواجهة فوراً (Legacy Support)
            triggerUIRender();
        }
    });

    window.firebaseUnsubscribe = unsubscribe;
}

// 3. دالة موحدة لتحديث كل أجزاء الموقع
function triggerUIRender() {
    if (typeof renderAllSections === 'function') renderAllSections();
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