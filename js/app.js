// app.js - Shared Alpine.js Components for E-commerce SPA
document.addEventListener('alpine:init', () => {
    /**
     * UI Utilities Store
     * Handles common UI interactions across all pages
     */
    Alpine.store('ui', {
        // WhatsApp business phone number
        whatsAppNumber: '96170608543',

        // Menu state
        isMenuOpen: false,

        // Cart notification state
        cartNotificationVisible: false,

        // Search state
        searchOpen: false,

        // Toggle mobile menu
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },

        // Close mobile menu
        closeMenu() {
            this.isMenuOpen = false;
        },

        // Toggle search modal
        toggleSearch() {
            this.searchOpen = !this.searchOpen;
        },

        // Close search modal
        closeSearch() {
            this.searchOpen = false;
        },

        // Show cart notification
        showCartNotification() {
            this.cartNotificationVisible = true;
            setTimeout(() => {
                this.cartNotificationVisible = false;
            }, 3000);
        },

        // Scroll to top
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },

        // Scroll to section (for homepage navigation)
        scrollToSection(sectionId) {
            // If not on home page, navigate to home first
            if (window.location.hash !== '#home' && window.location.hash !== '') {
                window.location.hash = 'home';
                // Wait for page to load, then scroll
                setTimeout(() => {
                    this.performScroll(sectionId);
                }, 500);
            } else {
                this.performScroll(sectionId);
            }
        },

        // Perform the actual scroll
        performScroll(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                const headerHeight = 80; // Account for fixed header
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        },

        // Enhanced WhatsApp opening function with customizable message
        openWhatsApp(message = 'Hello, I have a question about your products.') {
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${this.whatsAppNumber}?text=${encodedMessage}`, '_blank');
        }
    });

    /**
     * Shopping Cart Store
     * Handles cart functionality across all pages
     */
    Alpine.store('cart', {
        items: [],

        init() {
            // Load cart from localStorage if available
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                try {
                    this.items = JSON.parse(savedCart);
                } catch (e) {
                    console.error('Failed to parse saved cart:', e);
                    this.items = [];
                }
            }
        },

        saveCart() {
            localStorage.setItem('cartItems', JSON.stringify(this.items));
        },

        addItem(product, quantity = 1, options = {}) {
            // Check if product with the same options already exists
            const existingItemIndex = this.items.findIndex(item =>
                item.id === product.id &&
                JSON.stringify(item.options) === JSON.stringify(options)
            );

            if (existingItemIndex >= 0) {
                // Update quantity of existing item
                this.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                this.items.push({
                    id: product.id,
                    name: product.name,
                    price: product.salePrice || product.base_price || product.price,
                    image: Array.isArray(product.images) ? product.images[0] : product.images,
                    quantity: quantity,
                    options: options,
                    slug: product.slug
                });
            }

            this.saveCart();
            Alpine.store('ui').showCartNotification();
        },

        updateItemQuantity(index, quantity) {
            if (index >= 0 && index < this.items.length) {
                if (quantity <= 0) {
                    this.removeItem(index);
                } else {
                    this.items[index].quantity = quantity;
                    this.saveCart();
                }
            }
        },

        removeItem(index) {
            if (index >= 0 && index < this.items.length) {
                this.items.splice(index, 1);
                this.saveCart();
            }
        },

        clearCart() {
            this.items = [];
            this.saveCart();
        },

        getTotalItems() {
            return this.items.reduce((total, item) => total + item.quantity, 0);
        },

        getTotalPrice() {
            return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        getFormattedTotal() {
            return '$' + this.getTotalPrice().toFixed(2);
        }
    });

    /**
     * Utility functions for formatting
     */
    Alpine.data('utilities', () => {
        return {
            formatPrice(price) {
                return '$' + parseFloat(price).toFixed(2);
            },

            formatOptionName(name) {
                return name.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            },

            formatFeatureKey(key) {
                return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
            },

            // Get variant stock for products page
            getVariantStock(product) {
                if (!product) return 0;

                // If product has variants, sum up all variants stock
                if (product.option_variants_stock) {
                    return Object.values(product.option_variants_stock).reduce((sum, stock) => sum + stock, 0);
                }

                // Otherwise return product stock
                return product.stock || 0;
            },

            // Check if option value is available (for products page)
            isOptionValueAvailable(product, optionType, optionValue) {
                if (!product || !product.hasVariants) return true;

                // If product has option_variants_stock, check availability
                if (product.option_variants_stock) {
                    // For simplicity, if a variant exists with stock, it's available
                    for (const [key, stock] of Object.entries(product.option_variants_stock)) {
                        if (key.includes(optionValue) && stock > 0) {
                            return true;
                        }
                    }
                    return false;
                }

                return true;
            }
        };
    });

    /**
     * URL Utilities Store
     */
    Alpine.store('urlUtils', {
        // Find a product by slug
        findProductBySlug(slug) {
            return typeof PRODUCTS !== 'undefined'
                ? PRODUCTS.find(product => product.slug === slug)
                : null;
        },

        // Find a category by slug
        findCategoryBySlug(slug) {
            return typeof CATEGORIES !== 'undefined'
                ? CATEGORIES.find(category => category.slug === slug)
                : null;
        },

        // Get URL parameter from hash
        getHashParam(name) {
            const hash = window.location.hash.slice(1);
            const parts = hash.split('/');

            for (let i = 0; i < parts.length; i++) {
                if (parts[i] === name && i + 1 < parts.length) {
                    return decodeURIComponent(parts[i + 1]);
                }
            }
            return null;
        },

        // Navigate to route
        navigateTo(route, params = {}) {
            let hash = '#' + route;

            // Add parameters
            Object.entries(params).forEach(([key, value]) => {
                hash += '/' + key + '=' + encodeURIComponent(value);
            });

            window.location.hash = hash;
        },

        // Navigate to product
        navigateToProduct(slug) {
            window.location.hash = '#product/' + slug;
        },

        // Navigate to category
        navigateToCategory(slug) {
            window.location.hash = '#products/' + slug;
        }
    });

    /**
     * Product Data Store
     * Handles current product data for product pages
     */
    Alpine.store('productData', {
        currentProduct: null,

        init() {
            // This will be called by the SPA router when needed
        },

        setCurrentProduct(product) {
            this.currentProduct = product;
        },

        getCurrentProduct() {
            return this.currentProduct;
        },

        findProductBySlug(slug) {
            if (typeof PRODUCTS === 'undefined') return null;
            return PRODUCTS.find(p => p.slug === slug);
        },

        findProductById(id) {
            if (typeof PRODUCTS === 'undefined') return null;
            return PRODUCTS.find(p => p.id === id);
        }
    });

    /**
     * Global Error Handler
     */
    Alpine.store('errors', {
        current: null,

        set(error) {
            this.current = error;
            console.error('Application Error:', error);

            // Auto-clear error after 5 seconds
            setTimeout(() => {
                this.current = null;
            }, 5000);
        },

        clear() {
            this.current = null;
        },

        hasError() {
            return this.current !== null;
        }
    });

    /**
     * Loading State Store
     */
    Alpine.store('loading', {
        isLoading: false,
        message: 'Loading...',

        start(message = 'Loading...') {
            this.isLoading = true;
            this.message = message;
        },

        stop() {
            this.isLoading = false;
            this.message = 'Loading...';
        }
    });

    /**
     * Global Notification System
     */
    Alpine.store('notifications', {
        items: [],

        add(message, type = 'info', duration = 3000) {
            const id = Date.now();
            const notification = {
                id,
                message,
                type, // 'success', 'error', 'warning', 'info'
                duration
            };

            this.items.push(notification);

            // Auto-remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    this.remove(id);
                }, duration);
            }
        },

        remove(id) {
            const index = this.items.findIndex(item => item.id === id);
            if (index >= 0) {
                this.items.splice(index, 1);
            }
        },

        clear() {
            this.items = [];
        },

        success(message, duration = 3000) {
            this.add(message, 'success', duration);
        },

        error(message, duration = 5000) {
            this.add(message, 'error', duration);
        },

        warning(message, duration = 4000) {
            this.add(message, 'warning', duration);
        },

        info(message, duration = 3000) {
            this.add(message, 'info', duration);
        }
    });

    /**
     * Page Analytics (Simple tracking)
     */
    Alpine.store('analytics', {
        track(event, data = {}) {
            // Simple analytics tracking
            console.log('Analytics Event:', event, data);

            // Here you could integrate with Google Analytics, Facebook Pixel, etc.
            // Example: gtag('event', event, data);
        },

        trackPageView(page) {
            this.track('page_view', { page });
        },

        trackProductView(product) {
            this.track('product_view', {
                product_id: product.id,
                product_name: product.name,
                product_category: product.categories,
                price: product.salePrice || product.base_price || product.price
            });
        },

        trackAddToCart(product, quantity = 1) {
            this.track('add_to_cart', {
                product_id: product.id,
                product_name: product.name,
                quantity: quantity,
                price: product.salePrice || product.base_price || product.price
            });
        },

        trackSearch(query, results_count = 0) {
            this.track('search', {
                search_term: query,
                results_count: results_count
            });
        }
    });

    /**
     * Performance Monitor
     */
    Alpine.store('performance', {
        startTime: null,

        startTimer() {
            this.startTime = performance.now();
        },

        endTimer(label = 'Operation') {
            if (this.startTime) {
                const duration = performance.now() - this.startTime;
                console.log(`${label} took ${duration.toFixed(2)}ms`);
                this.startTime = null;
                return duration;
            }
        },

        measurePageLoad() {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
            });
        }
    });

    // Initialize cart on app start
    Alpine.store('cart').init();

    // Initialize performance monitoring
    Alpine.store('performance').measurePageLoad();

    // Global error handling
    window.addEventListener('error', (event) => {
        Alpine.store('errors').set({
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        Alpine.store('errors').set({
            message: 'Unhandled promise rejection',
            reason: event.reason
        });
    });
});