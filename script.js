// Sample Products Data
const products = [
    {
        id: 1,
        name: "Premium Cotton Shirt",
        category: "men",
        price: 1299,
        image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        rating: 4.5,
        badge: "New"
    },
    {
        id: 2,
        name: "Elegant Evening Dress",
        category: "women",
        price: 2499,
        image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        rating: 5,
        badge: "Sale"
    },
    {
        id: 3,
        name: "Kids Casual Wear",
        category: "kids",
        price: 899,
        image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        rating: 4,
        badge: null
    },
    {
        id: 4,
        name: "Formal Blazer",
        category: "men",
        price: 3499,
        image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        rating: 4.5,
        badge: "Hot"
    },
    {
        id: 5,
        name: "Designer Saree",
        category: "women",
        price: 4999,
        image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        rating: 5,
        badge: "New"
    },
    {
        id: 6,
        name: "Kids Party Dress",
        category: "kids",
        price: 1299,
        image: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
        rating: 4.5,
        badge: null
    },
    {
        id: 7,
        name: "Casual Denim Jeans",
        category: "men",
        price: 1799,
        image: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        rating: 4,
        badge: null
    },
    {
        id: 8,
        name: "Floral Summer Dress",
        category: "women",
        price: 1899,
        image: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        rating: 4.5,
        badge: "Sale"
    }
];

// Cart Array
let cart = [];

// DOM Elements
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearch = document.getElementById('closeSearch');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const filterButtons = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts('all');
    updateCart();
    setupEventListeners();
    smoothScroll();
    activeNavOnScroll();
});

// Setup Event Listeners
function setupEventListeners() {
    // Mobile Menu
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Search Overlay
    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    // Cart Sidebar
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
        searchOverlay.classList.remove('active');
    });

    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            loadProducts(filter);
        });
    });

    // Contact Form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
        contactForm.reset();
    });

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
    });
}

// Load Products
function loadProducts(filter) {
    productsGrid.innerHTML = '';

    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);

    const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

    card.innerHTML = `
        <div class="product-image">
            <div class="placeholder-img" style="background: ${product.image};">
                <i class="fas fa-tshirt" style="font-size: 80px; color: rgba(255,255,255,0.3);"></i>
            </div>
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">${stars}</div>
            <p class="product-price">₹${product.price}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-bag"></i> Add to Cart
            </button>
        </div>
    `;

    return card;
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showNotification('Product added to cart!');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Update Cart Display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '₹0';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image placeholder-img" style="background: ${item.image};">
                <i class="fas fa-tshirt" style="font-size: 30px; color: rgba(255,255,255,0.5);"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total}`;
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Smooth Scroll
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });
}

// Active Nav on Scroll
function activeNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Navbar shadow on scroll
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Vastram website initialized successfully! 🎉');
