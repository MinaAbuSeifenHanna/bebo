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
    // Instead of renderAllSections, we use the current router state
    if (window.currentPage && window.initPageScripts) {
      window.initPageScripts(window.currentPage, window.currentCategory);
    }

    // Setup event listeners
    setupEventListeners();
    // setupTabListeners(); // Removed for SPA

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
// Render Category (Scoped to container if provided)
function renderCategory(category, targetContainer = null) {
  const container = targetContainer || document.getElementById('all-services-grid');
  const titleEl = document.getElementById('section-title'); // Only relevant if no targetContainer or if explicitly wanting to update header

  if (!container) return;

  // Map UI categories (plural) to Firestore keys (singular)
  const categoryMap = {
    'massages': 'massage',
    'scrubs': 'scrub',
    'massages': 'massage',
    'scrubs': 'scrub',
    'hammam': 'hammam',
    'packages': 'packages',
    'salon': 'salon'
  };

  const dbCategory = categoryMap[category] || category;

  // Filter Data
  const services = getCurrentServices();
  if (!services || services.length === 0) {
    renderSkeletons();
    return;
  }

  container.innerHTML = '';

  let filteredServices;
  if (category === 'all') {
    const salonServices = services.filter(s => s.category === 'salon').sort((a, b) => (parseInt(a.id) || 0) - (parseInt(b.id) || 0)).slice(0, 2);
    const otherServices = services.filter(s => s.category !== 'salon');
    filteredServices = [...salonServices, ...otherServices];
  } else {
    filteredServices = services.filter(s => s.category === dbCategory);
  }

  // Sort: Prioritize Salon if 'all', otherwise sort by ID
  filteredServices.sort((a, b) => {
    if (category === 'all') {
      const isSalonA = a.category === 'salon';
      const isSalonB = b.category === 'salon';
      if (isSalonA && !isSalonB) return -1;
      if (!isSalonA && isSalonB) return 1;
    }
    return (parseInt(a.id) || 0) - (parseInt(b.id) || 0);
  });

  // Update Header (UI requires original key for i18n lookup)
  if (titleEl) {
    let titleKey = category === 'all' ? 'allServices' : category;
    // Special handling if i18n keys differ from category names
    if (category === 'scrubs') titleKey = 'scrub';
    if (category === 'massages') titleKey = 'massages';

    titleEl.setAttribute('data-i18n', titleKey);
    if (typeof getUIText === 'function') {
      titleEl.textContent = getUIText(titleKey);
    }
  }

  // Render Cards
  if (filteredServices.length > 0) {
    const fragment = document.createDocumentFragment();
    filteredServices.forEach(service => {
      const cardCol = createServiceCard(service);
      fragment.appendChild(cardCol);
      // SPA Observer Logic:
      // Note: cardObserver must be active. 
      const card = cardCol.querySelector('.service-card-luxury');
      if (card && typeof cardObserver !== 'undefined') cardObserver.observe(card);
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

  // Title is already translated by working-language-system.js
  const title = service.title || 'Service';

  // Price Logic (New Schema)
  const priceObj = service.price_info || {};
  const currency = priceObj.currency || '€';
  const salary = priceObj.salary;
  const after_disc = priceObj.after_disc;
  const mainPrice = after_disc !== undefined ? after_disc : (salary || 0);

  // Feature List Parser
  let features = [];
  if (service.details && typeof service.details === 'object') {
    // Service details is now an object { "1": "val", ... }
    features = Object.values(service.details);
  } else if (service.description) {
    // Fallback if description string exists
    features = service.description.split(/[•·.|\n]/).map(s => s.trim()).filter(s => s.length > 5);
  }

  // Fallback if no features
  if (features.length === 0) features = ['Premium Spa Experience', 'Professional Therapist', 'Luxury Products'];

  // Limit features to 7 for layout consistency
  const displayedFeatures = features.slice(0, 7);

  // Duration Logic (Check if 'duration' exists or extract from title/description)
  // service.time is "3 Hrs" string
  let duration = service.time ? service.time.replace(/[^\d.]/g, '') : '2';
  if (!duration) duration = '2';

  // Use Utils for pathing
  let imagePath = service.image || 'assets/images/placeholder.png';
  if (window.Utils) imagePath = window.Utils.resolvePath(imagePath);

  col.innerHTML = `
    <div class="service-card-luxury">
      <div class="card-image-arched" onclick="window.location.hash = '#details?id=${service.id}'" style="cursor: pointer;">
        <img src="${imagePath}" alt="${title}" loading="lazy" onerror="this.src='${window.Utils ? window.Utils.resolvePath('assets/images/placeholder.png') : ''}'">
      </div>
      
      <div class="card-title-banner">
        <a href="#details?id=${service.id}" data-link style="color: white; text-decoration: none;">${title}</a>
      </div>

      <div class="card-info-row">
        ${service.category !== 'salon' ? `<div class="card-duration">${duration} <span>Hrs</span></div>` : '<div></div>'}
        <div class="card-price-stack">
          ${salary !== undefined && after_disc !== undefined && salary > after_disc ? `<span class="card-price-old">${currency}${salary}</span>` : ''}
          <div class="card-price-main"><span>${currency}</span>${mainPrice}</div>
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
        <a href="#booking?id=${service.id}" data-link class="btn-book-luxury text-center text-decoration-none" style="line-height: 1.5; display: block;">Book Now</a>
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

// --- REFACTORED FOR SPA ---

window.initPageScripts = function (page, category) {
  console.log(`[initPageScripts] Page: ${page}, Category: ${category} `);

  // Update Global UI Text (Translations)
  if (typeof updateAllUIText === 'function') updateAllUIText();
  if (typeof updateCartCounter === 'function') window.updateCartCounter();

  // Handle Page Specifics
  if (page === 'services') {
    renderCategory(category || 'all');
  } else if (page === 'salon') {
    const salonGrid = document.getElementById('salon-services-grid');
    if (salonGrid) {
      renderCategory('salon', salonGrid);
    }
  } else if (page === 'home') {
    const homeGrid = document.getElementById('home-services-grid');
    if (homeGrid) {
      // Render all services or a subset
      renderCategory('all', homeGrid);
    }
  } else if (page === 'details') {
    // Get ID from global params exposed by router
    const id = window.currentParams?.id;
    if (id) initDetailsPage(id);
    else console.error("Missing ID for details page");
  } else if (page === 'booking') {
    const id = window.currentParams?.id;
    const mode = window.currentParams?.mode;
    if (id || mode === 'cart') initBookingPage(id);
    else console.error("Missing ID/Mode for booking page");
  } else if (page === 'cart') {
    if (window.renderCart) window.renderCart();
  }

  // Re-trigger skeleton if needed or data check
  if (window.isFirebaseLoaded === false) {
    console.log("Firebase not loaded yet, skeletons should be visible");
  }
};

// Logic for Details Page (Merged from service-details.js)
function initDetailsPage(serviceId) {
  console.log("Initializing Details for:", serviceId);

  // Find Service
  // Find Service
  // Wait for data if not ready
  if (!window.allServices || window.allServices.length === 0) {
    // Retry or wait - handled by event listener usually
    // But we can try fallback fetch here too
    console.log("⚠️ Cache empty, attempting direct fetch...");
  } else {
    // Try finding in existing cache
    let service = window.allServices.find(s => String(s.id) === String(serviceId));
    if (service) {
      renderDetailsContent(service);
      return;
    }
  }

  // Fallback: Fetch from Firestore directly
  // Determine collection based on ID prefix
  if (window.firebaseDB) {
    const isSalon = String(serviceId).startsWith('salon-');
    const collectionName = isSalon ? 'salon' : 'services';
    const docId = isSalon ? String(serviceId).replace('salon-', '') : String(serviceId);

    console.log(`Fetching direct: ${collectionName} -> ${docId}`);

    window.firebaseDB.collection(collectionName).doc(docId).get().then(doc => {
      if (doc.exists) {
        const data = doc.data();
        const service = { ...data, id: serviceId }; // Keep namespaced ID
        renderDetailsContent(service);
      } else {
        safeSetText('det-title', 'Service Not Found');
      }
    }).catch(err => {
      console.error("Error fetching service:", err);
      safeSetText('det-title', 'Error Loading Service');
    });
  } else {
    safeSetText('det-title', 'Loading...');
  }
}

function safeSetText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderDetailsContent(service) {
  // Render Data
  const lang = localStorage.getItem('selectedLanguage') || 'en';
  const data = (service.translations && service.translations[lang]) ? service.translations[lang] : (service.translations?.['en'] || {});
  const title = data.title || service.title || 'Service Details';

  const titleEl = document.getElementById('det-title');
  if (titleEl) titleEl.textContent = title;

  const timeEl = document.getElementById('det-time');
  if (timeEl) {
    if (service.category === 'salon') {
      // Hide parent container if possible, or just the value
      timeEl.parentElement.style.display = 'none';
    } else {
      timeEl.parentElement.style.display = 'block'; // Ensure visible for others
      timeEl.textContent = service.duration || service.time || '2 Hrs';
    }
  }

  // Price
  const priceObj = service.price_info || {};
  const currency = priceObj.currency || '€';
  const salary = priceObj.salary;
  const afterDisc = priceObj.after_disc;
  const mainPrice = afterDisc !== undefined ? afterDisc : (salary || 0);

  const priceEl = document.getElementById('det-new-price');
  if (priceEl) priceEl.textContent = `${currency}${mainPrice} `;

  const oldPriceEl = document.getElementById('det-old-price');
  if (oldPriceEl) {
    if (salary !== undefined && afterDisc !== undefined && salary > afterDisc) {
      oldPriceEl.textContent = `${currency}${salary} `;
      oldPriceEl.style.display = 'inline';
    } else {
      oldPriceEl.style.display = 'none';
    }
  }



  // Features
  const stepsCont = document.getElementById('det-steps');
  if (stepsCont && data.details) {
    stepsCont.innerHTML = Object.values(data.details).map(detailStr => `
      <div class="details-feature-item">
        <i class="fas fa-check"></i>
        <div class="f-content">
          <strong>${detailStr}</strong>
        </div>
      </div>
    `).join('');
  }

  // Render "What to Bring"
  renderWhatToBring(service);
}

// Helper to render "What to Bring" section
function renderWhatToBring(service) {
  // 1. Check if Salon (Skip)
  if (service.category === 'salon') {
    const existing = document.getElementById('what-to-bring-container');
    if (existing) existing.remove();
    return;
  }

  // 2. Get Translations
  if (typeof spaTranslations === 'undefined') {
    console.warn("spaTranslations not loaded for What To Bring section");
    return;
  }

  const lang = localStorage.getItem('selectedLanguage') || 'en';
  const t = spaTranslations[lang] || spaTranslations['en'];

  if (!t) return;

  // 3. Find Placement (After Features Grid)
  const featuresGrid = document.getElementById('det-steps');
  if (!featuresGrid || !featuresGrid.parentNode) return;

  // 4. Create or Update Container
  let container = document.getElementById('what-to-bring-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'what-to-bring-container';
    container.className = 'details-feature-grid fade-in-up mt-5 p-4';
    container.style.backgroundColor = 'var(--bg-light)';
    container.style.borderRadius = '12px';
    featuresGrid.parentNode.insertBefore(container, featuresGrid.nextSibling);
  }

  // 5. Inject Content
  container.innerHTML = `
        <h3 class="mb-4" style="font-weight: 800; font-family: 'Inter', sans-serif;">${t.title}</h3>
        <div class="d-flex flex-column gap-3">
            <div class="d-flex align-items-start">
                <i class="fas fa-check-circle text-success me-3 mt-1" style="font-size: 1.2rem;"></i>
                <div style="font-size: 1.1rem; font-weight: 500;">
                    ${t.item1}
                </div>
            </div>
             <div class="d-flex align-items-start">
                <i class="fas fa-check-circle text-success me-3 mt-1" style="font-size: 1.2rem;"></i>
                <div style="font-size: 1.1rem; font-weight: 500;">
                    ${t.item2}
                </div>
            </div>
        </div>
    `;
}

// Logic for Booking Page (Merged from booking.js)
function initBookingPage(serviceId) {
  const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
  const isCartMode = urlParams.get('mode') === 'cart';

  console.log("Initializing Booking for:", isCartMode ? "Cart Mode" : serviceId);

  // Setup Title
  const titleEl = document.getElementById('book-title');

  // SHARED FORM LOGIC
  const setupFormSubmission = (onSubmit) => {
    // Unbind old listeners to prevent duplication if SPA re-renders (though innerHTML refill usually handles this, safe to override)
    window.submitSingleBooking = onSubmit;
  };

  if (isCartMode) {
    // --- CART MODE ---
    if (titleEl) titleEl.textContent = "Booking Your Selection";

    const cartTotal = window.getCartTotal ? window.getCartTotal() : 0;
    // You could append total price to title or subtitle here

    setupFormSubmission(function (method = 'whatsapp') {
      // Reuse Cart Submission Logic (from cart.js or duplicated here)
      const name = document.getElementById('form-name').value;
      const date = document.getElementById('form-date').value;
      const time = document.getElementById('form-time').value;
      const residence = document.getElementById('form-residence').value;
      const room = document.getElementById('form-room').value;
      const notes = document.getElementById('form-notes').value;

      if (!name || !date || !time) {
        alert('Please fill in required fields');
        return;
      }

      const customerData = { name, phone: document.getElementById('form-phone').value, date, time, residence, room, notes };

      if (window.processBooking) {
        window.processBooking(customerData, method);
        // After booking, maybe redirect home?
        // window.location.hash = '#home'; // Process booking does this now
      } else {
        console.error("processBooking not found");
      }
    });

  } else {
    // --- SINGLE SERVICE MODE ---
    if (!window.allServices || window.allServices.length === 0) return;
    const service = window.allServices.find(s => String(s.id) === String(serviceId));
    if (!service) return;

    const lang = localStorage.getItem('selectedLanguage') || 'en';
    const data = service.translations?.[lang] || service.translations?.['en'];

    if (titleEl) titleEl.textContent = data.title;

    setupFormSubmission(function (method = 'whatsapp') {
      const name = document.getElementById('form-name').value;
      const date = document.getElementById('form-date').value;
      const time = document.getElementById('form-time').value;
      const residence = document.getElementById('form-residence').value || 'Seegull hotel';
      const room = document.getElementById('form-room').value || '22';

      if (!name || !date || !time) {
        alert('Please fill in required fields');
        return;
      }

      // Construct Message
      const currency = service.price_info?.currency || '€';
      const price = service.price_info.after_disc;
      const duration = data.duration || service.duration || 'N/A';

      const message = `Dear world SPA AND BEAUTY SALON 
    
Kindly I want to reserve the following services:
    
Name : ${name}
    
Date : ${date}
    
Time : ${time}
    
Hotel : ${residence}
    
Room Number : ${room}
    
Title : *${data.title}*
    
Duration : ${duration}
    
Price per person : ${price}${currency}
    
Quantity : 1
    
Total : ${price}${currency}
    
Confirm via: https://womenworldspa.com`;

      if (method === 'email') {
        const subject = encodeURIComponent("Booking Request - " + data.title);
        const body = encodeURIComponent(message.replace(/\*/g, ''));
        window.open(`mailto:worldspahurghada@gmail.com?subject=${subject}&body=${body}`, '_blank');
      } else {
        // WhatsApp
        const waLink = `https://wa.me/201007920759?text=${encodeURIComponent(message)}`;
        window.open(waLink, '_blank');
      }

      // Clean up or redirect
      window.history.back();
    });
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
  // Theme toggle is handled globally by theme.js via onclick="toggleTheme()"

  const navContainer = document.querySelector('.sticky-header-wrapper');
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
// Upload JSON to Firestore (Temporary Helper)
window.uploadServiceJsonToFirestore = async function (servicesData) {
  console.log('🚀 Starting JSON upload to Firestore...');

  if (!window.firebaseDB) {
    console.error('❌ Firebase not initialized. Cannot upload.');
    return;
  }

  if (!servicesData || !Array.isArray(servicesData)) {
    console.error('❌ Invalid data provided. Please pass the JSON array as an argument.');
    alert('Please pass the JSON array as an argument: uploadServiceJsonToFirestore([...])');
    return;
  }

  try {
    console.log(`📂 Processing ${servicesData.length} services...`);

    const collection = window.firebaseDB.collection('services');
    let count = 0;

    for (const service of servicesData) {
      if (!service.id) {
        console.warn('⚠️ Skipping service without ID:', service);
        continue;
      }

      // Use setDoc (overwrite) using string ID
      await collection.doc(String(service.id)).set(service);
      console.log(`✅ Uploaded Service ID: ${service.id}`);
      count++;
    }

    console.log(`🎉 Successfully uploaded ${count} services to Firestore!`);
    alert(`Successfully uploaded ${count} services to Firestore!`);

  } catch (error) {
    console.error('❌ Upload failed:', error);
    alert('Upload failed. Check console for details.');
  }
};

// Expose globally for language system
window.renderAllSections = renderAllSections;
window.renderCategory = renderCategory;
window.renderHomeContent = renderHomeContent;
window.renderSalonContent = renderSalonContent;
window.renderGalleryContent = renderGalleryContent;

// Check if we need to auto-trigger based on URL hash or params could be added here

