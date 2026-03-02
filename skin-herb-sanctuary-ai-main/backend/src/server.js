require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { analyzeSkin, getAnalysisResult } = require('./controllers/skinAnalysisController');
const morgan = require('morgan');
const path = require('path');
const skinAnalysisRoutes = require('./routes/skinAnalysisRoutes');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Initialize global prediction results storage
global.predictionResults = {};

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(morgan('dev')); // Logging
app.use(cors({
  origin: '*', // Allow all origins for testing; restrict in production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueId = uuidv4();
    cb(null, `${uniqueId}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Routes
app.post('/api/analyze-skin', upload.single('image'), analyzeSkin);
app.post('/api/predict', upload.single('image'), analyzeSkin); // New endpoint for the new model format
app.get('/api/analysis-result/:requestId', getAnalysisResult);
app.use('/api/skin-analysis', skinAnalysisRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Check if this is an axios error with a response
  if (err.isAxiosError && err.response) {
    console.error('API Error Response:', {
      status: err.response.status,
      data: JSON.stringify(err.response.data).substring(0, 500)
    });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message || 'Unknown error occurred'
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`Skin analysis API available at http://localhost:${PORT}/api/skin-analysis`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Give the server time to finish handling requests before shutting down
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;