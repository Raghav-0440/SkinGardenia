import os
import sys
import time
import json
import queue
import threading
import pickle
# Suppress TensorFlow warnings and info messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # 0=all, 1=info, 2=warnings, 3=errors only
import tensorflow as tf
# Disable TensorFlow's progress output
tf.get_logger().setLevel('ERROR')
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input as efficientnet_preprocess
import numpy as np
from PIL import Image
import io
import logging
from pathlib import Path
import cgi  # Still needed for HTTP server mode (FieldStorage)
import uuid
import tempfile
import traceback

# Set up logging - ALL logs go to stderr and file, NEVER to stdout
# stdout is reserved ONLY for JSON output
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("ml_service.log"),
        logging.StreamHandler(sys.stderr)  # Changed from sys.stdout to sys.stderr
    ]
)
logger = logging.getLogger("MLService")

# Create a queue for processing requests
request_queue = queue.Queue()
result_queue = queue.Queue()

# Global dictionary to store results by request ID
results = {}

# Global variables for model, class names, and temperature
model = None
class_names = None
temperature = None

def load_class_names_and_temperature():
    """Load class names and temperature from pickle files"""
    global class_names, temperature
    try:
        # Get the models directory path
        # ml_service.py is in: backend/src/ml_service.py
        # models folder is in: models/ (root of project)
        script_dir = os.path.dirname(os.path.abspath(__file__))  # backend/src
        project_root = os.path.join(script_dir, '..', '..', '..')
        project_root = os.path.abspath(project_root)
        models_dir = os.path.join(project_root, 'models')
        models_dir = os.path.abspath(models_dir)
        
        class_names_path = os.path.join(models_dir, 'class_names.pkl')
        temperature_path = os.path.join(models_dir, 'temperature.pkl')
        
        logger.info(f"Loading class names from: {class_names_path}")
        logger.info(f"Loading temperature from: {temperature_path}")
        
        if not os.path.exists(class_names_path):
            raise FileNotFoundError(f"Class names file not found at {class_names_path}")
        if not os.path.exists(temperature_path):
            raise FileNotFoundError(f"Temperature file not found at {temperature_path}")
        
        with open(class_names_path, 'rb') as f:
            class_names = pickle.load(f)
        
        with open(temperature_path, 'rb') as f:
            temp_data = pickle.load(f)
            # Temperature might be stored as a model object or a scalar
            if hasattr(temp_data, 'temperature'):
                temperature = float(temp_data.temperature)
            else:
                temperature = float(temp_data)
        
        logger.info(f"Loaded class names: {class_names}")
        logger.info(f"Loaded temperature: {temperature}")
        
        return class_names, temperature
    except Exception as e:
        logger.error(f"Error loading class names or temperature: {str(e)}")
        # Fallback to default values
        logger.warning("Using default class names and temperature")
        class_names = ['Acne', 'Carcinoma', 'Eczema', 'Keratosis', 'Milia', 'Rosacea']
        temperature = 1.0
        return class_names, temperature

def load_trained_model():
    """Load the trained model"""
    global model, class_names, temperature
    try:
        # Load class names and temperature first
        if class_names is None or temperature is None:
            load_class_names_and_temperature()
        
        if model is not None:
            logger.info("Using cached model")
            return model
        
        # All logging goes to logger (which outputs to stderr), never to stdout
        logger.info("Loading model (this may take 30-60 seconds on first run)...")
        
        # Get the models directory path
        # ml_service.py is in: skin-herb-sanctuary-ai-main/backend/src/ml_service.py
        # models folder is in: models/ (root of Major Project)
        # So we need to go up 3 levels: backend/src -> backend -> skin-herb-sanctuary-ai-main -> Major Project -> models
        script_dir = os.path.dirname(os.path.abspath(__file__))  # backend/src
        project_root = os.path.join(script_dir, '..', '..', '..')
        project_root = os.path.abspath(project_root)
        models_dir = os.path.join(project_root, 'models')
        models_dir = os.path.abspath(models_dir)
        model_path = os.path.join(models_dir, 'skin_model_final.h5')
        logger.info(f"Loading model from: {model_path}")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")
            
        # Log model file size
        model_size = os.path.getsize(model_path) / (1024 * 1024)  # Size in MB
        logger.info(f"Model file size: {model_size:.2f} MB")
        
        # Try loading with basic settings first
        logger.info("Loading TensorFlow model...")
        try:
            model = tf.keras.models.load_model(model_path, compile=False)
        except Exception as e:
            logger.warning(f"Basic loading failed: {str(e)}")
            logger.info("Retrying with custom objects...")
            # If basic loading fails, try with minimal custom objects
            model = tf.keras.models.load_model(
                model_path,
                compile=False,
                custom_objects={
                    'tf': tf,
                    'InputLayer': tf.keras.layers.InputLayer,
                    'Model': tf.keras.Model,
                    'Sequential': tf.keras.Sequential
                }
            )
        
        logger.info("Model loaded successfully")
        
        # Validate model weights
        weights = model.get_weights()
        logger.info(f"Model weights shape: {[w.shape for w in weights]}")
        
        # Test model with random input at model's expected size (300, 300, 3)
        logger.info("\nTesting model with random input...")
        test_input = np.random.random((1, 300, 300, 3))
        # Apply EfficientNet preprocessing for test
        test_input = efficientnet_preprocess(test_input)
        test_pred = model.predict(test_input, verbose=0)
        
        # Apply temperature scaling for calibrated predictions
        if temperature is not None and temperature != 1.0:
            logits = test_pred
            scaled_logits = logits / temperature
            test_pred = tf.nn.softmax(scaled_logits).numpy()
        logger.info(f"Test prediction shape: {test_pred.shape}")
        logger.info(f"Test prediction sum: {np.sum(test_pred)}")  # Should be close to 1.0
        
        # Log predictions for each class
        logger.info("\nTest predictions for each class:")
        for class_name, prob in zip(class_names, test_pred[0]):
            logger.info(f"{class_name}: {prob:.4f}")
        
        return model
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        logger.error(f"Stack trace: {traceback.format_exc()}")
        raise

def preprocess_image(img_path):
    """
    Preprocess image for EfficientNet model input.
    Matches training preprocessing from notebook:
    - Resize to (300, 300) - MUST match training
    - Convert to RGB
    - Apply EfficientNet preprocessing
    """
    try:
        # Verify image file exists and is readable
        if not os.path.exists(img_path):
            raise FileNotFoundError(f"Image file not found: {img_path}")
        
        logger.info(f"Loading image from: {img_path}")
        logger.info(f"Image file size: {os.path.getsize(img_path)} bytes")
        
        # Load image and resize to (300, 300) - MUST match training
        IMG_SIZE = (300, 300)
        img = image.load_img(img_path, target_size=IMG_SIZE)
        img_array = image.img_to_array(img)
        
        # Verify image was loaded correctly
        assert img_array.shape == (300, 300, 3), f"Unexpected image shape: {img_array.shape}, expected (300, 300, 3)"
        assert img_array.dtype == np.float32 or img_array.dtype == np.uint8, f"Unexpected dtype: {img_array.dtype}"
        
        # Log raw image statistics BEFORE preprocessing
        logger.info(f"Raw image stats - mean: {img_array.mean():.2f}, std: {img_array.std():.2f}, min: {img_array.min()}, max: {img_array.max()}")
        logger.info(f"Raw image first 10 pixels (R channel): {img_array[:2, :5, 0].flatten()}")
        
        # Calculate hash/sum of pixel values to verify uniqueness
        pixel_sum = np.sum(img_array)
        pixel_hash = hash(img_array.tobytes())
        logger.info(f"Image pixel sum: {pixel_sum:.2f}, hash: {pixel_hash}")
        
        # Add batch dimension first: (300, 300, 3) -> (1, 300, 300, 3)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Apply EfficientNet preprocessing (handles normalization correctly)
        # This matches the training preprocessing: tf.keras.applications.efficientnet.preprocess_input
        img_array = efficientnet_preprocess(img_array)
        
        # Verify preprocessing
        assert img_array.std() > 0.0, "Image has zero variance - all pixels are identical!"
        
        # Log final preprocessed image statistics
        logger.info(f"Preprocessed image shape: {img_array.shape}, dtype: {img_array.dtype}")
        logger.info(f"Preprocessed image stats - mean: {img_array.mean():.4f}, std: {img_array.std():.4f}, min: {img_array.min():.4f}, max: {img_array.max():.4f}")
        logger.info(f"Preprocessed image first 10 values: {img_array[0, :2, :5, 0].flatten()}")
        
        return img_array
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise

def process_image(image_path, request_id):
    """Process an image and return predictions"""
    try:
        logger.info(f"Processing image: {image_path}")
        logger.info(f"Request ID: {request_id}")
        
        # Verify image path is unique per request
        logger.info(f"Image path for request {request_id}: {image_path}")
        assert os.path.exists(image_path), f"Image file does not exist: {image_path}"
        
        # Preprocess image - this should produce a unique tensor per image
        img_array = preprocess_image(image_path)
        
        # Verify image tensor is not constant
        img_variance = np.var(img_array)
        img_mean = np.mean(img_array)
        logger.info(f"Image tensor variance: {img_variance:.6f}, mean: {img_mean:.4f}")
        assert img_variance > 1e-6, f"Image tensor has near-zero variance ({img_variance}), indicating constant/zero input!"
        
        # Log unique identifier for this tensor
        tensor_hash = hash(img_array.tobytes())
        tensor_sum = np.sum(img_array)
        logger.info(f"Tensor hash: {tensor_hash}, tensor sum: {tensor_sum:.4f}")
        
        # Log image details
        logger.info(f"Image shape: {img_array.shape}")
        logger.info(f"Image value range: [{img_array.min():.4f}, {img_array.max():.4f}]")
        logger.info(f"Image mean: {img_array.mean():.4f}, std: {img_array.std():.4f}")
        
        # Load model (will use cached version if already loaded)
        model = load_trained_model()
        
        # Verify model is not using a cached/global tensor
        # Make prediction
        # verbose=0 to prevent TensorFlow progress output from going to stdout
        logger.info("Making prediction with unique image tensor...")
        
        # Get raw logits from model
        logits = model(img_array, training=False)
        
        # Apply temperature scaling for calibrated predictions (if temperature is loaded)
        if temperature is not None and temperature != 1.0:
            logger.info(f"Applying temperature scaling with temperature: {temperature}")
            scaled_logits = logits / temperature
            predictions = tf.nn.softmax(scaled_logits).numpy()
        else:
            # If no temperature, use model's softmax output directly
            predictions = logits.numpy() if hasattr(logits, 'numpy') else logits
        
        # Log prediction statistics to verify they vary
        pred_sum = np.sum(predictions[0])
        pred_max = np.max(predictions[0])
        pred_entropy = -np.sum(predictions[0] * np.log(predictions[0] + 1e-10))
        logger.info(f"Prediction sum: {pred_sum:.6f} (should be ~1.0), max: {pred_max:.4f}, entropy: {pred_entropy:.4f}")
        
        # Log raw predictions
        logger.info("\nRaw predictions:")
        for class_name, prob in zip(class_names, predictions[0]):
            logger.info(f"{class_name}: {prob:.4f}")
        
        # Get top 3 predictions
        top3_idx = np.argsort(predictions[0])[-3:][::-1]
        top3_predictions = [(class_names[i], predictions[0][i]) for i in top3_idx]
        
        logger.info("\nTop 3 predictions:")
        for class_name, prob in top3_predictions:
            logger.info(f"{class_name}: {prob:.4f}")
        
        # Get final prediction
        predicted_class = class_names[np.argmax(predictions[0])]
        confidence = np.max(predictions[0])
        
        logger.info(f"\nFinal prediction: {predicted_class}")
        logger.info(f"Confidence: {confidence:.4f}")
        
        # Validate predictions
        if confidence < 0.5:  # If confidence is too low
            logger.warning("Low confidence prediction. Checking model weights...")
            # Check if model weights are loaded correctly
            weights = model.get_weights()
            logger.info(f"Model weights shape: {[w.shape for w in weights]}")
            
            # Test with a known image if available
            test_image_path = os.path.join(os.path.dirname(__file__), '..', 'test_images', 'test.jpg')
            if os.path.exists(test_image_path):
                logger.info("Testing with known image...")
                test_img = preprocess_image(test_image_path)
                test_pred = model.predict(test_img, verbose=0)
                logger.info("Test image predictions:")
                for class_name, prob in zip(class_names, test_pred[0]):
                    logger.info(f"{class_name}: {prob:.4f}")
        
        # Determine prediction reliability based on confidence
        # >= 0.6: high, 0.3-0.6: medium, < 0.3: low
        if confidence >= 0.6:
            reliability = 'high'
        elif confidence >= 0.3:
            reliability = 'medium'
        else:
            reliability = 'low'
        
        # Store results - always return Top-3 predictions
        # Only suppress if confidence < 0.2 (very low), otherwise show results
        result = {
            'request_id': request_id,
            'predicted_class': predicted_class,
            'confidence': float(confidence),
            'prediction_reliability': reliability,
            'top3_predictions': [
                {'class': class_name, 'probability': float(prob)}
                for class_name, prob in top3_predictions
            ],
            'all_predictions': {
                class_name: float(prob)
                for class_name, prob in zip(class_names, predictions[0])
            }
        }
        
        # Store in global dictionary
        results[request_id] = result
        
        return result
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        logger.error(f"Stack trace: {traceback.format_exc()}")
        raise

def get_recommendations(skin_condition):
    """Get recommendations based on the skin condition"""
    # This is a simple mapping - you can expand this with more detailed recommendations
    recommendations = {
        'Acne': {
            'plants': [
                {'plant': 'Tea Tree', 'benefit': 'Natural antiseptic properties help reduce inflammation and bacteria'},
                {'plant': 'Aloe Vera', 'benefit': 'Soothes inflammation and promotes healing'},
                {'plant': 'Neem', 'benefit': 'Antibacterial and anti-inflammatory properties'}
            ],
            'homeRemedies': [
                {'remedy': 'Honey Mask', 'benefit': 'Natural antibacterial properties help fight acne'},
                {'remedy': 'Green Tea Compress', 'benefit': 'Reduces inflammation and soothes skin'},
                {'remedy': 'Apple Cider Vinegar', 'benefit': 'Helps balance skin pH and reduce bacteria'}
            ]
        },
        'Eczema': {
            'plants': [
                {'plant': 'Chamomile', 'benefit': 'Calming properties help reduce inflammation'},
                {'plant': 'Oatmeal', 'benefit': 'Soothes itching and irritation'},
                {'plant': 'Calendula', 'benefit': 'Anti-inflammatory and healing properties'}
            ],
            'homeRemedies': [
                {'remedy': 'Coconut Oil', 'benefit': 'Natural moisturizer with anti-inflammatory properties'},
                {'remedy': 'Oatmeal Bath', 'benefit': 'Soothes itching and irritation'},
                {'remedy': 'Aloe Vera Gel', 'benefit': 'Cooling and healing properties'}
            ]
        },
        'Rosacea': {
            'plants': [
                {'plant': 'Green Tea', 'benefit': 'Anti-inflammatory properties help reduce redness'},
                {'plant': 'Chamomile', 'benefit': 'Calming properties help reduce inflammation'},
                {'plant': 'Licorice Root', 'benefit': 'Helps reduce redness and inflammation'}
            ],
            'homeRemedies': [
                {'remedy': 'Green Tea Compress', 'benefit': 'Reduces inflammation and redness'},
                {'remedy': 'Honey Mask', 'benefit': 'Natural anti-inflammatory properties'},
                {'remedy': 'Aloe Vera Gel', 'benefit': 'Cooling and soothing properties'}
            ]
        },
        'Keratosis': {
            'plants': [
                {'plant': 'Tea Tree Oil', 'benefit': 'Natural exfoliating properties'},
                {'plant': 'Apple Cider Vinegar', 'benefit': 'Helps soften and remove keratosis'},
                {'plant': 'Aloe Vera', 'benefit': 'Promotes skin healing and regeneration'}
            ],
            'homeRemedies': [
                {'remedy': 'Apple Cider Vinegar', 'benefit': 'Natural exfoliant that helps remove keratosis'},
                {'remedy': 'Coconut Oil', 'benefit': 'Moisturizes and softens skin'},
                {'remedy': 'Salicylic Acid', 'benefit': 'Helps remove keratosis gently'}
            ]
        },
        'Milia': {
            'plants': [
                {'plant': 'Tea Tree Oil', 'benefit': 'Natural astringent properties'},
                {'plant': 'Witch Hazel', 'benefit': 'Helps tighten pores and reduce milia'},
                {'plant': 'Aloe Vera', 'benefit': 'Promotes skin healing'}
            ],
            'homeRemedies': [
                {'remedy': 'Steam Treatment', 'benefit': 'Opens pores and helps remove milia'},
                {'remedy': 'Honey Mask', 'benefit': 'Natural exfoliant and antibacterial properties'},
                {'remedy': 'Retinol', 'benefit': 'Promotes skin cell turnover'}
            ]
        },
        'Carcinoma': {
            'plants': [
                {'plant': 'Green Tea', 'benefit': 'Antioxidant properties may help protect skin'},
                {'plant': 'Turmeric', 'benefit': 'Anti-inflammatory properties'},
                {'plant': 'Aloe Vera', 'benefit': 'Promotes skin healing'}
            ],
            'homeRemedies': [
                {'remedy': 'Regular Skin Checks', 'benefit': 'Early detection is crucial'},
                {'remedy': 'Sun Protection', 'benefit': 'Use SPF and protective clothing'},
                {'remedy': 'Consult Dermatologist', 'benefit': 'Professional medical advice is essential'}
            ]
        }
    }
    
    return recommendations.get(skin_condition, {
        'plants': [
            {'plant': 'Aloe Vera', 'benefit': 'General skin healing and soothing properties'},
            {'plant': 'Green Tea', 'benefit': 'Antioxidant properties for skin health'},
            {'plant': 'Chamomile', 'benefit': 'Calming and anti-inflammatory properties'}
        ],
        'homeRemedies': [
            {'remedy': 'Regular Moisturizing', 'benefit': 'Maintains skin health'},
            {'remedy': 'Sun Protection', 'benefit': 'Prevents skin damage'},
            {'remedy': 'Healthy Diet', 'benefit': 'Supports skin health from within'}
        ]
    })

def worker():
    """Worker thread that processes images from the queue"""
    while True:
        try:
            # Get a request from the queue
            request = request_queue.get()
            if request is None:
                break
                
            request_id, image_path = request
            logger.info(f"Processing request {request_id} with image {image_path}")
            
            # Process the image
            process_image(image_path, request_id)
            
            # Mark task as done
            request_queue.task_done()
        except Exception as e:
            logger.error(f"Error in worker thread: {e}")
            request_queue.task_done()

def get_result(request_id):
    """Get the result for a specific request ID"""
    if request_id in results:
        result = results[request_id]
        logger.info(f"Returning result for request {request_id}: {json.dumps(result, indent=2)}")
        return result
    logger.info(f"No result found for request {request_id}")
    return {'status': 'pending', 'request_id': request_id}

def add_to_queue(request_id, image_path):
    """Add a new request to the processing queue"""
    request_queue.put((request_id, image_path))
    logger.info(f"Added request {request_id} to queue")
    return {'status': 'queued', 'request_id': request_id}

# Start worker threads
num_workers = 2  # Adjust based on your system's capabilities
worker_threads = []
for _ in range(num_workers):
    t = threading.Thread(target=worker)
    t.daemon = True
    t.start()
    worker_threads.append(t)

logger.info(f"Started {num_workers} worker threads")

# Create a simple HTTP server to handle requests
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse

def save_uploaded_file(fileitem, upload_dir='uploads'):
    """Save uploaded file and return the path"""
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    # Generate unique filename
    file_name = str(uuid.uuid4()) + '.jpg'
    file_path = os.path.join(upload_dir, file_name)
    
    # Save the file
    with open(file_path, 'wb') as f:
        f.write(fileitem.file.read())
    
    return file_path

class MLServiceHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        """Send CORS headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS preflight"""
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        """Handle GET requests to check status or get results"""
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        logger.info(f"Received GET request for path: {path}")
        
        if path == '/health':
            self.send_response(200)
            self._send_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'healthy'}).encode())
            return
            
        if path.startswith('/api/analysis-result/'):
            request_id = path.split('/')[-1]
            logger.info(f"Getting result for request ID: {request_id}")
            result = get_result(request_id)
            logger.info(f"Sending response: {json.dumps(result, indent=2)}")
            self.send_response(200)
            self._send_cors_headers()
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            return
            
        logger.warning(f"Path not found: {path}")
        self.send_response(404)
        self.end_headers()
        
    def do_POST(self):
        """Handle POST requests to submit new images for processing"""
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        if path == '/api/analyze-skin':
            try:
                # Parse multipart form data
                content_type = self.headers.get('Content-Type', '')
                if not content_type.startswith('multipart/form-data'):
                    raise ValueError('Expected multipart/form-data')
                
                # Parse the form data
                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={'REQUEST_METHOD': 'POST',
                            'CONTENT_TYPE': self.headers['Content-Type']}
                )
                
                # Check if image file was uploaded
                if 'image' not in form:
                    raise ValueError('No image file uploaded')
                
                fileitem = form['image']
                if not fileitem.file:
                    raise ValueError('No image file uploaded')
                
                # Save the uploaded file
                image_path = save_uploaded_file(fileitem)
                
                # Generate request ID
                request_id = str(uuid.uuid4())
                
                # Directly process the image and get the result
                result = process_image(image_path, request_id)
                
                # Return the result to the frontend
                self.send_response(200)
                self._send_cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'status': 'success',
                    'request_id': request_id,
                    'result': result
                }).encode())
                
            except Exception as e:
                logger.error(f"Error processing upload: {str(e)}")
                self.send_response(500)
                self._send_cors_headers()
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'status': 'error',
                    'error': str(e)
                }).encode())
            return
            
        self.send_response(404)
        self.end_headers()

def run_server(port=3001):
    """Run the HTTP server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, MLServiceHandler)
    logger.info(f"Starting ML service on port {port}")
    httpd.serve_forever()

if __name__ == '__main__':
    # Check if called with image path and request_id (CLI mode)
    if len(sys.argv) >= 3:
        # CLI mode: process image and output JSON to stdout
        image_path = sys.argv[1]
        request_id = sys.argv[2]
        try:
            # ALL logging goes to stderr - never print to stdout except JSON
            logger.info(f"Starting image processing for request {request_id}")
            logger.info(f"Image path: {image_path}")
            
            # Process image
            result = process_image(image_path, request_id)
            
            # Output ONLY JSON to stdout - Node.js will parse this
            # Ensure no extra whitespace or logging interferes
            json_output = json.dumps(result, separators=(',', ':'))  # Compact JSON
            print(json_output, file=sys.stdout)
            sys.stdout.flush()  # Ensure output is sent immediately
            
            # Log success to stderr (for debugging, won't interfere with JSON)
            logger.info(f"Successfully processed request {request_id}")
            sys.exit(0)
        except Exception as e:
            # Log error to stderr
            logger.error(f"Error processing image in CLI mode: {str(e)}")
            import traceback
            error_trace = traceback.format_exc()
            logger.error(f"Traceback: {error_trace}")
            
            # Output error as JSON to stdout (so Node.js can parse it)
            error_result = {
                'status': 'error',
                'error': str(e),
                'request_id': request_id
            }
            json_output = json.dumps(error_result, separators=(',', ':'))
            print(json_output, file=sys.stdout)
            sys.stdout.flush()
            sys.exit(1)
    
    # Server mode: run as HTTP server
    # Allow an optional port argument (default to 5001 for ML service)
    try:
        default_port = 5001
        if len(sys.argv) > 1:
            try:
                default_port = int(sys.argv[1])
            except ValueError:
                logger.warning(f"Invalid port argument {sys.argv[1]}, using default {default_port}")
    except Exception:
        default_port = 5001

    # Start the server in a separate thread
    server_thread = threading.Thread(target=run_server, args=(default_port,))
    server_thread.daemon = True
    server_thread.start()
    
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down ML service")
        # Signal worker threads to exit
        for _ in range(num_workers):
            request_queue.put(None)
        # Wait for worker threads to finish
        for t in worker_threads:
            t.join() 