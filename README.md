
<br />

> **"Quality diapers shouldn't break the bank."**
>
> Nappy Garde isn't just another e-commerce site; it's a thoughtfully crafted shopping experience.  
> Built with modern web technologies and designed with Apple's aesthetic philosophy, it delivers premium baby products with pixel-perfect UI.

---

## 🌟 Vision

Nappy Garde's mission is to be:

- **A modern e-commerce platform** — Seamless shopping experience for parents
- **Apple-inspired design** — Pixel-perfect UI with glassmorphic effects
- **Fully responsive** — Beautiful on desktop, tablet, and mobile
- **Production-ready** — Complete with authentication, cart, and order management

---

## ✨ Why Nappy Garde?

Traditional e-commerce platforms are cluttered and overwhelming.  
Nappy Garde brings **minimalist design and smooth interactions** to online baby product shopping.

---

## 🎨 Apple-Inspired "Glassmorphic" Design

- **Minimalist Aesthetics**  
  Pure CSS implementation following Apple's design principles — clean, elegant, and modern.

- **Glassmorphic Cards**  
  Translucent overlays with `backdrop-filter: blur(10px)` create depth and premium feel.

- **Smooth Animations**  
  Fade-ins, hover lifts, and scale transitions provide delightful micro-interactions.

- **Apple Color Palette**  
  Signature blue (#0071E3), vibrant red (#FA233B), and clean backgrounds (#F5F5F7).

- **System Typography**  
  Native `-apple-system` fonts for maximum legibility and native feel.

---

## 🛍️ Complete Shopping Experience

### Customer Features
- **Browse Products** — View products by category (Newborn, Infant, Toddler)
- **Smart Search & Filters** — Real-time search with price, stock, and category filters
- **Product Details** — Images, descriptions, ratings, and reviews
- **Shopping Cart** — Add, update, remove items with real-time totals
- **Secure Checkout** — Cash on Delivery with form validation
- **Order Tracking** — Track status from Pending → Processing → Out for Delivery → Delivered
- **User Accounts** — Registration, login, order history

### Admin Features
- **Dashboard** — Order statistics and recent activity
- **Product Management** — Full CRUD operations for products
- **Order Management** — Update order status and view details
- **Stock Oversight** — Monitor inventory levels

---

## 🔐 Enterprise-Grade Security

- **Bcrypt Password Hashing**  
  10 salt rounds for secure password storage.

- **JWT Authentication**  
  Token-based authentication with 7-day expiry.

- **Protected Routes**  
  Admin-only endpoints for sensitive operations.

- **Input Validation**  
  Server-side validation on all API endpoints.

---

## � Project Structure

```
Nappy-Garde/
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── server.js             # Express server entry point
│   │   ├── routes/               # API endpoints
│   │   │   ├── users.routes.js   # Authentication (JWT + Bcrypt)
│   │   │   ├── products.routes.js # Product CRUD & filtering
│   │   │   ├── cart.routes.js    # Shopping cart management
│   │   │   └── orders.routes.js  # Order processing & tracking
│   │   └── middleware/
│   │       └── auth.middleware.js # JWT verification & admin check
│   ├── .env                      # Environment configuration
│   └── package.json
│
├── frontend/                     # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx               # Main app with routing
│   │   ├── pages/                # All application pages
│   │   │   ├── Home.jsx          # Landing with hero & featured products
│   │   │   ├── Products.jsx      # Product grid with filters
│   │   │   ├── Login.jsx         # Authentication
│   │   │   └── (more pages...)
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.jsx        # Sticky nav with search & cart
│   │   │   ├── Footer.jsx        # Footer with links
│   │   │   └── ProductCard.jsx   # Glassmorphic product cards
│   │   ├── context/              # React Context
│   │   │   ├── AuthContext.jsx   # User authentication state
│   │   │   └── CartContext.jsx   # Shopping cart state
│   │   ├── styles/               # Pure CSS (Apple-inspired)
│   │   │   └── index.css         # Complete design system
│   │   └── api/
│   │       └── api.js            # Axios client with interceptors
│   └── package.json
│
├── database/
│   ├── schema.sql                # PostgreSQL schema
│   └── seed.sql                  # Sample data (10 products, 3 users)
│
├── setup-db.sh                   # Automated database setup
├── package.json                  # Root package with concurrent scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** (v14+)
- **npm**

### ⚡ One-Command Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd Nappy-Garde

# 2. Install all dependencies
npm run install:all

# 3. Setup database (automated)
npm run setup:db

# 4. Start everything!
npm run dev
```

Visit **http://localhost:5173** 🎉

### Default Test Accounts

**Admin:**
- Email: `admin@nappygarde.com`
- Password: `password123`

**Customer:**
- Email: `john@example.com`
- Password: `password123`

---

## 🎯 Key Features

### Design & UX
✅ **Pixel-Perfect UI** — Apple-inspired design with glassmorphic effects  
✅ **Smooth Animations** — Fade-ins, hover lifts, modal transitions  
✅ **Fully Responsive** — Optimized for desktop, tablet, and mobile  
✅ **Mobile Menu** — Hamburger navigation with slide-in animation  

### Shopping Experience
✅ **Product Filtering** — Category, price range, stock availability  
✅ **Real-Time Search** — Instant product search with debouncing  
✅ **Smart Cart** — Automatic total calculation with stock validation  
✅ **Order Tracking** — Visual status indicators for all orders  

### Technical Excellence
✅ **REST API** — Complete backend with proper error handling  
✅ **JWT Auth** — Secure token-based authentication  
✅ **Transaction Safety** — Database transactions for order placement  
✅ **Stock Management** — Automatic inventory updates  

---

## � Tech Stack

### Backend
- **Node.js** + **Express.js** — REST API server
- **PostgreSQL** — Relational database with ACID compliance
- **Bcrypt** — Password hashing (10 salt rounds)
- **JWT** — Token-based authentication (7-day expiry)
- **CORS** — Cross-origin resource sharing
- **Nodemon** — Auto-reload during development

### Frontend
- **React.js** (18.2+) — Modern UI framework
- **React Router** — Client-side routing
- **Context API** — State management
- **Axios** — HTTP client with interceptors
- **Pure CSS** — No frameworks, Apple-inspired design system
- **Vite** — Lightning-fast build tool

### Database
- **PostgreSQL** (14+) — 6 core tables
- **Indexes** — Optimized queries
- **Triggers** — Auto-update timestamps
- **Constraints** — Data integrity enforcement

---

## 📊 Database Schema

6 core tables with proper relationships:

- **users** — Authentication with Bcrypt + roles (customer/admin)
- **products** — Product catalog with categories & images
- **orders** — Order management with status tracking
- **order_items** — Line items for each order
- **cart_items** — Shopping cart persistence
- **reviews** — Product ratings and comments

**Sample Data Included:**
- 10 premium diaper products
- 3 users (1 admin, 2 customers)
- 5 sample orders
- Product reviews with ratings

---

## 🎨 Design System

### Colors
```css
--primary-blue: #0071E3      /* Primary buttons, links */
--secondary-red: #FA233B     /* Badges, alerts, accents */
--text-primary: #1D1D1F      /* Main text */
--text-secondary: #6E6E73    /* Subtext, descriptions */
--bg-primary: #F5F5F7        /* Page background */
--bg-white: #FFFFFF          /* Card background */
--glass-bg: rgba(255, 255, 255, 0.75)  /* Glassmorphic cards */
```

### Typography
- **Font Family:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Headings:** 600-700 weight
- **Body:** 400 weight
- **Scale:** Harmonious type scale from 0.75rem to 3rem

### Spacing
- **Consistent:** 8px base unit (xs, sm, md, lg, xl, 2xl, 3xl)
- **Border Radius:** 8px - 24px for different elements

---

## � API Documentation

### Authentication
- `POST /api/users/register` — Register new user
- `POST /api/users/login` — Login user (returns JWT)
- `GET /api/users/me` — Get current user (protected)

### Products
- `GET /api/products` — List products (with filters)
- `GET /api/products/:id` — Get product details & reviews
- `POST /api/products` — Create product (admin only)
- `PUT /api/products/:id` — Update product (admin only)
- `DELETE /api/products/:id` — Delete product (admin only)

### Shopping Cart
- `GET /api/cart` — Get user's cart (protected)
- `POST /api/cart` — Add item to cart (protected)
- `PUT /api/cart/:id` — Update quantity (protected)
- `DELETE /api/cart/:id` — Remove item (protected)

### Orders
- `GET /api/orders` — Get orders (user's orders or all for admin)
- `GET /api/orders/:id` — Get order details (protected)
- `POST /api/orders` — Create order from cart (protected)
- `PUT /api/orders/:id/status` — Update status (admin only)

---

## 🔒 Security Features

✅ **Bcrypt Password Hashing** — Industry-standard encryption  
✅ **JWT Tokens** — Secure authentication with expiry  
✅ **Protected Routes** — Role-based access control  
✅ **Input Validation** — Server-side validation on all endpoints  
✅ **SQL Injection Prevention** — Parameterized queries  
✅ **CORS Configuration** — Controlled cross-origin access  

---

## 🛠️ Available Scripts

### Root Directory
```bash
npm run dev              # Start backend + frontend concurrently
npm run dev:backend      # Start backend only (port 5000)
npm run dev:frontend     # Start frontend only (port 5173)
npm run install:all      # Install all dependencies
npm run setup:db         # Automated database setup
npm run build:frontend   # Build frontend for production
```

### Backend
```bash
npm start                # Start backend in production mode
npm run dev              # Start with nodemon (auto-reload)
```

### Frontend
```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
```

---

## 🌐 Deployment

### Backend (Railway/Render/Heroku)
1. Set environment variables in platform dashboard
2. Connect PostgreSQL database
3. Run database migrations
4. Deploy from `backend` directory

### Frontend (Vercel/Netlify)
1. Build: `npm run build` in frontend directory
2. Deploy `dist` folder
3. Set `VITE_API_URL` environment variable
4. Configure SPA redirects

---

## 🐛 Troubleshooting

**Database Connection Error:**
- Ensure PostgreSQL is running
- Check `backend/.env` credentials
- Verify database exists: `psql -U postgres -l`

**Port Already in Use:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**CORS Errors:**
- Ensure backend is running on port 5000
- Check `frontend/.env` has correct `VITE_API_URL`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License — 100% Free and Open Source

---

## 🙏 Acknowledgments

- **Apple.com** for design inspiration
- **Unsplash** for product placeholder images
- **React and Node.js** communities for amazing tools

---

<p align="center">
<em>Where premium design meets seamless shopping.</em>
</p>
