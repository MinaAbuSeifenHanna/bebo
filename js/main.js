// main.js - Enhanced main application logic
// Global variables
let isInitialized = false;

// Event-based Initialization
window.addEventListener('services-loaded', (e) => {
  console.log('🚀 Event: services-loaded received');
  initializeApp();
});

function initializeApp() {
  if (isInitialized) return;

  try {
    console.log('🚀 Starting page initialization...');

    // Wait for Firebase to be ready (Double check)
    if (!window.isFirebaseLoaded) {
      console.log('⏳ Waiting for Firebase data...');
      return; // Will be triggered by event later
    }

    // Initialize language
    if (typeof initializeLanguageSystem === 'function') {
      initializeLanguageSystem();
    }

    // Render initial services
    renderAllSections();

    // Setup event listeners
    setupEventListeners();
    setupTabListeners();

    // Initial UI Updates
    if (typeof window.updateCartCounter === 'function') window.updateCartCounter();

    isInitialized = true;
    console.log('✅ Initialization complete');
  } catch (error) {
    console.error('❌ Initialization error:', error);
  }
}

// Backup initialization (for cache or if event missed)
document.addEventListener('DOMContentLoaded', function () {
  if (window.isFirebaseLoaded) {
    initializeApp();
  }
});

// Helper to safely get current services from Firebase ONLY
function getCurrentServices() {
  return window.allServices || [];
}

// Force services to be visible
function forceServicesVisible() {
  const servicesContent = document.getElementById('services-content');
  if (servicesContent) {
    servicesContent.classList.add('show', 'active');
  }
}

// --- Skeleton Loader ---
function renderSkeletons() {
  const container = document.getElementById('all-services-grid');
  if (!container) return;

  container.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
            <div class="skeleton-image skeleton"></div>
            <div class="skeleton-title skeleton"></div>
            <div class="skeleton-text skeleton"></div>
            <div class="skeleton-text skeleton" style="width: 50%"></div>
            <div class="skeleton-button skeleton"></div>
        `;
    container.appendChild(skeleton);
  }
}

// --- Render Main Content based on Category ---
function renderCategory(category) {
  const container = document.getElementById('all-services-grid');
  const titleEl = document.getElementById('section-title');

  if (!container) return;

  // Update Header
  if (titleEl) {
    let titleKey = category === 'all' ? 'allServices' : category;
    if (category === 'scrubs') titleKey = 'scrub';
    titleEl.setAttribute('data-i18n', titleKey);
    if (typeof getUIText === 'function') {
      titleEl.textContent = getUIText(titleKey);
    }
  }

  // Filter Data
  const services = getCurrentServices();
  if (!services || services.length === 0) {
    renderSkeletons();
    return;
  }

  container.innerHTML = '';

  let filteredServices = category === 'all'
    ? services
    : services.filter(s => s.category === category);

  // Render Cards
  if (filteredServices.length > 0) {
    const fragment = document.createDocumentFragment();
    filteredServices.forEach(service => {
      fragment.appendChild(createServiceCard(service));
    });
    container.appendChild(fragment);
  } else {
    container.innerHTML = '<div class="col-12 text-center py-5 text-muted">No services found in this category</div>';
  }
}

// --- Create reusable service card ---
function createServiceCard(service) {
  const col = document.createElement('div');
  col.className = 'fade-in-up';

  const currentLang = localStorage.getItem('selectedLanguage') || 'en';
  const langData = service.translations ? service.translations[currentLang] || service.translations['en'] : null;
  const title = langData ? langData.title : (service.title || 'Service');

  const priceObj = service.price_info || {};
  const currency = priceObj.currency || '€';
  const salary = priceObj.salary || '';
  const after_disc = priceObj.after_disc || salary;

  const priceHtml = (salary === after_disc || !salary)
    ? `<span class="discounted-price">${currency}${after_disc}</span>`
    : `<span class="original-price">${currency}${salary}</span>
       <span class="discounted-price">${currency}${after_disc}</span>`;

  let detailsText = 'Experience a luxury spa treatment designed for relaxation and rejuvenation.';
  if (langData && langData.description) {
    detailsText = langData.description;
  } else if (langData && langData.details) {
    const detailsArray = Object.values(langData.details).map(d => typeof d === 'object' ? d.name : d);
    detailsText = detailsArray.join(' • ');
  }

  // Use Utils for pathing
  let imagePath = service.image || 'assets/images/placeholder.png';
  if (window.Utils) imagePath = window.Utils.resolvePath(imagePath);

  col.innerHTML = `
    <div class="service-card">
      <div class="card-img-wrapper">
        <img src="${imagePath}" alt="${title}" loading="lazy" onerror="this.src='${window.Utils ? window.Utils.resolvePath('assets/images/backimage.png') : ''}'">
        <div class="duration-badge">
             <i class="far fa-clock me-1"></i> ${service.time || '60 Mins'}
        </div>
      </div>
      <div class="card-body">
        <h5 class="card-title text-primary-custom">${title}</h5>
        <p class="card-text">${detailsText}</p>
        <div class="price-container d-flex align-items-center mb-3">
          ${priceHtml}
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary-custom btn-sm flex-grow-1" onclick="viewDetails('${service.id}')">
            <i class="fas fa-info-circle me-1"></i> ${typeof getUIText === 'function' ? getUIText('viewDetails') : 'Details'}
          </button>
          <button class="btn btn-success-custom btn-sm" onclick="window.addToCart('${service.id}')">
            <i class="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  return col;
}

// Unified Tab Handler
function handleTabClick(e) {
  const button = e.target.closest('.nav-link');
  if (!button) return;

  const category = button.getAttribute('data-category');
  const target = button.getAttribute('data-bs-target');

  if (target === '#home-content') {
    renderHomeContent();
  } else {
    renderCategory(category || 'all');
  }

  const contentSection = document.querySelector('.tab-content');
  if (contentSection) {
    const yOffset = -100;
    const y = contentSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function renderAllSections() {
  renderCategory('all');
}

function setupTabListeners() {
  document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', handleTabClick);
  });
}

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

// Show checkout modal (bridge to Cart UI)
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
    // Rely on price_info if available, else duplicate the parsing logic? 
    // Best to reuse logic, but for now simple fallback
    const price = parseFloat(item.price_info?.after_disc || item.price_info?.salary || 0);
    const quantity = item.quantity || 1;
    const itemTotal = price * quantity;
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

  if (selectedServicesDiv) selectedServicesDiv.innerHTML = servicesHtml;
  if (totalPriceDiv) totalPriceDiv.textContent = `€${totalPrice.toFixed(2)}`;

  const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
  modal.show();
}

// Confirm booking handler for Modal (Checkout)
function confirmBooking() {
  const form = document.getElementById('checkoutForm');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const name = document.getElementById('customerName').value;
  const date = document.getElementById('bookingDate').value;
  const time = document.getElementById('bookingTime').value;

  // Optional Transport
  const transportCheck = document.getElementById('transportCheck');
  let notes = '';
  if (transportCheck && transportCheck.checked) {
    const residence = document.getElementById('residenceSelect')?.value || 'N/A';
    const room = document.getElementById('roomNumber')?.value || 'N/A';
    notes = `Requesting transportation from ${residence}, Room ${room}`;
  }

  window.processBooking({
    name,
    date,
    time,
    notes
  });

  form.reset();
}

// Sidebar Submission
window.submitSidebarBooking = function () {
  const name = document.getElementById('sidebarName').value;
  const phone = document.getElementById('sidebarPhone').value;
  const date = document.getElementById('sidebarDate').value;
  const time = document.getElementById('sidebarTime').value;

  if (!name || !date || !time) {
    alert('Please fill in required fields');
    return;
  }

  window.processBooking({
    name,
    phone,
    date,
    time
  });
};

function toggleTransportDetails() {
  const checkbox = document.getElementById('transportCheck');
  const detailsDiv = document.getElementById('transportDetails');
  if (checkbox && detailsDiv) {
    checkbox.checked ? detailsDiv.classList.remove('d-none') : detailsDiv.classList.add('d-none');
  }
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
      window.scrollY > 50 ? navContainer.classList.add('scrolled') : navContainer.classList.remove('scrolled');
    });
  }

  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }
}

window.viewDetails = function (id) {
  if (!id) return;
  // Use absolute relative path safe for subfolders too? 
  // If we are in root: pages/service-details.html
  // If we are in pages/: service-details.html
  // Best to use Utils.resolvePath logic or simply absolute path if we hosted on root.
  // Assuming basic structure:
  // If current location has /pages/, we don't need prefix.

  if (window.location.pathname.includes('/pages/')) {
    window.location.href = `service-details.html?id=${id}`;
  } else {
    window.location.href = `pages/service-details.html?id=${id}`;
  }
};
