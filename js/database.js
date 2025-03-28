// database.js - Handles all SQLite operations

const Database = {
    db: null,                // Will hold the SQL.js database instance
    initialized: false,      // Flag to track if database has been initialized

    // Initialize the database
    async init() {
        try {
            // Initialize SQL.js library
            // This loads the WebAssembly SQLite implementation
            const SQL = await initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });

            // Try to load existing database from localStorage
            let dbData = localStorage.getItem('productsDB');

            if (dbData) {
                // If database exists in localStorage, restore it

                // Convert base64 string to Uint8Array
                // SQLite data is binary, so we need to convert from the base64 string format used in localStorage
                const binaryString = window.atob(dbData);  // Decode base64 to binary string
                const bytes = new Uint8Array(binaryString.length);  // Create a new byte array
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);  // Convert each character to its byte value
                }

                // Create a new database instance from the binary data
                this.db = new SQL.Database(bytes);
            } else {
                // If no database exists, create a new one
                this.db = new SQL.Database();

                // Create products table with schema
                this.db.run(`
                    CREATE TABLE products (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,  /* Auto-incrementing unique ID */
                        name TEXT NOT NULL,                    /* Product name (required) */
                        description TEXT,                      /* Product description */
                        price REAL NOT NULL,                   /* Price as a decimal number (required) */
                        category TEXT,                         /* Product category */
                        stock INTEGER DEFAULT 0,               /* Stock quantity, defaults to 0 */
                        image TEXT                             /* URL to product image */
                    )
                `);

                // Insert sample data for initial use
                this.db.run(`
                    INSERT INTO products (name, description, price, category, stock, image)
                    VALUES 
                    ('Smartphone X', 'Latest smartphone with amazing features', 999.99, 'Electronics', 25, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
                    ('Laptop Pro', 'High-performance laptop for professionals', 1499.99, 'Electronics', 15, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
                    ('Wireless Headphones', 'Noise-canceling wireless headphones', 199.99, 'Audio', 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
                    ('Smart Watch', 'Track your fitness and stay connected', 299.99, 'Wearables', 30, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
                    ('Coffee Maker', 'Automatic coffee maker with timer', 89.99, 'Home Appliances', 12, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')
                `);

                // Save the newly created database to localStorage
                this.saveToLocalStorage();
            }

            this.initialized = true;
            return true;
        } catch (err) {
            console.error('Database initialization error:', err);
            return false;
        }
    },

    // Save the database to localStorage
    saveToLocalStorage() {
        if (!this.db) return false;

        // Export the database to a Uint8Array (binary format)
        const data = this.db.export();

        // Convert binary data to base64 string for localStorage storage
        const binaryArray = [];
        const bytes = new Uint8Array(data);
        const len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binaryArray.push(String.fromCharCode(bytes[i]));  // Convert each byte to a character
        }

        // Join all characters and encode as base64
        const base64String = window.btoa(binaryArray.join(''));

        // Save to localStorage
        localStorage.setItem('productsDB', base64String);
        return true;
    },

    // Get all products from the database
    getAllProducts() {
        if (!this.db) return [];

        try {
            // Execute SQL query to get all products, ordered by ID in descending order (newest first)
            const results = this.db.exec("SELECT * FROM products ORDER BY id DESC");

            // If no results, return empty array
            if (results.length === 0) return [];

            // Extract column names and values from the result
            const columns = results[0].columns;  // Array of column names
            const values = results[0].values;    // Array of rows, each row is an array of values

            // Convert the result into an array of objects
            // Each object represents a product with named properties
            return values.map(row => {
                const product = {};
                columns.forEach((column, i) => {
                    product[column] = row[i];  // Map each column name to its value
                });
                return product;
            });
        } catch (err) {
            console.error('Error getting products:', err);
            return [];
        }
    },

    // Get a specific product by its ID
    getProductById(id) {
        if (!this.db) return null;

        try {
            // Prepare a parameterized SQL statement
            // This prevents SQL injection attacks
            const stmt = this.db.prepare("SELECT * FROM products WHERE id = ?");

            // Bind the ID parameter to the statement
            stmt.bind([id]);

            // Execute and get result as an object
            const result = stmt.getAsObject();

            // Free the statement to release resources
            stmt.free();

            // If the result has properties, return it; otherwise return null
            return Object.keys(result).length > 0 ? result : null;
        } catch (err) {
            console.error('Error getting product by ID:', err);
            return null;
        }
    },

    // Add a new product to the database
    addProduct(product) {
        if (!this.db) return false;

        try {
            // Prepare a parameterized SQL INSERT statement
            const stmt = this.db.prepare(`
                INSERT INTO products (name, description, price, category, stock, image)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            // Execute the statement with product values
            stmt.run([
                product.name,
                product.description,
                product.price,
                product.category,
                product.stock,
                product.image
            ]);

            // Free the statement
            stmt.free();

            // Save changes to localStorage
            this.saveToLocalStorage();
            return true;
        } catch (err) {
            console.error('Error adding product:', err);
            return false;
        }
    },

    // Update an existing product
    updateProduct(product) {
        if (!this.db) return false;

        try {
            // Prepare a parameterized SQL UPDATE statement
            const stmt = this.db.prepare(`
                UPDATE products
                SET name = ?, description = ?, price = ?, category = ?, stock = ?, image = ?
                WHERE id = ?
            `);

            // Execute the statement with product values
            stmt.run([
                product.name,
                product.description,
                product.price,
                product.category,
                product.stock,
                product.image,
                product.id  // ID is used in the WHERE clause to identify the product
            ]);

            // Free the statement
            stmt.free();

            // Save changes to localStorage
            this.saveToLocalStorage();
            return true;
        } catch (err) {
            console.error('Error updating product:', err);
            return false;
        }
    },

    // Delete a product by ID
    deleteProduct(id) {
        if (!this.db) return false;

        try {
            // Prepare a parameterized SQL DELETE statement
            const stmt = this.db.prepare("DELETE FROM products WHERE id = ?");

            // Execute the statement with the ID
            stmt.run([id]);

            // Free the statement
            stmt.free();

            // Save changes to localStorage
            this.saveToLocalStorage();
            return true;
        } catch (err) {
            console.error('Error deleting product:', err);
            return false;
        }
    }
};
