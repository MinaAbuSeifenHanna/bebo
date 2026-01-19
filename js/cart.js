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
    // Check if sidebar exists, if so open it, else show alert
    const sidebarEl = document.getElementById('cartSidebar');
    if (sidebarEl) {
      toggleCartSidebar(true);
    } else {
      alert(`✅ Added to cart: ${title}`);
    }
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
      // Fix Image Path using Utils
      let imgPath = item.image || 'assets/images/placeholder.png';
      if (window.Utils && window.Utils.resolvePath) {
        imgPath = window.Utils.resolvePath(imgPath);
      }

      return `
                <div class="cart-item d-flex align-items-center mb-3 border-bottom pb-2">
                    <img src="${imgPath}" class="rounded me-3" style="width: 60px; height: 60px; object-fit: cover;" alt="${item.title}" onerror="this.src='${window.Utils ? window.Utils.resolvePath('assets/images/placeholder.png') : ''}'">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 text-truncate" style="max-width: 160px;">${item.title}</h6>
                        <small class="text-muted">€${price} x ${item.quantity}</small>
                    </div>
                    <button class="btn btn-sm text-danger" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
    }).join('');

    if (totalEl) {
      totalEl.textContent = `€${window.getCartTotal().toFixed(2)}`;
    }
  }

  // --- Booking Logic (Unified) ---
  // This handles the WhatsApp message generation
  window.processBooking = function (customerData) {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    let servicesList = '';
    cart.forEach(item => {
      const price = parseFloat(item.price_info?.after_disc || 0);
      const totalItem = price * item.quantity;
      servicesList += `• ${item.title} (x${item.quantity}) - €${totalItem.toFixed(2)}\n`;
    });

    const total = window.getCartTotal().toFixed(2);

    const message = `🌸 *New Booking Request* 🌸
👤 *${customerData.name}*
📞 ${customerData.phone || 'N/A'}
📅 ${customerData.date} at ${customerData.time}

💅 *Services:*
${servicesList}
💰 *Total: €${total}*

${customerData.notes ? `📝 Note: ${customerData.notes}` : ''}

Confirm via: womenworldspa.com`;

    const waLink = `https://wa.me/201007920759?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');

    // Clear cart and close UI
    window.clearCart();

    // Hide UI
    if (cartSidebarInstance) cartSidebarInstance.hide();
    const modalEl = document.getElementById('checkoutModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }

    // Show success
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    if (successModal) successModal.show();
  };

  // --- Cart Page Rendering (for cart.html) ---
  window.renderCart = function () {
    const container = document.getElementById('cart-items');
    const totalEl = document.querySelector('#cart-total');

    if (!container) return; // Not on cart page

    if (cart.length === 0) {
      container.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
      if (totalEl) totalEl.innerHTML = '<strong>Total</strong>: €0.00';
      return;
    }

    container.innerHTML = cart.map(item => {
      let imgPath = item.image || 'assets/images/placeholder.png';
      if (window.Utils) imgPath = window.Utils.resolvePath(imgPath);
      const price = parseFloat(item.price_info?.after_disc || 0).toFixed(2);

      return `
                <div class="card mb-3 shadow-sm">
                    <div class="row g-0 align-items-center">
                        <div class="col-3 col-md-2">
                             <img src="${imgPath}" class="img-fluid rounded-start h-100" style="object-fit: cover; min-height: 80px;" alt="${item.title}">
                        </div>
                        <div class="col-9 col-md-10">
                            <div class="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title mb-1">${item.title}</h5>
                                    <p class="card-text mb-0"><small class="text-muted">€${price} x ${item.quantity}</small></p>
                                </div>
                                <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart('${item.id}'); renderCart();">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    }).join('');

    const total = window.getCartTotal().toFixed(2);
    if (totalEl) totalEl.innerHTML = `<strong>Total</strong>: €${total}`;
  };

  // Expose update function for others (legacy support)
  window.updateCartCounter = updateCartUI;

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
  });

})();