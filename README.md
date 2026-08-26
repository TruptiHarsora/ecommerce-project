# 🛒 E-Commerce Platform

A full-stack e-commerce platform built with **React, Node.js, Express.js, and MongoDB**.

The application provides separate role-based experiences for **customers, sellers, and administrators**, including product management, shopping cart, orders, reviews, wishlist, seller management, and an admin dashboard.

---

## ✨ Features

### 👤 Customer

* User registration and login
* Authentication and protected routes
* User profile management
* Change password
* Product browsing
* Product details
* Product categories
* Shopping cart
* Wishlist
* Checkout
* Order placement
* Order history
* Order details
* Product reviews and ratings
* Review management

### 🏪 Seller

* Seller registration and management
* Seller profile
* Seller dashboard
* Product management
* Create products
* Update products
* Seller product listing
* Seller order management
* Review management

### 👨‍💼 Admin

* Admin dashboard
* User management
* Seller management
* Product management
* Category management
* Order management
* Review management
* Dashboard statistics
* Role-based access control

### 🔐 Security & Validation

* Authentication middleware
* Role-based authorization
* Protected routes
* Request validation
* Product validation
* Query validation
* Rate limiting
* Review ownership validation
* Product ownership validation
* Seller verification

### ☁️ File & Image Management

* Cloudinary image uploads
* Image compression
* Cloudinary file deletion
* File upload middleware

---

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript
* Vite
* Redux Toolkit
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* JavaScript
* REST API
* JWT Authentication

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### Services

* Cloudinary — image storage and management
* Email service — email functionality

### Deployment

* GitHub
* Render
* MongoDB Atlas

---

## 📁 Project Structure

```text
e-commerce/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── guards/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── category/
│   │   │   ├── order/
│   │   │   ├── products/
│   │   │   ├── review/
│   │   │   ├── seller/
│   │   │   ├── user/
│   │   │   └── wishlist/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── store/
│   │   │   └── slices/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── validators/
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── config.js
│   │   ├── db.js
│   │   └── email.config.js
│   │
│   ├── controllers/
│   │   ├── admin/
│   │   └── seller/
│   │
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── src/
│   │   ├── app.js
│   │   └── server.js
│   ├── utils/
│   ├── validators/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🏗️ Architecture

The application follows a client-server architecture.

```text
                    ┌──────────────────┐
                    │   React Client   │
                    │      Vite        │
                    └────────┬─────────┘
                             │
                             │ REST API
                             ▼
                    ┌──────────────────┐
                    │ Node.js +        │
                    │ Express Server   │
                    └────────┬─────────┘
                             │
                ┌────────────────────────┼
                │                        │            
                ▼                        ▼            
          ┌──────────┐             ┌──────────┐ 
          │ MongoDB  │             │Cloudinary│ 
          │          │             │          │ 
          └──────────┘             └──────────┘ 
```

---

## 🔄 Application Roles

The application supports three main roles.

### 👤 Customer

```text
Customer
   │
   ├── Browse products
   ├── Product details
   ├── Cart
   ├── Wishlist
   ├── Checkout
   ├── Orders
   └── Reviews
```

### 🏪 Seller

```text
Seller
   │
   ├── Seller dashboard
   ├── Manage products
   ├── Manage orders
   ├── Seller profile
   └── Manage reviews
```

### 👨‍💼 Admin

```text
Admin
   │
   ├── Dashboard
   ├── Users
   ├── Sellers
   ├── Products
   ├── Categories
   ├── Orders
   └── Reviews
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/TruptiHarsora/ecommerce-project.git
```

Then navigate to the project:

```bash
cd ecommerce-project
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=3000

FRONTEND_ORIGIN=

DB_URL=
DB_NAME=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES=
JWT_REFRESH_EXPIRES=

API_KEY=
API_SECRET=

CLOUD_NAME=

CGST=0.09
SGST=0.09
IGST=0.18
```

## ▶️ Running the Application

### Start the backend

Navigate to the server directory:

```bash
cd server
```

Run the development server:

```bash
npm run dev
```

Or, if your project uses the production start script:

```bash
npm start
```

### Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will display the local frontend URL in the terminal.

---

## 🔌 API Modules

The backend is organized into separate route and controller modules.

| Module     | Purpose                             |
| ---------- | ----------------------------------- |
| Auth       | Registration and authentication     |
| Users      | User profile and account management |
| Products   | Product management                  |
| Categories | Product category management         |
| Cart       | Shopping cart                       |
| Orders     | Checkout and order management       |
| Reviews    | Product reviews and ratings         |
| Wishlist   | Wishlist management                 |
| Sellers    | Seller management                   |
| Admin      | Administrative operations           |

---

## 🧩 Frontend Architecture

The frontend is organized using reusable components, pages, services, hooks, contexts, Redux slices, route guards, and validators.

### State Management

Redux Toolkit is used to manage application state including:

* Cart
* Orders
* Products
* Reviews
* Sellers
* Users
* Wishlist

### Route Protection

The application includes role-based route protection:

* `ProtectedRoutes`
* `AdminRoutes`
* `SellerRoutes`
* `RoleRoute`

These route guards help prevent unauthorized users from accessing protected functionality.

---

## ☁️ Image Management

Product and other uploaded images are handled using **Cloudinary**.

The backend includes utilities for:

* Uploading images
* Compressing images
* Deleting images from Cloudinary
* File upload handling
* File validation

---

## 🧪 Validation & Middleware

The backend uses multiple middleware layers for security, authorization, validation, and request processing.

Examples include:

* Authentication
* Role authorization
* Request validation
* Product validation
* Query validation
* Rate limiting
* File upload validation
* Product ownership checks
* Review ownership checks
* Seller verification
* Request body parsing

---

## 📊 Audit Logging

The application includes audit logging functionality for tracking important administrative or system actions.

---

## 📸 Screenshots

### * Home page
  
<img width="1654" height="2618" alt="HomePage" src="https://github.com/user-attachments/assets/1eb20b25-36c6-4f84-b964-aeb1ead78b30" />

### * Product listing
  
<img width="1654" height="2097" alt="Products" src="https://github.com/user-attachments/assets/e318d5d7-f511-4510-bc80-5ec3f4a44909" />

### * Product details
  
<img width="1654" height="2079" alt="ProductDetails" src="https://github.com/user-attachments/assets/a9d8c7b8-5a09-4195-9b82-bfb398f1c2a3" />

### * Shopping cart
<img width="1654" height="1176" alt="Cart" src="https://github.com/user-attachments/assets/5c3e47e7-ca31-4bad-9dc8-646648bb18d6" />
  
### * Checkout
<img width="1654" height="1251" alt="CheckoutPage" src="https://github.com/user-attachments/assets/8617e1fd-d80e-4e6b-8277-dffbdbacdc8f" />

### * Customer profile
  
<img width="1654" height="1251" alt="UserProfile" src="https://github.com/user-attachments/assets/c3040510-68a5-4122-a3c3-b38dfcb2fb79" />
  
### * Seller dashboard
  
<img width="1669" height="953" alt="SellerPanel" src="https://github.com/user-attachments/assets/dd912e4b-a469-41bc-a26c-04f8c323f8b5" />

### * Admin dashboard
  
<img width="1669" height="953" alt="AdminPanel" src="https://github.com/user-attachments/assets/cb3186df-836d-4b82-844b-97ac4ac8be67" />


---

## 🌐 Deployment

### Frontend

Coming soon.

### Backend

Deployed using **Render**.

### Database

MongoDB Atlas.

---

## 📚 What I Learned

Through this project, I worked with:

* Full-stack application development
* React component architecture
* Node.js and Express.js
* REST API development
* MongoDB database design
* Authentication and authorization
* Role-based access control
* Redux Toolkit
* API integration
* Cloudinary file management
* Middleware architecture
* Form and request validation
* Route protection
* File upload handling
* Application deployment

---

## 👨‍💻 Author

**Trupti Harsora**

GitHub: [TruptiHarsora](https://github.com/TruptiHarsora)

---

## 📄 License

This project was created for learning and portfolio purposes.
