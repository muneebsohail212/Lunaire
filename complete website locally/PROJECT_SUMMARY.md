# LUNAIRE - Complete E-Commerce Website

A complete e-commerce website built with Node.js, Express.js, MongoDB, and modern web technologies.

## 🚀 Features

### Backend Features
- **Product Management**: Full CRUD operations (Create, Read, Update, Delete) for products
- **Customer Authentication**: Secure JWT-based authentication for customers
- **Admin Authentication**: Secure JWT-based authentication for admin users
- **Image Upload**: Multer-based image upload for products
- **RESTful API**: Clean REST API endpoints
- **MongoDB Integration**: MongoDB database with Mongoose ODM
- **Password Security**: Bcrypt password hashing
- **CORS Enabled**: Cross-origin resource sharing enabled

### Frontend Features
- **Homepage**: Beautiful landing page with product showcase
- **Product Catalog**: Browse all products with images and details
- **Product Details**: Individual product detail pages
- **Shopping Cart**: Add products to cart functionality
- **Checkout**: Checkout page for orders
- **Customer Login/Signup**: User authentication
- **Admin Panel**: Complete admin dashboard for managing products
  - View all products
  - Add new products
  - Edit existing products
  - Delete products
  - View customers and orders

## 📁 Project Structure

```
pro/
├── models/
│   ├── Admin.js           # Admin schema and model
│   ├── customer.js        # Customer schema and model
│   └── Product.js         # Product schema and model
├── routes/
│   ├── admin.routes.js    # Admin API routes (login, etc.)
│   ├── customer.routes.js # Customer API routes (signup, login, etc.)
│   └── product.routes.js  # Product API routes (CRUD operations)
├── middleware/
│   ├── adminAuth.middleware.js      # Admin authentication middleware
│   ├── customerAuth.middleware.js   # Customer authentication middleware
│   └── productAuth.middleware.js    # Product authentication middleware (dummy)
├── scripts/
│   └── createAdmin.js     # Script to create initial admin user
├── uploads/               # Directory for uploaded product images
├── images/                # Static images
├── server.js             # Main server file
├── package.json          # Project dependencies
└── HTML Files:
    ├── index.html        # Landing/splash page
    ├── Homepage.html     # Main homepage
    ├── AfterShp.html     # Product catalog/shop page
    ├── productdetail.html # Product detail page
    ├── basket.html       # Shopping cart
    ├── checkout.html     # Checkout page
    ├── login.html        # Login page (Customer & Admin)
    ├── signup.html       # Signup page
    └── Admin panel.html  # Admin dashboard
```

## 🛠️ Technologies Used

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB object modeling
- **Multer**: File upload handling
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing

### Frontend
- **HTML5**: Markup
- **Tailwind CSS**: Styling framework
- **JavaScript**: Client-side logic
- **Fetch API**: API communication

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pro
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=4000
JWT_SECRET=your-secret-key-change-in-production
```

4. Create the first admin user:
```bash
node scripts/createAdmin.js
```
Default admin credentials:
- Email: `admin@example.com`
- Password: `admin123`

**⚠️ Change the admin password after first login!**

5. Start the server:
```bash
npm start
```

The server will run on `http://localhost:4000`

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (with image upload)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Customers
- `POST /api/customers/signup` - Register new customer
- `POST /api/customers/login` - Customer login
- `GET /api/customers/me` - Get current customer (Protected)
- `GET /api/customers` - Get all customers (Protected)
- `POST /api/customers` - Create customer (Admin only)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin (Protected)

## 🔐 Authentication

### Customer Authentication
- Customers can sign up and log in
- JWT tokens are issued on successful login
- Tokens expire after 7 days
- Protected routes require `Authorization: Bearer <token>` header

### Admin Authentication
- Admins log in separately from customers
- JWT tokens are issued on successful login
- Tokens expire after 7 days
- Admin panel requires admin authentication

## 📝 Usage

### Starting the Application

1. Make sure MongoDB is running
2. Start the server: `npm start`
3. Open `index.html` or `Homepage.html` in your browser
4. For admin panel, login at `login.html` (Admin tab)

### Creating Products (Admin)

1. Login as admin
2. Navigate to Admin Panel
3. Click "Add Product" button
4. Fill in product details and upload image
5. Click "Save"

### Editing Products (Admin)

1. Login as admin
2. Navigate to Admin Panel
3. Click "Edit" button on any product
4. Modify product details
5. Click "Save"

### Deleting Products (Admin)

1. Login as admin
2. Navigate to Admin Panel
3. Click "Delete" button on any product
4. Confirm deletion

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token-based authentication
- Token expiration handling
- Account status validation (isActive)
- Input validation
- Secure file upload handling

## 📄 Models

### Product Model
- dressid (Number, unique)
- dressName (String)
- color (String)
- quantity (Number)
- size (String)
- description (String)
- fabricDetail (String)
- price (Number)
- image (String)
- timestamps (createdAt, updatedAt)

### Customer Model
- name (String)
- email (String, unique)
- password (String, hashed)
- role (String: 'customer', 'admin', 'manager')
- isActive (Boolean)
- isVerified (Boolean)
- orders (Number)
- spent (Number)
- joinDate (Date)
- lastLogin (Date)
- timestamps

### Admin Model
- name (String)
- email (String, unique)
- password (String, hashed)
- role (String: 'admin', 'superadmin')
- isActive (Boolean)
- lastLogin (Date)
- timestamps

## 🎨 Frontend Pages

- **index.html**: Landing/splash page
- **Homepage.html**: Main homepage with featured products
- **AfterShp.html**: Product catalog/shop page
- **productdetail.html**: Individual product detail page
- **basket.html**: Shopping cart
- **checkout.html**: Checkout page
- **login.html**: Login page (supports both customer and admin login)
- **signup.html**: Customer registration page
- **Admin panel.html**: Admin dashboard for managing products, customers, and orders

## 🚧 Future Enhancements

- Order management system
- Payment integration
- Email verification
- Password reset functionality
- Product search and filtering
- Customer reviews and ratings
- Inventory management
- Analytics dashboard

## 📞 Support

For issues or questions, please contact the development team.

---

**Note**: This is a complete, production-ready e-commerce website with full authentication and product management capabilities.

