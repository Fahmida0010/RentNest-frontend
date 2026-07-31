# 🏠 RentNest

> **Find & List Rental Properties with Ease**

A modern **full-stack rental property marketplace** where tenants can discover rental homes, landlords can manage property listings, and admins can oversee the entire platform. The application provides secure authentication, rental request management, online payment integration, and role-based dashboards.

---

## 🌐 Live Demo

🔗 **Frontend:** 

🔗 **Backend API:** https://rentnestb.vercel.app

---

## 📂 GitHub Repository

### Frontend
https://github.com/Fahmida0010/RentNest-frontend.git

### Backend
https://github.com/Fahmida0010/RentNest-backend.git

---

# 📖 Project Overview

RentNest is a modern full-stack rental marketplace built with **Next.js**, **Node.js**, **Express**, **PostgreSQL**, and **Prisma**.

The platform supports three different user roles:

- 👤 Tenant
- 🏠 Landlord
- 🛡️ Admin

Each role has its own dashboard, permissions, and features.

Landlords can create rental listings, manage requests, and monitor tenants.

Tenants can search properties, submit rental requests, complete secure online payments, and leave reviews.

Admins can manage users, listings, rental requests, and categories.

---

# ✨ Key Features

## 🌍 Public

- Browse rental properties
- Property details page
- Search properties
- Filter by

  - Location
  - Price
  - Property Type
  - Amenities

- Featured properties
- Responsive UI

---

## 👤 Tenant

- Registration & Login
- JWT Authentication
- Browse Properties
- Submit Rental Request
- View Request History
- Online Payment
- Payment History
- Leave Reviews
- Update Profile

---

## 🏠 Landlord

- Property CRUD
- Upload Property Images
- Update Availability
- View Incoming Requests
- Approve Requests
- Reject Requests
- View Tenant Information
- Dashboard Analytics

---

## 🛡️ Admin

- Manage Users
- Ban / Unban Users
- Manage Categories
- Moderate Listings
- View All Rental Requests
- Dashboard Statistics

---

# 🔒 Authentication

- JWT Authentication
- Role Based Authorization
- Protected Routes
- Password Hashing (bcrypt)

---

# 💳 Payment

- SSLCommerz Integration

Features:

- Payment Session
- Payment Verification
- Payment History
- Transaction Tracking

---

# 🛠 Tech Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Axios
- TanStack Query
- React Hook Form
- Zod
- Framer Motion
- Lucide React
- Sonner
- JWT Decode

---

## Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod
- SSLCommerz
- Cloudinary
- Multer
- Cookie Parser
- CORS
- Dotenv

---

## Database

- PostgreSQL
- Prisma ORM

---

# 🗂 Project Structure

## Frontend

```
src
│
├── app
├── components
├── providers
├── services
├── hooks
├── lib
├── types
├── utils
├── constants
├── middleware.ts
└── assets
```

---

## Backend

```
src
│
├── app
│   ├── modules
│   ├── middleware
│   ├── routes
│   ├── config
│   ├── utils
│   ├── errors
│   ├── helpers
│   ├── interfaces
│   └── builder
│
├── prisma
├── app.ts
└── server.ts
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Fahmida0010/RentNest-backend.git
```

```
cd rentnest-server
```

Install dependencies

```bash
npm install
```

Create .env

```env
PORT=5000

DATABASE_URL=

JWT_ACCESS_SECRET=

JWT_ACCESS_EXPIRES_IN=7d

BCRYPT_SALT_ROUNDS=12

SSL_STORE_ID=

SSL_STORE_PASSWORD=

SSL_PAYMENT_API=

SSL_VALIDATION_API=
```

Generate Prisma Client

```bash
npx prisma generate
```

Push Database

```bash
npx prisma db push
```

Run Development

```bash
npm run dev
```

---

# 📚 API Documentation

- Authentication
- Properties
- Categories
- Rental Requests
- Payments
- Reviews
- Admin

API Documentation available using:

- Swagger
- Postman Collection

---

# ✅ Validation

- Zod Validation
- Global Error Handler
- Structured Error Response

Example

```json
{
  "success": false,
  "message": "Validation Error",
  "errorDetails": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

# 👥 User Roles

| Role | Permissions |
|------|-------------|
| Tenant | Browse, Rent, Pay, Review |
| Landlord | Manage Properties & Requests |
| Admin | Manage Entire Platform |

---

# 📦 Future Improvements

- Wishlist
- Notifications
- Email Verification
- Forgot Password
- Google Authentication
- Property Map
- Chat System
- Analytics Dashboard



⭐ If you like this project, consider giving it a star!