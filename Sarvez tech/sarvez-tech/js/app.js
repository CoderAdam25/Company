// ============================================
// SARVEZ TECH - Main JavaScript
// ============================================

// ============================================
// DATA
// ============================================
const products = [
    { id: 1, name: "iPhone 15 Pro Max", category: "iphone", price: 1199, image: "photo-1720357632099-6d84cd7ee044.avif", badge: "New", description: "Titanium design, A17 Pro chip, 48MP camera" },
    { id: 2, name: "iPhone 15 Pro", category: "iphone", price: 999, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop", badge: "Popular", description: "Pro camera system, Action button" },
    { id: 3, name: "MacBook Pro 16", category: "macbook", price: 2499, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=600&h=600&fit=crop", badge: "Best Seller", description: "M3 Max chip, 22 hours battery life" },
    { id: 4, name: "MacBook Air M3", category: "macbook", price: 1299, image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop", badge: null, description: "Lightweight, powerful, all-day battery" },
    { id: 5, name: "iPad Pro 12.9", category: "ipad", price: 1099, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop", badge: "New", description: "M2 chip, Liquid Retina XDR display" },
    { id: 6, name: "iPad Air", category: "ipad", price: 599, image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop", badge: null, description: "M1 chip, 10.9-inch display" },
    { id: 7, name: "Apple Watch Ultra 2", category: "watch", price: 799, image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop", badge: "Premium", description: "Rugged, 3000 nits display, 72-hour battery" },
    { id: 8, name: "Apple Watch Series 9", category: "watch", price: 399, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop", badge: null, description: "S9 SiP, Double Tap gesture" },
    { id: 9, name: "AirPods Pro 2", category: "airpods", price: 249, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop", badge: "Best Seller", description: "Adaptive Audio, USB-C charging" },
    { id: 10, name: "AirPods Max", category: "airpods", price: 549, image: "https://images.unsplash.com/photo-1625244263623-709bb8fba5a5?w=600&h=600&fit=crop", badge: "Premium", description: "High-fidelity audio, Active Noise Cancellation" },
    { id: 11, name: "iPhone 15", category: "iphone", price: 799, image: "photo-1720357632099-6d84cd7ee044.avif", badge: null, description: "Dynamic Island, 48MP Main camera" },
    { id: 12, name: "Mac Studio", category: "macbook", price: 1999, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop", badge: "Pro", description: "M2 Ultra, compact powerhouse" }
];
// ============================================
// STATE
// ============================================
let currentUser = null;
let users = [];
let cart = [];
let savedItems = [];
let currentFilter = 'all';
let searchQuery = '';

// Safe localStorage wrapper
const storage = {
    get: (key, fallback) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (e) {
            console.warn('Storage get error:', e);
            return fallback;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Storage set error:', e);
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Storage remove error:', e);
        }
    }
};

// Initialize data
function initData() {
    users = storage.get('sarvez_users', []);
    cart = storage.get('sarvez_guest_cart', []);
    savedItems = storage.get('sarvez_guest_saved', []);
}

// ============================================
// AUTH SYSTEM
// ============================================
function checkAuth() {
    initData();
    const session = storage.get('sarvez_current_session', null);
    if (session && session.email) {
        const user = users.find(u => u.email === session.email);
        if (user) {
            loginUser(user, false);
            return;
        }
    }
    // Guest mode
    updateAuthUI();
    updateCartUI();
    renderProducts('all');
}

function openAuth(tab) {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    switchAuthTab(tab);
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeAuth() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    if (signInForm) signInForm.reset();
    if (signUpForm) signUpForm.reset();
    hideAuthMessages();
}

function switchAuthTab(tab) {
    const signinTab = document.getElementById('tabSignIn');
    const signupTab = document.getElementById('tabSignUp');
    const signinForm = document.getElementById('signInForm');
    const signupForm = document.getElementById('signUpForm');

    if (!signinTab || !signupTab || !signinForm || !signupForm) return;

    hideAuthMessages();
    if (tab === 'signin') {
        signinTab.classList.add('active');
        signupTab.classList.remove('active');
        signinForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    } else {
        signupTab.classList.add('active');
        signinTab.classList.remove('active');
        signupForm.classList.remove('hidden');
        signinForm.classList.add('hidden');
    }
}

function hideAuthMessages() {
    const authError = document.getElementById('authError');
    const authSuccess = document.getElementById('authSuccess');
    if (authError) authError.classList.add('hidden');
    if (authSuccess) authSuccess.classList.add('hidden');
}

function showAuthError(msg) {
    const authErrorText = document.getElementById('authErrorText');
    const authError = document.getElementById('authError');
    const authSuccess = document.getElementById('authSuccess');
    if (authErrorText) authErrorText.textContent = msg;
    if (authError) authError.classList.remove('hidden');
    if (authSuccess) authSuccess.classList.add('hidden');
}

function showAuthSuccess(msg) {
    const authSuccessText = document.getElementById('authSuccessText');
    const authSuccess = document.getElementById('authSuccess');
    const authError = document.getElementById('authError');
    if (authSuccessText) authSuccessText.textContent = msg;
    if (authSuccess) authSuccess.classList.remove('hidden');
    if (authError) authError.classList.add('hidden');
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
}

function handleSignUp(e) {
    e.preventDefault();
    hideAuthMessages();

    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    const confirmInput = document.getElementById('signupConfirmPassword');
    const agreeTerms = document.getElementById('agreeTerms');

    if (!nameInput || !emailInput || !passwordInput || !confirmInput || !agreeTerms) {
        showAuthError('Form elements not found. Please refresh.');
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    if (!name || !email || !password) {
        showAuthError('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        showAuthError('Passwords do not match!');
        return;
    }

    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters!');
        return;
    }

    if (!agreeTerms.checked) {
        showAuthError('You must agree to the Terms of Service!');
        return;
    }

    if (users.find(u => u.email === email)) {
        showAuthError('An account with this email already exists!');
        return;
    }

    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password,
        phone: '',
        location: '',
        bio: '',
        createdAt: new Date().toISOString(),
        cart: [],
        savedItems: [],
        orders: [],
        totalSpent: 0,
        activityLog: [{ type: 'account_created', message: 'Account created', date: new Date().toISOString() }]
    };

    users.push(newUser);
    storage.set('sarvez_users', users);
    showAuthSuccess('Account created successfully! Please sign in.');

    setTimeout(() => {
        switchAuthTab('signin');
        const signinEmail = document.getElementById('signinEmail');
        if (signinEmail) signinEmail.value = email;
    }, 1500);
}

function handleSignIn(e) {
    e.preventDefault();
    hideAuthMessages();

    const emailInput = document.getElementById('signinEmail');
    const passwordInput = document.getElementById('signinPassword');
    const rememberMe = document.getElementById('rememberMe');

    if (!emailInput || !passwordInput) {
        showAuthError('Form elements not found. Please refresh.');
        return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const remember = rememberMe ? rememberMe.checked : false;

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        showAuthError('Invalid email or password!');
        return;
    }

    loginUser(user, remember);
    closeAuth();
    showToast('Welcome Back!', 'Good to see you again, ' + user.name);
}

function loginUser(user, remember) {
    currentUser = user;
    cart = user.cart || [];
    savedItems = user.savedItems || [];

    if (remember) {
        storage.set('sarvez_current_session', { email: user.email, timestamp: Date.now() });
    }

    updateAuthUI();
    updateCartUI();
    renderProducts(currentFilter);

    if (!user.activityLog) user.activityLog = [];
    user.activityLog.push({ type: 'login', message: 'Signed in', date: new Date().toISOString() });
    saveUserData();
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const mobileAuthButtons = document.getElementById('mobileAuthButtons');
    const profileSection = document.getElementById('profileSection');
    const mobileProfileSection = document.getElementById('mobileProfileSection');

    if (!authButtons || !mobileAuthButtons || !profileSection || !mobileProfileSection) return;

    if (currentUser) {
        // Hide sign in/sign up buttons
        authButtons.classList.add('hidden');
        mobileAuthButtons.classList.add('hidden');
        // Show profile
        profileSection.classList.remove('hidden');
        mobileProfileSection.classList.remove('hidden');

        const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

        const navAvatar = document.getElementById('navAvatar');
        const mobileNavAvatar = document.getElementById('mobileNavAvatar');
        const profileName = document.getElementById('profileName');
        const dropdownName = document.getElementById('dropdownName');
        const dropdownEmail = document.getElementById('dropdownEmail');
        const mobileProfileName = document.getElementById('mobileProfileName');
        const mobileProfileEmail = document.getElementById('mobileProfileEmail');

        if (navAvatar) navAvatar.textContent = initials;
        if (mobileNavAvatar) mobileNavAvatar.textContent = initials;
        if (profileName) profileName.textContent = currentUser.name;
        if (dropdownName) dropdownName.textContent = currentUser.name;
        if (dropdownEmail) dropdownEmail.textContent = currentUser.email;
        if (mobileProfileName) mobileProfileName.textContent = currentUser.name;
        if (mobileProfileEmail) mobileProfileEmail.textContent = currentUser.email;

        updateSavedCount();
    } else {
        // Show sign in/sign up buttons
        authButtons.classList.remove('hidden');
        mobileAuthButtons.classList.remove('hidden');
        // Hide profile
        profileSection.classList.add('hidden');
        mobileProfileSection.classList.add('hidden');
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function logout() {
    if (currentUser) {
        if (!currentUser.activityLog) currentUser.activityLog = [];
        currentUser.activityLog.push({ type: 'logout', message: 'Signed out', date: new Date().toISOString() });
        saveUserData();
    }

    currentUser = null;
    cart = [];
    savedItems = [];
    storage.remove('sarvez_current_session');
    storage.remove('sarvez_guest_cart');
    storage.remove('sarvez_guest_saved');

    updateAuthUI();
    updateCartUI();
    renderProducts('all');
    goHome();
    showToast('Logged Out', 'You have been successfully logged out.');

    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) dropdown.classList.remove('show');
}

function saveUserData() {
    if (!currentUser) return;
    currentUser.cart = cart;
    currentUser.savedItems = savedItems;
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
        users[idx] = currentUser;
        storage.set('sarvez_users', users);
    }
}

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profileDropdown');
    const btn = document.querySelector('#profileSection button');
    if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// ============================================
// PAGE NAVIGATION
// ============================================
function goHome() {
    const homePage = document.getElementById('homePage');
    const accountPage = document.getElementById('accountPage');
    const mainFooter = document.getElementById('mainFooter');

    if (homePage) homePage.style.display = 'block';
    if (accountPage) accountPage.classList.remove('active');
    if (mainFooter) mainFooter.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showAccountPage() {
    if (!currentUser) {
        openAuth('signin');
        return;
    }
    const homePage = document.getElementById('homePage');
    const accountPage = document.getElementById('accountPage');
    const mainFooter = document.getElementById('mainFooter');
    const dropdown = document.getElementById('profileDropdown');

    if (homePage) homePage.style.display = 'none';
    if (accountPage) accountPage.classList.add('active');
    if (mainFooter) mainFooter.style.display = 'none';
    if (dropdown) dropdown.classList.remove('show');

    loadAccountData();
    showAccountTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showSavedItems() {
    showAccountPage();
    showAccountTab('saved');
}

function showOrderHistory() {
    showAccountPage();
    showAccountTab('orders');
}

function showForgotPassword() {
    showAuthError('Please contact support@sarveztech.com to reset your password.');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
}

function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) featuresSection.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// MOBILE MENU
// ============================================
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) mobileMenu.classList.toggle('open');
}

// ============================================
// SEARCH
// ============================================
function openSearch() {
    const overlay = document.getElementById('searchOverlay');
    const input = document.getElementById('searchInput');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => { if (input) input.focus(); }, 100);
    }
}

function closeSearch() {
    const overlay = document.getElementById('searchOverlay');
    const results = document.getElementById('searchResults');
    const input = document.getElementById('searchInput');

    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (results) results.innerHTML = '';
    if (input) input.value = '';
    searchQuery = '';
}

function handleSearch(query) {
    searchQuery = query.toLowerCase().trim();
    const resultsContainer = document.getElementById('searchResults');

    if (!resultsContainer) return;

    if (searchQuery.length === 0) {
        resultsContainer.innerHTML = '';
        return;
    }

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery)
    );

    if (filtered.length === 0) {
        resultsContainer.innerHTML = '<div class="text-center py-8 text-gray-400">No products found</div>';
        return;
    }

    resultsContainer.innerHTML = filtered.map(product => `
        <div onclick="closeSearch(); showProductDetails(${product.id})" class="flex items-center space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
            <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-lg object-cover flex-shrink-0" loading="lazy">
            <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-white truncate">${product.name}</h4>
                <p class="text-sm text-gray-400">${product.description}</p>
            </div>
            <span class="font-bold text-white">$${product.price}</span>
        </div>
    `).join('');
}

// ============================================
// PRODUCTS
// ============================================
function renderProducts(filter) {
    currentFilter = filter;
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');

    if (!grid) return;

    let filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    // Apply search if active
    if (searchQuery) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery)
        );
    }

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.classList.remove('hidden');
    } else {
        if (noResults) noResults.classList.add('hidden');
        grid.innerHTML = filtered.map(product => {
            const isSaved = savedItems.some(s => s.id === product.id);
            return `<div class="liquid-glass-card rounded-2xl overflow-hidden group cursor-pointer" onclick="showProductDetails(${product.id})">
                <div class="product-image-container relative aspect-square bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                    <img src="${product.image}" alt="${product.name}" class="product-image w-full h-full object-cover" loading="lazy">
                    ${product.badge ? `<div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-bold shadow-lg">${product.badge}</div>` : ''}
                    <button onclick="event.stopPropagation(); toggleSavedItem(${product.id})" class="heart-btn absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all ${isSaved ? 'saved' : 'text-white'}">
                        <i data-lucide="heart" class="w-5 h-5 ${isSaved ? 'fill-current' : ''}"></i>
                    </button>
                    <button onclick="event.stopPropagation(); addToCart(${product.id})" class="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-blue-500 hover:border-blue-500 transition-all transform hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100">
                        <i data-lucide="plus" class="w-6 h-6"></i>
                    </button>
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-semibold mb-1 group-hover:text-blue-400 transition-colors">${product.name}</h3>
                    <p class="text-sm text-gray-400 mb-3">${product.description}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-2xl font-bold text-white">$${product.price}</span>
                        <div class="flex space-x-1"><i data-lucide="star" class="w-4 h-4 text-yellow-400 fill-yellow-400"></i><span class="text-sm text-gray-400">4.9</span></div>
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === category) {
            btn.classList.add('bg-white/20', 'border-blue-500');
            btn.classList.remove('liquid-glass');
        } else {
            btn.classList.remove('bg-white/20', 'border-blue-500');
            btn.classList.add('liquid-glass');
        }
    });
    renderProducts(category);
}

// ============================================
// PRODUCT DETAIL MODAL
// ============================================
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productModal');
    const content = document.getElementById('productModalContent');

    if (!modal || !content) return;

    const isSaved = savedItems.some(s => s.id === product.id);
    const specsHtml = product.specs ? product.specs.map(spec => 
        `<li class="flex items-center space-x-2 text-gray-300"><i data-lucide="check" class="w-4 h-4 text-green-400 flex-shrink-0"></i><span>${spec}</span></li>`
    ).join('') : '';

    content.innerHTML = `
        <div class="relative aspect-square md:aspect-auto bg-gradient-to-br from-gray-800/50 to-gray-900/50">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" loading="lazy">
            ${product.badge ? `<div class="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-xs font-bold shadow-lg">${product.badge}</div>` : ''}
        </div>
        <div class="p-8 flex flex-col justify-center">
            <h2 class="text-3xl font-bold mb-2">${product.name}</h2>
            <div class="flex items-center space-x-2 mb-4">
                <div class="flex space-x-1">
                    ${[1,2,3,4,5].map(() => '<i data-lucide="star" class="w-5 h-5 text-yellow-400 fill-yellow-400"></i>').join('')}
                </div>
                <span class="text-gray-400">(128 reviews)</span>
            </div>
            <p class="text-gray-300 text-lg mb-6">${product.description}</p>

            <div class="mb-6">
                <h4 class="font-semibold mb-3">Key Features</h4>
                <ul class="space-y-2">${specsHtml}</ul>
            </div>

            <div class="flex items-center justify-between mb-6">
                <span class="text-4xl font-bold text-white">$${product.price}</span>
                <span class="text-green-400 text-sm">In Stock</span>
            </div>

            <div class="flex space-x-4">
                <button onclick="addToCart(${product.id}); closeProductModal();" class="flex-1 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                    <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                    <span>Add to Cart</span>
                </button>
                <button onclick="toggleSavedItem(${product.id}); closeProductModal();" class="w-14 h-14 rounded-xl liquid-glass flex items-center justify-center hover:bg-white/10 transition-all ${isSaved ? 'text-pink-400' : 'text-white'}">
                    <i data-lucide="heart" class="w-6 h-6 ${isSaved ? 'fill-current' : ''}"></i>
                </button>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// SAVED ITEMS
// ============================================
function toggleSavedItem(productId) {
    if (!currentUser) {
        // Guest mode - save to localStorage
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const idx = savedItems.findIndex(s => s.id === productId);
        if (idx === -1) {
            savedItems.push(product);
            showToast('Saved!', product.name + ' added to your saved items.');
        } else {
            savedItems.splice(idx, 1);
            showToast('Removed', product.name + ' removed from saved items.');
        }
        storage.set('sarvez_guest_saved', savedItems);
        updateSavedCount();
        renderProducts(currentFilter);
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const idx = savedItems.findIndex(s => s.id === productId);
    if (idx === -1) {
        savedItems.push(product);
        if (!currentUser.activityLog) currentUser.activityLog = [];
        currentUser.activityLog.push({ type: 'item_saved', message: 'Saved ' + product.name, date: new Date().toISOString() });
        showToast('Saved!', product.name + ' added to your saved items.');
    } else {
        savedItems.splice(idx, 1);
        showToast('Removed', product.name + ' removed from saved items.');
    }

    saveUserData();
    updateSavedCount();
    renderProducts(currentFilter);
}

function updateSavedCount() {
    const count = savedItems.length;
    const badge = document.getElementById('savedCountBadge');
    const sidebar = document.getElementById('sidebarSavedCount');

    if (count > 0) {
        if (badge) { badge.textContent = count; badge.classList.remove('hidden'); }
        if (sidebar) { sidebar.textContent = count; sidebar.classList.remove('hidden'); }
    } else {
        if (badge) badge.classList.add('hidden');
        if (sidebar) sidebar.classList.add('hidden');
    }
}

// ============================================
// CART
// ============================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    if (currentUser) {
        if (!currentUser.activityLog) currentUser.activityLog = [];
        currentUser.activityLog.push({ type: 'cart_add', message: 'Added ' + product.name + ' to cart', date: new Date().toISOString() });
        saveUserData();
    } else {
        storage.set('sarvez_guest_cart', cart);
    }

    updateCartUI();
    showToast('Added to Cart', product.name + ' has been added to your cart');

    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.classList.add('cart-bounce');
        setTimeout(() => badge.classList.remove('cart-bounce'), 300);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    if (currentUser) {
        saveUserData();
    } else {
        storage.set('sarvez_guest_cart', cart);
    }
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    if (currentUser) {
        saveUserData();
    } else {
        storage.set('sarvez_guest_cart', cart);
    }
    updateCartUI();
}

function clearCart() {
    if (cart.length === 0) return;
    if (!confirm('Are you sure you want to clear your cart?')) return;

    cart = [];
    if (currentUser) {
        saveUserData();
    } else {
        storage.set('sarvez_guest_cart', cart);
    }
    updateCartUI();
    showToast('Cart Cleared', 'All items have been removed from your cart.');
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    const cartSubtotal = document.getElementById('cartSubtotal');

    if (!cartCount || !cartItems || !cartFooter || !cartTotal) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove('hidden');
        cartFooter.classList.remove('hidden');
        cartTotal.textContent = '$' + total.toLocaleString();
        if (cartSubtotal) cartSubtotal.textContent = '$' + total.toLocaleString();

        cartItems.innerHTML = cart.map(item => `
            <div class="flex space-x-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-lg object-cover" loading="lazy">
                <div class="flex-1 min-w-0">
                    <h4 class="font-semibold mb-1 truncate">${item.name}</h4>
                    <p class="text-gray-400 text-sm mb-2">$${item.price}</p>
                    <div class="flex items-center space-x-3">
                        <button onclick="updateQuantity(${item.id}, -1)" class="qty-btn w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <i data-lucide="minus" class="w-4 h-4"></i>
                        </button>
                        <span class="font-semibold w-6 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="qty-btn w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="p-2 hover:bg-red-500/20 rounded-full transition-colors self-start flex-shrink-0">
                    <i data-lucide="trash-2" class="w-5 h-5 text-red-400"></i>
                </button>
            </div>
        `).join('');
    } else {
        cartCount.classList.add('hidden');
        cartFooter.classList.add('hidden');
        cartItems.innerHTML = '<p class="text-gray-400 text-center py-12">Your cart is empty</p>';
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');

    if (!sidebar || !overlay) return;

    if (sidebar.classList.contains('translate-x-full')) {
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    } else {
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }
}

function checkout() {
    if (cart.length === 0) return;

    if (!currentUser) {
        openAuth('signin');
        showToast('Sign In Required', 'Please sign in to complete checkout.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = {
        id: 'ORD-' + Date.now().toString().slice(-6),
        items: cart.map(item => ({ ...item })),
        total: total,
        status: 'processing',
        date: new Date().toISOString()
    };

    if (!currentUser.orders) currentUser.orders = [];
    currentUser.orders.push(order);
    currentUser.totalSpent = (currentUser.totalSpent || 0) + total;

    if (!currentUser.activityLog) currentUser.activityLog = [];
    currentUser.activityLog.push({ type: 'order_placed', message: 'Order #' + order.id + ' placed', date: new Date().toISOString() });

    cart = [];
    saveUserData();
    updateCartUI();
    showToast('Order Placed!', 'Order #' + order.id + ' has been placed successfully. Total: $' + total.toLocaleString());
}

// ============================================
// ACCOUNT PAGE TABS
// ============================================
function showAccountTab(tab) {
    document.querySelectorAll('.account-tab').forEach(t => t.classList.remove('bg-white/10'));
    document.querySelectorAll('.account-tab-content').forEach(c => c.classList.add('hidden'));

    const tabBtn = document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1));
    const tabContent = document.getElementById('content' + tab.charAt(0).toUpperCase() + tab.slice(1));

    if (tabBtn) tabBtn.classList.add('bg-white/10');
    if (tabContent) tabContent.classList.remove('hidden');

    if (tab === 'overview') loadOverview();
    if (tab === 'personal') loadPersonalInfo();
    if (tab === 'saved') loadSavedItems();
    if (tab === 'orders') loadOrderHistory();

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function loadAccountData() {
    if (!currentUser) return;

    const accountName = document.getElementById('accountName');
    const accountEmail = document.getElementById('accountEmail');
    const accountAvatar = document.getElementById('accountAvatar');
    const memberSince = document.getElementById('memberSince');

    if (accountName) accountName.textContent = currentUser.name;
    if (accountEmail) accountEmail.textContent = currentUser.email;

    const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    if (accountAvatar) accountAvatar.textContent = initials;

    if (memberSince && currentUser.createdAt) {
        const date = new Date(currentUser.createdAt);
        memberSince.textContent = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
}

function loadOverview() {
    if (!currentUser) return;

    const overviewCartCount = document.getElementById('overviewCartCount');
    const overviewSavedCount = document.getElementById('overviewSavedCount');
    const overviewOrderCount = document.getElementById('overviewOrderCount');
    const overviewTotalSpent = document.getElementById('overviewTotalSpent');
    const recentActivity = document.getElementById('recentActivity');

    if (overviewCartCount) overviewCartCount.textContent = cart.length;
    if (overviewSavedCount) overviewSavedCount.textContent = savedItems.length;
    if (overviewOrderCount) overviewOrderCount.textContent = (currentUser.orders || []).length;
    if (overviewTotalSpent) overviewTotalSpent.textContent = '$' + (currentUser.totalSpent || 0).toLocaleString();

    if (!recentActivity) return;

    const recent = (currentUser.activityLog || []).slice(-5).reverse();

    if (recent.length === 0) {
        recentActivity.innerHTML = '<p class="text-gray-400 text-center py-8">No recent activity</p>';
        return;
    }

    const icons = {
        account_created: 'user-plus',
        login: 'log-in',
        logout: 'log-out',
        cart_add: 'shopping-cart',
        item_saved: 'heart',
        info_updated: 'edit',
        password_changed: 'shield',
        order_placed: 'package'
    };

    const colors = {
        account_created: 'blue',
        login: 'green',
        logout: 'yellow',
        cart_add: 'blue',
        item_saved: 'pink',
        info_updated: 'purple',
        password_changed: 'yellow',
        order_placed: 'green'
    };

    recentActivity.innerHTML = recent.map(act => {
        const icon = icons[act.type] || 'activity';
        const color = colors[act.type] || 'gray';
        const time = new Date(act.date).toLocaleString();
        return `<div class="flex items-center space-x-3 p-3 rounded-xl bg-white/5">
            <div class="w-10 h-10 rounded-full bg-${color}-500/10 flex items-center justify-center flex-shrink-0">
                <i data-lucide="${icon}" class="w-5 h-5 text-${color}-400"></i>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white">${act.message}</p>
                <p class="text-xs text-gray-500">${time}</p>
            </div>
        </div>`;
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function loadPersonalInfo() {
    if (!currentUser) return;

    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const editPhone = document.getElementById('editPhone');
    const editLocation = document.getElementById('editLocation');
    const editBio = document.getElementById('editBio');

    if (editName) editName.value = currentUser.name || '';
    if (editEmail) editEmail.value = currentUser.email || '';
    if (editPhone) editPhone.value = currentUser.phone || '';
    if (editLocation) editLocation.value = currentUser.location || '';
    if (editBio) editBio.value = currentUser.bio || '';
}

function savePersonalInfo() {
    if (!currentUser) return;

    const editName = document.getElementById('editName');
    const editPhone = document.getElementById('editPhone');
    const editLocation = document.getElementById('editLocation');
    const editBio = document.getElementById('editBio');

    if (editName) currentUser.name = editName.value.trim();
    if (editPhone) currentUser.phone = editPhone.value.trim();
    if (editLocation) currentUser.location = editLocation.value.trim();
    if (editBio) currentUser.bio = editBio.value.trim();

    if (!currentUser.activityLog) currentUser.activityLog = [];
    currentUser.activityLog.push({ type: 'info_updated', message: 'Personal information updated', date: new Date().toISOString() });

    saveUserData();
    updateAuthUI();
    loadAccountData();
    showToast('Saved!', 'Your personal information has been updated.');
}

function resetPersonalInfo() {
    loadPersonalInfo();
}

function loadSavedItems() {
    const grid = document.getElementById('savedItemsGrid');
    if (!grid) return;

    if (savedItems.length === 0) {
        grid.innerHTML = '<p class="text-gray-400 text-center py-12 col-span-full">No saved items yet. Browse products and click the heart icon to save!</p>';
        return;
    }

    grid.innerHTML = savedItems.map(item => `
        <div class="saved-item-card flex items-center space-x-4">
            <img src="${item.image}" alt="${item.name}" class="w-20 h-20 rounded-lg object-cover flex-shrink-0" loading="lazy">
            <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-white truncate">${item.name}</h4>
                <p class="text-sm text-gray-400">$${item.price}</p>
                <p class="text-xs text-gray-500">${item.description}</p>
            </div>
            <div class="flex flex-col space-y-2">
                <button onclick="addToCart(${item.id})" class="p-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                    <i data-lucide="shopping-cart" class="w-4 h-4 text-blue-400"></i>
                </button>
                <button onclick="toggleSavedItem(${item.id})" class="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors">
                    <i data-lucide="trash-2" class="w-4 h-4 text-red-400"></i>
                </button>
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function loadOrderHistory() {
    const list = document.getElementById('orderHistoryList');
    if (!list) return;

    if (!currentUser.orders || currentUser.orders.length === 0) {
        list.innerHTML = '<p class="text-gray-400 text-center py-12">No orders yet. Start shopping!</p>';
        return;
    }

    list.innerHTML = currentUser.orders.map(order => {
        const statusClass = order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400';
        const itemsHtml = order.items.map(item => `
            <div class="flex justify-between text-sm">
                <span class="text-gray-300">${item.name} x${item.quantity}</span>
                <span class="text-white">$${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `).join('');

        return `<div class="liquid-glass rounded-2xl p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <p class="font-semibold">Order #${order.id}</p>
                    <p class="text-sm text-gray-400">${new Date(order.date).toLocaleDateString()}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-medium ${statusClass}">${order.status}</span>
            </div>
            <div class="space-y-2 mb-4">${itemsHtml}</div>
            <div class="border-t border-white/10 pt-3 flex justify-between items-center">
                <span class="text-sm text-gray-400">Total</span>
                <span class="font-bold text-lg">$${order.total.toLocaleString()}</span>
            </div>
        </div>`;
    }).join('');
}

function changePassword(e) {
    e.preventDefault();
    if (!currentUser) return;

    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');

    if (!currentPassword || !newPassword || !confirmNewPassword) return;

    const current = currentPassword.value;
    const newPass = newPassword.value;
    const confirm = confirmNewPassword.value;

    if (current !== currentUser.password) {
        showToast('Error', 'Current password is incorrect!');
        return;
    }

    if (newPass.length < 6) {
        showToast('Error', 'New password must be at least 6 characters!');
        return;
    }

    if (newPass !== confirm) {
        showToast('Error', 'New passwords do not match!');
        return;
    }

    currentUser.password = newPass;
    if (!currentUser.activityLog) currentUser.activityLog = [];
    currentUser.activityLog.push({ type: 'password_changed', message: 'Password changed', date: new Date().toISOString() });

    saveUserData();
    currentPassword.value = '';
    newPassword.value = '';
    confirmNewPassword.value = '';
    showToast('Success', 'Your password has been updated!');
}

function deleteAccount() {
    if (!confirm('Are you sure? This will permanently delete your account and all data. This cannot be undone!')) return;

    users = users.filter(u => u.id !== currentUser.id);
    storage.set('sarvez_users', users);
    logout();
    showToast('Account Deleted', 'Your account has been permanently deleted.');
}

// ============================================
// EMAILJS NEWSLETTER
// ============================================
    const EMAILJS_CONFIG = {
        PUBLIC_KEY: 'lOh02U6W-7e7nmKJT',           // Get from EmailJS Dashboard > Account
        SERVICE_ID: 'service_mm365oo',           // Get from Email Services
        ADMIN_TEMPLATE_ID: 'template_st9a27l',     // Your admin notification template ID
        USER_TEMPLATE_ID: 'template_2z7lv3a',       // Your user confirmation template ID
        ADMIN_EMAIL: 'adam_ahmed15@hotmai.com'    // YOUR email address to receive notifications
};

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
})();

async function handleSubscribe(e) {
    e.preventDefault();

    const emailInput = document.getElementById('subscriberEmail');
    const btn = document.getElementById('subscribeBtn');
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    const loading = document.getElementById('emailLoading');
    const successDiv = document.getElementById('subscribeSuccess');
    const errorDiv = document.getElementById('subscribeError');
    const errorText = document.getElementById('errorText');

    if (!emailInput || !btn || !btnText || !btnIcon) return;

    const email = emailInput.value.trim();

    if (successDiv) successDiv.classList.add('hidden');
    if (errorDiv) errorDiv.classList.add('hidden');

    if (!email || !email.includes('@')) {
        if (errorText) errorText.textContent = 'Please enter a valid email address.';
        if (errorDiv) errorDiv.classList.remove('hidden');
        return;
    }

    if (loading) loading.classList.remove('hidden');
    btn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.classList.add('hidden');
    btn.classList.add('opacity-75', 'cursor-not-allowed');

    const currentDate = new Date().toLocaleString();

    try {
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS not loaded');
        }

        await Promise.all([
            emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.ADMIN_TEMPLATE_ID, {
                to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
                subscriber_email: email,
                subscription_date: currentDate
            }),
            emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.USER_TEMPLATE_ID, {
                to_email: email,
                subscriber_email: email,
                subscription_date: currentDate
            })
        ]);

        if (loading) loading.classList.add('hidden');
        btnText.textContent = 'Subscribed!';
        btnIcon.classList.remove('hidden');
        btnIcon.setAttribute('data-lucide', 'check');
        btn.classList.remove('from-blue-600', 'to-purple-600');
        btn.classList.add('from-green-600', 'to-green-500');
        if (successDiv) successDiv.classList.remove('hidden');
        emailInput.value = '';

        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            btn.disabled = false;
            btnText.textContent = 'Subscribe';
            btnIcon.setAttribute('data-lucide', 'send');
            btn.classList.remove('from-green-600', 'to-green-500', 'opacity-75', 'cursor-not-allowed');
            btn.classList.add('from-blue-600', 'to-purple-600');
            if (successDiv) successDiv.classList.add('hidden');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 3000);

    } catch (error) {
        console.error('EmailJS Error:', error);
        if (loading) loading.classList.add('hidden');
        btn.disabled = false;
        btnText.textContent = 'Subscribe';
        btnIcon.classList.remove('hidden');
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
        if (errorText) errorText.textContent = error.text || 'Failed to send emails. Please check your EmailJS configuration.';
        if (errorDiv) errorDiv.classList.remove('hidden');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

// ============================================
// UI HELPERS
// ============================================
function showToast(title, message) {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    if (!toast || !toastTitle || !toastMessage) return;

    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => toast.classList.remove('show'), 3000);
}

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    // Clear existing particles
    container.innerHTML = '';

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 5) + 's';
        container.appendChild(particle);
    }
}

// ============================================
// SCROLL SPY & NAV
// ============================================
function updateActiveNav() {
    const sections = ['home', 'features', 'products', 'about'];
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const el = document.getElementById(section);
        const link = document.querySelector(`[data-section="${section}"]`);
        if (!el || !link) return;

        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;

        if (scrollPos >= top && scrollPos < bottom) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function handleScroll() {
    const nav = document.getElementById('mainNav');
    const backToTop = document.getElementById('backToTop');

    // Nav background
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('liquid-glass-strong');
            nav.classList.remove('liquid-glass');
        } else {
            nav.classList.add('liquid-glass');
            nav.classList.remove('liquid-glass-strong');
        }
    }

    // Back to top button
    if (backToTop) {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }

    // Update active nav link
    updateActiveNav();
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        closeAuth();
        closeProductModal();
        closeSearch();
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
            toggleMobileMenu();
        }
    }

    // Ctrl/Cmd + K to open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
    }
});

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    checkAuth();
    renderProducts('all');
    createParticles();

    // Set initial active filter
    const allFilter = document.querySelector('[data-filter="all"]');
    if (allFilter) {
        allFilter.classList.add('bg-white/20', 'border-blue-500');
        allFilter.classList.remove('liquid-glass');
    }

    // Scroll listener
    window.addEventListener('scroll', handleScroll);

    // Resize listener
    window.addEventListener('resize', () => {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && window.innerWidth >= 768) {
            mobileMenu.classList.remove('open');
        }
    });

    // Intersection Observer for lazy loading images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});
