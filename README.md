# 🍛 Sahoo Family Fastfood — Production Setup Guide

## 📁 Project Structure

```
sahoo-fastfood/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminPanel.js       ← Full admin CRUD panel
│   │   ├── layout/
│   │   │   ├── Navbar.js
│   │   │   └── Footer.js
│   │   └── ui/
│   │       ├── index.js            ← Shared UI components
│   │       └── ProductCard.js
│   ├── context/
│   │   ├── AuthContext.js          ← Firebase auth state
│   │   ├── CartContext.js          ← Cart (localStorage)
│   │   └── ToastContext.js         ← Toast notifications
│   ├── firebase/
│   │   ├── config.js               ← Firebase init (your real keys)
│   │   ├── collections.js          ← Firestore collection names
│   │   └── seed.js                 ← One-time DB seed script
│   ├── hooks/
│   │   ├── useProducts.js
│   │   ├── useOrders.js
│   │   ├── useCategories.js
│   │   └── useWishlist.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── MenuPage.js
│   │   ├── ProductDetailPage.js
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── OrdersPage.js
│   │   ├── WishlistPage.js
│   │   ├── ProfilePage.js
│   │   ├── AboutPage.js
│   │   └── ContactPage.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   ├── reviewService.js
│   │   ├── categoryService.js
│   │   └── wishlistService.js
│   ├── utils/
│   │   ├── theme.js                ← Design tokens
│   │   ├── whatsapp.js             ← WA order builder
│   │   └── ProtectedRoute.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── firestore.rules                 ← Firestore security rules
├── storage.rules                   ← Storage security rules
├── vercel.json                     ← Vercel SPA config
├── .env.example                    ← Environment variable template
└── package.json
```

---

## 🔥 Step 1 — Firebase Console Setup

### 1.1 Enable Authentication
1. Go to **Firebase Console → sahoo-fastfood → Authentication**
2. Click **"Get Started"**
3. Enable **Email/Password** provider
4. Enable **Google** provider → add your support email → Save

### 1.2 Create Firestore Database
1. Go to **Firestore Database → Create Database**
2. Choose **Production mode**
3. Select region: **asia-south1 (Mumbai)** ← closest to Odisha
4. Click **Done**

### 1.3 Apply Firestore Security Rules
1. Go to **Firestore → Rules** tab
2. Replace the default rules with contents of `firestore.rules`
3. Click **Publish**

### 1.4 Enable Firebase Storage
1. Go to **Storage → Get Started**
2. Start in **Production mode**
3. Select same region: **asia-south1**
4. Go to **Storage → Rules** tab
5. Replace with contents of `storage.rules`
6. Click **Publish**

### 1.5 Add Authorized Domain (for Google Login)
1. Go to **Authentication → Settings → Authorized domains**
2. After Vercel deploy, add your Vercel domain: `your-app.vercel.app`

---

## 🧑‍💼 Step 2 — Set Yourself as Admin

After first login, you need to mark your account as admin in Firestore:

1. Go to **Firestore → users collection**
2. Find your user document (your UID)
3. Set `isAdmin: true`

**OR** set `REACT_APP_ADMIN_EMAIL=your@email.com` in `.env` — new signups with that email auto-get admin.

---

## 🌱 Step 3 — Seed Initial Data

After deploying and logging in as admin:

1. Go to `/admin` → **Settings tab**
2. Click **"Seed Initial Data"**
3. This populates 9 categories + 22 products into Firestore

> ⚠️ Run only ONCE. Running again creates duplicates.

---

## 💻 Step 4 — Local Development

```bash
# 1. Clone / download the project
cd sahoo-fastfood

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env and set REACT_APP_ADMIN_EMAIL=your@gmail.com

# 4. Start dev server
npm start
# Opens http://localhost:3000
```

---

## 🚀 Step 5 — Deploy to Vercel

### Option A: Vercel CLI (recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from project root
vercel

# Follow prompts:
#   Set up project? Y
#   Which scope? (your account)
#   Link to existing project? N
#   Project name: sahoo-fastfood
#   Directory: ./
#   Override settings? N

# First deploy is preview. For production:
vercel --prod
```

### Option B: Vercel Dashboard (no CLI)

1. Push code to GitHub
2. Go to **vercel.com → New Project**
3. Import your GitHub repository
4. Framework: **Create React App**
5. Add Environment Variables (see below)
6. Click **Deploy**

### Environment Variables on Vercel

In Vercel Dashboard → Project → Settings → Environment Variables, add:

| Key | Value |
|-----|-------|
| `REACT_APP_ADMIN_EMAIL` | `your@gmail.com` |
| `REACT_APP_WA_NUMBER` | `918249790363` |
| `REACT_APP_WA_CHANNEL` | `https://whatsapp.com/channel/...` |

> Firebase keys are already hardcoded in `src/firebase/config.js` so no env vars needed for them.

---

## 🔐 Step 6 — Add Vercel Domain to Firebase

After deploy, copy your Vercel URL (e.g. `sahoo-fastfood.vercel.app`):

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Click **Add domain**
3. Paste your Vercel URL
4. Save

This is **required** for Google login to work in production.

---

## 📱 Features Summary

| Feature | Implementation |
|---------|---------------|
| Email Signup/Login | Firebase Auth |
| Google Login | Firebase Auth + Popup |
| Protected Routes | `ProtectedRoute.js` wrapper |
| Products (CRUD) | Firestore `products` collection |
| Product Images | Firebase Storage `products/` folder |
| Categories (CRUD) | Firestore `categories` collection |
| Orders (permanent) | Firestore `orders` collection |
| Reviews (permanent) | Firestore `reviews` collection |
| Wishlist (per user) | Stored in Firestore `users` doc |
| Cart | localStorage (persists across tabs) |
| WhatsApp Order | `utils/whatsapp.js` — opens WA with order message |
| Admin Panel | `/admin` route — Products, Orders, Categories, Reviews |
| Order Status Update | Admin dropdown → Firestore `updateDoc` |

---

## 🛠️ Common Issues

**Google login popup blocked?**
→ Add domain to Firebase Auth → Authorized Domains

**Firestore permission denied?**
→ Check `firestore.rules` is published in Firebase Console

**Images not uploading?**
→ Check `storage.rules` is published + user is admin

**Admin panel not accessible?**
→ Set `isAdmin: true` in your Firestore user document

**Blank page on Vercel?**
→ Ensure `vercel.json` is in project root (handles React Router)

---

## 📞 Support

WhatsApp: +91 8249790363
Channel: https://whatsapp.com/channel/0029VbD0z1m7DAWqhCHcUe0u
