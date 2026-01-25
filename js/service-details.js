// service-details.js
// Handles rendering of the service details page
// Dependencies: Utils, firebase-data-loader

(function () {
    async function loadDetailData() {
        // Get Service ID
        const params = new URLSearchParams(window.location.search);
        const serviceId = params.get('id');

        if (!serviceId) {
            console.error("No service ID provided");
            safeSetText('det-title', 'Error: No Service ID');
            return;
        }

        let service = null;

        // 1. Try Cache / Global Data
        if (window.allServices && window.allServices.length > 0) {
            service = window.allServices.find(s => String(s.id) === String(serviceId));
        }

        // 2. Fetch from Firestore if not in cache
        if (!service) {
            console.log(`⚠️ Service ${serviceId} not found in cache. Fetching from Firestore...`);
            if (window.firebaseDB) {
                try {
                    const doc = await window.firebaseDB.collection('services').doc(String(serviceId)).get();
                    if (doc.exists) {
                        service = { id: doc.id, ...doc.data() };
                        console.log("✅ Fetched single service:", service);
                    } else {
                        console.error("❌ Service document does not exist");
                    }
                } catch (error) {
                    console.error("❌ Error fetching service:", error);
                }
            } else {
                console.warn("⚠️ Firebase DB not ready yet.");
                // Wait for global load event as last resort
                return;
            }
        }

        // 3. Render or Show Error
        if (!service) {
            console.error("Service not found after fetch attempt");
            safeSetText('det-title', 'Service Not Found');
            const hero = document.querySelector('.details-hero-arched');
            if (hero) hero.innerHTML = '<div class="text-center p-5">Please return to home page.</div>';
            return;
        }

        renderService(service);
    }

    function renderService(service) {
        // Resolve Translation
        const lang = localStorage.getItem('selectedLanguage') || 'en';
        // Fallback to English if translation missing or partial
        const data = (service.translations && service.translations[lang])
            ? service.translations[lang]
            : (service.translations?.['en'] || {});

        const title = data.title || service.title || 'Service Details';

        // Update UI
        safeSetText('det-title', title);

        // Time logic: service.time is "3 Hrs". Extract number or render as is? 
        // Existing page expects "0 Mins". 
        // If "3 Hrs", let's just show it. Or convert? 
        // Let's use service.time directly if available.
        safeSetText('det-time', service.time || service.duration || '2 Hrs');

        safeSetText('sticky-title', title);

        // Price Logic
        const priceObj = service.price_info || {};
        const currency = priceObj.currency || '€';
        const salary = priceObj.salary;
        const afterDisc = priceObj.after_disc;
        const mainPrice = afterDisc !== undefined ? afterDisc : (salary || 0);

        safeSetText('det-new-price', `${currency}${mainPrice}`);
        safeSetText('sticky-price', `${currency}${mainPrice}`);

        const oldPriceEl = document.getElementById('det-old-price');
        if (oldPriceEl) {
            if (salary !== undefined && afterDisc !== undefined && salary > afterDisc) {
                oldPriceEl.textContent = `${currency}${salary}`;
                oldPriceEl.style.display = 'inline';
            } else {
                oldPriceEl.style.display = 'none';
            }
        }

        // Image
        const imgEl = document.getElementById('det-image');
        if (imgEl && window.Utils) {
            imgEl.src = window.Utils.resolvePath(service.image || 'assets/images/placeholder.png');
            imgEl.alt = title;
            imgEl.onerror = () => { imgEl.src = window.Utils.resolvePath('assets/images/placeholder.png'); };
        }

        // Features/Details Mapping
        const stepsCont = document.getElementById('det-steps');
        if (stepsCont && data.details) {
            // New structure: data.details is { "1": "val", "2": "val" } key-value where value is string.
            // Old code expected object with .name property.

            stepsCont.innerHTML = Object.values(data.details).map(detailStr => `
                <div class="details-feature-item">
                    <i class="fas fa-check"></i>
                    <div class="f-content">
                        <strong>${detailStr}</strong>
                    </div>
                </div>
            `).join('');
        }

        // Trigger animations
        document.querySelectorAll('.fade-in-up').forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Helper for Add to Cart
        window.addToCartFromDetails = function () {
            // Check if cart logic is loaded
            if (window.addToCart) {
                window.addToCart(service.id); // Use the resolved service ID
            } else {
                console.warn("Cart logic not ready, waiting...");
                // Simple retry or alert
                alert("Cart system loading... please try again.");
            }
        };
    }

    function safeSetText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // Event Listeners
    window.addEventListener('services-loaded', (e) => {
        console.log('Service Details: Data loaded event');
        loadDetailData();
    });

    document.addEventListener('DOMContentLoaded', () => {
        // Always attempt load. 
        // If cache exists, it uses it. 
        // If not, it tries direct Firestore fetch.
        loadDetailData();
    });

    // Define safe global for cart immediately
    window.addToCartFromDetails = function () {
        console.warn("Cart logic loading or service not ready...");
    };

})();