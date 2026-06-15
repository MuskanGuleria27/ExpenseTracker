require('dotenv').config();

// ✅ ADD THESE TWO LINES HERE 👇
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("https://expensetracker-ls4.onrender.com/api/v1/auth",authRoutes);
app.use("https://expensetracker-ls4.onrender.com/api/v1/income",incomeRoutes);
app.use("https://expensetracker-ls4.onrender.com/api/v1/expense",expenseRoutes);
app.use("https://expensetracker-ls4.onrender.com/api/v1/dashboard",dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});