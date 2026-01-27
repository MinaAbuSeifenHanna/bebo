// js/cart.js - Unified Cart System
// Depends on: js/utils.js (for pathing)

(function () {
  // --- State ---
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let cartSidebarInstance = null;

  // --- Core Cart Functions ---

  // Save to LocalStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  }

  // Add Item
  window.addToCart = function (serviceId) {
    // 1. Check Data Availability
    if (!window.allServices || window.allServices.length === 0) {
      console.warn('⚠️ Services data not loaded yet.');
      alert('Please wait for services to load...');
      return;
    }

    // 2. Find Service
    const service = window.allServices.find(s => String(s.id) === String(serviceId));
    if (!service) {
      console.error(`Service with ID ${serviceId} not found.`);
      return;
    }

    // 3. Prepare Cart Item (Multi-language support)
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    const langData = service.translations?.[currentLang] || service.translations?.['en'];
    const title = langData ? langData.title : (service.title || 'Service');

    const product = {
      id: service.id,
      title: title, // Store current language title, or maybe store English and translate on render?
      // Storing displayed title is easier for now, but less flexible if lang changes.
      // Ideally we store only ID and quantity, and look up details on render. 
      // But for safety (if service deleted), we store snapshot.
      price_info: service.price_info, // Store full price object
      image: service.image,
      quantity: 1,
      addedAt: new Date().toISOString()
    };

    // 4. Update Cart
    const existingIndex = cart.findIndex(item => String(item.id) === String(serviceId));
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(product);
    }

    saveCart();

    // 5. User Feedback
    // Cart is now a standalone page, so we just update the UI counters
    /*
    const sidebarEl = document.getElementById('cartSidebar');
    if (sidebarEl) {
      toggleCartSidebar(true);
    } else {
      alert(`✅ Added to cart: ${title}`);
    }
    */
    alert(`✅ Added to cart: ${title}`);
  };

  // Remove Item
  window.removeFromCart = function (serviceId) {
    const index = cart.findIndex(item => String(item.id) === String(serviceId));
    if (index > -1) {
      cart.splice(index, 1);
      saveCart();
    }
  };

  // Clear Cart
  window.clearCart = function () {
    cart = [];
    saveCart();
  };

  // Get Cart Totals
  window.getCartTotal = function () {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price_info?.after_disc || item.price_info?.salary || 0);
      return total + (price * (item.quantity || 1));
    }, 0);
  };

  window.getCartCount = function () {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  // --- UI/Rendering Functions ---

  function updateCartUI() {
    // 1. Update Counters (Badges)
    const count = window.getCartCount();
    const badges = document.querySelectorAll('.cart-counter');
    badges.forEach(el => {
      el.textContent = count;
      el.classList.remove('animate-bounce');
      void el.offsetWidth; // trigger reflow
      if (count > 0) el.classList.add('animate-bounce');
    });

    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) cartBadge.textContent = count;

    // 2. Update Sidebar if Open/Exist
    renderCartSidebarItems();

    // 3. Update Checkout Modal if Open (if used)
    if (typeof renderCheckoutModalItems === 'function') renderCheckoutModalItems();
  }

  // Sidebar Management
  window.toggleCartSidebar = function (forceOpen = false) {
    const el = document.getElementById('cartSidebar');
    if (!el) return;

    if (!cartSidebarInstance) {
      cartSidebarInstance = new bootstrap.Offcanvas(el);
    }

    if (forceOpen === true) {
      cartSidebarInstance.show();
    } else {
      cartSidebarInstance.toggle();
    }

    renderCartSidebarItems();
  };

  function renderCartSidebarItems() {
    const container = document.getElementById('cartItemsContainer');
    const footer = document.getElementById('cartFooter');
    const totalEl = document.getElementById('sidebarTotal');

    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="fas fa-shopping-basket fa-3x mb-3 opacity-50"></i>
                    <p>Your cart is empty</p>
                    <button class="btn btn-sm btn-outline-primary" data-bs-dismiss="offcanvas">Start Shopping</button>
                </div>
            `;
      if (footer) footer.style.display = 'none';
      if (totalEl) totalEl.textContent = '€0.00';
      return;
    }

    if (footer) footer.style.display = 'block';

    container.innerHTML = cart.map(item => {
      const price = parseFloat(item.price_info?.after_disc || 0).toFixed(2);
      const currency = item.price_info?.currency || '€';

      let imgPath = item.image || 'assets/images/placeholder.png';
      if (window.Utils && window.Utils.resolvePath) {
        imgPath = window.Utils.resolvePath(imgPath);
      }

      return `
                <div class="cart-item-luxury fade-in-up" style="opacity: 1; transform: translateY(0);">
                    <div class="cart-img-pill">
                        <img src="${imgPath}" alt="${item.title}" onerror="this.src='${window.Utils ? window.Utils.resolvePath('assets/images/placeholder.png') : ''}'">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${price}${currency} x ${item.quantity}</div>
                    </div>
                    <button class="btn btn-sm text-danger border-0 bg-transparent" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
    }).join('');

    const subtotal = window.getCartTotal().toFixed(2);
    const currency = cart[0]?.price_info?.currency || '€';

    // Update Footer with Luxury Total
    if (footer) {
      footer.innerHTML = `
            <div id="cartFooterItems">
              <div class="cart-total-row">
                  <span class="cart-total-label">Total Amount</span>
                  <span class="cart-total-value">${subtotal}${currency}</span>
              </div>
              <button class="btn-book-luxury w-100 py-3" onclick="showCheckoutForm()">
                  Proceed to Booking
              </button>
            </div>
        `;
    }
  }

  // --- Sidebar View Toggles ---
  window.showCheckoutForm = function () {
    // Check both potential containers (offcanvas or standalone page)
    const itemsCont = document.getElementById('cartItemsContainer') || document.getElementById('cart-items');
    const formCont = document.getElementById('checkoutFormContainer') || document.getElementById('checkout-form-container');
    const footer = document.getElementById('cartFooterItems') || document.getElementById('cart-page-footer');
    const pageTitle = document.getElementById('cart-page-title');

    if (itemsCont) itemsCont.classList.add('d-none');
    if (formCont) formCont.classList.remove('d-none');
    if (footer) footer.classList.add('d-none');
    if (pageTitle) pageTitle.style.display = 'none';
  };

  window.showCartItems = function () {
    const itemsCont = document.getElementById('cartItemsContainer') || document.getElementById('cart-items');
    const formCont = document.getElementById('checkoutFormContainer') || document.getElementById('checkout-form-container');
    const footer = document.getElementById('cartFooterItems') || document.getElementById('cart-page-footer');
    const pageTitle = document.getElementById('cart-page-title');

    if (itemsCont) itemsCont.classList.remove('d-none');
    if (formCont) formCont.classList.add('d-none');
    if (footer) footer.classList.remove('d-none');
    if (pageTitle) pageTitle.style.display = 'block';
  };

  window.submitSidebarBooking = function () {
    const name = document.getElementById('sidebarName').value;
    const phone = document.getElementById('sidebarPhone').value;
    const date = document.getElementById('sidebarDate').value;
    const time = document.getElementById('sidebarTime').value;

    if (!name || !date || !time) {
      alert('Please fill in all required fields');
      return;
    }

    const customerData = { name, phone, date, time };
    window.processBooking(customerData);
  };

  window.submitCartBooking = function () {
    const name = document.getElementById('cart-name').value;
    const phone = document.getElementById('cart-phone').value;
    const date = document.getElementById('cart-date').value;
    const time = document.getElementById('cart-time').value;
    const notes = document.getElementById('cart-notes').value;
    const transport = document.getElementById('cart-transport').checked;
    const residence = document.getElementById('cart-residence').value;
    const room = document.getElementById('cart-room').value;

    if (!name || !date || !time) {
      alert('Please fill in all required fields');
      return;
    }

    const customerData = { name, phone, date, time, notes, transport, residence, room };
    window.processBooking(customerData);
  };

  // --- Booking Logic (Unified) ---
  // This handles the WhatsApp message generation
  window.processBooking = function (customerData) {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    // تجهيز لستة الخدمات بالشكل الجديد
    let servicesList = '';
    cart.forEach(item => {
      // جلب العنوان بناءً على اللغة الحالية
      const lang = window.currentLang || 'en';
      const title = item.translations?.[lang]?.title || item.translations?.['en']?.title || item.title;
      const pricePerPerson = parseFloat(item.price_info?.after_disc || 0);
      const currency = item.price_info?.currency || '€';
      const duration = item?.time || 'N/A';

      servicesList += `Title : *${title}*

Duration : ${duration}

Price per person : ${pricePerPerson}${currency}

Quantity : ${item.quantity}

`;
    });

    const total = window.getCartTotal().toFixed(2);
    const currency = cart[0]?.price_info?.currency || '€';

    // بناء الرسالة بالصيغة المطلوبة بالظبط
    const message = `Dear world SPA AND BEAUTY SALON 

Kindly I want to reserve the following services:

Name : ${customerData.name}

Date : ${customerData.date}

Time : ${customerData.time}

Hotel : ${customerData.residence || 'Seegull hotel'}

Room Number : ${customerData.room || '22'}

${servicesList}Total : ${total}${currency}

Confirm via: https://womenworldspa.com`;

    // رقم الواتساب الخاص بك
    const waLink = `https://wa.me/201007920759?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');

    // مسح السلة وقفل المودال
    window.clearCart();
    if (cartSidebarInstance) cartSidebarInstance.hide();
    const modalEl = document.getElementById('checkoutModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }

    // إظهار رسالة النجاح
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    if (successModal) successModal.show();
  };
  // --- Cart Page Rendering (for cart.html) ---
  window.renderCart = function () {
    const container = document.getElementById('cart-items');
    const footer = document.getElementById('cart-page-footer');
    const totalEl = document.getElementById('cart-page-total');

    if (!container) return; // Not on cart page

    const count = window.getCartCount();
    const titleEl = document.getElementById('cart-page-title');
    if (titleEl) {
      titleEl.textContent = count > 0 ? `Your Selection (${count} ${count === 1 ? 'Service' : 'Services'})` : 'Your Selection';
    }

    if (cart.length === 0) {
      container.innerHTML = `
                <div class="text-center py-5">
                    <div class="mb-4" style="font-size: 3rem; opacity: 0.1;"><i class="fas fa-shopping-bag"></i></div>
                    <p class="text-muted" style="text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem;">Your selection is currently empty</p>
                    <a href="../index.html" class="btn-book-luxury d-inline-block mt-3 px-4 py-2" style="width: auto; text-decoration: none;">Explore Services</a>
                </div>
            `;
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';

    // Add Clear All Button at top
    const clearBtnHtml = `
        <div class="text-end mb-3">
            <button class="btn btn-sm btn-outline-dark border-0 text-muted" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px;" onclick="if(confirm('Clear all selection?')) { clearCart(); renderCart(); }">
                <i class="fas fa-times me-1"></i> Clear Selection
            </button>
        </div>
    `;

    container.innerHTML = clearBtnHtml + cart.map(item => {
      let imgPath = item.image || 'assets/images/placeholder.png';
      if (window.Utils) imgPath = window.Utils.resolvePath(imgPath);
      const price = parseFloat(item.price_info?.after_disc || 0).toFixed(2);
      const currency = item.price_info?.currency || '€';

      return `
                <div class="cart-item-luxury fade-in-up" style="opacity: 1; transform: translateY(0);">
                    <div class="cart-img-pill">
                        <img src="${imgPath}" alt="${item.title}" onerror="this.src='${window.Utils ? window.Utils.resolvePath('assets/images/placeholder.png') : ''}'">
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title" style="font-size: 0.85rem;">${item.title}</div>
                        <div class="cart-item-price">${price}${currency} x ${item.quantity}</div>
                    </div>
                    <button class="btn btn-sm text-danger border-0 bg-transparent d-flex align-items-center gap-1" onclick="removeFromCart('${item.id}'); renderCart();" title="Remove item">
                        <i class="fas fa-trash-alt" style="font-size: 0.8rem;"></i>
                        <span style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase;">Remove</span>
                    </button>
                </div>
            `;
    }).join('');

    const total = window.getCartTotal().toFixed(2);
    const currency = cart[0]?.price_info?.currency || '€';
    if (totalEl) totalEl.textContent = `${total}${currency}`;
  };

  // Expose update function for others (legacy support)
  window.updateCartCounter = updateCartUI;

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    // Transport Toggle Listener
    const transportCheck = document.getElementById('cart-transport');
    const residenceCont = document.getElementById('cart-residence-container');
    if (transportCheck && residenceCont) {
      transportCheck.addEventListener('change', (e) => {
        if (e.target.checked) residenceCont.classList.remove('d-none');
        else residenceCont.classList.add('d-none');
      });
    }
  });

})();