
const DEFAULT_SERVICES = [
  {
    id: 'srv-1',
    name: 'Hydrating Herbal Facial',
    category: 'Skin & Facial',
    price: 45.00,
    desc: 'Deep cleansing facial with herbal extracts for glowing, refreshed skin.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'srv-2',
    name: 'Royal Bridal Makeup',
    category: 'Bridal & Makeup',
    price: 150.00,
    desc: 'Complete bridal makeover including HD makeup, saree draping, and hair styling.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'srv-3',
    name: 'Hair Spa & Spa Care',
    category: 'Hair Care',
    price: 35.00,
    desc: 'Deep nourishment treatment for damaged, frizzy, or chemically treated hair.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'srv-4',
    name: 'Gel Gel Polish & Manicure',
    category: 'Nail & Hands',
    price: 25.00,
    desc: 'Precision nail shaping, cuticle care, and long-lasting premium gel polish.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80'
  }
];

let services = JSON.parse(localStorage.getItem('parlour_services')) || DEFAULT_SERVICES;
let bookings = JSON.parse(localStorage.getItem('parlour_bookings')) || [
  { id: 'BK-101', name: 'Sophia Smith', phone: '+1234567890', service: 'Hydrating Herbal Facial', date: '2026-10-10', time: '14:00', status: 'Pending' },
  { id: 'BK-102', name: 'Emma Watson', phone: '+1987654321', service: 'Royal Bridal Makeup', date: '2026-10-12', time: '10:00', status: 'Completed' }
];
let currentCart = [];

const servicesGrid = document.getElementById('servicesGrid');
const serviceSelect = document.getElementById('serviceSelect');
const bookingForm = document.getElementById('bookingForm');
const whatsappBtn = document.getElementById('whatsappBtn');
const posServicesGrid = document.getElementById('posServicesGrid');
const cartList = document.getElementById('cartList');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTax = document.getElementById('cartTax');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const adminTableBody = document.getElementById('adminTableBody');
const toastEl = document.getElementById('toast');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

document.addEventListener('DOMContentLoaded', () => {
  renderServices('all');
  populateServiceSelectOptions();
  renderPOSServices();
  renderAdminTable();
  updateStats();
  setupEventListeners();
});


function setupEventListeners() {

  hamburgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderServices(e.target.dataset.category);
    });
  });


  bookingForm.addEventListener('submit', handleFormSubmit);
  whatsappBtn.addEventListener('click', handleWhatsAppBooking);


  clearCartBtn.addEventListener('click', clearCart);
  checkoutBtn.addEventListener('click', checkoutCart);
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.remove('hidden');
  setTimeout(() => {
    toastEl.classList.add('hidden');
  }, 3000);
}

function renderServices(categoryFilter = 'all') {
  servicesGrid.innerHTML = '';
  const filtered = categoryFilter === 'all' 
    ? services 
    : services.filter(s => s.category === categoryFilter);

  filtered.forEach(service => {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.innerHTML = `
      <img src="${service.image}" alt="${service.name}" class="service-img">
      <div class="service-info">
        <span class="service-category">${service.category}</span>
        <h3 class="service-title">${service.name}</h3>
        <p class="service-desc">${service.desc}</p>
        <div class="service-bottom">
          <span class="service-price">$${service.price.toFixed(2)}</span>
          <a href="#booking" class="btn btn-primary" onclick="preselectService('${service.name}')">Book Now</a>
        </div>
      </div>
    `;
    servicesGrid.appendChild(card);
  });
}

function populateServiceSelectOptions() {
  serviceSelect.innerHTML = '<option value="">-- Choose a Service --</option>';
  services.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.name;
    opt.textContent = `${s.name} ($${s.price.toFixed(2)})`;
    serviceSelect.appendChild(opt);
  });
}

function preselectService(serviceName) {
  serviceSelect.value = serviceName;
}


function handleFormSubmit(e) {
  e.preventDefault();
  
  const newBooking = {
    id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
    name: document.getElementById('clientName').value,
    phone: document.getElementById('clientPhone').value,
    service: document.getElementById('serviceSelect').value,
    date: document.getElementById('bookingDate').value,
    time: document.getElementById('bookingTime').value,
    notes: document.getElementById('bookingNotes').value,
    status: 'Pending'
  };

  bookings.unshift(newBooking);
  saveBookings();
  renderAdminTable();
  updateStats();
  
  bookingForm.reset();
  showToast('Appointment booked successfully!');
}

function handleWhatsAppBooking() {
  const name = document.getElementById('clientName').value;
  const service = document.getElementById('serviceSelect').value;
  const date = document.getElementById('bookingDate').value;
  const time = document.getElementById('bookingTime').value;

  if (!name || !service || !date) {
    alert('Please fill in your Name, Service, and Date before booking on WhatsApp.');
    return;
  }

  const text = `Hello Glow & Grace! I'd like to book an appointment:%0A%0A*Name:* ${name}%0A*Service:* ${service}%0A*Date:* ${date}%0A*Time:* ${time}`;
  window.open(`https://wa.me/1234567890?text=${text}`, '_blank');
}

function renderPOSServices() {
  posServicesGrid.innerHTML = '';
  services.forEach(service => {
    const btn = document.createElement('div');
    btn.className = 'pos-item';
    btn.innerHTML = `
      <span class="pos-item-name">${service.name}</span>
      <div class="pos-item-price">$${service.price.toFixed(2)}</div>
    `;
    btn.onclick = () => addToCart(service);
    posServicesGrid.appendChild(btn);
  });
}

function addToCart(service) {
  currentCart.push(service);
  updateCartUI();
}

function removeFromCart(index) {
  currentCart.splice(index, 1);
  updateCartUI();
}

function clearCart() {
  currentCart = [];
  updateCartUI();
}

function updateCartUI() {
  cartList.innerHTML = '';
  
  if (currentCart.length === 0) {
    cartList.innerHTML = '<li class="empty-cart">No items added to invoice yet.</li>';
    cartSubtotal.textContent = '$0.00';
    cartTax.textContent = '$0.00';
    cartTotal.textContent = '$0.00';
    return;
  }

  let subtotal = 0;
  currentCart.forEach((item, idx) => {
    subtotal += item.price;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <span>${item.name}</span>
      <div>
        <span>$${item.price.toFixed(2)}</span>
        <i class="fa-solid fa-times remove-item" onclick="removeFromCart(${idx})"></i>
      </div>
    `;
    cartList.appendChild(li);
  });

  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
  cartTax.textContent = `$${tax.toFixed(2)}`;
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

function checkoutCart() {
  if (currentCart.length === 0) {
    alert('Cart is empty!');
    return;
  }
  showToast('Invoice Generated & Saved!');
  clearCart();
}


function renderAdminTable() {
  adminTableBody.innerHTML = '';

  if (bookings.length === 0) {
    adminTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No bookings found.</td></tr>';
    return;
  }

  bookings.forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${b.id}</strong></td>
      <td>${b.name}<br><small>${b.phone}</small></td>
      <td>${b.service}</td>
      <td>${b.date} @ ${b.time}</td>
      <td>
        <span class="badge ${b.status === 'Completed' ? 'badge-completed' : 'badge-pending'}">
          ${b.status}
        </span>
      </td>
      <td>
        ${b.status === 'Pending' 
          ? `<button class="action-btn complete" onclick="toggleBookingStatus('${b.id}')" title="Mark Completed"><i class="fa-solid fa-check-circle"></i></button>` 
          : ''}
        <button class="action-btn delete" onclick="deleteBooking('${b.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    adminTableBody.appendChild(tr);
  });
}

function toggleBookingStatus(id) {
  const bk = bookings.find(b => b.id === id);
  if (bk) {
    bk.status = bk.status === 'Pending' ? 'Completed' : 'Pending';
    saveBookings();
    renderAdminTable();
    updateStats();
    showToast(`Booking ${id} status updated`);
  }
}

function deleteBooking(id) {
  if (confirm(`Are you sure you want to delete booking ${id}?`)) {
    bookings = bookings.filter(b => b.id !== id);
    saveBookings();
    renderAdminTable();
    updateStats();
    showToast('Booking deleted');
  }
}

function updateStats() {
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'Pending').length;
  const completed = bookings.filter(b => b.status === 'Completed').length;

  document.getElementById('statTotalBookings').textContent = total;
  document.getElementById('statPendingBookings').textContent = pending;
  document.getElementById('statCompletedBookings').textContent = completed;
}

function saveBookings() {
  localStorage.setItem('parlour_bookings', JSON.stringify(bookings));
}