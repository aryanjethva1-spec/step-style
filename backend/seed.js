import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Brand from './models/Brand.js';
import Product from './models/Product.js';

dotenv.config();

const products = [
    {
        name: 'Nike Air Max 270',
        price: 150,
        category: 'Sports',
        description: 'The Nike Air Max 270 is clean, sleek and lightweight. It provides ultimate comfort and style for your daily runs.',
        sizes: ['7', '8', '9', '10', '11'],
        footwearType: 'Running',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        stock: 50,
        rating: 4.8
    },
    {
        name: 'Adidas Ultraboost 22',
        price: 180,
        category: 'Sports',
        description: 'Responsive cushioning and an adaptive fit make this the go-to running shoe for athletes.',
        sizes: ['8', '9', '10', '11'],
        footwearType: 'Running',
        image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80',
        stock: 45,
        rating: 4.9
    },
    {
        name: 'Puma RS-X Bold',
        price: 120,
        category: 'Casual',
        description: 'Retro-inspired design with a bulky silhouette and vibrant color accents.',
        sizes: ['7', '8', '9', '10'],
        footwearType: 'Sneakers',
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
        stock: 30,
        rating: 4.5
    },
    {
        name: 'Nike Dunk Low Panda',
        price: 110,
        category: 'Casual',
        description: 'The iconic black and white colorway that goes with everything.',
        sizes: ['6', '7', '8', '9', '10', '11'],
        footwearType: 'Sneakers',
        image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80',
        stock: 100,
        rating: 4.9
    },
    {
        name: 'Jordan 1 Retro High',
        price: 170,
        category: 'Casual',
        description: 'The classic sneaker that started it all. Premium leather and timeless design.',
        sizes: ['9', '10', '11', '12'],
        footwearType: 'Basketball',
        image: 'https://images.unsplash.com/photo-1597045566774-4537ae55ce10?auto=format&fit=crop&w=800&q=80',
        stock: 20,
        rating: 5.0
    },
    {
        name: 'Adidas Stan Smith',
        price: 90,
        category: 'Casual',
        description: 'Simplicity is key. A clean, classic white trainer with green accents.',
        sizes: ['5', '6', '7', '8', '9'],
        footwearType: 'Sneakers',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        stock: 60,
        rating: 4.7
    },
    {
        name: 'Vans Old Skool',
        price: 65,
        category: 'Casual',
        description: 'The classic skate shoe with the iconic side stripe.',
        sizes: ['4', '5', '6', '7', '8', '9', '10'],
        footwearType: 'Sneakers',
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
        stock: 80,
        rating: 4.6
    },
    {
        name: 'New Balance 574 Metallic',
        price: 95,
        category: 'Casual',
        description: 'Modern comfort meets legendary style.',
        sizes: ['6', '7', '8', '9'],
        footwearType: 'Sneakers',
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80',
        stock: 40,
        rating: 4.4
    }
];

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Create Admin User
        let admin = await User.findOne({ email: 'admin@stepstyle.com' });
        if (!admin) {
            await User.create({
                name: 'System Admin',
                email: 'admin@stepstyle.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin User Created');
        }

        // Create Official Brand
        let brand = await Brand.findOne({ brandName: 'StepStyle Official' });
        if (!brand) {
            brand = await Brand.create({
                brandName: 'StepStyle Official',
                email: 'official@stepstyle.com',
                password: 'password123',
                description: 'The official footwear partner of StepStyle.',
                logo: 'https://cdn-icons-png.flaticon.com/512/2872/2872620.png',
                status: 'approved'
            });
            console.log('Official Brand Created');
        }

        // Add Brand ID and Name to Products
        const productsWithBrand = products.map(p => ({
            ...p,
            brandId: brand._id,
            brandName: brand.brandName
        }));

        // Clear existing products and seed
        await Product.deleteMany({});
        await Product.insertMany(productsWithBrand);

        console.log('Data Seeded Successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
}

seedData();
