// cart.js - Enhanced Cart Management with Sidebar
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartSidebarInstance = null;

// Get current services from language system
function getCurrentServices() {
  return window.allServices || [];
}

function addToCart(serviceId) {
  const services = getCurrentServices();
  let service = services.find(s => s.id === serviceId);

  if (!service) {
    const all = window.allServices || window.servicesData || [];
    service = all.find(s => s.id === serviceId);

    if (!service) {
      console.error('Service not found:', serviceId);
      // Try fallback if just loaded
      setTimeout(() => addToCart(serviceId), 500);
      return;
    }
  }

  // Check if service already in cart
  const existingIndex = cart.findIndex(item => item.id === serviceId);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    showNotification(getUIText('added') || 'Service quantity updated!', 'success');
  } else {
    // Clone necessary clean properties usually
    cart.push({
      id: service.id,
      title: service.title,
      image: service.image,
      salary: service.salary,
      after_disc: service.after_disc,
      time: service.time || '',
      quantity: 1,
      addedAt: new Date().toISOString()
    });
    showNotification(getUIText('added') || 'Service added to cart!', 'success');
  }

  saveCart();

  // Open sidebar to show user what they added (UX best practice)
  toggleCartSidebar(true);
}

function removeFromCart(serviceId) {
  const index = cart.findIndex(item => item.id === serviceId);

  if (index !== -1) {
    cart.splice(index, 1);
    saveCart();
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCounter();
  renderCartSidebarItems(); // Re-render sidebar if open
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    // Robust parsing
    let priceStr = (item.after_disc || item.salary || '0').toString();
    // Remove non-numeric except dot/comma, replace comma with dot
    let cleanPrice = priceStr.replace(/[^0-9.,]/g, '').replace(',', '.');
    const price = parseFloat(cleanPrice) || 0;
    return total + (price * (item.quantity || 1));
  }, 0);
}

function getCartItemsCount() {
  return cart.reduce((count, item) => count + (item.quantity || 1), 0);
}

function updateCartCounter() {
  const counterElements = document.querySelectorAll('.cart-counter');
  const count = getCartItemsCount();
  counterElements.forEach(el => {
    el.textContent = count;
    // Animate badge
    el.classList.remove('animate-bounce');
    void el.offsetWidth; // trigger reflow
    if (count > 0) el.classList.add('animate-bounce');
  });

  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = count;
}

// Sidebar Management
function toggleCartSidebar(forceOpen = false) {
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

  // Always render when opening
  renderCartSidebarItems();
  showCartItems(); // Ensure we are on list view not form view
}


function renderCartSidebarItems() {
  const container = document.getElementById('cartItemsContainer');
  const totalEl = document.getElementById('sidebarTotal');
  const footer = document.getElementById('cartFooter');

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
            <div class="empty-cart-message">
                <div class="empty-cart-icon"><i class="fas fa-shopping-basket"></i></div>
                <h5 class="mb-3">Your cart is empty</h5>
                <p>Browse our services and find your perfect treatment.</p>
                <button class="btn btn-outline-primary btn-sm rounded-pill" data-bs-dismiss="offcanvas">Start Shopping</button>
            </div>
        `;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  container.innerHTML = cart.map(item => {
    let priceStr = (item.after_disc || item.salary || '0');
    return `
        <div class="cart-item">
            <img src="${item.image || 'assets/images/placeholder.png'}" class="cart-item-image" alt="${item.title}" onerror="this.src='assets/images/backimage.png'">
            <div class="cart-item-details">
                <h6 class="cart-item-title">${item.title}</h6>
                <div class="cart-item-price">${priceStr}</div>
                ${item.quantity > 1 ? `<small class="text-muted">Quantity: ${item.quantity}</small>` : ''}
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
        `;
  }).join('');

  if (totalEl) totalEl.textContent = `€${getCartTotal().toFixed(2)}`;
}

// Flow Switching
function showCartItems() {
  document.getElementById('cartItemsContainer').classList.remove('d-none');
  document.getElementById('cartFooter').classList.remove('d-none');
  document.getElementById('checkoutFormContainer').classList.add('d-none');
}

function showCheckoutForm() {
  document.getElementById('cartItemsContainer').classList.add('d-none');
  document.getElementById('cartFooter').classList.add('d-none');
  document.getElementById('checkoutFormContainer').classList.remove('d-none');

  // Set min date
  const dateInput = document.getElementById('sidebarDate');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
}

// Submission
function submitSidebarBooking() {
  const name = document.getElementById('sidebarName').value;
  const phone = document.getElementById('sidebarPhone').value;
  const date = document.getElementById('sidebarDate').value;
  const time = document.getElementById('sidebarTime').value;

  if (!name || !date || !time) {
    showNotification('Please fill in required fields', 'warning');
    return;
  }

  // Build message
  let servicesList = '';
  cart.forEach(item => {
    let priceStr = (item.after_disc || item.salary || '0').toString();
    // Remove non-numeric except dot/comma, replace comma with dot
    let cleanPrice = priceStr.replace(/[^0-9.,]/g, '').replace(',', '.');
    let itemPrice = parseFloat(cleanPrice) || 0;

    const itemTotal = itemPrice * (item.quantity || 1);
    servicesList += `• ${item.title} (x${item.quantity || 1}) - €${itemTotal.toFixed(2)}\n`;
  });

  const total = getCartTotal().toFixed(2);

  const message = `🌸 *New Booking Request* 🌸
👤 *${name}*
📞 ${phone || 'No phone provided'}
📅 ${date} at ${time}

💅 *Services:*
${servicesList}
💰 *Total: €${total}*

Confirm via: https://womenworldspa.com`;

  console.log('Booking Data:', { name, phone, date, time, cart, total });

  // WhatsApp logic
  const waLink = `https://wa.me/201007920759?text=${encodeURIComponent(message)}`;
  window.open(waLink, '_blank');

  showNotification('Booking Sent! We will contact you shortly.', 'success');

  // Clear and close
  cart = [];
  saveCart();

  if (cartSidebarInstance) cartSidebarInstance.hide();

  // Show success modal if exists (optional, or just rely on notification)
  const successModal = new bootstrap.Modal(document.getElementById('successModal'));
  if (successModal) successModal.show();
}

// UX Utilities
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} position-fixed shadow-lg`;
  notification.style.cssText = `
    top: 20px;
    right: 20px;
    z-index: 1060;
    min-width: 300px;
    border-radius: 12px;
    animation: slideIn 0.3s ease;
  `;
  notification.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <span><i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>${message}</span>
      <button type="button" class="btn-close ms-2" onclick="this.parentElement.parentElement.remove()"></button>
    </div>
  `;

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3500);
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  updateCartCounter();
});