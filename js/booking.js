// js/booking.js - Logic for the dedicated booking page

(function () {
    async function initBooking() {
        const params = new URLSearchParams(window.location.search);
        const serviceId = params.get('id');

        if (!serviceId) {
            window.location.href = '../index.html';
            return;
        }

        // Wait for data if not ready
        if (!window.allServices || window.allServices.length === 0) {
            window.addEventListener('services-loaded', () => renderBooking(serviceId));
            return;
        }

        renderBooking(serviceId);
    }

    function renderBooking(serviceId) {
        const service = window.allServices.find(s => String(s.id) === String(serviceId));
        if (!service) {
            document.body.innerHTML = '<div class="container py-5 text-center"><h3>Service not found</h3><a href="../index.html" class="btn btn-primary">Go Home</a></div>';
            return;
        }

        const lang = localStorage.getItem('selectedLanguage') || 'en';
        const data = service.translations?.[lang] || service.translations?.['en'];

        // Update Text
        safeSetText('book-title', data.title);
        safeSetText('book-time', `${service.duration || '2'} Hrs`);

        // Price Calculation
        const currency = service.price_info?.currency || '€';
        const price = service.price_info.after_disc;
        const oldPrice = service.price_info.salary;

        safeSetText('book-new-price', `${price}${currency}`);
        safeSetText('footer-total', `${price}${currency}`);

        const oldPriceEl = document.getElementById('book-old-price');
        if (oldPriceEl) {
            if (oldPrice && oldPrice != price) {
                oldPriceEl.textContent = `${oldPrice}${currency}`;
                oldPriceEl.style.display = 'inline';
            } else {
                oldPriceEl.style.display = 'none';
            }
        }

        // Image
        const imgEl = document.getElementById('book-image');
        if (imgEl && window.Utils) {
            imgEl.src = window.Utils.resolvePath(service.image || 'assets/images/placeholder.png');
            imgEl.onerror = () => { imgEl.src = window.Utils.resolvePath('assets/images/placeholder.png'); };
        }

        // Features Grid
        const featuresCont = document.getElementById('book-features');
        if (featuresCont && data.details) {
            featuresCont.innerHTML = Object.values(data.details).map(d => `
                <div class="details-feature-item">
                    <i class="fas fa-check"></i>
                    <div class="f-content">
                        <strong>${d.name}</strong>
                        <span>${d.desc || 'Premium treatment step'}</span>
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

        // View Toggles
        window.showCheckoutForm = function () {
            const detailsCont = document.getElementById('service-details-content');
            const formCont = document.getElementById('checkout-form-container');
            const footer = document.querySelector('.cart-footer');

            if (detailsCont) detailsCont.classList.add('d-none');
            if (formCont) formCont.classList.remove('d-none');
            if (footer) footer.classList.add('d-none');
            window.scrollTo(0, 0);
        };

        window.showServiceDetails = function () {
            const detailsCont = document.getElementById('service-details-content');
            const formCont = document.getElementById('checkout-form-container');
            const footer = document.querySelector('.cart-footer');

            if (detailsCont) detailsCont.classList.remove('d-none');
            if (formCont) formCont.classList.add('d-none');
            if (footer) footer.classList.remove('d-none');
            window.scrollTo(0, 0);
        };

        // Form Submission Logic
        window.submitSingleBooking = function () {
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const date = document.getElementById('form-date').value;
            const time = document.getElementById('form-time').value;
            const notes = document.getElementById('form-notes').value;
            const transport = document.getElementById('form-transport').checked;
            const residence = document.getElementById('form-residence').value;
            const room = document.getElementById('form-room').value;

            if (!name || !date || !time) {
                alert('Please fill in all required fields');
                return;
            }

            let transportInfo = '';
            if (transport) {
                transportInfo = `🚗 *Transportation Info*\n📍 Place: ${residence || 'N/A'}\n🔢 Room: ${room || 'N/A'}\n`;
            }

            const message = `🌸 *New Booking Request* 🌸
👤 *${name}*
📞 ${phone || 'N/A'}
📅 ${date} at ${time}
${transportInfo}
💅 *Service:* ${data.title}
💰 *Price:* ${price}${currency}
⌛ *Duration:* ${service.duration || '2'} Hrs

${notes ? `📝 Note: ${notes}` : ''}

Confirm via: womenworldspa.com`;

            const waLink = `https://wa.me/201007920759?text=${encodeURIComponent(message)}`;
            window.open(waLink, '_blank');

            // Show Success Modal
            const successModal = new bootstrap.Modal(document.getElementById('successModal'));
            if (successModal) successModal.show();
        };

        // Initialize Transport Toggles
        const initTransportToggle = () => {
            const transportCheck = document.getElementById('form-transport');
            const residenceCont = document.getElementById('form-residence-container');
            if (transportCheck && residenceCont) {
                transportCheck.addEventListener('change', (e) => {
                    if (e.target.checked) residenceCont.classList.remove('d-none');
                    else residenceCont.classList.add('d-none');
                });
            }
        };
        initTransportToggle();

        // Legacy confirmBooking (keep for compatibility if needed, but we now use the form)
        window.confirmBooking = window.showCheckoutForm;
    }

    function safeSetText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    document.addEventListener('DOMContentLoaded', initBooking);
})();
