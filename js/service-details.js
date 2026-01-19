// service-details.js
// Handles rendering of the service details page
// Dependencies: Utils, firebase-data-loader

(function () {
    function loadDetailData() {
        // Get Service ID
        const params = new URLSearchParams(window.location.search);
        const serviceId = params.get('id');

        if (!serviceId) {
            console.error("No service ID provided");
            return;
        }

        // Check Services Data
        const services = window.allServices || [];
        if (services.length === 0) {
            console.log('Waiting for services data...');
            return; // Will retry via event listener
        }

        // Find Service
        const service = services.find(s => String(s.id) === String(serviceId));
        if (!service) {
            document.body.innerHTML = '<div class="container py-5 text-center"><h3>Service not found</h3><a href="../index.html" class="btn btn-primary">Go Home</a></div>';
            return;
        }

        // Resolve Translation
        const lang = localStorage.getItem('selectedLanguage') || 'en';
        const data = service.translations?.[lang] || service.translations?.['en'];

        // Update UI
        safeSetText('det-title', data.title);
        safeSetText('det-time', service.time || '60 Mins');
        safeSetText('sticky-title', data.title);

        // Price
        const currency = service.price_info?.currency || '€';
        const price = service.price_info.after_disc;
        safeSetText('det-new-price', `${currency}${price}`);
        safeSetText('sticky-price', `${currency}${price}`);

        const oldPriceEl = document.getElementById('det-old-price');
        if (oldPriceEl) {
            if (service.price_info.salary && service.price_info.salary != service.price_info.after_disc) {
                oldPriceEl.textContent = `${currency}${service.price_info.salary}`;
                oldPriceEl.style.display = 'inline';
            } else {
                oldPriceEl.style.display = 'none';
            }
        }

        // Image
        const imgEl = document.getElementById('det-image');
        if (imgEl && window.Utils) {
            imgEl.src = window.Utils.resolvePath(service.image || 'assets/images/placeholder.png');
            imgEl.onerror = () => { imgEl.src = window.Utils.resolvePath('assets/images/backimage.png'); };
        }

        // Steps/Details
        const stepsCont = document.getElementById('det-steps');
        if (stepsCont && data.details) {
            stepsCont.innerHTML = Object.values(data.details).map(d => `
                <li class="treatment-step">
                    <div class="step-icon">
                        <i class="fas fa-leaf"></i>
                    </div>
                    <div>
                        <strong class="d-block text-dark">${d.name}</strong>
                        <span class="text-muted small">${d.desc || 'Included in treatment'}</span>
                    </div>
                </li>
            `).join('');
        }

        // Exposing helper for the HTML button
        window.addToCartFromDetails = function () {
            if (window.addToCart) {
                window.addToCart(serviceId);
            } else {
                console.error("addToCart function not found");
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
        // Attempt load if data is already ready (e.g. from cache)
        if (window.allServices && window.allServices.length > 0) {
            loadDetailData();
        }
    });

})();