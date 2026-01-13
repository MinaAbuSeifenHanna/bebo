// main.js - Enhanced main application logic
// Global variables
let isInitialized = false;

// Enhanced initialization with error handling
function initializeApp() {
  try {
    console.log('🚀 بدأ تحميل الصفحة...');

    // Initialize language system first
    if (typeof initializeLanguageSystem === 'function') {
      console.log('📝 تهيئة نظام اللغة...');
      initializeLanguageSystem(); // This should populate window.allServices
    } else {
      console.error('❌ وظيفة initializeLanguageSystem غير موجودة');
    }

    // Ensure services data is available
    if (!window.allServices || window.allServices.length === 0) {
      console.warn('⚠️ window.allServices is empty. Checking sources...');
      if (typeof window.servicesData !== 'undefined') {
        window.allServices = window.servicesData;
        console.log('✅ Recovered services from window.servicesData');
      } else if (typeof updateAllServices === 'function') {
        updateAllServices();
      }
    }

    if (window.allServices && window.allServices.length > 0) {
      console.log(`📊 تم تحميل ${window.allServices.length} خدمة`);
    } else {
      console.error('❌ بيانات الخدمات غير متاحة (Services Data Missing)');
      window.allServices = [];
    }

    // Render initial services
    console.log('🔄 عرض الخدمات الأولية...');
    renderAllSections();

    // Force services to be visible (fallback)
    setTimeout(() => {
      console.log('👁️ فرض رؤية الخدمات...');
      forceServicesVisible();
    }, 500);

    // Setup event listeners
    console.log('🎧 إعداد مستمعي الأحداث...');
    setupEventListeners();
    setupTabListeners();

    // Initialize cart
    console.log('🛒 تهيئة السلة...');
    if (typeof updateCartCounter === 'function') updateCartCounter();
    if (typeof updateSelectedServices === 'function') updateSelectedServices();

    isInitialized = true;
    console.log('✅ اكتمل تحميل الصفحة بنجاح');
  } catch (error) {
    console.error('❌ خطأ في التهيئة:', error);
  }
}

// Safe initialization
document.addEventListener('DOMContentLoaded', function () {
  if (!isInitialized) {
    initializeApp();
  }
});

// Backup initialization
window.addEventListener('load', function () {
  if (!isInitialized) {
    console.log('🔄 محاولة تهيئة احتياطية...');
    setTimeout(initializeApp, 1000);
  }
});

// Helper to safely get current services
function getCurrentServices() {
  return window.allServices || [];
}

// Force services to be visible
function forceServicesVisible() {
  console.log('👁️ فرض رؤية الخدمات...');
  const servicesContent = document.getElementById('services-content');
  const servicesGrid = document.getElementById('all-services-grid');

  if (servicesContent) {
    servicesContent.classList.add('show');
    servicesContent.classList.add('active');
    servicesContent.style.display = 'block';
    servicesContent.style.visibility = 'visible';
    console.log('✅ تم تفعيل حاوية الخدمات');
  }

  if (servicesGrid) {
    servicesGrid.style.display = 'grid';
    servicesGrid.style.visibility = 'visible';

    // If no services rendered, try again
    if (servicesGrid.children.length === 0) {
      console.log('⚠️ لا توجد خدمات، جاري العرض بالقوة...');

      try {
        const services = getCurrentServices();
        console.log(`📊 تم العثور على ${services.length} خدمة`);

        if (services && services.length > 0) {
          servicesGrid.innerHTML = '';
          services.slice(0, 6).forEach((service, index) => {
            try {
              const serviceCard = createServiceCard(service);
              servicesGrid.appendChild(serviceCard);
            } catch (e) {
              console.error('Error creating card:', e);
            }
          });
          console.log('✅ تم عرض 6 خدمات بنجاح');
        } else {
          renderCategory('all');
        }
      } catch (error) {
        console.log('❌ خطأ في عرض الخدمات:', error.message);
      }
    } else {
      console.log(`✅ تم العثور على ${servicesGrid.children.length} خدمة معروضة`);
    }
  }
}

// Render Main Content based on Category
function renderCategory(category) {
  const container = document.getElementById('all-services-grid');
  const titleEl = document.getElementById('section-title');

  if (!container) return;

  // 1. Clear Container First
  container.innerHTML = '';

  // 2. Update Header Title
  if (titleEl) {
    let titleKey = 'allServices';
    if (category === 'packages') titleKey = 'packages';
    else if (category === 'massages') titleKey = 'massages';
    else if (category === 'hammam') titleKey = 'hammam';
    else if (category === 'scrubs') titleKey = 'scrub';

    titleEl.setAttribute('data-i18n', titleKey);
    if (typeof getUIText === 'function') {
      titleEl.textContent = getUIText(titleKey);
    }
  }

  // 3. Filter Data
  const services = getCurrentServices();
  let filteredServices = [];

  if (!services || services.length === 0) {
    // Try again if empty
    if (typeof updateAllServices === 'function') updateAllServices();
    const retryServices = window.allServices || [];
    if (retryServices.length === 0) {
      console.warn('No services to render');
      container.innerHTML = '<div class="col-12 text-center py-5 text-muted">Loading services...</div>';
      return;
    }
    filteredServices = retryServices; // Assign retry to filtered for filtering
  } else {
    filteredServices = services;
  }

  // Apply filters
  const allS = filteredServices; // Use local var to avoid confusion
  if (category === 'all') {
    filteredServices = allS;
  } else if (category === 'packages') {
    filteredServices = allS.filter(s => {
      const title = s.title || '';
      const hasPackageKeywords = title.includes('VIP') ||
        title.includes('Hammam and Massage') ||
        title.includes('Scrub and Massage');
      const timeInMinutes = parseTime(s.time);
      return timeInMinutes >= 120 || hasPackageKeywords;
    });
  } else if (category === 'massages') {
    filteredServices = allS.filter(s => (s.title || '').includes('Massage') && !(s.title || '').includes('Hammam'));
  } else if (category === 'hammam') {
    filteredServices = allS.filter(s => (s.title || '').includes('Hammam'));
  } else if (category === 'scrubs') {
    const scrubKeywords = ['Scrub', 'Salt', 'Coconut', 'Clay', 'Honey', 'Chocolate', 'Coffee'];
    filteredServices = allS.filter(s => scrubKeywords.some(k => (s.title || '').includes(k)));
  }

  // 4. Render Cards
  if (filteredServices.length > 0) {
    filteredServices.forEach(service => {
      try {
        container.appendChild(createServiceCard(service));
      } catch (e) { console.error(e); }
    });
  } else {
    container.innerHTML = '<div class="col-12 text-center py-5 text-muted">No services found in this category.</div>';
  }
}

// Unified Tab Handler
function handleTabClick(e) {
  const button = e.target;
  const category = button.getAttribute('data-category');
  const target = button.getAttribute('data-bs-target');

  // If switching to Home, handle separately
  if (target === '#home-content') {
    renderHomeContent();
  } else {
    // Otherwise render category into the main grid
    renderCategory(category || 'all');
  }
}

// Initial Render
function renderAllSections() {
  renderCategory('all');
}

// Setup Listeners
function setupTabListeners() {
  document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', handleTabClick);
  });
}

// Render Home content separately
function renderHomeContent() {
  const container = document.getElementById('home-content');
  if (container) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h2 class="section-title mb-4" data-i18n="welcome">Welcome to Women World Beauty & Spa</h2>
        <p class="lead mb-4" data-i18n="homeDescription">Experience luxury spa treatments in heart of Hurghada</p>
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card border-0 shadow-lg">
              <div class="card-body p-4">
                <h5 class="card-title mb-3" data-i18n="contactInfo">Contact Information</h5>
                <div class="contact-info">
                  <p class="mb-2"><i class="fas fa-phone me-2"></i> +201007920759</p>
                  <p class="mb-2"><i class="fas fa-envelope me-2"></i> minaabuseifen@gmail.com</p>
                  <p class="mb-0"><i class="fas fa-map-marker-alt me-2"></i> Hurghada, Egypt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    if (typeof updateAllUIText === 'function') updateAllUIText();
  }
}

// Debug function to check services data
function debugServices() {
  console.log('🔍 بدء تصحيح الخدمات...');
  console.log('📊 window.allServices:', typeof window.allServices, window.allServices?.length);
  const services = getCurrentServices();

  if (services.length > 0) {
    console.log('📝 أول خدمة:', services[0]);
  }
}

// Create reusable service card
function createServiceCard(service) {
  const col = document.createElement('div');
  col.className = 'fade-in-up';

  // Prepare details string safely
  const detailsArray = [];
  if (service.details && typeof service.details === 'object') {
    Object.values(service.details).forEach(detail => {
      if (detail === null || detail === undefined) return;

      if (typeof detail === 'object') {
        Object.values(detail).forEach(value => {
          if (value) detailsArray.push(value);
        });
      } else {
        detailsArray.push(detail);
      }
    });
  }

  // Get Button Texts safely
  const viewDetailsText = typeof getUIText === 'function' ? getUIText('viewDetails') : 'View Details';
  const addToCartText = typeof getUIText === 'function' ? getUIText('addToCart') : 'Add to Cart';

  const title = service.title || 'Service';
  const image = service.image || 'assets/images/placeholder.png';
  const time = service.time || '';
  const salary = service.salary || '';
  const after_disc = service.after_disc || salary;

  col.innerHTML = `
    <div class="card h-100 service-card">
      <div class="overflow-hidden">
        <img src="${image}" class="card-img-top" alt="${title}" loading="lazy" onerror="this.src='assets/images/backimage.png'">
      </div>
      <div class="card-body d-flex flex-column">
        <div class="time-badge">${time}</div>
        <h5 class="card-title">${title}</h5>
        <div class="price-container mb-3">
          <span class="original-price text-muted text-decoration-line-through">${salary}</span>
          <span class="discounted-price">${after_disc}</span>
        </div>
        <p class="card-text small">
          ${detailsArray.length > 0 ? detailsArray.slice(0, 2).join(' • ') : 'Luxury spa treatment'}
        </p>
        <div class="mt-auto d-flex justify-content-center gap-2">
          <button class="btn btn-primary btn-sm rounded-pill px-4" onclick="viewDetails('${service.id}')">
            ${viewDetailsText}
          </button>
          <button class="btn btn-success btn-sm rounded-pill px-4" onclick="addToCart('${service.id}')">
            ${addToCartText}
          </button>
        </div>
      </div>
    </div>
  `;

  return col;
}

// Parse time string to minutes for filtering
function parseTime(timeStr) {
  if (!timeStr) return 0;
  if (timeStr.includes('Hrs')) {
    const hours = parseInt(timeStr);
    return isNaN(hours) ? 0 : hours * 60;
  } else if (timeStr.includes('Mins')) {
    const mins = parseInt(timeStr);
    return isNaN(mins) ? 0 : parseInt(timeStr);
  }
  return 0;
}

// Update cart counter (from original file)
function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const counters = document.querySelectorAll('.cart-counter');
  counters.forEach(counter => {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    counter.textContent = totalItems;
  });
}

// Show checkout modal
function showCheckoutModal() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cart.length === 0) {
    alert('Your cart is empty. Please add services first.');
    return;
  }

  const selectedServicesDiv = document.getElementById('selectedServices');
  const totalPriceDiv = document.getElementById('totalPrice');

  let servicesHtml = '';
  let totalPrice = 0;

  cart.forEach(item => {
    // Robust price parsing
    let priceStr = (item.after_disc || item.salary || '0').toString();
    const itemPrice = parseFloat(priceStr.replace(/[^0-9.]/g, '')); // Strip currency symbols
    const quantity = item.quantity || 1;
    const itemTotal = (isNaN(itemPrice) ? 0 : itemPrice) * quantity;
    totalPrice += itemTotal;

    servicesHtml += `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div>
          <strong>${item.title}</strong>
          <span class="text-muted"> x${quantity}</span>
        </div>
        <span>€${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });

  if (selectedServicesDiv) selectedServicesDiv.innerHTML = servicesHtml || '<p class="text-muted">No services selected</p>';
  if (totalPriceDiv) totalPriceDiv.textContent = `€${totalPrice.toFixed(2)}`;

  const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
  modal.show();
}

// Confirm booking
function confirmBooking() {
  const form = document.getElementById('checkoutForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = document.getElementById('customerName').value;
  const date = document.getElementById('bookingDate').value;
  const time = document.getElementById('bookingTime').value;
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  if (cart.length === 0) {
    alert('Your cart is empty. Please add services first.');
    return;
  }

  let totalPrice = 0;
  let servicesList = '';

  cart.forEach(item => {
    let priceStr = (item.after_disc || item.salary || '0').toString();
    const itemPrice = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    const quantity = item.quantity || 1;
    const itemTotal = (isNaN(itemPrice) ? 0 : itemPrice) * quantity;
    totalPrice += itemTotal;
    servicesList += `• ${item.title} x${quantity} - €${itemTotal.toFixed(2)}\n`;
  });

  const message = `🌸 *New Booking - Women World Beauty & Spa* 🌸
📝 *Customer Details:*
Name: ${name}
Date: ${date}
Time: ${time}

💅 *Selected Services:*
${servicesList}
${getTransportationMessage()}
💰 *Total Price:* €${totalPrice.toFixed(2)}

📞 *Contact:* +201007920759
📍 *Location:* Hurghada, Egypt`;

  const whatsappUrl = `https://wa.me/201007920759?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');

  console.log('Booking details:', { name, date, time, cart, totalPrice });

  localStorage.removeItem('cart');
  updateCartCounter();

  const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
  if (checkoutModal) checkoutModal.hide();

  const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  if (successModal) successModal.show();

  form.reset();
  resetTransportation();
}

function resetTransportation() {
  const checkbox = document.getElementById('transportCheck');
  const detailsDiv = document.getElementById('transportDetails');
  if (checkbox) checkbox.checked = false;
  if (detailsDiv) detailsDiv.classList.add('d-none');
}

// Toggle Transportation Details
function toggleTransportDetails() {
  const checkbox = document.getElementById('transportCheck');
  const detailsDiv = document.getElementById('transportDetails');

  if (checkbox && detailsDiv) {
    if (checkbox.checked) {
      detailsDiv.classList.remove('d-none');
    } else {
      detailsDiv.classList.add('d-none');
    }
  }
}

function getTransportationMessage() {
  const checkbox = document.getElementById('transportCheck');
  if (checkbox && checkbox.checked) {
    const residence = document.getElementById('residenceSelect')?.value || 'Not specified';
    const room = document.getElementById('roomNumber')?.value || 'Not specified';
    return `
🚖 *Transportation Requested:*
📍 Residence: ${residence}
🔢 Room: ${room}
`;
  }
  return '';
}

// Setup event listeners
function setupEventListeners() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    });
  }

  const navContainer = document.querySelector('.sticky-nav-container');
  if (navContainer) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navContainer.classList.add('scrolled');
      } else {
        navContainer.classList.remove('scrolled');
      }
    });
  }

  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
}