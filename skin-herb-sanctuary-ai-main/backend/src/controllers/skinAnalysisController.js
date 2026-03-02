const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const fsPromises = require('fs').promises;

// Helper to send error responses
const sendErrorResponse = (res, statusCode, message) => {
  console.error(message);
  res.status(statusCode).json({ error: message });
};

// Helper function to clean up temporary files
const cleanupFile = async (filePath) => {
    try {
        await fsPromises.unlink(filePath);
    } catch (error) {
        console.error('Error cleaning up file:', error);
    }
};

// Helper function to classify condition type
const isHighRiskCondition = (conditionName) => {
    const highRiskConditions = ['Carcinoma'];
    return highRiskConditions.includes(conditionName);
};

const isBenignCondition = (conditionName) => {
    const benignConditions = ['Acne', 'Eczema', 'Keratosis', 'Milia', 'Rosacea'];
    return benignConditions.includes(conditionName);
};

// Helper function to generate appropriate decision message
const generateDecisionMessage = (topPredictions, confidence, topConfidence) => {
    // Only return "Unable to analyze" if there are truly no predictions
    // Low confidence with valid predictions should still show results
    if (!topPredictions || topPredictions.length === 0 || 
        (topPredictions.length > 0 && topPredictions[0].condition === 'Unknown' && topPredictions[0].probability === 0)) {
        return {
            message: "Unable to analyze image clearly. Please try with a different image.",
            tone: "neutral",
            requiresReview: false
        };
    }

    const topPrediction = topPredictions[0];
    const topCondition = topPrediction.condition || topPrediction.class || 'Unknown';
    const topProbability = topPrediction.probability || topPrediction.confidence || 0;
    
    const isHighRisk = isHighRiskCondition(topCondition);
    const isBenign = isBenignCondition(topCondition);
    
    // Check if any high-risk condition appears in top predictions with significant probability
    const highRiskInTop = topPredictions.some(p => {
        const cond = p.condition || p.class || '';
        const prob = p.probability || p.confidence || 0;
        return isHighRiskCondition(cond) && prob > 0.15; // 15% threshold for high-risk
    });
    
    // High-risk conditions: conservative approach
    if (isHighRisk) {
        if (topProbability > 0.7) {
            return {
                message: "Some features appear consistent with a condition that requires professional evaluation. Please consult a dermatologist.",
                tone: "caution",
                requiresReview: true
            };
        } else if (topProbability > 0.4) {
            return {
                message: "Some visual patterns may warrant professional review. Consider consulting a healthcare provider.",
                tone: "neutral",
                requiresReview: true
            };
        } else {
            return {
                message: "Based on visual patterns, this appears most likely benign. If you have concerns, consult a healthcare provider.",
                tone: "reassuring",
                requiresReview: false
            };
        }
    }
    
    // High-risk condition in top predictions but not first
    if (highRiskInTop && !isHighRisk) {
        const highRiskPred = topPredictions.find(p => {
            const cond = p.condition || p.class || '';
            return isHighRiskCondition(cond);
        });
        const highRiskProb = highRiskPred ? (highRiskPred.probability || highRiskPred.confidence || 0) : 0;
        
        if (highRiskProb > 0.3) {
            return {
                message: "Multiple conditions are possible. Some features may benefit from professional review.",
                tone: "neutral",
                requiresReview: true
            };
        }
    }
    
    // Benign conditions: reassuring approach
    if (isBenign) {
        if (topProbability > 0.7) {
            return {
                message: "Appears most likely consistent with a benign condition. If symptoms persist or worsen, consider consulting a healthcare provider.",
                tone: "reassuring",
                requiresReview: false
            };
        } else if (topProbability > 0.4) {
            return {
                message: "Most likely a benign condition, though visual patterns show some overlap. If you have concerns, a healthcare provider can provide guidance.",
                tone: "reassuring",
                requiresReview: false
            };
        } else {
            return {
                message: "Visual patterns show overlap across multiple conditions. The most likely appears benign, but confidence is low. Consider professional evaluation if symptoms are concerning.",
                tone: "neutral",
                requiresReview: false
            };
        }
    }
    
    // Unknown or edge cases
    if (topProbability > 0.5) {
        return {
            message: "Based on visual patterns, this appears most likely consistent with the identified condition.",
            tone: "neutral",
            requiresReview: false
        };
    } else {
        return {
            message: "Visual patterns show overlap across multiple conditions. Consider professional evaluation for accurate assessment.",
            tone: "neutral",
            requiresReview: false
        };
    }
};

// Helper function to format prediction results
const formatPredictionResults = (rawResults) => {
    try {
        console.log('Raw results from Python (first 1000 chars):', rawResults.substring(0, 1000));
        const results = JSON.parse(rawResults.trim());
        console.log('Parsed results:', JSON.stringify(results, null, 2));
        
        // Check for error status from Python
        if (results.status === 'error') {
            console.error('Python returned error:', results.error);
            throw new Error(results.error || 'Python processing failed');
        }
        
        // Handle the format from ml_service.py (top3_predictions)
        let topPredictions = [];
        if (results.top3_predictions && Array.isArray(results.top3_predictions)) {
            topPredictions = results.top3_predictions.map(pred => ({
                class: pred.class || pred.condition || 'Unknown',
                condition: pred.class || pred.condition || 'Unknown',
                probability: typeof pred.probability === 'number' ? pred.probability : parseFloat(pred.probability) || 0,
                confidence: typeof pred.probability === 'number' ? pred.probability : parseFloat(pred.probability) || 0
            }));
            console.log('Found top3_predictions array with', topPredictions.length, 'items');
        } else if (results.topPredictions && Array.isArray(results.topPredictions)) {
            topPredictions = results.topPredictions.map(pred => ({
                class: pred.class || pred.condition || 'Unknown',
                condition: pred.class || pred.condition || 'Unknown',
                probability: typeof pred.probability === 'number' ? pred.probability : parseFloat(pred.probability) || 0,
                confidence: typeof pred.probability === 'number' ? pred.probability : parseFloat(pred.probability) || 0
            }));
            console.log('Found topPredictions array with', topPredictions.length, 'items');
        } else if (results.all_predictions && typeof results.all_predictions === 'object') {
            // Convert all_predictions object to array format
            topPredictions = Object.entries(results.all_predictions)
                .map(([class_name, prob]) => ({
                    class: class_name,
                    condition: class_name,
                    probability: typeof prob === 'number' ? prob : parseFloat(prob) || 0,
                    confidence: typeof prob === 'number' ? prob : parseFloat(prob) || 0
                }))
                .sort((a, b) => b.probability - a.probability)
                .slice(0, 3);
            console.log('Converted all_predictions to topPredictions:', topPredictions.length, 'items');
        } else {
            console.warn('No predictions found in results. Available keys:', Object.keys(results));
            // Don't return empty - this is a real parsing issue
            throw new Error('No predictions found in Python output');
        }
        
        // Validate that we have at least one valid prediction
        // Only suppress if confidence < 0.2, otherwise show results
        const topProb = topPredictions.length > 0 ? topPredictions[0].probability : 0;
        if (topPredictions.length === 0 || 
            (topPredictions.length > 0 && topPredictions[0].probability === 0 && topPredictions[0].condition === 'Unknown')) {
            throw new Error('Invalid predictions: all probabilities are zero or condition is Unknown');
        }
        
        // Don't suppress predictions unless confidence < 0.2
        if (topProb < 0.2) {
            console.warn('Very low confidence prediction (< 0.2), but still returning results');
        }
        
        const confidence = typeof results.confidence === 'number' ? results.confidence : 
                          (results.confidence ? parseFloat(results.confidence) : 0);
        
        // Get prediction reliability from Python output
        const reliability = results.prediction_reliability || 
                          (confidence >= 0.6 ? 'high' : 
                           confidence >= 0.3 ? 'medium' : 'low');
        
        console.log('Final topPredictions:', topPredictions.map(p => `${p.condition}: ${p.probability.toFixed(3)}`).join(', '));
        console.log('Final confidence:', confidence);
        console.log('Prediction reliability:', reliability);
        
        return {
            skinType: results.skinType || results.predicted_class || topPredictions[0]?.condition || 'Unknown',
            confidence: confidence,
            prediction_reliability: reliability,
            concerns: results.concerns || [],
            recommendations: results.recommendations || [],
            topPredictions: topPredictions,
            predicted_class: results.predicted_class || topPredictions[0]?.condition || 'Unknown'
        };
    } catch (error) {
        console.error('Error formatting prediction results:', error.message);
        console.error('Raw results that failed to parse (first 500 chars):', rawResults.substring(0, 500));
        // Re-throw to let caller handle it properly - don't silently return empty results
        throw new Error(`Failed to parse Python output: ${error.message}`);
    }
};

// Main function to analyze skin using Python ML service
const analyzeSkin = async (req, res) => {
  try {
    // Check if file was uploaded (multer puts it in req.file)
    if (!req.file) {
      return sendErrorResponse(res, 400, 'No image uploaded. Please ensure the file field is named "image".');
    }

    console.log('Uploaded file:', req.file.originalname, 'Size:', req.file.size);

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
      // Clean up uploaded file
      await cleanupFile(req.file.path);
      return sendErrorResponse(res, 400, 'Only JPG/PNG images are allowed');
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    if (!fileBuffer || fileBuffer.length === 0) {
      await cleanupFile(req.file.path);
      return sendErrorResponse(res, 400, 'Uploaded image is empty');
    }

    // Generate a unique request ID
    const requestId = uuidv4();
    
    // Use the file path from multer (already saved)
    const savedFilePath = req.file.path;
    
    // Send the request to the ML service
    try {
      // First check if ML service is available
      try {
        const healthCheck = await axios.get('http://localhost:5001/health', { timeout: 5000 });
        if (healthCheck.status !== 200) {
          throw new Error('ML service is not available');
        }
        console.log('ML service health check passed');
      } catch (healthError) {
        console.error('ML service health check failed:', healthError.message);
        await cleanupFile(savedFilePath);
        return res.status(503).json({
          status: 'error',
          message: 'ML service is not available. Please make sure the ML service is running on port 5001.',
          details: healthError.message
        });
      }
      
      // Use HTTP service instead of spawning Python process
      console.log('Sending image to ML service via HTTP');
      console.log('Image path:', savedFilePath);
      console.log('Request ID:', requestId);
      
      // Create FormData to send image to ML service
      const formData = new FormData();
      formData.append('image', fs.createReadStream(savedFilePath));
      
      try {
        // Send request to ML service with increased timeout (90 seconds for model loading + prediction)
        const mlResponse = await axios.post('http://localhost:5001/api/analyze-skin', formData, {
          headers: formData.getHeaders(),
          timeout: 90000, // 90 second timeout
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        });
        
        // Clean up the uploaded file
        await cleanupFile(savedFilePath);
        
        if (mlResponse.data && mlResponse.data.status === 'success' && mlResponse.data.result) {
          // ML service returned result directly
          const result = mlResponse.data.result;
          
          // Format the results
          let formattedResults;
          try {
            // Convert ML service result format to expected format
            const resultJson = JSON.stringify(result);
            formattedResults = formatPredictionResults(resultJson);
          } catch (parseError) {
            console.error('Failed to format ML service results:', parseError.message);
            return res.status(500).json({
              status: 'error',
              message: 'Failed to format model predictions',
              details: parseError.message
            });
          }
          
          global.predictionResults[requestId] = formattedResults;

          // Check if this is the new /predict endpoint (check request path)
          const isPredictEndpoint = req.path === '/predict' || req.originalUrl.includes('/predict');
          
          // Format top predictions
          const topPredictions = formattedResults.topPredictions || [];
          const confidence = formattedResults.confidence || 0;
          
          const formattedTopPredictions = topPredictions.slice(0, 3).map((pred) => {
            // Handle different possible formats from Python
            const condition = pred.class || pred.condition || pred.label || pred.predicted_class || 'Unknown';
            const probability = typeof pred.probability === 'number' ? pred.probability : 
                               (typeof pred.confidence === 'number' ? pred.confidence : 0);
            return {
              condition: condition,
              probability: probability
            };
          });
          
          // Get top probability for decision logic
          const topProbability = formattedTopPredictions.length > 0 ? formattedTopPredictions[0].probability : 0;
          
          // Get prediction reliability from Python output
          const reliability = formattedResults.prediction_reliability || 
                            (topProbability >= 0.6 ? 'high' : 
                             topProbability >= 0.3 ? 'medium' : 'low');
          
          // Generate appropriate decision message based on condition type and confidence
          const decisionInfo = generateDecisionMessage(formattedTopPredictions, confidence, topProbability);
          
          // Determine confidence level based on new thresholds: >= 0.6 confident, 0.3-0.6 uncertain, < 0.3 low
          let confidenceLevel = "UNCERTAIN";
          if (formattedTopPredictions.length > 0 && topProbability >= 0.2) {
            // Only suppress if confidence < 0.2, otherwise show results
            if (topProbability >= 0.6) {
              confidenceLevel = "CONFIDENT";
            } else if (topProbability >= 0.3) {
              confidenceLevel = "UNCERTAIN";
            } else {
              confidenceLevel = "LOW_CONFIDENCE";
            }
          } else {
            confidenceLevel = "UNCERTAIN";
          }
          
          const response = {
            top_predictions: formattedTopPredictions,
            confidence: confidenceLevel,
            prediction_reliability: reliability,
            decision: decisionInfo.message,
            decision_tone: decisionInfo.tone,
            requires_review: decisionInfo.requiresReview
          };
          
          if (isPredictEndpoint) {
            console.log('Final response for /predict:', JSON.stringify(response, null, 2));
            return res.json(response);
          }

          // Return the results for /api/analyze-skin
          const fullResponse = {
            status: 'success',
            requestId,
            ...response,
            ...formattedResults
          };
          
          console.log('Returning /api/analyze-skin format:', JSON.stringify(fullResponse, null, 2));
          res.json(fullResponse);
        } else {
          // ML service returned error
          console.error('ML service returned error:', mlResponse.data);
          return res.status(500).json({
            status: 'error',
            message: 'ML service returned an error',
            details: mlResponse.data.error || 'Unknown error'
          });
        }
      } catch (axiosError) {
        // Clean up the uploaded file
        await cleanupFile(savedFilePath);
        
        console.error('Error calling ML service:', axiosError.message);
        if (axiosError.code === 'ECONNREFUSED') {
          return res.status(503).json({
            status: 'error',
            message: 'Cannot connect to ML service. Please make sure it is running on port 5001.',
            details: axiosError.message
          });
        } else if (axiosError.code === 'ETIMEDOUT' || axiosError.message.includes('timeout')) {
          return res.status(504).json({
            status: 'error',
            message: 'Analysis timed out. Please try again with a different image.',
            details: 'The ML service took too long to respond'
          });
        } else {
          return res.status(500).json({
            status: 'error',
            message: 'Error communicating with ML service',
            details: axiosError.message
          });
        }
      }
      
    } catch (error) {
      // Clean up the uploaded file in case of error
      await cleanupFile(savedFilePath);

      console.error('Error in skin analysis:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        details: error.message
      });
    }
    
  } catch (error) {
    console.error('Skin analysis error:', error);
    console.error('Error stack:', error.stack);
    const message = error.response?.data?.error || error.message || 'Internal server error';
    res.status(500).json({ 
      error: message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get the result of a skin analysis
const getAnalysisResult = (req, res) => {
  const { requestId } = req.params;
  
  if (!requestId) {
    return sendErrorResponse(res, 400, 'Missing request ID');
  }
  
  const result = global.predictionResults[requestId];

  if (!result) {
    return res.status(404).json({
      status: 'error',
      message: 'Analysis result not found'
    });
  }

  res.json({
    status: 'success',
    requestId,
    ...result
  });
};

module.exports = {
  analyzeSkin,
  getAnalysisResult
};
