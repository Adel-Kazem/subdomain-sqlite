// categories.js - Product Categories Data for GreenLion SPA
const CATEGORIES = [
    {
        id: 466617751,
        name: "Mobile Accessories",
        slug: "mobile-accessories",
        description: "Essential accessories for your mobile devices including chargers, cables, power banks, and protective cases",
        image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        parent_id: null,
        sort_order: 1,
        is_active: true,
        seo_title: "Mobile Accessories - Chargers, Cables & Power Banks | GreenLion Lebanon",
        seo_description: "Shop premium mobile accessories including fast chargers, USB cables, wireless power banks, and phone cases. Free shipping in Lebanon.",
        featured: true,
        product_count: 15,
        subcategories: [
            {
                id: 466617752,
                name: "Chargers & Cables",
                slug: "chargers-cables",
                parent_id: 466617751
            },
            {
                id: 466617753,
                name: "Power Banks",
                slug: "power-banks",
                parent_id: 466617751
            },
            {
                id: 466617754,
                name: "Phone Cases",
                slug: "phone-cases",
                parent_id: 466617751
            }
        ]
    },
    {
        id: 1017426431,
        name: "Smart Gadgets",
        slug: "smart-gadgets",
        description: "Innovative smart gadgets including wireless earbuds, smart speakers, and cutting-edge tech accessories",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        parent_id: null,
        sort_order: 2,
        is_active: true,
        seo_title: "Smart Gadgets - Wireless Audio & Tech Accessories | GreenLion Lebanon",
        seo_description: "Discover the latest smart gadgets including wireless earbuds, smart speakers, and innovative tech accessories. Premium quality guaranteed.",
        featured: true,
        product_count: 12,
        subcategories: [
            {
                id: 1017426432,
                name: "Wireless Audio",
                slug: "wireless-audio",
                parent_id: 1017426431
            },
            {
                id: 1017426433,
                name: "Smart Speakers",
                slug: "smart-speakers",
                parent_id: 1017426431
            },
            {
                id: 1017426434,
                name: "Tech Accessories",
                slug: "tech-accessories",
                parent_id: 1017426431
            }
        ]
    },
    {
        id: 20182851,
        name: "Grooming Tools",
        slug: "grooming-tools",
        description: "Professional grooming tools including hair clippers, trimmers, and personal care devices",
        image: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        parent_id: null,
        sort_order: 3,
        is_active: true,
        seo_title: "Grooming Tools - Hair Clippers & Trimmers | GreenLion Lebanon",
        seo_description: "Professional grooming tools for modern men. Shop hair clippers, beard trimmers, and personal care devices with warranty.",
        featured: true,
        product_count: 8,
        subcategories: [
            {
                id: 20182852,
                name: "Hair Clippers",
                slug: "hair-clippers",
                parent_id: 20182851
            },
            {
                id: 20182853,
                name: "Beard Trimmers",
                slug: "beard-trimmers",
                parent_id: 20182851
            },
            {
                id: 20182854,
                name: "Personal Care",
                slug: "personal-care",
                parent_id: 20182851
            }
        ]
    },
    {
        id: 754398123,
        name: "Home Appliances",
        slug: "home-appliances",
        description: "Smart home appliances including security cameras, digital frames, and home automation devices",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        parent_id: null,
        sort_order: 4,
        is_active: true,
        seo_title: "Smart Home Appliances - Security Cameras & Digital Frames | GreenLion Lebanon",
        seo_description: "Transform your home with smart appliances including security cameras, digital photo frames, and home automation devices.",
        featured: true,
        product_count: 10,
        subcategories: [
            {
                id: 754398124,
                name: "Security Cameras",
                slug: "security-cameras",
                parent_id: 754398123
            },
            {
                id: 754398125,
                name: "Digital Frames",
                slug: "digital-frames",
                parent_id: 754398123
            },
            {
                id: 754398126,
                name: "Home Automation",
                slug: "home-automation",
                parent_id: 754398123
            },
            {
                id: 754398127,
                name: "Small Appliances",
                slug: "small-appliances",
                parent_id: 754398123
            }
        ]
    },
    {
        id: 892567234,
        name: "Gaming Accessories",
        slug: "gaming-accessories",
        description: "Gaming accessories and peripherals for mobile and console gaming",
        image: "https://images.unsplash.com/photo-1592840331281-e5b2f0b06877?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        parent_id: null,
        sort_order: 5,
        is_active: true,
        seo_title: "Gaming Accessories - Mobile & Console Gaming | GreenLion Lebanon",
        seo_description: "Level up your gaming with premium gaming accessories including controllers, headsets, and mobile gaming gear.",
        featured: false,
        product_count: 6,
        subcategories: [
            {
                id: 892567235,
                name: "Mobile Gaming",
                slug: "mobile-gaming",
                parent_id: 892567234
            },
            {
                id: 892567236,
                name: "Gaming Controllers",
                slug: "gaming-controllers",
                parent_id: 892567234
            }
        ]
    },
    {
        id: 345128967,
        name: "Computer Accessories",
        slug: "computer-accessories",
        description: "Essential computer accessories including keyboards, mice, webcams, and laptop stands",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        parent_id: null,
        sort_order: 6,
        is_active: true,
        seo_title: "Computer Accessories - Keyboards, Mice & Laptop Stands | GreenLion Lebanon",
        seo_description: "Enhance your productivity with premium computer accessories including wireless keyboards, ergonomic mice, and laptop stands.",
        featured: false,
        product_count: 9,
        subcategories: [
            {
                id: 345128968,
                name: "Keyboards & Mice",
                slug: "keyboards-mice",
                parent_id: 345128967
            },
            {
                id: 345128969,
                name: "Webcams",
                slug: "webcams",
                parent_id: 345128967
            },
            {
                id: 345128970,
                name: "Laptop Stands",
                slug: "laptop-stands",
                parent_id: 345128967
            }
        ]
    }
];

// Category utility functions
const CategoryUtils = {
    // Get all categories
    getAll() {
        return CATEGORIES;
    },

    // Get featured categories
    getFeatured() {
        return CATEGORIES.filter(cat => cat.featured);
    },

    // Get category by ID
    getById(id) {
        return CATEGORIES.find(cat => cat.id === id);
    },

    // Get category by slug
    getBySlug(slug) {
        return CATEGORIES.find(cat => cat.slug === slug);
    },

    // Get parent categories (top-level)
    getParentCategories() {
        return CATEGORIES.filter(cat => cat.parent_id === null);
    },

    // Get subcategories for a parent category
    getSubcategories(parentId) {
        const parentCategory = this.getById(parentId);
        return parentCategory ? parentCategory.subcategories || [] : [];
    },

    // Get all descendant category IDs (including subcategories)
    getAllDescendantIds(parentId) {
        let ids = [parentId];
        const subcategories = this.getSubcategories(parentId);

        subcategories.forEach(subcat => {
            ids.push(subcat.id);
            // If subcategories have their own subcategories, recursively get them
            ids = ids.concat(this.getAllDescendantIds(subcat.id));
        });

        return ids;
    },

    // Get category hierarchy path
    getCategoryPath(categoryId) {
        const category = this.getById(categoryId);
        if (!category) return [];

        const path = [category];

        if (category.parent_id) {
            const parent = this.getById(category.parent_id);
            if (parent) {
                path.unshift(parent);
            }
        }

        return path;
    },

    // Get breadcrumb for category
    getBreadcrumb(categoryId) {
        const path = this.getCategoryPath(categoryId);
        return path.map(cat => ({
            name: cat.name,
            slug: cat.slug,
            url: `#products/${cat.slug}`
        }));
    },

    // Get categories for navigation menu
    getNavigationCategories() {
        return this.getParentCategories()
            .filter(cat => cat.is_active)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(cat => ({
                ...cat,
                subcategories: this.getSubcategories(cat.id)
            }));
    },

    // Search categories
    search(query) {
        const searchTerm = query.toLowerCase();
        return CATEGORIES.filter(cat =>
            cat.name.toLowerCase().includes(searchTerm) ||
            cat.description.toLowerCase().includes(searchTerm)
        );
    },

    // Get category statistics
    getStats() {
        const totalCategories = CATEGORIES.length;
        const featuredCategories = this.getFeatured().length;
        const parentCategories = this.getParentCategories().length;
        const totalProducts = CATEGORIES.reduce((sum, cat) => sum + (cat.product_count || 0), 0);

        return {
            totalCategories,
            featuredCategories,
            parentCategories,
            totalProducts
        };
    },

    // Generate sitemap data for categories
    getSitemapData() {
        return CATEGORIES.map(cat => ({
            url: `#products/${cat.slug}`,
            name: cat.name,
            description: cat.description,
            lastModified: new Date().toISOString(),
            priority: cat.featured ? 0.8 : 0.6
        }));
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.CATEGORIES = CATEGORIES;
    window.CategoryUtils = CategoryUtils;
}

// Alpine.js integration
document.addEventListener('alpine:init', () => {
    // Category store for Alpine.js
    Alpine.store('categories', {
        data: CATEGORIES,
        utils: CategoryUtils,

        // Get all categories
        getAll() {
            return this.data;
        },

        // Get featured categories
        getFeatured() {
            return this.utils.getFeatured();
        },

        // Get category by slug
        getBySlug(slug) {
            return this.utils.getBySlug(slug);
        },

        // Get navigation categories
        getNavigation() {
            return this.utils.getNavigationCategories();
        },

        // Search categories
        search(query) {
            return this.utils.search(query);
        }
    });
});