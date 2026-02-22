require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Find or create an admin user to be the creator
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            admin = await User.create({
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@dealdrop.com',
                password: 'adminpassword123',
                role: 'admin',
                isVerified: true
            });
            console.log('Created admin user');
        }

        const products = [
            {
                name: 'iPhone 15 Pro',
                description: 'The latest iPhone with A17 Pro chip and titanium design.',
                price: 134900,
                originalPrice: 144900,
                category: 'Electronics',
                brand: 'Apple',
                images: [{ url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80', isPrimary: true }],
                inventory: { quantity: 10 },
                status: 'active',
                featured: true,
                createdBy: admin._id
            },
            {
                name: 'Sony WH-1000XM5',
                description: 'Industry-leading noise canceling headphones.',
                price: 29990,
                originalPrice: 34990,
                category: 'Electronics',
                brand: 'Sony',
                images: [{ url: 'https://images.unsplash.com/photo-1618366712214-8c0797445510?w=800&q=80', isPrimary: true }],
                inventory: { quantity: 15 },
                status: 'active',
                featured: true,
                createdBy: admin._id
            },
            {
                name: 'Cotton Casual Shirt',
                description: 'Comfortable premium cotton shirt for everyday wear.',
                price: 1299,
                originalPrice: 1999,
                category: 'Clothing',
                brand: 'Levis',
                images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', isPrimary: true }],
                inventory: { quantity: 50 },
                status: 'active',
                featured: false,
                createdBy: admin._id
            },
            {
                name: 'Modern Coffee Table',
                description: 'Sleek wooden coffee table for your living room.',
                price: 4999,
                originalPrice: 7999,
                category: 'Home & Kitchen',
                brand: 'IKEA',
                images: [{ url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80', isPrimary: true }],
                inventory: { quantity: 5 },
                status: 'active',
                featured: true,
                createdBy: admin._id
            }
        ];

        await Product.deleteMany({});
        await Product.insertMany(products);

        console.log('Successfully seeded database!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
