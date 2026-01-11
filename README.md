# Admin Panel API

A Node.js and Express.js backend API for managing products and customers, designed for an e-commerce application with image upload functionality.

## Features

- **Product Management**: CRUD operations for products (dresses) with image uploads
- **Customer Management**: Track customer information, orders, and spending
- **File Upload**: Image upload support using Multer
- **RESTful API**: Clean REST API endpoints
- **MongoDB Integration**: MongoDB database with Mongoose ODM
- **CORS Enabled**: Cross-origin resource sharing enabled for frontend integration

## Technologies Used

- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB object modeling
- **Multer**: File upload handling
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing

## Project Structure

```
pro/
├── models/
│   ├── customer.js       # Customer schema and model
│   └── Product.js        # Product schema and model
├── routes/
│   ├── customer.routes.js    # Customer API routes
│   └── product.routes.js     # Product API routes
├── uploads/              # Directory for uploaded images
├── server.js            # Main server file
└── package.json         # Project dependencies
```

## Installation

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
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:4000` (or the port specified in your `.env` file).

## API Endpoints

### Products

#### Get All Products
```
GET /api/products
```
Returns all products sorted by creation date (newest first).

#### Create Product
```
POST /api/products
Content-Type: multipart/form-data
```
Creates a new product with optional image upload.

**Request Body:**
- `dressid` (Number, required): Unique dress ID
- `dressName` (String, required): Name of the dress
- `color` (String, required): Color of the dress
- `quantity` (Number, required): Stock quantity
- `size` (String, required): Size of the dress
- `description` (String, required): Product description
- `fabricDetail` (String, optional): Fabric details
- `price` (Number, required): Product price
- `image` (File, optional): Product image

### Customers

#### Get All Customers
```
GET /api/customers
```
Returns all customers sorted by creation date (newest first).

#### Create Customer
```
POST /api/customers
Content-Type: application/json
```
Creates a new customer.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "orders": 5,
  "spent": 500.00,
  "joinDate": "2024-01-01"
}
```

## Models

### Product Schema
- `dressid` (Number, required, unique): Unique dress identifier
- `dressName` (String, required): Name of the dress
- `color` (String, required): Color
- `quantity` (Number, required, min: 0): Stock quantity
- `size` (String, required): Size
- `description` (String, required): Description
- `fabricDetail` (String): Fabric details
- `price` (Number, required): Price
- `image` (String): Image filename
- `createdAt` (Date): Creation timestamp
- `updatedAt` (Date): Last update timestamp

### Customer Schema
- `name` (String, required): Customer name
- `email` (String, required, unique): Customer email
- `orders` (Number, default: 0): Number of orders
- `spent` (Number, default: 0): Total amount spent
- `joinDate` (Date, default: Date.now): Join date
- `createdAt` (Date): Creation timestamp
- `updatedAt` (Date): Last update timestamp

## File Uploads

Product images are uploaded to the `uploads/` directory and served statically at `/uploads/:filename`. Images are automatically renamed with a timestamp to prevent naming conflicts.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 4000) | No |

## Development

### Running the Server
```bash
npm start
```

### Dependencies
- express: ^5.2.1
- mongoose: ^9.0.1
- multer: ^2.0.2
- cors: ^2.8.5
- dotenv: ^17.2.3

## License

ISC

