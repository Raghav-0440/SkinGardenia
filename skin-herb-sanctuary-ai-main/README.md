# Skin Herb Sanctuary AI

A web application for analyzing skin conditions using AI and providing herbal recommendations.

## Features

- AI-powered skin condition analysis
- Personalized herbal recommendations
- Modern, responsive UI

## Architecture

The application consists of three main components:

1. **Frontend**: React application with Vite
2. **Backend**: Node.js Express server
3. **ML Service**: Python service for running the TensorFlow model

## Setup and Installation

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/skin-herb-sanctuary-ai.git
   cd skin-herb-sanctuary-ai
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

4. Install Python dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

## Running the Application

### Option 1: Using the batch script (Windows)

Simply run the `start-services.bat` script:
```
start-services.bat
```

### Option 2: Manual startup

1. Start the ML Service:
   ```
   cd backend/src
   python ml_service.py
   ```

2. Start the Node Backend:
   ```
   cd backend
   npm run dev
   ```

3. Start the Frontend:
   ```
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Go to the AI Skin Analyzer page
3. Upload an image of your skin
4. Click "Analyze Skin"
5. Wait for the analysis to complete
6. View your personalized recommendations

## API Endpoints

### Backend API

- `POST /api/analyze-skin`: Submit an image for analysis
- `GET /api/analysis-result/:requestId`: Get the result of an analysis
- `GET /health`: Health check endpoint

### ML Service API

- `POST /process`: Submit an image for processing
- `GET /result/:requestId`: Get the result of a processing request
- `GET /health`: Health check endpoint

## Troubleshooting

If you encounter any issues:

1. Make sure all services are running
2. Check the console logs for each service
3. Ensure the ML model file is in the correct location (`backend/Model/skin_conditions_model.h5`)
4. Check that all required Python packages are installed

## License

[MIT License](LICENSE)
