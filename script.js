// ===== THE CEO GRILLS - COMPLETE FUNCTIONAL JAVASCRIPT =====
// Fully compatible with your HTML and CSS
// Includes professional premium builder with guided and quick modes
// Includes complete authentication system

// ===== GLOBAL STATE =====
const AppState = {
    user: {
        isLoggedIn: false,
        name: 'Guest User',
        email: '',
        phone: '',
        avatar: 'U',
        userId: null,
        firebaseUser: null
    },
    cart: [],
    total: 0,
    deliveryFee: 500,
    isAdmin: false,
    adminPassword: 'CEO2024@Grills',
    currentTab: 'home'
};

// ===== DOM LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 The CEO Grills - Initializing Premium Experience...');
    
    // Initialize all components
    initializeAll();
    
    // Hide loading screen after 1.5 seconds
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                showToast('Welcome to The CEO Grills! 🔥', 'success');
            }, 500);
        }
    }, 1500);
    
    console.log('✅ Website fully loaded');
});

// ===== INITIALIZATION =====
function initializeAll() {
    console.log('🔥 The CEO Grills - Initializing Premium Experience...');
    
    // Load saved state
    loadSavedState();
    
    // Initialize Firebase Auth System
    if (typeof initAuthSystem === 'function') {
        initAuthSystem();
    } else {
        console.warn('Auth system not found. Make sure auth.js is loaded');
        // Create a fallback auth system
        setupFallbackAuth();
    }
    
    // Initialize all other systems
    initNavigation();
    initMenuSystem();
    initCartSystem();
    initOrderSystem();
    initModals();
    initFloatingButtons();
    initPremiumBuilder();
    initMap();
    initWhatsAppContactForm();
    
    // Update UI
    updateCartUI();
    
    // Set up event listeners
    setupGlobalListeners();
    
    console.log('✅ Premium website fully loaded');
}

// Fallback auth system if auth.js doesn't load
function setupFallbackAuth() {
    console.log('⚠️ Using fallback auth system');
    
    // Create simple auth modal
    const authModalHTML = `
        <div class="modal-overlay" id="authModal" style="display: none;">
            <div class="modal-container">
                <h3>Authentication Required</h3>
                <p>Please wait for the authentication system to load or refresh the page.</p>
                <button onclick="document.getElementById('authModal').style.display = 'none'">Close</button>
            </div>
        </div>
    `;
    
    if (!document.getElementById('authModal')) {
        document.body.insertAdjacentHTML('beforeend', authModalHTML);
    }
    
    // Simple auth functions
    window.openAuthModal = function() {
        document.getElementById('authModal').style.display = 'flex';
    };
    
    window.closeAuthModal = function() {
        document.getElementById('authModal').style.display = 'none';
    };
}

function loadSavedState() {
    try {
        // Load cart
        const savedCart = localStorage.getItem('ceoGrillsCart');
        if (savedCart) {
            AppState.cart = JSON.parse(savedCart);
            updateCartTotal();
        }
        
        // Load user
        const savedUser = localStorage.getItem('ceoGrillsUser');
        if (savedUser) {
            AppState.user = JSON.parse(savedUser);
        }
    } catch (error) {
        console.warn('Could not load saved state:', error);
    }
}

function saveState() {
    try {
        localStorage.setItem('ceoGrillsCart', JSON.stringify(AppState.cart));
        localStorage.setItem('ceoGrillsUser', JSON.stringify(AppState.user));
    } catch (error) {
        console.warn('Could not save state:', error);
    }
}

// ===== UTILITY FUNCTIONS =====
function showToast(message, type = 'info') {
    try {
        let container = document.getElementById('toastContainer');
        if (!container) {
            // Create toast container if it doesn't exist
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container';
            toastContainer.setAttribute('aria-live', 'assertive');
            toastContainer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(toastContainer);
            container = toastContainer;
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${message}</div>
            </div>
            <button class="btn-toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    } catch (error) {
        console.error('Error showing toast:', error);
    }
}

function formatCurrency(amount) {
    return '₦' + amount.toLocaleString('en-NG');
}

// ===== NAVIGATION SYSTEM =====
function initNavigation() {
    console.log('🔧 Initializing navigation...');
    
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMain = document.getElementById('navMain');
    
    if (mobileToggle && navMain) {
        mobileToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMain.classList.toggle('active');
            this.innerHTML = !isExpanded 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                scrollToSection(targetId);
                
                // Update active link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Close mobile menu if open
                if (navMain && navMain.classList.contains('active')) {
                    navMain.classList.remove('active');
                    if (mobileToggle) {
                        mobileToggle.setAttribute('aria-expanded', 'false');
                        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            }
        });
    });
    
    // Hero buttons
    document.getElementById('orderNowHero')?.addEventListener('click', () => {
        scrollToSection('fire-menu');
    });
    
    document.getElementById('watchLiveHero')?.addEventListener('click', () => {
        scrollToSection('live-stream');
    });
    
    // Cart button
    document.getElementById('navOrderBtn')?.addEventListener('click', openCartModal);
    
    // Admin button
    document.getElementById('adminBtn')?.addEventListener('click', toggleAdminPanel);
    
    console.log('✅ Navigation initialized');
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.premium-nav')?.offsetHeight || 80;
        window.scrollTo({
            top: section.offsetTop - navHeight,
            behavior: 'smooth'
        });
    }
}

// ===== MENU SYSTEM =====
function initMenuSystem() {
    console.log('🍽️ Initializing menu system...');
    
    // Menu items data
    const menuItems = [
        {
            id: 'bole-1',
            name: "CEO's Ultimate Platter",
            description: 'Roasted plantain, yam, fish, crab, prawns, sausages and chicken with spicy palm oil sauce.',
            price: 14500,
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'bole',
            tags: ['popular', 'spicy'],
            rating: 4.9
        },
        {
            id: 'bole-2',
            name: 'Classic Bole Combo',
            description: 'Perfectly roasted plantain and yam with choice of protein and signature sauce.',
            price: 7500,
            image: 'download (1).png',
            category: 'bole',
            tags: ['vegetarian-friendly'],
            rating: 4.7
        },
        {
            id: 'seafood-1',
            name: 'Seafood Tower',
            description: 'Fresh giant crabs, tiger prawns, and grilled fish served with roasted plantain.',
            price: 12500,
            image: 'images.png',
            category: 'seafood',
            tags: ['popular', 'seafood'],
            rating: 4.9
        },
        {
            id: 'sides-1',
            name: 'Extra Signature Sauce',
            description: 'Additional serving of our legendary palm oil sauce.',
            price: 800,
            image: 'imagess.png',
            category: 'sides',
            tags: ['sauce'],
            rating: 4.8
        },
        {
            id: 'drinks-1',
            name: 'CEO Special Drink',
            description: 'Refreshing tropical fruit blend.',
            price: 1500,
            image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'drinks',
            tags: ['refreshing'],
            rating: 4.6
        }
    ];
    
    // Load menu items
    loadMenuItems(menuItems);
    
    // Setup filters
    setupMenuFilters();
    
    // Setup search
    setupMenuSearch();
    
    // Setup tabs
    setupMenuTabs();
    
    console.log('✅ Menu system initialized');
}

function loadMenuItems(items) {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    
    container.innerHTML = items.map(item => `
        <div class="menu-item" data-category="${item.category}" data-tags="${item.tags?.join(',') || ''}">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="menu-item-badges">
                    ${item.tags?.includes('popular') ? '<span class="menu-badge popular"><i class="fas fa-fire"></i> Popular</span>' : ''}
                </div>
                <div class="menu-item-rating">
                    <span class="rating-stars">${'★'.repeat(Math.floor(item.rating))}${'☆'.repeat(5-Math.floor(item.rating))}</span>
                    <span class="rating-value">${item.rating}</span>
                </div>
            </div>
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h3>${item.name}</h3>
                    <div class="menu-price">${formatCurrency(item.price)}</div>
                </div>
                <p>${item.description}</p>
                <div class="menu-item-meta">
                    <span class="meta-item"><i class="fas fa-clock"></i> 30-45 mins</span>
                    <span class="meta-item"><i class="fas fa-fire"></i> 600-800 cal</span>
                </div>
                <div class="menu-tags">
                    ${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="menu-item-actions">
                    <button class="btn-add-cart" onclick="addToCart({
                        id: '${item.id}',
                        name: '${item.name.replace(/'/g, "\\'")}',
                        price: ${item.price},
                        quantity: 1,
                        image: '${item.image}'
                    })">
                        <i class="fas fa-cart-plus"></i> Add to Order
                    </button>
                    <button class="btn-view-details" onclick="showItemDetails('${item.id}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupMenuFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            filterMenuItems();
        });
    });
}

function setupMenuSearch() {
    const searchInput = document.getElementById('menuSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterMenuItems();
        });
    }
}

function setupMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter items
            filterMenuItems();
        });
    });
}

function filterMenuItems() {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    const activeTab = document.querySelector('.menu-tab.active')?.dataset.category || 'all';
    const searchTerm = document.getElementById('menuSearch')?.value.toLowerCase() || '';
    
    const items = document.querySelectorAll('.menu-item');
    
    items.forEach(item => {
        const category = item.dataset.category;
        const tags = item.dataset.tags || '';
        const name = item.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = item.querySelector('p')?.textContent.toLowerCase() || '';
        
        let show = true;
        
        // Filter by category
        if (activeTab !== 'all' && category !== activeTab) {
            show = false;
        }
        
        // Filter by tag
        if (activeFilter !== 'all' && !tags.includes(activeFilter)) {
            show = false;
        }
        
        // Filter by search
        if (searchTerm && !name.includes(searchTerm) && !description.includes(searchTerm)) {
            show = false;
        }
        
        item.style.display = show ? 'flex' : 'none';
    });
}

function showItemDetails(itemId) {
    showToast('Item details feature coming soon!', 'info');
}

// ===== CART SYSTEM =====
function initCartSystem() {
    console.log('🛒 Initializing cart system...');
    
    // Update cart on load
    updateCartUI();
    
    console.log('✅ Cart system initialized');
}

function addToCart(item) {
    try {
        // Check if item already exists
        const existingIndex = AppState.cart.findIndex(cartItem => 
            cartItem.id === item.id
        );
        
        if (existingIndex > -1) {
            // Update quantity
            AppState.cart[existingIndex].quantity += item.quantity || 1;
        } else {
            // Add new item
            AppState.cart.push({
                ...item,
                quantity: item.quantity || 1
            });
        }
        
        // Update state
        updateCartTotal();
        saveState();
        updateCartUI();
        
        showToast(`${item.name} added to cart!`, 'success');
        
        return true;
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Failed to add item to cart', 'error');
        return false;
    }
}

function updateCartQuantity(index, change) {
    if (AppState.cart[index]) {
        AppState.cart[index].quantity += change;
        
        // Remove if quantity is 0 or less
        if (AppState.cart[index].quantity <= 0) {
            AppState.cart.splice(index, 1);
        }
        
        updateCartTotal();
        saveState();
        updateCartUI();
        
        // Refresh cart modal if open
        refreshCartModal();
    }
}

function removeFromCart(index) {
    if (AppState.cart[index]) {
        const itemName = AppState.cart[index].name;
        AppState.cart.splice(index, 1);
        updateCartTotal();
        saveState();
        updateCartUI();
        
        // Refresh cart modal immediately
        refreshCartModal();
        
        showToast(`${itemName} removed from cart`, 'info');
    }
}

function refreshCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal && modal.classList.contains('active')) {
        // Update cart modal content
        openCartModal();
    }
}

function updateCartTotal() {
    AppState.total = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateCartUI() {
    const cartCount = AppState.cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update all cart counters
    document.querySelectorAll('.cart-counter, .floating-counter').forEach(counter => {
        if (counter) {
            counter.textContent = cartCount;
            counter.style.display = cartCount > 0 ? 'flex' : 'none';
        }
    });
    
    // Update floating button
    const floatingCounter = document.getElementById('floatingCartCounter');
    if (floatingCounter) {
        floatingCounter.textContent = cartCount;
        floatingCounter.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    
    const itemsContainer = document.getElementById('cartModalItems');
    const totalsContainer = document.getElementById('cartModalTotals');
    
    if (!itemsContainer) return;
    
    if (AppState.cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="btn-browse-menu" onclick="closeModal('cartModal'); scrollToSection('fire-menu')">
                    Browse Menu
                </button>
            </div>
        `;
        if (totalsContainer) {
            totalsContainer.style.display = 'none';
        }
    } else {
        itemsContainer.innerHTML = AppState.cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="item-quantity">
                        <button class="btn-qty" onclick="updateCartQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="btn-qty" onclick="updateCartQuantity(${index}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <span>${formatCurrency(item.price * item.quantity)}</span>
                    <button class="btn-remove-item" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        if (totalsContainer) {
            totalsContainer.style.display = 'block';
            
            // Update cart modal totals
            const cartSubtotal = document.getElementById('cartSubtotal');
            const cartDelivery = document.getElementById('cartDelivery');
            const cartTotal = document.getElementById('cartTotal');
            if (cartSubtotal) cartSubtotal.textContent = formatCurrency(AppState.total);
            if (cartDelivery) cartDelivery.textContent = formatCurrency(AppState.deliveryFee);
            if (cartTotal) cartTotal.textContent = formatCurrency(AppState.total + AppState.deliveryFee);
        }
    }
    
    modal.classList.add('active');
    modal.style.display = 'flex';
    
    // Setup close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.onclick = () => closeModal('cartModal');
    }
    
    // Setup checkout button
    const checkoutBtn = modal.querySelector('#checkoutFromCart');
    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            closeModal('cartModal');
            if (AppState.cart.length > 0) {
                showToast('Proceeding to checkout...', 'info');
                // In a real app, this would redirect to checkout page
            }
        };
    }
}

// ===== ORDER SYSTEM =====
function initOrderSystem() {
    console.log('📦 Initializing order system...');
    
    console.log('✅ Order system initialized');
}

// ===== MODAL SYSTEM =====
function initModals() {
    console.log('🔲 Initializing modals...');
    
    // Close all modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target.id);
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
    
    console.log('✅ Modals initialized');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// ===== FLOATING BUTTONS =====
function initFloatingButtons() {
    console.log('🔘 Initializing floating buttons...');
    
    // WhatsApp button
    document.getElementById('floatingWhatsapp')?.addEventListener('click', () => {
        window.open('https://wa.me/2347030593267', '_blank');
    });
    
    // Call button
    document.getElementById('floatingCall')?.addEventListener('click', () => {
        window.location.href = 'tel:+2347030593267';
    });
    
    // Cart button
    document.getElementById('floatingCart')?.addEventListener('click', openCartModal);
    
    console.log('✅ Floating buttons initialized');
}

// ===== ADMIN PANEL =====
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (!panel) return;
    
    // Check password first
    if (!AppState.isAdmin) {
        const password = prompt('Enter admin password:');
        if (password === AppState.adminPassword) {
            AppState.isAdmin = true;
            showToast('Admin access granted', 'success');
        } else {
            showToast('Incorrect password', 'error');
            return;
        }
    }
    
    panel.classList.toggle('active');
    panel.style.display = panel.classList.contains('active') ? 'block' : 'none';
    
    if (panel.classList.contains('active')) {
        loadAdminData();
    }
}

function loadAdminData() {
    // Load orders for admin
    const orders = JSON.parse(localStorage.getItem('ceoGrillsOrders') || '[]');
    const adminContent = document.querySelector('.admin-content');
    
    if (adminContent) {
        adminContent.innerHTML = `
            <div class="admin-section">
                <h4><i class="fas fa-chart-bar"></i> Today's Stats</h4>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${orders.length}</div>
                        <div class="stat-label">Total Orders</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}</div>
                        <div class="stat-label">Total Revenue</div>
                    </div>
                </div>
            </div>
            
            <div class="admin-section">
                <h4><i class="fas fa-shopping-cart"></i> Recent Orders</h4>
                <div class="orders-table">
                    ${orders.slice(0, 5).map(order => `
                        <div class="order-row">
                            <div class="order-info">
                                <div class="order-id">#${order.id}</div>
                                <div class="order-time">${new Date(order.date).toLocaleDateString()}</div>
                            </div>
                            <div class="order-customer">${order.phone || 'N/A'}</div>
                            <div class="order-total">${formatCurrency(order.total)}</div>
                            <div class="order-status-badge ${order.status}">${order.status.toUpperCase()}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// ===== MAP SYSTEM =====
function initMap() {
    console.log('🗺️ Initializing map...');
    
    const mainMap = document.getElementById('mainMap');
    if (!mainMap) {
        console.error('Map container not found');
        return;
    }
    
    try {
        // Wait for Leaflet to be fully loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet not loaded');
            // Show fallback
            showMapFallback();
            return;
        }
        
        // Coordinates for Port Harcourt (Chinda Road area)
        const restaurantCoords = [4.8200, 7.0550];
        
        // Create the map
        const map = L.map('mainMap').setView(restaurantCoords, 16);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Custom restaurant marker
        const restaurantIcon = L.divIcon({
            className: 'restaurant-marker',
            html: '<i class="fas fa-fire"></i>',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
        
        // Add marker with popup
        const marker = L.marker(restaurantCoords, { icon: restaurantIcon })
            .addTo(map)
            .bindPopup(`
                <div class="map-popup">
                    <h4><i class="fas fa-fire"></i> The CEO Grills</h4>
                    <p><strong>Address:</strong> 36 Chinda Road, off Ada-George Road</p>
                    <p><strong>Area:</strong> Rumueme, Port Harcourt</p>
                    <p><strong>State:</strong> Rivers State, Nigeria</p>
                    <button class="btn-get-directions" onclick="openDirections()">
                        <i class="fas fa-directions"></i> Get Directions
                    </button>
                </div>
            `);
        
        // Open popup by default
        marker.openPopup();
        
        // Save map reference
        window.restaurantMap = map;
        
        console.log('✅ Map initialized successfully');
        
    } catch (error) {
        console.error('Error initializing map:', error);
        // Show fallback image if map fails
        showMapFallback();
    }
}

function showMapFallback() {
    const mainMap = document.getElementById('mainMap');
    if (mainMap) {
        mainMap.innerHTML = `
            <div class="map-fallback" style="width:100%; height:100%; background:#f5f5f5; display:flex; align-items:center; justify-content:center; color:#666; border-radius: 12px;">
                <div style="text-align:center; padding: 20px;">
                    <i class="fas fa-map-marker-alt" style="font-size:48px; margin-bottom:16px; color:#C52E20;"></i>
                    <h4 style="margin-bottom:8px; color: #1A1A1A;">36 Chinda Road</h4>
                    <p style="color: #666; margin-bottom: 4px;">off Ada-George Road, Rumueme</p>
                    <p style="color: #666;">Port Harcourt, Rivers State</p>
                    <button class="btn-get-directions" onclick="openDirections()" style="margin-top:20px; padding:10px 20px; background:#C52E20; color:white; border:none; border-radius:6px; cursor:pointer;">
                        <i class="fas fa-directions"></i> Get Directions
                    </button>
                </div>
            </div>
        `;
    }
}

function openDirections() {
    const address = encodeURIComponent('36 Chinda Road, off Ada-George Road, Rumueme, Port Harcourt, Nigeria');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
}

// ===== GLOBAL EVENT LISTENERS =====
function setupGlobalListeners() {
    // Newsletter subscription
    document.getElementById('subscribeNewsletter')?.addEventListener('click', () => {
        const email = document.getElementById('newsletterEmail')?.value;
        if (email && email.includes('@')) {
            showToast('Thank you for subscribing!', 'success');
            document.getElementById('newsletterEmail').value = '';
        } else {
            showToast('Please enter a valid email', 'warning');
        }
    });
    
    // Get directions button
    document.getElementById('getDirections')?.addEventListener('click', () => {
        openDirections();
    });
    
    // WhatsApp contact
    document.querySelector('.btn-whatsapp')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://wa.me/2347030593267', '_blank');
    });
    
    // Download menu
    document.querySelector('.btn-view-all')?.addEventListener('click', () => {
        showToast('Menu PDF download coming soon!', 'info');
    });
    
    // Setup builder event listeners
    setupBuilderEventListeners();
}

function setupBuilderEventListeners() {
    // Get all "Build Your Own Platter" buttons
    const builderButtons = document.querySelectorAll('#openBuilderModal, #openBuilderModalFooter, .btn-build-platter');
    
    builderButtons.forEach(button => {
        // Remove any existing event listeners by cloning
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }
        
        // Add new event listener
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (typeof PremiumBuilder !== 'undefined' && PremiumBuilder.open) {
                PremiumBuilder.open();
            } else {
                showToast('Custom builder is loading...', 'info');
            }
        });
    });
    
    console.log('✅ Builder event listeners set up');
}

// ===== WHATSAPP CONTACT FORM SYSTEM =====
function initWhatsAppContactForm() {
    console.log('📱 Initializing WhatsApp Contact Form...');
    
    const form = document.getElementById('whatsappContactForm');
    const clearBtn = document.getElementById('clearContactForm');
    const messageTextarea = document.getElementById('contactMessage');
    const charCount = document.getElementById('messageCharCount');
    
    if (!form) return;
    
    // Character counter for message
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            // Update color based on length
            if (count > 500) {
                charCount.style.color = '#dc3545';
            } else if (count > 450) {
                charCount.style.color = '#ffc107';
            } else {
                charCount.style.color = '#1A1A1A';
            }
        });
        
        // Initial count
        charCount.textContent = messageTextarea.value.length;
    }
    
    // Clear form button
    if (clearBtn) {
        clearBtn.addEventListener('click', function(e) {
            e.preventDefault();
            clearContactForm();
        });
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        sendWhatsAppMessage();
    });
}

function clearContactForm() {
    const form = document.getElementById('whatsappContactForm');
    
    if (!form) return;
    
    // Reset all form fields
    form.reset();
    
    // Reset character counter
    const charCount = document.getElementById('messageCharCount');
    if (charCount) charCount.textContent = '0';
    
    showToast('Form cleared', 'info');
}

function sendWhatsAppMessage() {
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value.trim();
    
    if (!name || !phone || !subject || !message) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Format phone number (remove non-digits)
    const formattedPhone = phone.replace(/\D/g, '');
    
    // Your WhatsApp business number
    const businessNumber = '2347030593267'; // Without + or 0
    
    // Create the message content
    let whatsappMessage = `*NEW MESSAGE FROM WEBSITE CONTACT FORM*\n\n`;
    whatsappMessage += `*Name:* ${name}\n`;
    whatsappMessage += `*Phone:* ${phone}\n`;
    
    if (email) {
        whatsappMessage += `*Email:* ${email}\n`;
    }
    
    whatsappMessage += `*Subject:* ${subject}\n`;
    whatsappMessage += `*Message:*\n${message}\n\n`;
    
    whatsappMessage += `*Timestamp:* ${new Date().toLocaleString('en-NG')}\n`;
    
    // URL encode the message
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Create WhatsApp URL
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    let whatsappURL;
    if (isMobile) {
        // For mobile devices - open WhatsApp app directly
        whatsappURL = `whatsapp://send?phone=${businessNumber}&text=${encodedMessage}`;
    } else {
        // For desktop - open web.whatsapp.com
        whatsappURL = `https://web.whatsapp.com/send?phone=${businessNumber}&text=${encodedMessage}`;
    }
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    showToast('Opening WhatsApp...', 'success');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Copy failed', 'error');
    });
}

// ===== PREMIUM CUSTOM BUILDER =====
const PremiumBuilder = {
    // State management
    state: {
        currentStep: 1,
        totalSteps: 5,
        mode: 'guided',
        cartItem: {
            id: '',
            name: 'Custom Premium Platter',
            description: '',
            price: 0,
            image: '',
            category: 'custom',
            customizations: {},
            specialInstructions: ''
        },
        guided: {
            base: null,
            proteins: [],
            sauce: null,
            spiceLevel: 3,
            extras: [],
            presentation: 'standard'
        },
        quick: {
            instructions: '',
            customAmount: 0,
            orderType: 'custom'
        }
    },

    // Food database
    ingredients: {
        bases: [
            {
                id: 'premium-plantain',
                name: 'Golden Roasted Plantain',
                description: 'Premium plantain slow-roasted to caramelized perfection',
                price: 4500,
                image: 'downloadd.jpg',
                icon: '🍌',
                tags: ['popular', 'signature']
            },
            {
                id: 'herb-yam',
                name: 'Herb-infused Yam',
                description: 'Fresh yam grilled with rosemary and thyme',
                price: 3800,
                image: 'downloadq.jpg',
                icon: '🍠',
                tags: ['vegetarian']
            },
            {
                id: 'combo-special',
                name: 'CEO Signature Combo',
                description: 'Plantain + Yam + Potato medley with special seasoning',
                price: 5500,
                image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                icon: '👑',
                tags: ['popular', 'chef-choice']
            },
            {
                id: 'black-plantain',
                name: 'Black Plantain Deluxe',
                description: 'Rare black plantain with honey glaze',
                price: 5200,
                image: 'downloadw.jpg',
                icon: '⚫',
                tags: ['premium', 'exclusive']
            }
        ],

        proteins: [
            {
                id: 'grilled-tilapia',
                name: 'Grilled Tilapia',
                description: 'Fresh river fish with lemon herb marinade',
                price: 3500,
                image: 'downloade.jpg',
                icon: '🐟',
                maxQuantity: 2
            },
            {
                id: 'jumbo-prawns',
                name: 'Jumbo Tiger Prawns',
                description: 'XL prawns in garlic butter sauce',
                price: 4200,
                image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                icon: '🦐',
                maxQuantity: 3
            },
            {
                id: 'blue-crab',
                name: 'Whole Blue Crab',
                description: 'Seasonal crab with special preparation',
                price: 4800,
                image: 'downloadr.jpg',
                icon: '🦀',
                maxQuantity: 1
            },
            {
                id: 'spicy-chicken',
                name: 'Spicy Chicken Wings',
                description: 'Crispy wings with secret spice blend',
                price: 2800,
                image: 'https://images.unsplash.com/photo-1562967914-608f82629710?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                icon: '🍗',
                maxQuantity: 4
            },
            {
                id: 'beef-skewers',
                name: 'Beef Skewers',
                description: 'Premium beef cubes on skewers',
                price: 3200,
                image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                icon: '🥩',
                maxQuantity: 3
            },
            {
                id: 'grilled-lobster',
                name: 'Grilled Lobster Tail',
                description: 'Fresh lobster with herb butter',
                price: 6800,
                image: 'downloadt.jpg',
                icon: '🦞',
                maxQuantity: 1,
                tags: ['premium']
            }
        ],

        sauces: [
            {
                id: 'original-signature',
                name: 'Original Signature',
                description: 'Our legendary palm oil sauce blend',
                price: 0,
                image: 'https://images.unsplash.com/photo-1565299509267-2a879b912a9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                icon: '🔥',
                spiceLevel: 3
            },
            {
                id: 'fire-dragon',
                name: 'Fire Dragon',
                description: 'Extra spicy with ghost pepper infusion',
                price: 500,
                image: 'https://images.unsplash.com/photo-1565299509267-2a879b912a9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                icon: '🌶️',
                spiceLevel: 5
            },
            {
                id: 'garlic-gold',
                name: 'Garlic Gold',
                description: 'Premium garlic butter emulsion',
                price: 500,
                image: 'https://images.unsplash.com/photo-1565299509267-2a879b912a9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                icon: '🧄',
                spiceLevel: 2
            },
            {
                id: 'truffle-fusion',
                name: 'Truffle Fusion',
                description: 'Black truffle infused luxury sauce',
                price: 1000,
                image: 'https://images.unsplash.com/photo-1565299509267-2a879b912a9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                icon: '🍄',
                spiceLevel: 1,
                tags: ['premium']
            }
        ],

        extras: [
            {
                id: 'extra-sauce',
                name: 'Extra Sauce Jar',
                description: 'Additional signature sauce',
                price: 800,
                image: 'downloado.jpg',
                icon: '🥫'
            },
            {
                id: 'premium-coleslaw',
                name: 'Premium Coleslaw',
                description: 'Fresh vegetable slaw with house dressing',
                price: 1200,
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                icon: '🥗'
            },
            {
                id: 'crispy-dodo',
                name: 'Crispy Dodo',
                description: 'Extra plantain portion',
                price: 1500,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                icon: '🍌'
            },
            {
                id: 'truffle-fries',
                name: 'Truffle Fries',
                description: 'Hand-cut fries with truffle oil',
                price: 1800,
                image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                icon: '🍟',
                tags: ['premium']
            },
            {
                id: 'avocado-rose',
                name: 'Avocado Rose',
                description: 'Fresh avocado, artfully presented',
                price: 1600,
                image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                icon: '🥑'
            }
        ]
    },

    // Preset combinations (Preserved for internal logic use if needed, though UI removed)
    presets: {
        'family-feast': {
            name: 'Family Feast',
            description: 'Perfect for 4-5 people',
            base: 'combo-special',
            proteins: ['grilled-tilapia', 'spicy-chicken', 'beef-skewers'],
            sauce: 'original-signature',
            extras: ['premium-coleslaw', 'crispy-dodo', 'extra-sauce'],
            price: 22000
        },
        'romantic-dinner': {
            name: 'Romantic Dinner',
            description: 'For two with premium ingredients',
            base: 'premium-plantain',
            proteins: ['jumbo-prawns', 'grilled-lobster'],
            sauce: 'garlic-gold',
            extras: ['avocado-rose', 'truffle-fries'],
            presentation: 'special',
            price: 18500
        },
        'party-platter': {
            name: 'Party Platter',
            description: 'Great for gatherings',
            base: 'combo-special',
            proteins: ['grilled-tilapia', 'jumbo-prawns', 'blue-crab', 'spicy-chicken', 'beef-skewers'],
            sauce: 'original-signature',
            extras: ['premium-coleslaw', 'crispy-dodo', 'extra-sauce', 'truffle-fries'],
            price: 35000
        }
    },

    // Initialize the builder
    init: function() {
        console.log('🎨 Initializing Premium Builder...');
        this.createBuilderModal();
        this.setupEventListeners();
        this.setupPresetListeners();
        
        // Initialize with default selections
        this.updatePrice();
        this.updateVisualization();
    },

    // Create the builder modal HTML
    createBuilderModal: function() {
        const modal = document.getElementById('builderModal');
        if (!modal) {
            console.error('Builder modal not found!');
            return;
        }

        modal.innerHTML = `
            <div class="luxury-builder-container">
                <!-- Header with progress -->
                <div class="builder-header">
                    <div class="header-content">
                        <div class="brand-title">
                            <i class="fas fa-crown"></i>
                            <h2>Design Your Masterpiece</h2>
                            <span class="subtitle">Premium Custom Platter Builder</span>
                        </div>
                        
                        <div class="progress-container">
                            <div class="progress-steps">
                                ${Array.from({length: this.state.totalSteps}, (_, i) => i + 1).map(step => `
                                    <div class="step-indicator ${step === 1 ? 'active' : ''}" data-step="${step}">
                                        <div class="step-number">${step}</div>
                                        <div class="step-label">${this.getStepLabel(step)}</div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 20%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="builder-close" onclick="PremiumBuilder.close()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Main Content Area -->
                <div class="builder-content">
                    <!-- Step 1: Mode Selection -->
                    <div class="builder-step active" data-step="1">
                        <div class="step-header">
                            <h3><span class="step-number">01</span> Choose Your Creation Style</h3>
                            <p class="step-description">Select how you'd like to build your premium platter</p>
                        </div>
                        
                        <div class="mode-selection">
                            <div class="mode-card guided active" onclick="PremiumBuilder.selectMode('guided')">
                                <div class="mode-icon">
                                    <i class="fas fa-layer-group"></i>
                                </div>
                                <div class="mode-content">
                                    <h4>Guided Builder</h4>
                                    <p>Step-by-step creation with visual selection</p>
                                    <ul class="mode-features">
                                        <li><i class="fas fa-check"></i> Choose each component</li>
                                        <li><i class="fas fa-check"></i> See live preview</li>
                                        <li><i class="fas fa-check"></i> Chef recommendations</li>
                                    </ul>
                                </div>
                                <div class="mode-badge">
                                    <i class="fas fa-star"></i> Recommended
                                </div>
                            </div>
                            
                            <div class="mode-card quick" onclick="PremiumBuilder.selectMode('quick')">
                                <div class="mode-icon">
                                    <i class="fas fa-bolt"></i>
                                </div>
                                <div class="mode-content">
                                    <h4>Quick Builder</h4>
                                    <p>Describe exactly what you want with custom amount</p>
                                    <ul class="mode-features">
                                        <li><i class="fas fa-check"></i> Write custom instructions</li>
                                        <li><i class="fas fa-check"></i> Set your own amount</li>
                                        <li><i class="fas fa-check"></i> Quick presets available</li>
                                    </ul>
                                </div>
                                <div class="mode-badge">
                                    <i class="fas fa-rocket"></i> Express
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Base Selection (Guided) -->
                    <div class="builder-step" data-step="2">
                        <div class="step-header">
                            <h3><span class="step-number">02</span> Select Your Base</h3>
                            <p class="step-description">Foundation of your masterpiece</p>
                        </div>
                        
                        <div class="ingredients-grid" id="baseGrid">
                            ${this.ingredients.bases.map(base => `
                                <div class="ingredient-card" data-id="${base.id}" onclick="PremiumBuilder.selectBase('${base.id}')">
                                    <div class="card-image">
                                        <img src="${base.image}" alt="${base.name}" loading="lazy">
                                        <div class="card-overlay"></div>
                                        <div class="card-badges">
                                            ${base.tags?.includes('popular') ? '<span class="badge popular"><i class="fas fa-fire"></i> Popular</span>' : ''}
                                            ${base.tags?.includes('premium') ? '<span class="badge premium"><i class="fas fa-crown"></i> Premium</span>' : ''}
                                        </div>
                                    </div>
                                    <div class="card-content">
                                        <div class="card-header">
                                            <h4>${base.icon} ${base.name}</h4>
                                            <div class="card-price">₦${base.price.toLocaleString()}</div>
                                        </div>
                                        <p class="card-description">${base.description}</p>
                                        <div class="card-footer">
                                            <button class="select-btn">
                                                <i class="fas fa-plus-circle"></i> Select
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Step 3: Protein Selection -->
                    <div class="builder-step" data-step="3">
                        <div class="step-header">
                            <h3><span class="step-number">03</span> Choose Your Proteins</h3>
                            <p class="step-description">Select up to 3 protein options (optional)</p>
                            <div class="step-subheader">
                                <span class="protein-count">Selected: <span id="proteinCount">0</span>/3</span>
                                <small>Click protein cards to add/remove</small>
                            </div>
                        </div>
                        
                        <div class="ingredients-grid" id="proteinGrid">
                            ${this.ingredients.proteins.map(protein => `
                                <div class="ingredient-card protein" data-id="${protein.id}" onclick="PremiumBuilder.toggleProtein('${protein.id}')">
                                    <div class="card-image">
                                        <img src="${protein.image}" alt="${protein.name}" loading="lazy">
                                        <div class="card-overlay"></div>
                                        <div class="quantity-badge">0</div>
                                        <div class="card-badges">
                                            ${protein.tags?.includes('premium') ? '<span class="badge premium"><i class="fas fa-crown"></i> Premium</span>' : ''}
                                        </div>
                                    </div>
                                    <div class="card-content">
                                        <div class="card-header">
                                            <h4>${protein.icon} ${protein.name}</h4>
                                            <div class="card-price">₦${protein.price.toLocaleString()}</div>
                                        </div>
                                        <p class="card-description">${protein.description}</p>
                                        <div class="protein-controls">
                                            <button class="btn-remove" onclick="event.stopPropagation(); PremiumBuilder.adjustProteinQuantity('${protein.id}', -1)">
                                                <i class="fas fa-minus"></i>
                                            </button>
                                            <span class="quantity-display">0</span>
                                            <button class="btn-add" onclick="event.stopPropagation(); PremiumBuilder.adjustProteinQuantity('${protein.id}', 1)">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Step 4: Sauce & Spice -->
                    <div class="builder-step" data-step="4">
                        <div class="step-header">
                            <h3><span class="step-number">04</span> Sauce & Spice Level</h3>
                            <p class="step-description">Choose your sauce and preferred spice level</p>
                        </div>
                        
                        <div class="sauce-selection">
                            <div class="sauce-options">
                                ${this.ingredients.sauces.map(sauce => `
                                    <div class="sauce-card" data-id="${sauce.id}" onclick="PremiumBuilder.selectSauce('${sauce.id}')">
                                        <div class="sauce-icon">${sauce.icon}</div>
                                        <div class="sauce-content">
                                            <h5>${sauce.name}</h5>
                                            <p>${sauce.description}</p>
                                            <div class="sauce-price">${sauce.price > 0 ? `+₦${sauce.price.toLocaleString()}` : 'Included'}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="spice-control">
                                <h4><i class="fas fa-pepper-hot"></i> Spice Level</h4>
                                <div class="spice-slider-container">
                                    <div class="spice-labels">
                                        <span>Mild</span>
                                        <span>Medium</span>
                                        <span>Hot</span>
                                        <span>Extra Hot</span>
                                        <span>Fire</span>
                                    </div>
                                    <input type="range" min="1" max="5" value="3" class="spice-slider" 
                                           oninput="PremiumBuilder.updateSpiceLevel(this.value)">
                                    <div class="spice-visual">
                                        <div class="spice-level" style="width: 60%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 5: Extras -->
                    <div class="builder-step" data-step="5">
                        <div class="step-header">
                            <h3><span class="step-number">05</span> Add Extras</h3>
                            <p class="step-description">Enhance your platter with premium extras</p>
                        </div>
                        
                        <div class="extras-grid">
                            ${this.ingredients.extras.map(extra => `
                                <div class="extra-card" data-id="${extra.id}" onclick="PremiumBuilder.toggleExtra('${extra.id}')">
                                    <div class="extra-image">
                                        <img src="${extra.image}" alt="${extra.name}" loading="lazy">
                                    </div>
                                    <div class="extra-content">
                                        <div class="extra-header">
                                            <h5>${extra.icon} ${extra.name}</h5>
                                            <div class="extra-price">+₦${extra.price.toLocaleString()}</div>
                                        </div>
                                        <p class="extra-description">${extra.description}</p>
                                        <div class="extra-check">
                                            <i class="fas fa-check"></i>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="special-instructions">
                            <h4><i class="fas fa-edit"></i> Special Instructions</h4>
                            <textarea placeholder="Any special requests? (e.g., 'Extra crispy', 'No onions', 'Separate sauces', etc.)" 
                                      rows="3" oninput="PremiumBuilder.updateSpecialInstructions(this.value)"></textarea>
                        </div>
                    </div>

                    <!-- Quick Builder Interface -->
                    <div class="builder-step quick-mode" data-step="quick">
                        <div class="step-header">
                            <h3><span class="step-number">⚡</span> Quick Custom Order</h3>
                            <p class="step-description">Describe exactly what you want and set your amount</p>
                        </div>
                        
                        <div class="quick-builder">
                            <!-- Custom Instructions (Moved up, now Compulsory) -->
                            <div class="instructions-section">
                                <h4><i class="fas fa-edit"></i> Your Custom Instructions <span style="color:red">*</span></h4>
                                <div class="instructions-box">
                                    <textarea placeholder="Example: I want plantain and yam base with grilled fish and prawns. Make it extra spicy with garlic sauce. Add coleslaw on the side. Please present it beautifully for a special occasion." 
                                              rows="5" id="quickInstructions" oninput="PremiumBuilder.updateQuickInstructions(this.value)"></textarea>
                                    <div class="instructions-footer">
                                        <div class="char-count">
                                            <span id="charCount">0</span>/500 characters
                                        </div>
                                        <div class="instructions-tips">
                                            <i class="fas fa-lightbulb"></i> Be specific for best results
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Custom Amount Input (Moved up, now Compulsory) -->
                            <div class="amount-section">
                                <h4><i class="fas fa-money-bill-wave"></i> Set Your Amount <span style="color:red">*</span></h4>
                                <div class="amount-input-container">
                                    <div class="amount-input-wrapper">
                                        <span class="currency-symbol">₦</span>
                                        <input type="number" 
                                               id="customAmount" 
                                               step="500" 
                                               placeholder="Enter amount (e.g., 15000)" 
                                               oninput="PremiumBuilder.updateCustomAmount(this.value)">
                                    </div>
                                    <div class="amount-tips">
                                        <i class="fas fa-info-circle"></i>
                                        <span>Based on your instructions, our chefs will prepare accordingly.</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Order Type (Optional) -->
                            <div class="order-type-section">
                                <h4><i class="fas fa-tag"></i> Order Type (Optional)</h4>
                                <div class="order-type-options">
                                    <label class="order-type-option" onclick="PremiumBuilder.selectOrderType('custom')">
                                        <input type="radio" name="orderType" value="custom" checked>
                                        <div class="option-content">
                                            <div class="option-icon">🎨</div>
                                            <div class="option-info">
                                                <strong>Custom Order</strong>
                                                <small>Special request</small>
                                            </div>
                                        </div>
                                    </label>
                                    <label class="order-type-option" onclick="PremiumBuilder.selectOrderType('birthday')">
                                        <input type="radio" name="orderType" value="birthday">
                                        <div class="option-content">
                                            <div class="option-icon">🎂</div>
                                            <div class="option-info">
                                                <strong>Birthday Special</strong>
                                                <small>With extra surprises</small>
                                            </div>
                                        </div>
                                    </label>
                                    <label class="order-type-option" onclick="PremiumBuilder.selectOrderType('anniversary')">
                                        <input type="radio" name="orderType" value="anniversary">
                                        <div class="option-content">
                                            <div class="option-icon">💝</div>
                                            <div class="option-info">
                                                <strong>Anniversary</strong>
                                                <small>Romantic setup</small>
                                            </div>
                                        </div>
                                    </label>
                                    <label class="order-type-option" onclick="PremiumBuilder.selectOrderType('corporate')">
                                        <input type="radio" name="orderType" value="corporate">
                                        <div class="option-content">
                                            <div class="option-icon">💼</div>
                                            <div class="option-info">
                                                <strong>Corporate</strong>
                                                <small>Business events</small>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Summary Step -->
                    <div class="builder-step summary-step" data-step="summary">
                        <div class="step-header">
                            <h3><span class="step-number">✓</span> Review Your Creation</h3>
                            <p class="step-description">Finalize your premium platter</p>
                        </div>
                        
                        <div class="summary-container">
                            <!-- Visual Preview -->
                            <div class="visual-preview">
                                <div class="platter-visual" id="platterVisual">
                                    <div class="visual-base"></div>
                                    <div class="visual-proteins">
                                        <div class="visual-protein"></div>
                                        <div class="visual-protein"></div>
                                    </div>
                                    <div class="visual-sauce"></div>
                                    <div class="visual-extras">
                                        <div class="visual-extra"></div>
                                    </div>
                                </div>
                                <div class="visual-legend">
                                    <h4>Your Platter Includes:</h4>
                                    <div class="legend-items" id="legendItems"></div>
                                </div>
                            </div>
                            
                            <!-- Order Details -->
                            <div class="order-details">
                                <div class="details-section">
                                    <h4><i class="fas fa-clipboard-list"></i> Order Summary</h4>
                                    <div class="details-list" id="orderSummary">
                                        <!-- Dynamically populated -->
                                    </div>
                                </div>
                                
                                <div class="price-section">
                                    <div class="price-breakdown">
                                        <div class="price-row">
                                            <span>Base:</span>
                                            <span id="priceBase">₦0</span>
                                        </div>
                                        <div class="price-row">
                                            <span>Proteins:</span>
                                            <span id="priceProteins">₦0</span>
                                        </div>
                                        <div class="price-row">
                                            <span>Sauce:</span>
                                            <span id="priceSauce">₦0</span>
                                        </div>
                                        <div class="price-row">
                                            <span>Extras:</span>
                                            <span id="priceExtras">₦0</span>
                                        </div>
                                        <div class="price-row total">
                                            <span>TOTAL:</span>
                                            <span id="priceTotal">₦0</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer with Navigation -->
                <div class="builder-footer">
                    <div class="footer-left">
                        <div class="total-display">
                            <span class="total-label">Estimated Total:</span>
                            <span class="total-amount" id="builderTotal">₦0</span>
                        </div>
                    </div>
                    
                    <div class="footer-center">
                        <button class="btn-prev" onclick="PremiumBuilder.prevStep()">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                        
                        <button class="btn-next" onclick="PremiumBuilder.nextStep()">
                            Next <i class="fas fa-arrow-right"></i>
                        </button>
                        
                        <button class="btn-complete" onclick="PremiumBuilder.addToCart()">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                    
                    <div class="footer-right">
                        <div class="builder-tips">
                            <i class="fas fa-info-circle"></i>
                            <span>100% Satisfaction Guarantee</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Quick builder character count
        const quickTextarea = document.getElementById('quickInstructions');
        if (quickTextarea) {
            quickTextarea.addEventListener('input', function() {
                const count = this.value.length;
                const charCountElem = document.getElementById('charCount');
                if (charCountElem) {
                    charCountElem.textContent = count;
                }
                if (count > 500) {
                    this.value = this.value.substring(0, 500);
                }
            });
        }
        
        // Custom amount input validation (Removed min/max restriction)
        const amountInput = document.getElementById('customAmount');
        if (amountInput) {
            amountInput.addEventListener('input', function() {
                // Allow any amount, just ensure it's a number
                let value = parseInt(this.value.replace(/\D/g, ''));
                if (isNaN(value)) value = 0;
                this.value = value;
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    },

    setupPresetListeners: function() {
        // Will be implemented when presets are clicked
    },

    // Navigation methods
    selectMode: function(mode) {
        this.state.mode = mode;
        
        // Update UI
        document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector(`.mode-card.${mode}`)?.classList.add('active');
        
        if (mode === 'quick') {
            this.goToStep('quick');
        } else {
            this.goToStep(2);
        }
        
        this.updateProgress();
    },

    goToStep: function(step) {
        // Hide all steps
        document.querySelectorAll('.builder-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Show target step
        const targetStep = document.querySelector(`.builder-step[data-step="${step}"]`);
        if (targetStep) {
            targetStep.classList.add('active');
            this.state.currentStep = step;
            this.updateProgress();
        }
        
        // Update navigation buttons
        this.updateNavigation();
        
        // Update summary if we're on summary step
        if (step === 'summary') {
            this.updateSummary();
        }
    },

    nextStep: function() {
        if (this.state.mode === 'guided') {
            const current = parseInt(this.state.currentStep);
            if (current < this.state.totalSteps) {
                this.goToStep(current + 1);
            } else {
                this.goToStep('summary');
            }
        } else {
            // QUICK MODE VALIDATION
            // Check Instructions
            if (!this.state.quick.instructions || this.state.quick.instructions.trim().length === 0) {
                this.showToast('Please enter your custom instructions', 'warning');
                // Focus on instructions
                const instructionsBox = document.getElementById('quickInstructions');
                if(instructionsBox) instructionsBox.focus();
                return;
            }

            // Check Amount
            if (!this.state.quick.customAmount || this.state.quick.customAmount <= 0) {
                this.showToast('Please enter a valid amount', 'warning');
                // Focus on amount
                const amountBox = document.getElementById('customAmount');
                if(amountBox) amountBox.focus();
                return;
            }

            // If validation passes
            this.goToStep('summary');
        }
    },

    prevStep: function() {
        if (this.state.mode === 'guided') {
            const current = parseInt(this.state.currentStep);
            if (current > 1) {
                this.goToStep(current - 1);
            } else {
                this.goToStep(1);
            }
        } else {
            this.goToStep(1);
        }
    },

    updateProgress: function() {
        const progress = document.querySelector('.progress-fill');
        const stepIndicators = document.querySelectorAll('.step-indicator');
        
        if (!progress || !stepIndicators.length) return;
        
        // Calculate progress percentage
        let progressPercent = 0;
        if (this.state.mode === 'guided') {
            const current = parseInt(this.state.currentStep);
            progressPercent = (current / this.state.totalSteps) * 100;
        } else if (this.state.currentStep === 'quick') {
            progressPercent = 80;
        } else if (this.state.currentStep === 'summary') {
            progressPercent = 100;
        }
        
        progress.style.width = `${progressPercent}%`;
        
        // Update step indicators
        stepIndicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove('active', 'completed');
            
            if (this.state.mode === 'guided') {
                if (stepNum < this.state.currentStep) {
                    indicator.classList.add('completed');
                } else if (stepNum == this.state.currentStep) {
                    indicator.classList.add('active');
                }
            }
        });
    },

    updateNavigation: function() {
        const prevBtn = document.querySelector('.btn-prev');
        const nextBtn = document.querySelector('.btn-next');
        const completeBtn = document.querySelector('.btn-complete');
        
        if (!prevBtn || !nextBtn || !completeBtn) return;
        
        if (this.state.currentStep === 1 || this.state.currentStep === 'quick') {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'inline-flex';
            completeBtn.style.display = 'none';
        } else if (this.state.currentStep === 'summary') {
            prevBtn.style.display = 'inline-flex';
            nextBtn.style.display = 'none';
            completeBtn.style.display = 'inline-flex';
        } else {
            prevBtn.style.display = 'inline-flex';
            nextBtn.style.display = 'inline-flex';
            completeBtn.style.display = 'none';
        }
    },

    // Selection methods
    selectBase: function(baseId) {
        const base = this.ingredients.bases.find(b => b.id === baseId);
        if (!base) return;
        
        this.state.guided.base = base;
        
        // Update UI
        document.querySelectorAll('#baseGrid .ingredient-card').forEach(card => {
            card.classList.remove('selected');
        });
        const selectedCard = document.querySelector(`#baseGrid .ingredient-card[data-id="${baseId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
            const selectBtn = selectedCard.querySelector('.select-btn');
            if (selectBtn) {
                selectBtn.innerHTML = '<i class="fas fa-check"></i> Selected';
            }
        }
        
        this.updatePrice();
        this.updateVisualization();
        this.showToast(`Selected: ${base.name}`, 'success');
    },

    toggleProtein: function(proteinId) {
        const protein = this.ingredients.proteins.find(p => p.id === proteinId);
        if (!protein) return;
        
        const existing = this.state.guided.proteins.find(p => p.id === proteinId);
        const card = document.querySelector(`#proteinGrid .ingredient-card[data-id="${proteinId}"]`);
        
        if (existing) {
            // Remove protein
            this.state.guided.proteins = this.state.guided.proteins.filter(p => p.id !== proteinId);
            if (card) {
                card.classList.remove('selected');
                card.querySelector('.quantity-badge').textContent = '0';
                card.querySelector('.quantity-display').textContent = '0';
            }
        } else {
            // Add protein if we have capacity
            if (this.state.guided.proteins.length < 3) {
                this.state.guided.proteins.push({
                    ...protein,
                    quantity: 1
                });
                if (card) {
                    card.classList.add('selected');
                    card.querySelector('.quantity-badge').textContent = '1';
                    card.querySelector('.quantity-display').textContent = '1';
                }
            } else {
                this.showToast('Maximum 3 proteins allowed', 'warning');
                return;
            }
        }
        
        this.updateProteinCount();
        this.updatePrice();
        this.updateVisualization();
    },

    adjustProteinQuantity: function(proteinId, change) {
        const protein = this.state.guided.proteins.find(p => p.id === proteinId);
        if (!protein) return;
        
        const maxQty = this.ingredients.proteins.find(p => p.id === proteinId)?.maxQuantity || 2;
        
        if (protein.quantity + change < 1) {
            // Remove protein
            this.toggleProtein(proteinId);
            return;
        }
        
        if (protein.quantity + change > maxQty) {
            this.showToast(`Maximum ${maxQty} allowed for this protein`, 'warning');
            return;
        }
        
        protein.quantity += change;
        
        // Update UI
        const card = document.querySelector(`#proteinGrid .ingredient-card[data-id="${proteinId}"]`);
        if (card) {
            card.querySelector('.quantity-badge').textContent = protein.quantity;
            card.querySelector('.quantity-display').textContent = protein.quantity;
        }
        
        this.updateProteinCount();
        this.updatePrice();
    },

    selectSauce: function(sauceId) {
        const sauce = this.ingredients.sauces.find(s => s.id === sauceId);
        if (!sauce) return;
        
        this.state.guided.sauce = sauce;
        
        // Update UI
        document.querySelectorAll('.sauce-card').forEach(card => {
            card.classList.remove('selected');
        });
        const selectedCard = document.querySelector(`.sauce-card[data-id="${sauceId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        this.updatePrice();
        this.showToast(`Selected: ${sauce.name}`, 'success');
    },

    updateSpiceLevel: function(level) {
        this.state.guided.spiceLevel = parseInt(level);
        
        // Update slider visual
        const visual = document.querySelector('.spice-level');
        if (visual) {
            visual.style.width = `${(level - 1) * 25}%`;
        }
        
        // Update spice description
        const descriptions = ['Mild', 'Medium', 'Hot', 'Extra Hot', 'Fire'];
        this.showToast(`Spice level: ${descriptions[level - 1]}`, 'info');
    },

    toggleExtra: function(extraId) {
        const extra = this.ingredients.extras.find(e => e.id === extraId);
        if (!extra) return;
        
        const existingIndex = this.state.guided.extras.findIndex(e => e.id === extraId);
        const card = document.querySelector(`.extra-card[data-id="${extraId}"]`);
        
        if (existingIndex > -1) {
            // Remove extra
            this.state.guided.extras.splice(existingIndex, 1);
            if (card) {
                card.classList.remove('selected');
            }
        } else {
            // Add extra
            this.state.guided.extras.push(extra);
            if (card) {
                card.classList.add('selected');
            }
        }
        
        this.updatePrice();
        this.updateVisualization();
    },

    updateSpecialInstructions: function(instructions) {
        this.state.cartItem.specialInstructions = instructions;
    },

    // Quick Builder methods
    updateQuickInstructions: function(instructions) {
        this.state.quick.instructions = instructions;
    },

    updateCustomAmount: function(amount) {
        const amountNum = parseInt(amount) || 0;
        // Removed restriction: allow any amount >= 0
        this.state.quick.customAmount = amountNum;
        this.updatePrice();
    },

    selectOrderType: function(orderType) {
        this.state.quick.orderType = orderType;
        
        // Update UI
        document.querySelectorAll('.order-type-option').forEach(option => {
            option.classList.remove('active');
        });
        const selectedOption = document.querySelector(`.order-type-option[onclick*="${orderType}"]`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
    },

    applyPreset: function(presetKey) {
        const preset = this.presets[presetKey];
        if (!preset) return;
        
        // Apply preset to guided builder
        this.state.mode = 'guided';
        this.selectMode('guided');
        
        // Set base
        this.selectBase(preset.base);
        
        // Clear existing proteins and add preset ones
        this.state.guided.proteins = [];
        preset.proteins.forEach(proteinId => {
            this.toggleProtein(proteinId);
        });
        
        // Set sauce
        this.selectSauce(preset.sauce);
        
        // Clear existing extras and add preset ones
        this.state.guided.extras = [];
        preset.extras.forEach(extraId => {
            this.toggleExtra(extraId);
        });
        
        // Set presentation if specified
        if (preset.presentation) {
            this.state.guided.presentation = preset.presentation;
        }
        
        this.showToast(`Applied ${preset.name} preset`, 'success');
        this.goToStep('summary');
    },

    // Update methods
    updateProteinCount: function() {
        const totalProteins = this.state.guided.proteins.reduce((sum, p) => sum + p.quantity, 0);
        const proteinCountElem = document.getElementById('proteinCount');
        if (proteinCountElem) {
            proteinCountElem.textContent = totalProteins;
        }
    },

    updatePrice: function() {
        let total = 0;
        
        if (this.state.mode === 'guided') {
            // Base price
            if (this.state.guided.base) {
                total += this.state.guided.base.price;
            }
            
            // Proteins price
            this.state.guided.proteins.forEach(protein => {
                total += protein.price * protein.quantity;
            });
            
            // Sauce price
            if (this.state.guided.sauce) {
                total += this.state.guided.sauce.price;
            }
            
            // Extras price
            this.state.guided.extras.forEach(extra => {
                total += extra.price;
            });
        } else {
            // Quick builder - use custom amount
            total = this.state.quick.customAmount || 0;
        }
        
        // Update cart item
        this.state.cartItem.price = total;
        this.state.cartItem.id = `custom-${Date.now()}`;
        
        // Update UI
        const builderTotalElem = document.getElementById('builderTotal');
        if (builderTotalElem) {
            builderTotalElem.textContent = `₦${total.toLocaleString()}`;
        }
    },

    updateVisualization: function() {
        const visual = document.getElementById('platterVisual');
        if (!visual) return;
        
        // Clear previous
        visual.innerHTML = '';
        
        // Add base visual
        if (this.state.guided.base) {
            const baseVisual = document.createElement('div');
            baseVisual.className = 'visual-base';
            baseVisual.style.backgroundImage = `url(${this.state.guided.base.image})`;
            baseVisual.title = this.state.guided.base.name;
            visual.appendChild(baseVisual);
        }
        
        // Add protein visuals
        this.state.guided.proteins.forEach((protein, index) => {
            const proteinVisual = document.createElement('div');
            proteinVisual.className = `visual-protein protein-${index + 1}`;
            proteinVisual.style.backgroundImage = `url(${protein.image})`;
            proteinVisual.title = `${protein.name} × ${protein.quantity}`;
            visual.appendChild(proteinVisual);
        });
        
        // Add sauce visual if selected
        if (this.state.guided.sauce) {
            const sauceVisual = document.createElement('div');
            sauceVisual.className = 'visual-sauce';
            sauceVisual.title = this.state.guided.sauce.name;
            visual.appendChild(sauceVisual);
        }
        
        // Add extras visuals
        this.state.guided.extras.forEach((extra, index) => {
            const extraVisual = document.createElement('div');
            extraVisual.className = `visual-extra extra-${index + 1}`;
            extraVisual.style.backgroundImage = `url(${extra.image})`;
            extraVisual.title = extra.name;
            visual.appendChild(extraVisual);
        });
    },

    updateSummary: function() {
        if (this.state.mode === 'guided') {
            this.updateGuidedSummary();
        } else {
            this.updateQuickSummary();
        }
        
        this.updatePriceBreakdown();
    },

    updateGuidedSummary: function() {
        const summaryElement = document.getElementById('orderSummary');
        if (!summaryElement) return;
        
        let html = '';
        
        // Base
        if (this.state.guided.base) {
            html += `
                <div class="summary-item">
                    <strong>Base:</strong>
                    <span>${this.state.guided.base.name}</span>
                    <span class="item-price">₦${this.state.guided.base.price.toLocaleString()}</span>
                </div>
            `;
        }
        
        // Proteins
        if (this.state.guided.proteins.length > 0) {
            this.state.guided.proteins.forEach(protein => {
                html += `
                    <div class="summary-item">
                        <strong>Protein:</strong>
                        <span>${protein.name} × ${protein.quantity}</span>
                        <span class="item-price">₦${(protein.price * protein.quantity).toLocaleString()}</span>
                </div>
                `;
            });
        }
        
        // Sauce
        if (this.state.guided.sauce) {
            const saucePrice = this.state.guided.sauce.price > 0 ? 
                `+₦${this.state.guided.sauce.price.toLocaleString()}` : 'Included';
            html += `
                <div class="summary-item">
                    <strong>Sauce:</strong>
                    <span>${this.state.guided.sauce.name}</span>
                    <span class="item-price">${saucePrice}</span>
                </div>
            `;
        }
        
        // Spice level
        const spiceLevels = ['Mild', 'Medium', 'Hot', 'Extra Hot', 'Fire'];
        html += `
            <div class="summary-item">
                <strong>Spice Level:</strong>
                <span>${spiceLevels[this.state.guided.spiceLevel - 1] || 'Medium'}</span>
            </div>
        `;
        
        // Extras
        if (this.state.guided.extras.length > 0) {
            this.state.guided.extras.forEach(extra => {
                html += `
                    <div class="summary-item">
                        <strong>Extra:</strong>
                        <span>${extra.name}</span>
                        <span class="item-price">+₦${extra.price.toLocaleString()}</span>
                    </div>
                `;
            });
        }
        
        // Special instructions
        if (this.state.cartItem.specialInstructions) {
            html += `
                <div class="summary-item special">
                    <strong>Special Instructions:</strong>
                    <span>${this.state.cartItem.specialInstructions}</span>
                </div>
            `;
        }
        
        summaryElement.innerHTML = html || '<p>No items selected</p>';
    },

    updateQuickSummary: function() {
        const summaryElement = document.getElementById('orderSummary');
        if (!summaryElement) return;
        
        const instructions = this.state.quick.instructions || '';
        const amount = this.state.quick.customAmount || 0;
        const orderType = this.state.quick.orderType || 'custom';
        
        let html = `
            <div class="summary-item">
                <strong>Order Type:</strong>
                <span>${this.getOrderTypeLabel(orderType)}</span>
            </div>
        `;
        
        if (instructions) {
            html += `
                <div class="summary-item">
                    <strong>Instructions:</strong>
                    <span class="instructions-text">${instructions.substring(0, 150)}${instructions.length > 150 ? '...' : ''}</span>
                </div>
            `;
        }
        
        if (amount > 0) {
            html += `
                <div class="summary-item">
                    <strong>Amount:</strong>
                    <span class="amount-value">₦${amount.toLocaleString()}</span>
                </div>
            `;
        }
        
        summaryElement.innerHTML = html;
    },

    updatePriceBreakdown: function() {
        let basePrice = 0;
        let proteinPrice = 0;
        let saucePrice = 0;
        let extrasPrice = 0;
        
        if (this.state.mode === 'guided') {
            if (this.state.guided.base) {
                basePrice = this.state.guided.base.price;
            }
            
            this.state.guided.proteins.forEach(protein => {
                proteinPrice += protein.price * protein.quantity;
            });
            
            if (this.state.guided.sauce) {
                saucePrice = this.state.guided.sauce.price;
            }
            
            this.state.guided.extras.forEach(extra => {
                extrasPrice += extra.price;
            });
        } else {
            // Quick builder - custom amount
            basePrice = 0;
            proteinPrice = 0;
            saucePrice = 0;
            extrasPrice = this.state.quick.customAmount || 0;
        }
        
        const total = basePrice + proteinPrice + saucePrice + extrasPrice;
        
        // Update UI
        const priceBaseElem = document.getElementById('priceBase');
        const priceProteinsElem = document.getElementById('priceProteins');
        const priceSauceElem = document.getElementById('priceSauce');
        const priceExtrasElem = document.getElementById('priceExtras');
        const priceTotalElem = document.getElementById('priceTotal');
        
        if (priceBaseElem) priceBaseElem.textContent = `₦${basePrice.toLocaleString()}`;
        if (priceProteinsElem) priceProteinsElem.textContent = `₦${proteinPrice.toLocaleString()}`;
        if (priceSauceElem) priceSauceElem.textContent = `₦${saucePrice.toLocaleString()}`;
        if (priceExtrasElem) priceExtrasElem.textContent = `₦${extrasPrice.toLocaleString()}`;
        if (priceTotalElem) priceTotalElem.textContent = `₦${total.toLocaleString()}`;
    },

    // Replace the existing addToCart function in PremiumBuilder with this:

addToCart: async function() {
    // Validate quick builder
    if (this.state.mode === 'quick') {
        if (!this.state.quick.instructions || this.state.quick.instructions.trim().length === 0) {
            this.showToast('Please provide detailed instructions', 'warning');
            return;
        }
        
        if (!this.state.quick.customAmount || this.state.quick.customAmount <= 0) {
            this.showToast('Please enter a valid amount', 'warning');
            return;
        }
    }
    
    // Build the order data
    let orderData = {
        cartItem: {
            id: `custom-${Date.now()}`,
            name: this.state.cartItem.name,
            price: this.state.cartItem.price,
            quantity: 1,
            isCustom: true,
            customizations: {}
        },
        mode: this.state.mode,
        total: this.state.cartItem.price,
        items: [] // We'll populate this below
    };
    
    if (this.state.mode === 'guided') {
        // Build guided builder data
        let description = [];
        let items = [];
        
        // Base item
        if (this.state.guided.base) {
            items.push({
                id: this.state.guided.base.id,
                name: this.state.guided.base.name,
                price: this.state.guided.base.price,
                quantity: 1,
                type: 'base',
                image: this.state.guided.base.image
            });
            description.push(this.state.guided.base.name);
        }
        
        // Proteins
        if (this.state.guided.proteins.length > 0) {
            this.state.guided.proteins.forEach(protein => {
                items.push({
                    id: protein.id,
                    name: protein.name,
                    price: protein.price,
                    quantity: protein.quantity || 1,
                    type: 'protein',
                    image: protein.image
                });
            });
            
            const proteins = this.state.guided.proteins.map(p => 
                `${p.name}${p.quantity > 1 ? ` × ${p.quantity}` : ''}`
            ).join(', ');
            description.push(`with ${proteins}`);
        }
        
        // Sauce
        if (this.state.guided.sauce) {
            items.push({
                id: this.state.guided.sauce.id,
                name: this.state.guided.sauce.name,
                price: this.state.guided.sauce.price,
                quantity: 1,
                type: 'sauce',
                image: this.state.guided.sauce.image
            });
            description.push(`${this.state.guided.sauce.name} sauce`);
        }
        
        // Extras
        if (this.state.guided.extras.length > 0) {
            this.state.guided.extras.forEach(extra => {
                items.push({
                    id: extra.id,
                    name: extra.name,
                    price: extra.price,
                    quantity: 1,
                    type: 'extra',
                    image: extra.image
                });
            });
            
            const extras = this.state.guided.extras.map(e => e.name).join(', ');
            description.push(`plus ${extras}`);
        }
        
        const spiceLevels = ['Mild', 'Medium', 'Hot', 'Extra Hot', 'Fire'];
        description.push(`${spiceLevels[this.state.guided.spiceLevel - 1] || 'Medium'} spice`);
        
        orderData.cartItem.description = description.join(' | ');
        orderData.cartItem.customizations = {
            type: 'guided',
            base: this.state.guided.base?.id,
            proteins: this.state.guided.proteins.map(p => ({
                id: p.id,
                name: p.name,
                quantity: p.quantity,
                price: p.price
            })),
            sauce: this.state.guided.sauce?.id,
            spiceLevel: this.state.guided.spiceLevel,
            extras: this.state.guided.extras.map(e => e.id),
            specialInstructions: this.state.cartItem.specialInstructions
        };
        orderData.items = items;
        
    } else {
        // Quick builder data
        const orderTypeLabels = {
            'custom': 'Custom Order',
            'birthday': 'Birthday Special',
            'anniversary': 'Anniversary Special',
            'corporate': 'Corporate Order'
        };
        
        orderData.cartItem.description = `${orderTypeLabels[this.state.quick.orderType] || 'Custom Order'}: ${this.state.quick.instructions.substring(0, 100)}${this.state.quick.instructions.length > 100 ? '...' : ''}`;
        orderData.cartItem.customizations = {
            type: 'quick',
            instructions: this.state.quick.instructions,
            customAmount: this.state.quick.customAmount,
            orderType: this.state.quick.orderType
        };
        orderData.items = [{
            id: 'quick-custom',
            name: 'Custom Quick Order',
            price: this.state.quick.customAmount,
            quantity: 1,
            type: 'quick',
            description: this.state.quick.instructions
        }];
    }
    
    // Save the premium builder order
    if (typeof EnhancedOrderSystem !== 'undefined') {
        const saveResult = await EnhancedOrderSystem.savePremiumBuilderOrder(orderData);
        
        if (saveResult.success) {
            console.log('✅ Premium builder order saved with ID:', saveResult.orderId);
        } else {
            console.warn('⚠️ Could not save premium builder order:', saveResult.error);
        }
    } else {
        console.warn('⚠️ EnhancedOrderSystem not available, saving to localStorage only');
        // Fallback to localStorage
        const orders = JSON.parse(localStorage.getItem('ceoGrillsPremiumOrders') || '[]');
        orders.push({
            ...orderData,
            orderId: 'PB-LOCAL-' + Date.now(),
            createdAt: new Date().toISOString(),
            userId: firebase.auth().currentUser?.uid || 'guest',
            userEmail: firebase.auth().currentUser?.email || 'guest@example.com'
        });
        localStorage.setItem('ceoGrillsPremiumOrders', JSON.stringify(orders));
    }
    
    // Add to cart for immediate purchase
    if (typeof addToCart === 'function') {
        const success = addToCart(orderData.cartItem);
        if (success) {
            this.close();
            this.showToast('Custom platter added to cart! Our chefs will prepare it with extra care.', 'success');
            this.resetBuilder();
        }
    } else {
        console.error('addToCart function not found!');
        this.showToast('Error adding to cart', 'error');
    }
},
    getPlatterImage: function() {
        // Return appropriate image based on selections
        if (this.state.guided.base?.image) {
            return this.state.guided.base.image;
        }
        
        // Default image
        return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    },

    // Utility methods
    getStepLabel: function(step) {
        const labels = {
            1: 'Mode',
            2: 'Base',
            3: 'Proteins',
            4: 'Sauce',
            5: 'Extras'
        };
        return labels[step] || 'Step ' + step;
    },

    getOrderTypeLabel: function(orderType) {
        const labels = {
            'custom': 'Custom Order',
            'birthday': 'Birthday Special',
            'anniversary': 'Anniversary Special',
            'corporate': 'Corporate Order'
        };
        return labels[orderType] || 'Custom Order';
    },

    showToast: function(message, type = 'info') {
        // Use existing toast system
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            alert(message);
        }
    },

    resetBuilder: function() {
        // Reset state
        this.state = {
            currentStep: 1,
            totalSteps: 5,
            mode: 'guided',
            cartItem: {
                id: '',
                name: 'Custom Premium Platter',
                description: '',
                price: 0,
                image: '',
                category: 'custom',
                customizations: {},
                specialInstructions: ''
            },
            guided: {
                base: null,
                proteins: [],
                sauce: null,
                spiceLevel: 3,
                extras: [],
                presentation: 'standard'
            },
            quick: {
                instructions: '',
                customAmount: 0,
                orderType: 'custom'
            }
        };
        
        // Reset UI if modal is open
        if (document.getElementById('builderModal')?.classList.contains('active')) {
            this.goToStep(1);
            this.updateVisualization();
            this.updatePrice();
            this.updateProteinCount();
        }
    },

    // Modal control
    open: function() {
        const modal = document.getElementById('builderModal');
        if (!modal) return;
        
        modal.classList.add('active');
        modal.style.display = 'flex';
        
        // Initialize builder
        this.resetBuilder();
        this.init();
        
        this.showToast('Design your premium platter! 🔥', 'success');
    },

    close: function() {
        const modal = document.getElementById('builderModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
};

// ===== INITIALIZE PREMIUM BUILDER =====
function initPremiumBuilder() {
    console.log('🎨 Initializing Premium Builder...');
    // The builder will be initialized when the modal opens
}




// ===== EXPORT FUNCTIONS TO WINDOW =====
// Make functions available for onclick handlers in HTML
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.openCartModal = openCartModal;
window.closeModal = closeModal;
window.scrollToSection = scrollToSection;
window.showToast = showToast;
window.toggleAdminPanel = toggleAdminPanel;
window.showItemDetails = showItemDetails;
window.openDirections = openDirections;
window.sendWhatsAppMessage = sendWhatsAppMessage;
window.clearContactForm = clearContactForm;
window.copyToClipboard = copyToClipboard;

console.log('🚀 The CEO Grills JavaScript loaded successfully!');



// ===== SECRET ADMIN TAP SYSTEM =====
let tapCount = 0;
let tapTimeout = null;
const ADMIN_PASSWORD = 'CEO2024@Grills'; // You can change this password

function initSecretAdminTap() {
    console.log('🔒 Initializing secret admin tap system...');
    
    const adminSecretTap = document.getElementById('adminSecretTap');
    const tapCounter = document.getElementById('tapCounter');
    
    if (!adminSecretTap || !tapCounter) {
        console.warn('Secret tap elements not found');
        return;
    }
    
    // Create password overlay if it doesn't exist
    if (!document.getElementById('passwordOverlay')) {
        createPasswordOverlay();
    }
    
    // Tap event listener
    adminSecretTap.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Reset timeout
        if (tapTimeout) {
            clearTimeout(tapTimeout);
        }
        
        // Increment tap count
        tapCount++;
        
        // Show and animate counter
        tapCounter.textContent = tapCount;
        tapCounter.classList.add('show', 'pulse');
        
        // Check if we've reached 4 taps
        if (tapCount === 4) {
            console.log('🎯 Admin tap sequence completed!');
            
            // Add success animation
            this.classList.add('secret-success');
            
            // Show password prompt
            setTimeout(() => {
                showPasswordPrompt();
            }, 500);
            
            // Reset tap count after a delay
            setTimeout(() => {
                resetTapCounter();
            }, 1000);
        } else {
            // Reset tap counter after 2 seconds if not completed
            tapTimeout = setTimeout(() => {
                resetTapCounter();
            }, 2000);
        }
    });
    
    // Remove success animation when it ends
    adminSecretTap.addEventListener('animationend', function() {
        this.classList.remove('secret-success');
    });
    
    console.log('✅ Secret admin tap system initialized');
}

function resetTapCounter() {
    tapCount = 0;
    const tapCounter = document.getElementById('tapCounter');
    if (tapCounter) {
        tapCounter.classList.remove('show');
        setTimeout(() => {
            tapCounter.textContent = '0';
        }, 300);
    }
}

function createPasswordOverlay() {
    const passwordOverlayHTML = `
        <div class="password-overlay" id="passwordOverlay">
            <div class="password-modal">
                <h3><i class="fas fa-crown"></i> Admin Access</h3>
                <p>Enter admin password to continue:</p>
                <input type="password" class="password-input" id="adminPasswordInput" 
                       placeholder="Enter password..." autocomplete="off">
                <div class="password-error" id="passwordError">
                    Incorrect password. Try again.
                </div>
                <div class="password-buttons">
                    <button type="button" class="btn-password btn-cancel" id="cancelPassword">
                        Cancel
                    </button>
                    <button type="button" class="btn-password btn-submit" id="submitPassword">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', passwordOverlayHTML);
    
    // Setup password overlay event listeners
    setupPasswordOverlay();
}

function setupPasswordOverlay() {
    const passwordOverlay = document.getElementById('passwordOverlay');
    const passwordInput = document.getElementById('adminPasswordInput');
    const cancelBtn = document.getElementById('cancelPassword');
    const submitBtn = document.getElementById('submitPassword');
    const passwordError = document.getElementById('passwordError');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            passwordOverlay.classList.remove('active');
            passwordInput.value = '';
            passwordError.classList.remove('show');
            resetTapCounter();
        });
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            const enteredPassword = passwordInput.value;
            
            if (enteredPassword === ADMIN_PASSWORD) {
                // Correct password
                passwordOverlay.classList.remove('active');
                passwordInput.value = '';
                passwordError.classList.remove('show');
                
                // Redirect to admin panel
                window.location.href = 'admin-panel.html';
                
                showToast('Admin access granted! 🔥', 'success');
            } else {
                // Incorrect password
                passwordError.classList.add('show');
                passwordInput.value = '';
                passwordInput.focus();
                
                // Add shake animation
                passwordOverlay.querySelector('.password-modal').style.animation = 'none';
                setTimeout(() => {
                    passwordOverlay.querySelector('.password-modal').style.animation = 'slideUp 0.3s ease, shake 0.5s ease';
                }, 10);
                
                // Hide shake animation after it completes
                setTimeout(() => {
                    passwordOverlay.querySelector('.password-modal').style.animation = 'slideUp 0.3s ease';
                }, 500);
            }
        });
    }
    
    // Allow Enter key to submit
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });
    }
}

function showPasswordPrompt() {
    const passwordOverlay = document.getElementById('passwordOverlay');
    if (passwordOverlay) {
        passwordOverlay.classList.add('active');
        document.getElementById('adminPasswordInput').focus();
    }
}

// Update the initialization function in script.js
// Add this to your existing initializeAll() function:
function initializeAll() {
    console.log('🔥 The CEO Grills - Initializing Premium Experience...');
    
    // Load saved state
    loadSavedState();
    
    // Initialize Firebase Auth System
    if (typeof initAuthSystem === 'function') {
        initAuthSystem();
    } else {
        console.warn('Auth system not found. Make sure auth.js is loaded');
        // Create a fallback auth system
        setupFallbackAuth();
    }
    
    // Initialize all other systems
    initNavigation();
    initMenuSystem();
    initCartSystem();
    initOrderSystem();
    initModals();
    initFloatingButtons();
    initPremiumBuilder();
    initMap();
    initWhatsAppContactForm();
    initSecretAdminTap(); // ADD THIS LINE
    
    // Update UI
    updateCartUI();
    
    // Set up event listeners
    setupGlobalListeners();
    
    console.log('✅ Premium website fully loaded');
}