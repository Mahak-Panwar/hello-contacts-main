const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');

const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS to allow frontend (if needed for dev)
// configure origins accordingly in production
app.use(
  cors({
    origin: "http://localhost:3000", // tumhara frontend origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
    credentials: false, // agar cookies bhejni hain to true
  })
);


// Body parser - parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
// app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));

// Serve frontend static files (assuming React build in /frontend/build)
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, 'build');
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(frontendBuildPath, 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Middleware - error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);