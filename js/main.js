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
    skeleton.className = 'service-card-luxury skeleton';
    skeleton.innerHTML = `
            <div class="card-image-arched skeleton" style="margin-top: 20px;"></div>
            <div class="card-title-banner skeleton" style="height: 50px;"></div>
            <div class="card-info-row d-flex justify-content-between">
              <div class="skeleton" style="height: 20px; width: 60px;"></div>
              <div class="skeleton" style="height: 25px; width: 80px;"></div>
            </div>
            <div class="card-feature-list">
              <div class="feature-item skeleton" style="height: 35px; width: 100%;"></div>
              <div class="feature-item skeleton" style="height: 35px; width: 90%;"></div>
              <div class="feature-item skeleton" style="height: 35px; width: 95%;"></div>
            </div>
            <div class="card-action-bar">
              <div class="skeleton" style="height: 50px; flex-grow: 1; border-radius: 10px;"></div>
              <div class="skeleton" style="height: 50px; width: 55px; border-radius: 10px;"></div>
            </div>
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
      const cardCol = createServiceCard(service);
      fragment.appendChild(cardCol);
      const card = cardCol.querySelector('.service-card-luxury');
      if (card) cardObserver.observe(card);
    });
    container.appendChild(fragment);
  } else {
    container.innerHTML = '<div class="col-12 text-center py-5 text-muted">No services found in this category</div>';
  }
}

// --- Create reusable service card (Luxury Detailed) ---
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

  // Feature List Parser
  let features = [];
  if (langData && langData.details) {
    features = Object.values(langData.details).map(d => typeof d === 'object' ? d.name : d);
  } else if (langData && langData.description) {
    // Split by common separators if it's a flat string
    features = langData.description.split(/[•·.|\n]/).map(s => s.trim()).filter(s => s.length > 5);
  }

  // Fallback if no features
  if (features.length === 0) features = ['Premium Spa Experience', 'Professional Therapist', 'Luxury Products'];

  // Limit features to 7 for layout consistency
  const displayedFeatures = features.slice(0, 7);

  // Duration Logic (Check if 'duration' exists or extract from title/description)
  const duration = service.duration || '2'; // Default to 2 for demo if not found

  // Use Utils for pathing
  let imagePath = service.image || 'assets/images/placeholder.png';
  if (window.Utils) imagePath = window.Utils.resolvePath(imagePath);

  col.innerHTML = `
    <div class="service-card-luxury" onclick="window.location.href='pages/booking.html?id=${service.id}'">
      <div class="card-image-arched">
        <img src="${imagePath}" alt="${title}" loading="lazy" onerror="this.src='${window.Utils ? window.Utils.resolvePath('assets/images/placeholder.png') : ''}'">
      </div>
      
      <div class="card-title-banner">
        <span>${title}</span>
      </div>

      <div class="card-info-row">
        <div class="card-duration">${duration} <span>Hrs</span></div>
        <div class="card-price-stack">
          ${salary !== after_disc && salary ? `<span class="card-price-old">${currency}${salary}</span>` : ''}
          <div class="card-price-main"><span>${currency}</span>${after_disc}</div>
        </div>
      </div>

      <ul class="card-feature-list">
        ${displayedFeatures.map(f => `
          <li class="feature-item">
            <i class="fas fa-check"></i>
            <span>${f}</span>
          </li>
        `).join('')}
      </ul>

      <div class="card-action-bar">
        <div class="btn-book-luxury text-center" style="line-height: 1.5;">Book Now</div>
        <button class="btn-cart-luxury" onclick="event.stopPropagation(); window.addToCart('${service.id}')">
          <i class="fas fa-shopping-cart"></i>
        </button>
      </div>
    </div>
  `;

  return col;
}

// --- Scroll Animation Observer ---
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

// Unified Tab Handler
function handleTabClick(e) {
  const button = e.target.closest('.nav-link');
  if (!button) return;

  const category = button.getAttribute('data-category');
  const target = button.getAttribute('data-bs-target');
  const isLevel1Home = button.id === 'home-tab';
  const isLevel2Home = button.id === 'home-local-tab';

  const serviceNav = document.getElementById('service-nav-container');
  if (serviceNav) {
    if (target === '#home-content' || isLevel2Home) {
      serviceNav.style.display = 'block';
    } else if (button.closest('#primaryNav')) {
      // If clicking Salon or Gallery from level 1, hide service nav
      serviceNav.style.display = 'none';
    }
  }

  // Handle Level 1 Home clicking -> Ensure Tier 2 Home is active
  if (isLevel1Home) {
    const localHomeTab = document.getElementById('home-local-tab');
    if (localHomeTab) {
      // Bootstrap tab switch
      const tab = new bootstrap.Tab(localHomeTab);
      tab.show();
    }
  }

  if (target === '#home-content' || isLevel2Home) {
    renderHomeContent();
  } else if (target === '#salon-content') {
    renderSalonContent();
  } else if (target === '#gallery-content') {
    renderGalleryContent();
  } else {
    renderCategory(category || 'all');
  }

  const contentSection = document.querySelector('.tab-content');
  if (contentSection) {
    const yOffset = -120; // Adjusted for sticky header
    const y = contentSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function renderAllSections() {
  const activeTab = document.querySelector('.nav-link.active');
  const serviceNav = document.getElementById('service-nav-container');

  if (activeTab) {
    const target = activeTab.getAttribute('data-bs-target');
    const category = activeTab.getAttribute('data-category');
    const isLevel2Home = activeTab.id === 'home-local-tab';

    // Handle initial visibility
    if (serviceNav) {
      if (target === '#home-content' || isLevel2Home) {
        serviceNav.style.display = 'block';
      } else {
        serviceNav.style.display = 'none';
      }
    }

    if (target === '#home-content' || isLevel2Home) {
      renderHomeContent();
    } else if (target === '#salon-content') {
      renderSalonContent();
    } else if (target === '#gallery-content') {
      renderGalleryContent();
    } else {
      renderCategory(category || 'all');
    }
  } else {
    renderCategory('all');
  }
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
      <div class="text-center py-5 fade-in-up">
        <h2 class="section-title mb-4" data-i18n="welcome">Welcome to World Spa & Beauty</h2>
        <p class="lead mb-5" data-i18n="homeDescription">Experience luxury spa treatments in heart of Hurghada</p>
        <div class="row justify-content-center">
          <div class="col-md-10 col-lg-8">
            <div class="contact-card-minimal">
              <div class="card-body p-4 p-md-5">
                <h5 class="card-title-bw mb-5" data-i18n="contactInfo">Contact Information</h5>
                <div class="contact-info-grid">
                  <a href="tel:+201007920759" class="contact-item-minimal">
                    <div class="icon-bw"><i class="fas fa-phone"></i></div>
                    <span class="fw-bold">+201007920759</span>
                  </a>
                  <a href="mailto:minaabuseifen@gmail.com" class="contact-item-minimal">
                    <div class="icon-bw"><i class="fas fa-envelope"></i></div>
                    <span class="fw-bold">minaabuseifen@gmail.com</span>
                  </a>
                  <div class="contact-item-minimal">
                    <div class="icon-bw"><i class="fas fa-map-marker-alt"></i></div>
                    <span class="fw-bold">Hurghada, Egypt</span>
                  </div>
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

function renderSalonContent() {
  const container = document.getElementById('salon-content');
  if (container) {
    container.innerHTML = `
      <div class="py-5 fade-in-up">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4 mb-lg-0">
             <div class="salon-img-box">
                <img src="assets/images/backimage.png" alt="Salon" class="img-fluid w-100">
             </div>
          </div>
          <div class="col-lg-6 px-lg-5">
            <h2 class="section-title mb-4" data-i18n="salon">Our Salon</h2>
            <p class="text-muted mb-5 lead">Welcome to our state-of-the-art beauty salon. We offer a wide range of professional beauty treatments tailored to your needs.</p>
            <ul class="salon-services-list">
               <li><div class="icon-bw-small"><i class="fas fa-check"></i></div> <span>Professional Hair Styling</span></li>
               <li><div class="icon-bw-small"><i class="fas fa-check"></i></div> <span>Expert Makeup Services</span></li>
               <li><div class="icon-bw-small"><i class="fas fa-check"></i></div> <span>Premium Nail Care</span></li>
               <li><div class="icon-bw-small"><i class="fas fa-check"></i></div> <span>Luxury Facial Treatments</span></li>
            </ul>
          </div>
        </div>
      </div>
    `;
    if (typeof updateAllUIText === 'function') updateAllUIText();
  }
}

function renderGalleryContent() {
  const container = document.getElementById('gallery-content');
  if (container) {
    container.innerHTML = `
      <div class="py-5 fade-in-up">
         <h2 class="section-title text-center mb-5" data-i18n="gallery">Photo Gallery</h2>
         <div class="row g-3">
            <div class="col-6 col-md-4">
               <div class="gallery-item-bw">
                  <img src="assets/images/1.png" alt="Gallery 1" class="img-fluid w-100 gallery-img">
               </div>
            </div>
            <div class="col-6 col-md-4">
                <div class="gallery-item-bw">
                   <img src="assets/images/2.png" alt="Gallery 2" class="img-fluid w-100 gallery-img">
                </div>
             </div>
             <div class="col-6 col-md-4">
                <div class="gallery-item-bw">
                   <img src="assets/images/3.png" alt="Gallery 3" class="img-fluid w-100 gallery-img">
                </div>
             </div>
             <div class="col-6 col-md-4">
                <div class="gallery-item-bw">
                   <img src="assets/images/4.png" alt="Gallery 4" class="img-fluid w-100 gallery-img">
                </div>
             </div>
             <div class="col-6 col-md-4">
                <div class="gallery-item-bw">
                   <img src="assets/images/backimage.png" alt="Gallery 5" class="img-fluid w-100 gallery-img">
                </div>
             </div>
             <div class="col-6 col-md-4">
                <div class="gallery-item-bw">
                   <img src="assets/images/logo.jpg" alt="Gallery 6" class="img-fluid w-100 gallery-img">
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
      const icon = themeToggle.querySelector('i');
      if (icon) {
        if (document.body.classList.contains('dark-theme')) {
          icon.className = 'fas fa-sun';
        } else {
          icon.className = 'fas fa-moon';
        }
      } else {
        themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
      }
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

  // Horizontal Scroll Fade Logic
  const scrollTabs = document.querySelector('.scrolling-tabs-wrapper .nav-tabs');
  const scrollFade = document.querySelector('.scroll-fade-end');
  if (scrollTabs && scrollFade) {
    scrollTabs.addEventListener('scroll', () => {
      const remainingScroll = scrollTabs.scrollWidth - scrollTabs.clientWidth - scrollTabs.scrollLeft;
      if (remainingScroll < 10) {
        scrollFade.style.opacity = '0';
      } else {
        scrollFade.style.opacity = '1';
      }
    });
  }

  // Mouse Wheel to Horizontal Scroll for Tabs
  if (scrollTabs) {
    scrollTabs.addEventListener('wheel', (evt) => {
      evt.preventDefault();
      scrollTabs.scrollLeft += evt.deltaY;
    });
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
