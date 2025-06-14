// spa-router.js - Single Page Application Router for GreenLion
document.addEventListener('alpine:init', () => {
    // SPA Main Controller
    Alpine.data('spa', () => {
        return {
            // State
            currentRoute: 'home',
            currentParams: {},
            pageContent: '',
            loading: false,
            scrollTop: false,
            pageCache: {},

            // Initialize SPA
            async init() {
                // Initialize stores first
                this.initializeStores();

                // Set up hash change listener
                window.addEventListener('hashchange', () => this.handleRouteChange());

                // Handle initial route
                await this.handleRouteChange();

                // Set up link interceptor for SPA navigation
                this.setupLinkInterceptor();
            },

            // Initialize Alpine stores
            initializeStores() {
                // Ensure product data store is initialized
                if (Alpine.store('productData')) {
                    Alpine.store('productData').init();
                }
            },

            // Handle route changes
            async handleRouteChange() {
                this.loading = true;

                try {
                    const hash = window.location.hash.slice(1) || 'home';
                    const [route, ...paramParts] = hash.split('/');

                    // Parse parameters
                    this.currentParams = this.parseParameters(paramParts);
                    this.currentRoute = route;

                    // Load the appropriate page
                    await this.loadPage(route);

                    // Update page title and meta tags
                    this.updatePageMeta(route);

                    // Scroll to top on route change
                    window.scrollTo(0, 0);

                } catch (error) {
                    console.error('Error handling route change:', error);
                    await this.loadPage('404');
                } finally {
                    this.loading = false;
                }
            },

            // Parse URL parameters
            parseParameters(paramParts) {
                const params = {};

                paramParts.forEach(part => {
                    if (part.includes('=')) {
                        const [key, value] = part.split('=');
                        params[key] = decodeURIComponent(value);
                    } else if (part) {
                        // For product slugs and category slugs
                        if (this.currentRoute === 'product' || this.currentRoute === 'products') {
                            params.slug = decodeURIComponent(part);
                        }
                    }
                });

                return params;
            },

            // Load page content
            async loadPage(route) {
                try {
                    // Check cache first
                    const cacheKey = route + JSON.stringify(this.currentParams);
                    if (this.pageCache[cacheKey] && route !== 'product') {
                        this.pageContent = this.pageCache[cacheKey];
                        this.initializePageComponents(route);
                        return;
                    }

                    let content = '';

                    switch (route) {
                        case 'home':
                            content = await this.loadHomePage();
                            break;
                        case 'products':
                            content = await this.loadProductsPage();
                            break;
                        case 'product':
                            content = await this.loadProductPage();
                            break;
                        case 'cart':
                            content = await this.loadCartPage();
                            break;
                        default:
                            content = await this.load404Page();
                    }

                    // Cache the content (except for product pages which are dynamic)
                    if (route !== 'product') {
                        this.pageCache[cacheKey] = content;
                    }

                    this.pageContent = content;

                    // Initialize page-specific components
                    this.$nextTick(() => {
                        this.initializePageComponents(route);
                    });

                } catch (error) {
                    console.error('Error loading page:', error);
                    this.pageContent = await this.load404Page();
                }
            },

            // Load home page
            async loadHomePage() {
                return `
                    <!-- Hero Section -->
                    <section class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        <!-- Background Pattern -->
                        <div class="absolute inset-0 opacity-5">
                            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, #000 2px, transparent 2px); background-size: 50px 50px;"></div>
                        </div>
                        <div class="relative z-10 max-w-7xl mx-auto px-6 text-center">
                            <div class="space-y-8">
                                <!-- Main Headline -->
                                <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-primary tracking-tight">
                                    <span class="block">GreenLion</span>
                                    <span class="block text-2xl md:text-4xl lg:text-5xl font-light text-gray-600 mt-4">
                                        Premium Electronics
                                    </span>
                                </h1>
                                <!-- Hero Description -->
                                <p class="text-xl md:text-2xl text-gray-600 font-light max-w-4xl mx-auto leading-relaxed">
                                    Discover our curated collection of mobile accessories, smart gadgets, grooming tools, and innovative home appliances designed for the modern lifestyle.
                                </p>
                                <!-- CTA Buttons -->
                                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                                    <a href="#products" class="bg-primary text-white px-8 py-4 text-lg font-medium hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 shadow-lg">
                                        Explore Collection
                                    </a>
                                    <button @click="$store.ui.openWhatsApp('Hello! I would like to learn more about GreenLion products.')" class="border-2 border-primary text-primary px-8 py-4 text-lg font-medium hover:bg-primary hover:text-white transition-all duration-300">
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!-- Scroll Indicator -->
                        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                            <div class="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                                <div class="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
                            </div>
                        </div>
                    </section>

                    <!-- Featured Categories Section -->
                    <section id="featured-categories" class="py-20 bg-white">
                        <div class="max-w-7xl mx-auto px-6">
                            <!-- Section Header -->
                            <div class="text-center mb-16">
                                <h2 class="text-4xl md:text-5xl font-bold text-primary mb-6">Our Categories</h2>
                                <p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                                    From mobile accessories to smart home devices, discover everything you need to enhance your digital lifestyle.
                                </p>
                            </div>
                            <!-- Categories Grid -->
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <!-- Mobile Accessories -->
                                <div class="group cursor-pointer">
                                    <a href="#products/mobile-accessories" class="block">
                                        <div class="relative overflow-hidden bg-gray-100 aspect-square mb-6 group-hover:scale-105 transition-transform duration-300">
                                            <img src="https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mobile Accessories" class="w-full h-full object-cover">
                                            <div class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                        </div>
                                        <h3 class="text-xl font-semibold text-primary mb-2 group-hover:text-primary-hover transition-colors">Mobile Accessories</h3>
                                        <p class="text-gray-600 font-light">Chargers, cables, power banks, and protective cases</p>
                                    </a>
                                </div>
                                <!-- Smart Gadgets -->
                                <div class="group cursor-pointer">
                                    <a href="#products/smart-gadgets" class="block">
                                        <div class="relative overflow-hidden bg-gray-100 aspect-square mb-6 group-hover:scale-105 transition-transform duration-300">
                                            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Smart Gadgets" class="w-full h-full object-cover">
                                            <div class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                        </div>
                                        <h3 class="text-xl font-semibold text-primary mb-2 group-hover:text-primary-hover transition-colors">Smart Gadgets</h3>
                                        <p class="text-gray-600 font-light">Wireless audio, smart speakers, and innovative tech</p>
                                    </a>
                                </div>
                                <!-- Grooming Tools -->
                                <div class="group cursor-pointer">
                                    <a href="#products/grooming-tools" class="block">
                                        <div class="relative overflow-hidden bg-gray-100 aspect-square mb-6 group-hover:scale-105 transition-transform duration-300">
                                            <img src="https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Grooming Tools" class="w-full h-full object-cover">
                                            <div class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                        </div>
                                        <h3 class="text-xl font-semibold text-primary mb-2 group-hover:text-primary-hover transition-colors">Grooming Tools</h3>
                                        <p class="text-gray-600 font-light">Hair clippers, trimmers, and personal care essentials</p>
                                    </a>
                                </div>
                                <!-- Home Appliances -->
                                <div class="group cursor-pointer">
                                    <a href="#products/home-appliances" class="block">
                                        <div class="relative overflow-hidden bg-gray-100 aspect-square mb-6 group-hover:scale-105 transition-transform duration-300">
                                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Smart Home Appliances" class="w-full h-full object-cover">
                                            <div class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                        </div>
                                        <h3 class="text-xl font-semibold text-primary mb-2 group-hover:text-primary-hover transition-colors">Home Appliances</h3>
                                        <p class="text-gray-600 font-light">Smart cameras, digital frames, and home automation</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Featured Products Section -->
                    <section id="featured-products" class="py-20 bg-gray-50">
                        <div class="max-w-7xl mx-auto px-6">
                            <!-- Section Header -->
                            <div class="text-center mb-16">
                                <h2 class="text-4xl md:text-5xl font-bold text-primary mb-6">Featured Products</h2>
                                <p class="text-xl text-gray-600 font-light max-w-3xl mx-auto">
                                    Carefully selected products that combine innovative technology with exceptional quality and design.
                                </p>
                            </div>
                            <!-- Products Grid -->
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" x-data="featuredProducts">
                                <template x-for="product in products" :key="product.id">
                                    <div class="bg-white shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                        <div class="relative overflow-hidden aspect-square">
                                            <img :src="Array.isArray(product.images) ? product.images[0] : product.images" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                                            <div class="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                                            <!-- Quick Actions -->
                                            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button @click="$store.ui.openWhatsApp(\`Hello! I'm interested in the \${product.name}. Could you provide more information?\`)" class="bg-white p-2 shadow-md hover:bg-gray-50 transition-colors">
                                                    <svg class="h-5 w-5">
                                                        <use xlink:href="#icon-whatsapp"></use>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="p-6">
                                            <h3 class="text-lg font-semibold text-primary mb-2 group-hover:text-primary-hover transition-colors" x-text="product.name"></h3>
                                            <div class="flex items-center justify-between">
                                                <span class="text-2xl font-bold text-primary" x-text="'$' + (product.base_price || product.price).toFixed(2)"></span>
                                                <a :href="'#product/' + product.slug" class="text-primary hover:text-primary-hover font-medium transition-colors">
                                                    View Details →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                            <!-- View All Products CTA -->
                            <div class="text-center mt-12">
                                <a href="#products" class="inline-block bg-primary text-white px-8 py-4 text-lg font-medium hover:bg-primary-hover transition-all duration-300 transform hover:scale-105">
                                    View All Products
                                </a>
                            </div>
                        </div>
                    </section>

                    <!-- About Section -->
                    <section id="about" class="py-20 bg-white">
                        <div class="max-w-7xl mx-auto px-6">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <!-- Content -->
                                <div class="space-y-6">
                                    <h2 class="text-4xl md:text-5xl font-bold text-primary">About GreenLion</h2>
                                    <p class="text-xl text-gray-600 font-light leading-relaxed">
                                        We are Lebanon's premier destination for cutting-edge consumer electronics and smart gadgets. Our carefully curated collection features the latest in mobile accessories, innovative smart devices, premium grooming tools, and advanced home appliances.
                                    </p>
                                    <p class="text-lg text-gray-600 font-light leading-relaxed">
                                        At GreenLion, we believe technology should enhance your daily life. That's why we select only the highest quality products from trusted brands, ensuring every purchase delivers exceptional value and performance.
                                    </p>
                                    <!-- Features -->
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                        <div class="flex items-start space-x-3">
                                            <div class="flex-shrink-0 w-6 h-6 bg-primary-light rounded-full flex items-center justify-center mt-1">
                                                <svg class="h-4 w-4 text-white">
                                                    <use xlink:href="#icon-check"></use>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 class="font-semibold text-primary mb-1">Premium Quality</h4>
                                                <p class="text-gray-600 font-light">Carefully selected products from trusted brands</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="flex-shrink-0 w-6 h-6 bg-primary-light rounded-full flex items-center justify-center mt-1">
                                                <svg class="h-4 w-4 text-white">
                                                    <use xlink:href="#icon-check"></use>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 class="font-semibold text-primary mb-1">Expert Support</h4>
                                                <p class="text-gray-600 font-light">Dedicated customer service via WhatsApp</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="flex-shrink-0 w-6 h-6 bg-primary-light rounded-full flex items-center justify-center mt-1">
                                                <svg class="h-4 w-4 text-white">
                                                    <use xlink:href="#icon-check"></use>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 class="font-semibold text-primary mb-1">Fast Delivery</h4>
                                                <p class="text-gray-600 font-light">Quick shipping across Lebanon</p>
                                            </div>
                                        </div>
                                        <div class="flex items-start space-x-3">
                                            <div class="flex-shrink-0 w-6 h-6 bg-primary-light rounded-full flex items-center justify-center mt-1">
                                                <svg class="h-4 w-4 text-white">
                                                    <use xlink:href="#icon-check"></use>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 class="font-semibold text-primary mb-1">Warranty Protection</h4>
                                                <p class="text-gray-600 font-light">Comprehensive warranty on all products</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Image -->
                                <div class="relative">
                                    <div class="aspect-square bg-gray-100 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern electronics store" class="w-full h-full object-cover">
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-tr from-primary opacity-10"></div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- CTA Section -->
                    <section class="py-20 bg-primary text-white">
                        <div class="max-w-4xl mx-auto px-6 text-center">
                            <h2 class="text-4xl md:text-5xl font-bold mb-6">Ready to Upgrade Your Tech?</h2>
                            <p class="text-xl font-light mb-8 opacity-90">
                                Discover the latest in consumer electronics and smart gadgets. Contact us via WhatsApp for personalized recommendations and exclusive deals.
                            </p>
                            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                                <button @click="$store.ui.openWhatsApp('Hello GreenLion! I would like to explore your product collection and learn about current offers.')" class="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                                    <svg class="h-6 w-6">
                                        <use xlink:href="#icon-whatsapp"></use>
                                    </svg>
                                    <span>Chat on WhatsApp</span>
                                </button>
                                <a href="#products" class="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-medium transition-all duration-300">
                                    Browse Products
                                </a>
                            </div>
                        </div>
                    </section>
                `;
            },

            // Load products page
            async loadProductsPage() {
                const categorySlug = this.currentParams.slug;
                return `
                    <div class="pt-24" x-data="productCatalog" x-init="init(); ${categorySlug ? `selectCategoryBySlug('${categorySlug}')` : ''}">
                        <!-- Page Header -->
                        <div class="bg-white border-b border-gray-200">
                            <div class="max-w-7xl mx-auto px-6 py-8">
                                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <h1 class="text-3xl md:text-4xl font-bold text-primary" x-text="selectedCategory !== null ? getCategoryName(selectedCategory) : 'All Products'"></h1>
                                        <p class="text-gray-600 mt-2">Discover our premium collection of electronics and smart gadgets</p>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <!-- View Toggle -->
                                        <div class="flex bg-gray-100 rounded-lg p-1">
                                            <button @click="setView('grid')" :class="view === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'" class="p-2 rounded-md transition-all">
                                                <svg class="h-5 w-5">
                                                    <use xlink:href="#icon-grid"></use>
                                                </svg>
                                            </button>
                                            <button @click="setView('list')" :class="view === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'" class="p-2 rounded-md transition-all">
                                                <svg class="h-5 w-5">
                                                    <use xlink:href="#icon-list"></use>
                                                </svg>
                                            </button>
                                        </div>
                                        <!-- Mobile Filter Toggle -->
                                        <button @click="mobileFiltersOpen = true" class="md:hidden bg-primary text-white px-4 py-2 rounded-lg font-medium">
                                            <span class="flex items-center gap-2">
                                                <svg class="h-4 w-4">
                                                    <use xlink:href="#icon-filter"></use>
                                                </svg>
                                                Filters
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="max-w-7xl mx-auto px-6 py-8">
                            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                <!-- Filters Sidebar -->
                                <div class="lg:col-span-1">
                                    <!-- Desktop Filters -->
                                    <div class="hidden lg:block space-y-6">
                                        <!-- Search -->
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                                            <input type="text" x-model="searchQuery" placeholder="Search..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                        </div>

                                        <!-- Categories -->
                                        <div>
                                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                                            <div class="space-y-2">
                                                <label class="flex items-center">
                                                    <input type="radio" x-model="selectedCategorySlug" value="" @change="selectCategoryBySlug('')" class="text-primary focus:ring-primary">
                                                    <span class="ml-3">All Products</span>
                                                </label>
                                                <template x-for="category in categoryData" :key="category.id">
                                                    <label class="flex items-center">
                                                        <input type="radio" x-model="selectedCategorySlug" :value="category.slug" @change="selectCategoryBySlug(category.slug)" class="text-primary focus:ring-primary">
                                                        <span class="ml-3" x-text="category.name"></span>
                                                    </label>
                                                </template>
                                            </div>
                                        </div>

                                        <!-- Sort -->
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                            <select x-model="sortBy" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                                <option value="featured">Featured</option>
                                                <option value="newest">Newest</option>
                                                <option value="price-asc">Price: Low to High</option>
                                                <option value="price-desc">Price: High to Low</option>
                                                <option value="name">Name A-Z</option>
                                            </select>
                                        </div>

                                        <!-- Clear Filters -->
                                        <button @click="clearFilters()" class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                            Clear All Filters
                                        </button>
                                    </div>

                                    <!-- Mobile Filters Overlay -->
                                    <div x-show="mobileFiltersOpen" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="transition ease-in duration-200" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" @click="mobileFiltersOpen = false">
                                        <div x-show="mobileFiltersOpen" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0" x-transition:leave="transition ease-in duration-200" x-transition:leave-start="translate-x-0" x-transition:leave-end="translate-x-full" class="absolute right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto" @click.stop>
                                            <div class="p-6 space-y-6">
                                                <div class="flex items-center justify-between">
                                                    <h3 class="text-lg font-semibold">Filters</h3>
                                                    <button @click="mobileFiltersOpen = false" class="text-gray-400 hover:text-gray-600">
                                                        <svg class="h-6 w-6">
                                                            <use xlink:href="#icon-close"></use>
                                                        </svg>
                                                    </button>
                                                </div>
                                                
                                                <!-- Mobile Search -->
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                                                    <input type="text" x-model="searchQuery" placeholder="Search..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                                </div>

                                                <!-- Mobile Categories -->
                                                <div>
                                                    <h4 class="font-semibold text-gray-900 mb-4">Categories</h4>
                                                    <div class="space-y-2">
                                                        <label class="flex items-center">
                                                            <input type="radio" x-model="selectedCategorySlug" value="" @change="selectCategoryBySlug('')" class="text-primary focus:ring-primary">
                                                            <span class="ml-3">All Products</span>
                                                        </label>
                                                        <template x-for="category in categoryData" :key="category.id">
                                                            <label class="flex items-center">
                                                                <input type="radio" x-model="selectedCategorySlug" :value="category.slug" @change="selectCategoryBySlug(category.slug)" class="text-primary focus:ring-primary">
                                                                <span class="ml-3" x-text="category.name"></span>
                                                            </label>
                                                        </template>
                                                    </div>
                                                </div>

                                                <!-- Mobile Sort -->
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                                    <select x-model="sortBy" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                                        <option value="featured">Featured</option>
                                                        <option value="newest">Newest</option>
                                                        <option value="price-asc">Price: Low to High</option>
                                                        <option value="price-desc">Price: High to Low</option>
                                                        <option value="name">Name A-Z</option>
                                                    </select>
                                                </div>

                                                <!-- Mobile Clear Filters -->
                                                <button @click="clearFilters(); mobileFiltersOpen = false" class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                                    Clear All Filters
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Products Grid -->
                                <div class="lg:col-span-3">
                                    <!-- Results Count -->
                                    <div class="flex items-center justify-between mb-6">
                                        <p class="text-gray-600" x-text="\`Showing \${getFilteredProducts().length} products\`"></p>
                                    </div>

                                    <!-- Products -->
                                    <div x-show="getFilteredProducts().length > 0" :class="view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'">
                                        <template x-for="product in getFilteredProducts()" :key="product.id">
                                            <!-- Grid View -->
                                            <div x-show="view === 'grid'" class="bg-white shadow-sm hover:shadow-lg transition-all duration-300 group">
                                                <div class="relative overflow-hidden aspect-square">
                                                    <img :src="Array.isArray(product.images) ? product.images[0] : product.images" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" @error="$event.target.src = 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image'">
                                                    <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <button @click="$store.ui.openWhatsApp(\`Hello! I'm interested in the \${product.name}. Could you provide more information?\`)" class="bg-white/90 hover:bg-white p-2 shadow-md transition-colors">
                                                            <svg class="h-4 w-4 text-green-600">
                                                                <use xlink:href="#icon-whatsapp"></use>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <!-- Product Badges -->
                                                    <div class="absolute top-3 left-3 flex flex-col gap-1">
                                                        <span x-show="product.isNew" class="bg-green-500 text-white text-xs px-2 py-1 font-medium">NEW</span>
                                                        <span x-show="product.isOnSale" class="bg-red-500 text-white text-xs px-2 py-1 font-medium">SALE</span>
                                                    </div>
                                                </div>
                                                <div class="p-4">
                                                    <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                        <a :href="'#product/' + product.slug" x-text="product.name"></a>
                                                    </h3>
                                                    <p class="text-sm text-gray-600 mb-3 line-clamp-2" x-text="product.description"></p>
                                                    <div class="flex items-center justify-between">
                                                        <div class="flex flex-col">
                                                            <span class="text-lg font-bold text-primary" x-text="'$' + (product.salePrice || product.base_price || product.price).toFixed(2)"></span>
                                                            <span x-show="product.salePrice && product.base_price !== product.salePrice" class="text-sm text-gray-500 line-through" x-text="'$' + product.base_price.toFixed(2)"></span>
                                                        </div>
                                                        <a :href="'#product/' + product.slug" class="text-primary hover:text-primary-hover text-sm font-medium">
                                                            View →
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- List View -->
                                            <div x-show="view === 'list'" class="bg-white shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                                                <div class="flex gap-6">
                                                    <div class="flex-shrink-0 w-32 h-32 bg-gray-100 overflow-hidden">
                                                        <img :src="Array.isArray(product.images) ? product.images[0] : product.images" :alt="product.name" class="w-full h-full object-cover" @error="$event.target.src = 'https://via.placeholder.com/128x128/f3f4f6/9ca3af?text=No+Image'">
                                                    </div>
                                                    <div class="flex-1 space-y-3">
                                                        <div class="flex items-start justify-between">
                                                            <div>
                                                                <h3 class="text-lg font-semibold text-gray-900 hover:text-primary transition-colors">
                                                                    <a :href="'#product/' + product.slug" x-text="product.name"></a>
                                                                </h3>
                                                                <p class="text-gray-600 mt-1 line-clamp-2" x-text="product.description"></p>
                                                            </div>
                                                            <div class="flex items-center gap-2">
                                                                <span x-show="product.isNew" class="bg-green-500 text-white text-xs px-2 py-1 font-medium">NEW</span>
                                                                <span x-show="product.isOnSale" class="bg-red-500 text-white text-xs px-2 py-1 font-medium">SALE</span>
                                                            </div>
                                                        </div>
                                                        <div class="flex items-center justify-between">
                                                            <div class="flex items-center gap-3">
                                                                <span class="text-xl font-bold text-primary" x-text="'$' + (product.salePrice || product.base_price || product.price).toFixed(2)"></span>
                                                                <span x-show="product.salePrice && product.base_price !== product.salePrice" class="text-gray-500 line-through" x-text="'$' + product.base_price.toFixed(2)"></span>
                                                            </div>
                                                            <div class="flex items-center gap-3">
                                                                <button @click="$store.ui.openWhatsApp(\`Hello! I'm interested in the \${product.name}. Could you provide more information?\`)" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-medium transition-colors">
                                                                    <span class="flex items-center gap-1">
                                                                        <svg class="h-4 w-4">
                                                                            <use xlink:href="#icon-whatsapp"></use>
                                                                        </svg>
                                                                        WhatsApp
                                                                    </span>
                                                                </button>
                                                                <a :href="'#product/' + product.slug" class="bg-primary hover:bg-primary-hover text-white px-4 py-2 text-sm font-medium transition-colors">
                                                                    View Details
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>

                                    <!-- No Products Found -->
                                    <div x-show="getFilteredProducts().length === 0" class="text-center py-12">
                                        <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H6a1 1 0 00-1 1v1"/>
                                            </svg>
                                        </div>
                                        <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                                        <p class="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                                        <button @click="clearFilters()" class="bg-primary text-white px-6 py-3 font-medium hover:bg-primary-hover transition-colors">
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            // Load product page
            async loadProductPage() {
                const productSlug = this.currentParams.slug;
                if (!productSlug) {
                    return await this.load404Page();
                }

                // Find product by slug
                const product = typeof PRODUCTS !== 'undefined'
                    ? PRODUCTS.find(p => p.slug === productSlug)
                    : null;

                if (!product) {
                    return await this.load404Page();
                }

                // Update product data store
                if (Alpine.store('productData')) {
                    Alpine.store('productData').currentProduct = product;
                }

                return `
                    <div class="pt-24 min-h-screen" x-data="{ currentProduct: ${JSON.stringify(product).replace(/"/g, '&quot;')} }">
                        <!-- Breadcrumb -->
                        <div class="bg-white border-b border-gray-200">
                            <div class="max-w-7xl mx-auto px-6 py-4">
                                <nav class="text-sm">
                                    <ol class="flex items-center space-x-2">
                                        <li>
                                            <a href="#home" class="text-gray-500 hover:text-primary transition-colors">Home</a>
                                        </li>
                                        <li class="text-gray-400">/</li>
                                        <li>
                                            <a href="#products" class="text-gray-500 hover:text-primary transition-colors">Products</a>
                                        </li>
                                        <li class="text-gray-400">/</li>
                                        <li>
                                            <span class="text-primary font-medium" x-text="currentProduct?.name || 'Product Details'"></span>
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>

                        <!-- Product Content -->
                        <div x-data="productDetail({ product: currentProduct })" class="max-w-7xl mx-auto px-6 py-8">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <!-- Product Images Section -->
                                <div x-data="productViewer(currentProduct)" class="space-y-6">
                                    <!-- Main Product Image -->
                                    <div class="relative aspect-square bg-white shadow-sm overflow-hidden group">
                                        <img x-ref="mainImage" 
                                             :src="getSelectedImage()" 
                                             :alt="product?.name + ' - Premium electronics from GreenLion'" 
                                             class="w-full h-full object-cover cursor-zoom-in" 
                                             :style="imgStyle"
                                             @mouseenter="mouseEnter" 
                                             @mouseleave="mouseLeave" 
                                             @mousemove="mouseMove"
                                             @touchstart="touchStart" 
                                             @touchmove="touchMove" 
                                             @touchend="touchEnd"
                                             @error="handleImageError">
                                        
                                        <!-- Zoom Indicator -->
                                        <div x-show="!isTouchDevice" class="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1">
                                            Hover to zoom
                                        </div>
                                        <div x-show="isTouchDevice" class="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1">
                                            Double tap to zoom
                                        </div>
                                    </div>

                                    <!-- Product Thumbnails -->
                                    <div x-show="hasThumbnails()" class="relative">
                                        <div class="flex items-center">
                                            <!-- Scroll Left Button -->
                                            <button @click="scrollThumbnails('left')" 
                                                    x-show="!isScrollLeftEnd" 
                                                    class="absolute left-0 z-10 bg-white shadow-md p-2 hover:bg-gray-50 transition-colors">
                                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                                                </svg>
                                            </button>
                                            
                                            <!-- Thumbnails Container -->
                                            <div x-ref="thumbnailsContainer" 
                                                 @scroll="checkScrollPosition" 
                                                 class="flex gap-3 overflow-x-auto hide-scrollbar px-8 py-2">
                                                <!-- Main Product Images -->
                                                <template x-if="product.images" x-for="(image, index) in (Array.isArray(product.images) ? product.images : [product.images])" :key="'main-' + index">
                                                    <button @click="selectImage(image)" 
                                                            :class="getSelectedImage() === image ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200'" 
                                                            class="flex-shrink-0 w-16 h-16 bg-white overflow-hidden hover:ring-primary transition-colors">
                                                        <img :src="image" 
                                                             :alt="'Thumbnail ' + (index + 1) + ' of ' + product.name" 
                                                             class="w-full h-full object-cover"
                                                             @error="$event.target.src = 'https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=No+Image'">
                                                    </button>
                                                </template>
                                            </div>
                                            
                                            <!-- Scroll Right Button -->
                                            <button @click="scrollThumbnails('right')" 
                                                    x-show="!isScrollRightEnd" 
                                                    class="absolute right-0 z-10 bg-white shadow-md p-2 hover:bg-gray-50 transition-colors">
                                                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Product Details Section -->
                                <div class="space-y-8">
                                    <!-- Product Header -->
                                    <div class="space-y-4">
                                        <div class="flex items-center gap-2 text-sm">
                                            <span class="text-gray-500 font-medium" x-text="product.brand || 'GreenLion'"></span>
                                            <span class="text-gray-300">•</span>
                                            <span class="text-gray-500" x-text="'SKU: ' + (product.sku || 'N/A')"></span>
                                        </div>
                                        <h1 class="text-3xl md:text-4xl font-bold text-primary" x-text="product.name"></h1>
                                        
                                        <!-- Product Badges -->
                                        <div class="flex gap-2">
                                            <span x-show="product.isNew" class="bg-green-500 text-white text-sm px-3 py-1 font-medium">NEW</span>
                                            <span x-show="product.isOnSale" class="bg-red-500 text-white text-sm px-3 py-1 font-medium">SALE</span>
                                            <span x-show="product.isFeatured" class="bg-primary text-white text-sm px-3 py-1 font-medium">FEATURED</span>
                                        </div>
                                    </div>

                                    <!-- Price Section -->
                                    <div class="space-y-3">
                                        <div class="flex items-baseline gap-3">
                                            <span class="text-3xl font-bold text-primary" x-text="formatPrice(getVariantPrice())"></span>
                                            <span x-show="product.salePrice && product.base_price !== product.salePrice" 
                                                  class="text-xl text-gray-500 line-through" 
                                                  x-text="formatPrice(product.base_price)"></span>
                                        </div>
                                        <!-- Shipping Info -->
                                        <div class="text-sm text-gray-600">
                                            <span x-show="getVariantShippingCost() === 0" class="text-green-600 font-medium">
                                                ✓ Free shipping
                                            </span>
                                            <span x-show="getVariantShippingCost() > 0" 
                                                  x-text="'Shipping: ' + formatPrice(getVariantShippingCost())"></span>
                                        </div>
                                    </div>

                                    <!-- Product Description -->
                                    <div class="space-y-4">
                                        <h3 class="text-lg font-semibold text-gray-900">Description</h3>
                                        <p class="text-gray-600 leading-relaxed" x-text="product.description"></p>
                                    </div>

                                    <!-- Product Options -->
                                    <div x-show="product.options && Object.keys(product.options).length > 0" class="space-y-6">
                                        <template x-for="(values, optionName) in product.options" :key="optionName">
                                            <div class="space-y-3">
                                                <h4 class="font-medium text-gray-900" x-text="formatOptionName(optionName)"></h4>
                                                <div class="flex flex-wrap gap-3">
                                                    <template x-for="value in values" :key="value">
                                                        <button @click="selectOption(optionName, value)" 
                                                                :class="selectedOptions[optionName] === value ? 'ring-2 ring-primary bg-primary text-white' : 'ring-1 ring-gray-300 bg-white text-gray-700 hover:ring-primary'" 
                                                                :disabled="!isOptionValueAvailable(optionName, value)"
                                                                :class="!isOptionValueAvailable(optionName, value) ? 'opacity-50 cursor-not-allowed' : ''"
                                                                class="px-4 py-2 text-sm font-medium transition-all">
                                                            <span x-text="value"></span>
                                                            <span x-show="!isOptionValueAvailable(optionName, value)" class="ml-1 text-xs">(Out of Stock)</span>
                                                        </button>
                                                    </template>
                                                </div>
                                            </div>
                                        </template>
                                    </div>

                                    <!-- Stock Status -->
                                    <div class="space-y-2">
                                        <div class="flex items-center gap-2">
                                            <div x-show="isVariantInStock()" class="flex items-center gap-2 text-green-600">
                                                <svg class="h-5 w-5">
                                                    <use xlink:href="#icon-check"></use>
                                                </svg>
                                                <span class="font-medium">In Stock</span>
                                                <span class="text-sm text-gray-500" x-text="'(' + getVariantStock() + ' available)'"></span>
                                            </div>
                                            <div x-show="!isVariantInStock()" class="flex items-center gap-2 text-red-600">
                                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                                </svg>
                                                <span class="font-medium">Out of Stock</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Quantity & Add to Cart -->
                                    <div class="space-y-4">
                                        <div class="flex items-center gap-4">
                                            <div class="flex items-center border border-gray-300">
                                                <button @click="decreaseQuantity()" 
                                                        :disabled="quantity <= 1" 
                                                        class="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <svg class="h-4 w-4">
                                                        <use xlink:href="#icon-minus"></use>
                                                    </svg>
                                                </button>
                                                <input type="number" 
                                                       x-model.number="quantity" 
                                                       :min="1" 
                                                       :max="getVariantStock()" 
                                                       class="w-16 px-3 py-2 text-center border-l border-r border-gray-300 focus:outline-none">
                                                <button @click="increaseQuantity()" 
                                                        :disabled="quantity >= getVariantStock()" 
                                                        class="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                    <svg class="h-4 w-4">
                                                        <use xlink:href="#icon-plus"></use>
                                                    </svg>
                                                </button>
                                            </div>
                                            <span class="text-sm text-gray-500">Quantity</span>
                                        </div>

                                        <!-- Action Buttons -->
                                        <div class="space-y-3">
                                            <button @click="addToCart()" 
                                                    :disabled="!isVariantInStock()" 
                                                    class="w-full bg-primary text-white py-4 font-semibold text-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                <span x-show="isVariantInStock()">Add to Cart</span>
                                                <span x-show="!isVariantInStock()">Out of Stock</span>
                                            </button>
                                            
                                            <div x-data="whatsappInquiry({ buttonText: 'Inquire via WhatsApp' })">
                                                <button @click="inquireAboutProduct()" 
                                                        class="w-full bg-green-500 text-white py-4 font-semibold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                                                    <svg class="h-6 w-6">
                                                        <use xlink:href="#icon-whatsapp"></use>
                                                    </svg>
                                                    <span x-text="buttonText"></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Product Features -->
                                    <div x-show="product.features && Object.keys(product.features).length > 0" class="space-y-4">
                                        <h3 class="text-lg font-semibold text-gray-900">Features</h3>
                                        <div class="grid grid-cols-1 gap-3">
                                            <template x-for="(value, key) in product.features" :key="key">
                                                <div class="flex items-start gap-3">
                                                    <svg class="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0">
                                                        <use xlink:href="#icon-check"></use>
                                                    </svg>
                                                    <div>
                                                        <span class="font-medium text-gray-900" x-text="formatFeatureKey(key) + ':'"></span>
                                                        <span class="text-gray-600 ml-2" x-text="value"></span>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>

                                    <!-- Product Specifications -->
                                    <div class="space-y-4 pt-6 border-t border-gray-200">
                                        <h3 class="text-lg font-semibold text-gray-900">Specifications</h3>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div class="space-y-2">
                                                <div class="flex justify-between">
                                                    <span class="font-medium text-gray-900">Brand:</span>
                                                    <span class="text-gray-600" x-text="product.brand || 'GreenLion'"></span>
                                                </div>
                                                <div class="flex justify-between">
                                                    <span class="font-medium text-gray-900">SKU:</span>
                                                    <span class="text-gray-600" x-text="product.sku || 'N/A'"></span>
                                                </div>
                                            </div>
                                            <div class="space-y-2">
                                                <div x-show="product.requiresShipping" class="flex justify-between">
                                                    <span class="font-medium text-gray-900">Shipping:</span>
                                                    <span class="text-gray-600">Required</span>
                                                </div>
                                                <div class="flex justify-between">
                                                    <span class="font-medium text-gray-900">Condition:</span>
                                                    <span class="text-gray-600">New</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Related Products Section -->
                        <section class="bg-white py-16 mt-16">
                            <div class="max-w-7xl mx-auto px-6">
                                <div x-data="relatedProducts({ productId: currentProduct?.id, maxProducts: 4 })">
                                    <div x-show="products.length > 0">
                                        <h2 class="text-3xl font-bold text-primary mb-8 text-center" x-text="title"></h2>
                                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <template x-for="product in products" :key="product.id">
                                                <div class="bg-white shadow-sm hover:shadow-lg transition-all duration-300 group">
                                                    <div class="relative overflow-hidden aspect-square">
                                                        <img :src="Array.isArray(product.images) ? product.images[0] : product.images" 
                                                             :alt="product.name + ' - Related electronics product'" 
                                                             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                             @error="$event.target.src = 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image'">
                                                        <!-- Quick Action -->
                                                        <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <button @click="$store.ui.openWhatsApp(\`Hello! I'm interested in the \${product.name}. Could you provide more information?\`)" 
                                                                    class="bg-white/90 hover:bg-white p-2 shadow-md transition-colors">
                                                                <svg class="h-4 w-4 text-green-600">
                                                                    <use xlink:href="#icon-whatsapp"></use>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div class="p-4">
                                                        <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                            <a :href="'#product/' + product.slug" x-text="product.name"></a>
                                                        </h3>
                                                        <div class="flex items-center justify-between">
                                                            <span class="text-lg font-bold text-primary" 
                                                                  x-text="'$' + (product.salePrice || product.base_price || product.price).toFixed(2)"></span>
                                                            <a :href="'#product/' + product.slug" 
                                                               class="text-primary hover:text-primary-hover text-sm font-medium">
                                                                View →
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                `;
            },

            // Load cart page
            async loadCartPage() {
                return `
                    <div class="pt-24 min-h-screen bg-gray-50" x-data="cartPage" x-init="init()">
                        <!-- Page Header -->
                        <div class="bg-white border-b border-gray-200">
                            <div class="max-w-7xl mx-auto px-6 py-8">
                                <h1 class="text-3xl md:text-4xl font-bold text-primary">Shopping Cart</h1>
                                <p class="text-gray-600 mt-2">Review your items and proceed to checkout</p>
                            </div>
                        </div>

                        <div class="max-w-7xl mx-auto px-6 py-8">
                            <!-- Cart Content -->
                            <div x-show="$store.cart.items.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <!-- Cart Items -->
                                <div class="lg:col-span-2 space-y-6">
                                    <div class="bg-white shadow-sm">
                                        <div class="p-6">
                                            <h2 class="text-xl font-semibold text-gray-900 mb-6">Cart Items</h2>
                                            <div class="space-y-6">
                                                <template x-for="(item, index) in $store.cart.items" :key="index">
                                                    <div class="flex gap-4 p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                                                        <!-- Product Image -->
                                                        <div class="flex-shrink-0 w-20 h-20 bg-gray-100 overflow-hidden">
                                                            <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" @error="$event.target.src = 'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=No+Image'">
                                                        </div>
                                                        
                                                        <!-- Product Details -->
                                                        <div class="flex-1 space-y-2">
                                                            <h3 class="font-semibold text-gray-900" x-text="item.name"></h3>
                                                            
                                                            <!-- Options -->
                                                            <div x-show="item.options && Object.keys(item.options).length > 0" class="text-sm text-gray-600">
                                                                <template x-for="(value, key) in item.options" :key="key">
                                                                    <span class="inline-block mr-4">
                                                                        <span x-text="key + ': ' + value"></span>
                                                                    </span>
                                                                </template>
                                                            </div>
                                                            
                                                            <!-- Price -->
                                                            <div class="flex items-center justify-between">
                                                                <span class="text-lg font-bold text-primary" x-text="formatPrice(item.price)"></span>
                                                                
                                                                <!-- Quantity Controls -->
                                                                <div class="flex items-center gap-3">
                                                                    <div class="flex items-center border border-gray-300">
                                                                        <button @click="$store.cart.updateItemQuantity(index, item.quantity - 1)" 
                                                                                class="px-2 py-1 hover:bg-gray-100 transition-colors">
                                                                            <svg class="h-4 w-4">
                                                                                <use xlink:href="#icon-minus"></use>
                                                                            </svg>
                                                                        </button>
                                                                        <span class="px-3 py-1 text-center min-w-[3rem]" x-text="item.quantity"></span>
                                                                        <button @click="$store.cart.updateItemQuantity(index, item.quantity + 1)" 
                                                                                class="px-2 py-1 hover:bg-gray-100 transition-colors">
                                                                            <svg class="h-4 w-4">
                                                                                <use xlink:href="#icon-plus"></use>
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                    
                                                                    <!-- Remove Button -->
                                                                    <button @click="$store.cart.removeItem(index)" 
                                                                            class="text-red-600 hover:text-red-700 p-1">
                                                                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Order Summary -->
                                <div class="lg:col-span-1">
                                    <div class="bg-white shadow-sm p-6 space-y-6">
                                        <h2 class="text-xl font-semibold text-gray-900">Order Summary</h2>
                                        
                                        <!-- Shipping Method -->
                                        <div class="space-y-3">
                                            <h3 class="font-medium text-gray-900">Shipping Method</h3>
                                            <div class="space-y-2">
                                                <template x-for="(method, key) in shippingMethods" :key="key">
                                                    <label class="flex items-center p-3 border cursor-pointer transition-colors" 
                                                           :class="shippingMethod === key ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'">
                                                        <input type="radio" 
                                                               x-model="shippingMethod" 
                                                               :value="key" 
                                                               @change="updateEstimatedDelivery()"
                                                               :disabled="key === 'free' && !qualifiesForFreeShipping()"
                                                               class="text-primary focus:ring-primary">
                                                        <div class="ml-3 flex-1">
                                                            <div class="flex items-center justify-between">
                                                                <span class="font-medium" x-text="method.name"></span>
                                                                <span class="text-primary font-semibold" 
                                                                      x-text="key === 'free' && qualifiesForFreeShipping() ? 'FREE' : formatPrice(method.cost)"></span>
                                                            </div>
                                                            <div class="text-sm text-gray-600" x-text="method.days + ' business days'"></div>
                                                            <div x-show="key === 'free' && !qualifiesForFreeShipping()" 
                                                                 class="text-xs text-gray-500" 
                                                                 x-text="'Minimum order: ' + formatPrice(method.minimumOrder)"></div>
                                                        </div>
                                                    </label>
                                                </template>
                                            </div>
                                            <div class="text-sm text-gray-600">
                                                <span class="font-medium">Estimated delivery:</span>
                                                <span x-text="estimatedDelivery"></span>
                                            </div>
                                        </div>

                                        <!-- Coupon Code -->
                                        <div class="space-y-3">
                                            <h3 class="font-medium text-gray-900">Coupon Code</h3>
                                            <div class="flex gap-2">
                                                <input type="text" 
                                                       x-model="couponCode" 
                                                       placeholder="Enter coupon code" 
                                                       class="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                                <button @click="applyCoupon()" 
                                                        class="bg-primary text-white px-4 py-2 font-medium hover:bg-primary-hover transition-colors">
                                                    Apply
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Order Totals -->
                                        <div class="space-y-3 pt-4 border-t border-gray-200">
                                            <div class="flex justify-between">
                                                <span class="text-gray-600">Subtotal:</span>
                                                <span class="font-semibold" x-text="$store.cart.getFormattedTotal()"></span>
                                            </div>
                                            <div class="flex justify-between">
                                                <span class="text-gray-600">Shipping:</span>
                                                <span class="font-semibold" 
                                                      x-text="qualifiesForFreeShipping() ? 'FREE' : formatPrice(getCurrentShippingMethod().cost)"></span>
                                            </div>
                                            <div class="flex justify-between text-lg font-bold text-primary pt-3 border-t border-gray-200">
                                                <span>Total:</span>
                                                <span x-text="formatPrice(getFinalTotal())"></span>
                                            </div>
                                        </div>

                                        <!-- Action Buttons -->
                                        <div class="space-y-3">
                                            <div x-data="whatsappCheckout">
                                                <button @click="sendOrder()" 
                                                        class="w-full bg-green-500 text-white py-4 font-semibold text-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                                                    <svg class="h-6 w-6">
                                                        <use xlink:href="#icon-whatsapp"></use>
                                                    </svg>
                                                    <span>Checkout via WhatsApp</span>
                                                </button>
                                            </div>
                                            
                                            <button @click="$store.cart.clearCart()" 
                                                    class="w-full border-2 border-gray-300 text-gray-700 py-3 font-medium hover:border-gray-400 transition-colors">
                                                Clear Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Empty Cart -->
                            <div x-show="$store.cart.items.length === 0" class="text-center py-16">
                                <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                                    </svg>
                                </div>
                                <h2 class="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                                <p class="text-gray-600 mb-8">Add some products to your cart to continue shopping.</p>
                                <a href="#products" class="inline-block bg-primary text-white px-8 py-4 text-lg font-medium hover:bg-primary-hover transition-colors">
                                    Continue Shopping
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            },

            // Load 404 page
            async load404Page() {
                return `
                    <div class="pt-24 min-h-screen flex items-center justify-center">
                        <div class="max-w-4xl mx-auto px-6 text-center">
                            <div class="space-y-6">
                                <div class="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                                    <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.64-4.29-3.668 0-2.15 1.94-3.92 4.29-3.92s4.29 1.77 4.29 3.92c0 .993-.183 1.908-.51 2.691z"/>
                                    </svg>
                                </div>
                                <h1 class="text-4xl font-bold text-gray-900">Page Not Found</h1>
                                <p class="text-lg text-gray-600">The page you're looking for doesn't exist or may have been moved.</p>
                                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a href="#home" class="bg-primary text-white px-6 py-3 font-medium hover:bg-primary-hover transition-colors">
                                        Go Home
                                    </a>
                                    <a href="#products" class="border-2 border-primary text-primary px-6 py-3 font-medium hover:bg-primary hover:text-white transition-colors">
                                        Browse Products
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            },

            // Initialize page-specific components
            initializePageComponents(route) {
                // Re-initialize Alpine components for the new page content
                this.$nextTick(() => {
                    const content = document.getElementById('spa-content');
                    if (content) {
                        // Let Alpine process the new content
                        Alpine.initTree(content);
                    }
                });
            },

            // Update page meta tags
            updatePageMeta(route) {
                const titleElement = document.getElementById('meta-title');
                const descElement = document.getElementById('meta-description');

                switch (route) {
                    case 'home':
                        if (titleElement) titleElement.textContent = 'GreenLion - Premium Consumer Electronics & Smart Gadgets in Lebanon';
                        if (descElement) descElement.setAttribute('content', 'Discover GreenLion\'s premium collection of mobile accessories, smart gadgets, grooming tools & home appliances. Free shipping in Lebanon.');
                        break;
                    case 'products':
                        if (titleElement) titleElement.textContent = 'Products - Premium Electronics | GreenLion Lebanon';
                        if (descElement) descElement.setAttribute('content', 'Browse our complete collection of premium electronics, mobile accessories, smart gadgets, and home appliances.');
                        break;
                    case 'product':
                        const productSlug = this.currentParams.slug;
                        const product = typeof PRODUCTS !== 'undefined'
                            ? PRODUCTS.find(p => p.slug === productSlug)
                            : null;
                        if (product) {
                            if (titleElement) titleElement.textContent = `${product.name} - GreenLion Lebanon`;
                            if (descElement) descElement.setAttribute('content', product.description || 'Premium electronics product details and specifications.');
                        }
                        break;
                    case 'cart':
                        if (titleElement) titleElement.textContent = 'Shopping Cart - GreenLion Lebanon';
                        if (descElement) descElement.setAttribute('content', 'Review your cart items and proceed to checkout with premium electronics from GreenLion.');
                        break;
                }
            },

            // Set up link interceptor for SPA navigation
            setupLinkInterceptor() {
                document.addEventListener('click', (e) => {
                    const link = e.target.closest('a');
                    if (!link) return;

                    const href = link.getAttribute('href');
                    if (!href || !href.startsWith('#')) return;

                    // Let the browser handle the hash change
                    // Our hashchange listener will handle the routing
                });
            }
        };
    });

    // Featured Products Data Component
    Alpine.data('featuredProducts', () => {
        return {
            products: [],
            init() {
                // Get featured products from PRODUCTS array
                if (typeof PRODUCTS !== 'undefined') {
                    this.products = PRODUCTS.filter(p => p.isFeatured).slice(0, 6);

                    // If no featured products, get first 6 products
                    if (this.products.length === 0) {
                        this.products = PRODUCTS.slice(0, 6);
                    }
                }
            }
        };
    });

    // Related Products Component
    Alpine.data('relatedProducts', (config = {}) => {
        return {
            products: [],
            title: config.title || 'Related Products',
            maxProducts: config.maxProducts || 4,

            init() {
                this.loadRelatedProducts();
            },

            loadRelatedProducts() {
                if (typeof PRODUCTS === 'undefined' || !config.productId) {
                    this.products = [];
                    return;
                }

                const currentProduct = PRODUCTS.find(p => p.id === config.productId);
                if (!currentProduct) {
                    this.products = [];
                    return;
                }

                // Get products from same categories
                let related = PRODUCTS.filter(p =>
                    p.id !== config.productId &&
                    p.categories &&
                    currentProduct.categories &&
                    p.categories.some(catId => currentProduct.categories.includes(catId))
                );

                // If not enough related products, fill with other products
                if (related.length < this.maxProducts) {
                    const remaining = PRODUCTS.filter(p =>
                        p.id !== config.productId &&
                        !related.find(r => r.id === p.id)
                    );
                    related = [...related, ...remaining];
                }

                // Shuffle and limit
                this.products = this.shuffle(related).slice(0, this.maxProducts);
            },

            shuffle(array) {
                const shuffled = [...array];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled;
            }
        };
    });
});