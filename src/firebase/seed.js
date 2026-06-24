/**
 * seed.js
 * Run this ONCE from the browser console or a Node script to populate Firestore
 * with initial categories and products.
 *
 * Usage (browser):
 *   import { seedDatabase } from "./firebase/seed";
 *   seedDatabase();
 *
 * Or call it from the AdminPanel → Settings tab.
 */

import { db } from "./config";
import { COLLECTIONS } from "./collections";
import {
  collection,
  doc,
  setDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";

// ─── Initial Categories ───────────────────────────────────────────────────────
const INITIAL_CATEGORIES = [
  { id: "biryani", name: "Biryani", icon: "🍛", order: 1 },
  { id: "burger", name: "Burger", icon: "🍔", order: 2 },
  { id: "pizza", name: "Pizza", icon: "🍕", order: 3 },
  { id: "chowmein", name: "Chowmein", icon: "🍜", order: 4 },
  { id: "fried-rice", name: "Fried Rice", icon: "🍚", order: 5 },
  { id: "rolls", name: "Rolls", icon: "🌯", order: 6 },
  { id: "momos", name: "Momos", icon: "🥟", order: 7 },
  { id: "snacks", name: "Snacks", icon: "🍟", order: 8 },
  { id: "beverages", name: "Beverages", icon: "🥤", order: 9 },
];

// ─── Initial Products ─────────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  { name: "Chicken Biryani", category: "Biryani", price: 180, rating: 4.8, reviewCount: 124, description: "Aromatic basmati rice layered with tender chicken, saffron & spices. Served with raita.", emoji: "🍛", badge: "Bestseller", available: true },
  { name: "Veg Biryani", category: "Biryani", price: 120, rating: 4.5, reviewCount: 87, description: "Fragrant basmati with seasonal veggies, whole spices & fried onions.", emoji: "🍚", badge: "Popular", available: true },
  { name: "Egg Biryani", category: "Biryani", price: 140, rating: 4.6, reviewCount: 96, description: "Fluffy eggs cooked in spiced rice with caramelized onions & mint.", emoji: "🥚", badge: "", available: true },
  { name: "Paneer Pizza", category: "Pizza", price: 160, rating: 4.4, reviewCount: 62, description: "Wood-fired base with creamy paneer, bell peppers & mozzarella.", emoji: "🍕", badge: "", available: true },
  { name: "Chicken Pizza", category: "Pizza", price: 190, rating: 4.7, reviewCount: 108, description: "Loaded with juicy chicken tikka, onions & our signature sauce.", emoji: "🍕", badge: "Spicy", available: true },
  { name: "Veg Burger", category: "Burger", price: 80, rating: 4.3, reviewCount: 54, description: "Crispy aloo tikki patty with fresh veggies, cheese & tangy sauce.", emoji: "🍔", badge: "", available: true },
  { name: "Chicken Burger", category: "Burger", price: 110, rating: 4.6, reviewCount: 143, description: "Juicy grilled chicken fillet with lettuce, tomato & mayo.", emoji: "🍔", badge: "Bestseller", available: true },
  { name: "Veg Chowmein", category: "Chowmein", price: 90, rating: 4.4, reviewCount: 71, description: "Stir-fried noodles with colorful veggies in schezwan sauce.", emoji: "🍜", badge: "", available: true },
  { name: "Chicken Chowmein", category: "Chowmein", price: 120, rating: 4.5, reviewCount: 89, description: "Wok-tossed noodles with tender chicken strips & veggies.", emoji: "🍜", badge: "Popular", available: true },
  { name: "Veg Fried Rice", category: "Fried Rice", price: 100, rating: 4.3, reviewCount: 47, description: "Indo-Chinese style fried rice with fresh vegetables & soy sauce.", emoji: "🍚", badge: "", available: true },
  { name: "Chicken Fried Rice", category: "Fried Rice", price: 130, rating: 4.6, reviewCount: 92, description: "Wok-fried rice with chicken pieces, egg & scallions.", emoji: "🍚", badge: "Popular", available: true },
  { name: "Paneer Roll", category: "Rolls", price: 90, rating: 4.4, reviewCount: 38, description: "Flaky paratha wrapped with spiced paneer, onions & mint chutney.", emoji: "🌯", badge: "", available: true },
  { name: "Chicken Roll", category: "Rolls", price: 110, rating: 4.7, reviewCount: 67, description: "Soft roti stuffed with grilled chicken, veggies & house sauce.", emoji: "🌯", badge: "Spicy", available: true },
  { name: "Veg Momos", category: "Momos", price: 80, rating: 4.5, reviewCount: 156, description: "Steamed dumplings stuffed with spiced cabbage & veggies.", emoji: "🥟", badge: "Fan Fav", available: true },
  { name: "Chicken Momos", category: "Momos", price: 100, rating: 4.8, reviewCount: 198, description: "Juicy chicken-filled dumplings with fiery red chutney.", emoji: "🥟", badge: "Bestseller", available: true },
  { name: "Spring Roll", category: "Snacks", price: 70, rating: 4.3, reviewCount: 43, description: "Crispy golden rolls filled with veggies & glass noodles.", emoji: "🥚", badge: "", available: true },
  { name: "French Fries", category: "Snacks", price: 60, rating: 4.4, reviewCount: 89, description: "Golden, crispy fries served with ketchup & mayo dip.", emoji: "🍟", badge: "", available: true },
  { name: "Onion Rings", category: "Snacks", price: 65, rating: 4.2, reviewCount: 31, description: "Crispy battered onion rings with zesty dipping sauce.", emoji: "🧅", badge: "", available: true },
  { name: "Cold Drink", category: "Beverages", price: 30, rating: 4.0, reviewCount: 22, description: "Chilled 300ml can – Pepsi or Coke.", emoji: "🥤", badge: "", available: true },
  { name: "Fresh Lime Soda", category: "Beverages", price: 40, rating: 4.6, reviewCount: 35, description: "Refreshing lime soda — sweet, salt or mixed.", emoji: "🍋", badge: "", available: true },
  { name: "Mango Lassi", category: "Beverages", price: 60, rating: 4.7, reviewCount: 48, description: "Thick chilled mango yogurt drink — summer special.", emoji: "🥭", badge: "Special", available: true },
  { name: "Masala Chai", category: "Beverages", price: 20, rating: 4.8, reviewCount: 210, description: "Spiced milk tea brewed the desi way.", emoji: "☕", badge: "Popular", available: true },
];

export async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Seed categories
    const catBatch = writeBatch(db);
    for (const cat of INITIAL_CATEGORIES) {
      const ref = doc(collection(db, COLLECTIONS.CATEGORIES), cat.id);
      catBatch.set(ref, { ...cat, createdAt: serverTimestamp() });
    }
    await catBatch.commit();
    console.log("✅ Categories seeded");

    // Seed products (batches of 500 max per Firestore limit)
    const prodBatch = writeBatch(db);
    for (const product of INITIAL_PRODUCTS) {
      const ref = doc(collection(db, COLLECTIONS.PRODUCTS));
      prodBatch.set(ref, { ...product, imageUrl: "", createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    }
    await prodBatch.commit();
    console.log("✅ Products seeded");

    // Seed default settings
    await setDoc(doc(db, COLLECTIONS.SETTINGS, "restaurant"), {
      name: "Sahoo Family Fastfood",
      location: "Rajsunakhala, Odisha, India",
      whatsapp: "918249790363",
      waChannel: "https://whatsapp.com/channel/0029VbD0z1m7DAWqhCHcUe0u",
      hours: "10:00 AM – 10:00 PM",
      updatedAt: serverTimestamp(),
    });
    console.log("✅ Settings seeded");
    console.log("🎉 Database seeded successfully!");

  } catch (err) {
    console.error("❌ Seed error:", err);
    throw err;
  }
}
