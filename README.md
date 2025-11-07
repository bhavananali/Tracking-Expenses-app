# Expense Tracker - MERN Stack Application

A full-stack Expense Tracker web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, CRUD operations, and data visualization.

## 🚀 Features

### Core Features
- **User Authentication** - JWT-based login/signup system
- **Expense Management** - Full CRUD operations (Create, Read, Update, Delete)
- **Expense Fields** - Title, Amount, Category, Date, Description
- **Dashboard** - Overview with total expenses and category-wise summary
- **Responsive Design** - Mobile-first responsive design

### Advanced Features
- **Advanced Filtering** - Search by title, filter by category and date range
- **Data Visualization** - Interactive charts using Chart.js
- **Category Management** - Predefined categories with color coding
- **Form Validation** - Comprehensive client and server-side validation
- **Error Handling** - Robust error handling throughout the application

## 🛠️ Tech Stack

### Frontend
- **React.js** - Frontend framework
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure
```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── expense.js
│   │   └── user.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── expense.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── expense.routes.js
│   │   ├── index.js
│   │   └── user.routes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AddExpense.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Statistics.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
└── README.md
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

### Backend Setup
```bash
cd backend
npm install
```

#### Environment Variables (Backend)
Create a `.env` file in the backend directory:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Frontend Setup
```bash
cd ../frontend
npm install
```

#### Environment Variables (Frontend)
Create a `.env` file in the frontend directory:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Running the Application
#### Start the Backend Server
```bash
cd backend
npm run dev
```
Server will run on [http://localhost:5000](http://localhost:5000)

#### Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
Client will run on [http://localhost:3000](http://localhost:3000)

## 📚 API Endpoints

### Authentication Routes
- **POST** `/api/users/register` - Register a new user
- **POST** `/api/users/login` - Login user
- **GET** `/api/users/profile` - Get user profile (Protected)

### Expense Routes (All Protected)
- **GET** `/api/expenses` - Get all expenses (with filtering)
- **GET** `/api/expenses/:id` - Get single expense
- **POST** `/api/expenses` - Create new expense
- **PUT** `/api/expenses/:id` - Update expense
- **DELETE** `/api/expenses/:id` - Delete expense
- **GET** `/api/expenses/statistics/summary` - Get expense statistics

## 🎨 Features Overview

### Dashboard
- Total expenses summary
- Recent transactions
- Category-wise spending breakdown
- Quick access to add new expenses

### Expense Management
- Add new expenses with form validation
- Edit existing expenses
- Delete expenses with confirmation
- Advanced filtering and search
- Responsive table and card views

### Statistics
- Interactive charts (Bar, Doughnut, Line)
- Category-wise spending visualization
- Monthly trends
- Time-based filtering

### User Experience
- Mobile-responsive design
- Loading states and error handling
- Intuitive navigation
- Professional UI/UX

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration

## 🤝 Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
This project is licensed under the **MIT License**.

## 👨‍💻 Author
**Avinash** - *Full Stack Developer*
