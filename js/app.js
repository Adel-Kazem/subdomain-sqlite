// app.js - Main application logic

// Product display page functionality
function productApp() {
    return {
        products: [],
        loading: true,
        error: null,

        async init() {
            this.loading = true;
            this.error = null;

            try {
                // Initialize the database
                const dbInitialized = await Database.init();

                if (!dbInitialized) {
                    this.error = "Failed to initialize the database. Please try refreshing the page.";
                    this.loading = false;
                    return;
                }

                // Load products
                this.products = Database.getAllProducts();
                this.loading = false;
            } catch (err) {
                console.error('Error initializing product app:', err);
                this.error = "An error occurred while loading products. Please try again.";
                this.loading = false;
            }
        }
    };
}

// Admin page functionality
function adminApp() {
    return {
        products: [],
        loading: true,
        error: null,
        successMessage: '',
        editMode: false,
        formData: {
            id: null,
            name: '',
            description: '',
            price: 0,
            category: '',
            stock: 0,
            image: ''
        },

        async init() {
            this.loading = true;
            this.error = null;

            try {
                // Initialize the database
                const dbInitialized = await Database.init();

                if (!dbInitialized) {
                    this.error = "Failed to initialize the database. Please try refreshing the page.";
                    this.loading = false;
                    return;
                }

                // Load products
                this.refreshProducts();
                this.loading = false;
            } catch (err) {
                console.error('Error initializing admin app:', err);
                this.error = "An error occurred while loading products. Please try again.";
                this.loading = false;
            }
        },

        refreshProducts() {
            this.products = Database.getAllProducts();
        },

        resetForm() {
            this.formData = {
                id: null,
                name: '',
                description: '',
                price: 0,
                category: '',
                stock: 0,
                image: ''
            };
            this.editMode = false;
        },

        editProduct(product) {
            this.formData = { ...product };
            this.editMode = true;
            // Scroll to the form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        saveProduct() {
            try {
                // Convert string values to appropriate types
                const product = {
                    ...this.formData,
                    price: parseFloat(this.formData.price),
                    stock: parseInt(this.formData.stock, 10)
                };

                let success = false;

                if (this.editMode) {
                    // Update existing product
                    success = Database.updateProduct(product);
                    if (success) {
                        this.successMessage = `Product "${product.name}" has been updated successfully.`;
                    }
                } else {
                    // Add new product
                    success = Database.addProduct(product);
                    if (success) {
                        this.successMessage = `Product "${product.name}" has been added successfully.`;
                    }
                }

                if (success) {
                    this.refreshProducts();
                    this.resetForm();

                    // Clear success message after 3 seconds
                    setTimeout(() => {
                        this.successMessage = '';
                    }, 3000);
                } else {
                    this.error = "Failed to save product. Please try again.";
                }
            } catch (err) {
                console.error('Error saving product:', err);
                this.error = "An error occurred while saving the product. Please try again.";
            }
        },

        deleteProduct(id) {
            if (confirm('Are you sure you want to delete this product?')) {
                try {
                    const success = Database.deleteProduct(id);

                    if (success) {
                        this.refreshProducts();
                        this.successMessage = "Product has been deleted successfully.";

                        // Clear success message after 3 seconds
                        setTimeout(() => {
                            this.successMessage = '';
                        }, 3000);
                    } else {
                        this.error = "Failed to delete product. Please try again.";
                    }
                } catch (err) {
                    console.error('Error deleting product:', err);
                    this.error = "An error occurred while deleting the product. Please try again.";
                }
            }
        }
    };
}
