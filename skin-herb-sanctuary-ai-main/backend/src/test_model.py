import os
import sys
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_model():
    try:
        # Load the model
        model_path = os.path.join(os.path.dirname(__file__), '..', 'Model', 'skin_conditions_model.h5')
        logger.info(f"Loading model from: {model_path}")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")
        
        # Load the model directly (not recreating architecture)
        model = load_model(model_path)
        
        # Print model summary
        logger.info("\nModel Summary:")
        model.summary()
        
        # Print model configuration
        logger.info("\nModel Configuration:")
        logger.info(f"Input shape: {model.input_shape}")
        logger.info(f"Output shape: {model.output_shape}")
        
        # Test with random input
        test_input = np.random.random((1, 224, 224, 3))
        logger.info("\nTesting with random input:")
        logger.info(f"Input shape: {test_input.shape}")
        logger.info(f"Input range: [{test_input.min():.2f}, {test_input.max():.2f}]")
        
        # Make prediction
        predictions = model.predict(test_input, verbose=1)
        logger.info("\nRaw predictions:")
        for i, prob in enumerate(predictions[0]):
            logger.info(f"Class {i}: {prob:.4f}")
        
        # Test with zero input
        zero_input = np.zeros((1, 224, 224, 3))
        logger.info("\nTesting with zero input:")
        predictions = model.predict(zero_input, verbose=1)
        logger.info("\nRaw predictions:")
        for i, prob in enumerate(predictions[0]):
            logger.info(f"Class {i}: {prob:.4f}")
        
        # Test with ones input
        ones_input = np.ones((1, 224, 224, 3))
        logger.info("\nTesting with ones input:")
        predictions = model.predict(ones_input, verbose=1)
        logger.info("\nRaw predictions:")
        for i, prob in enumerate(predictions[0]):
            logger.info(f"Class {i}: {prob:.4f}")
        
        return True
        
    except Exception as e:
        logger.error(f"Error testing model: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_model()
    sys.exit(0 if success else 1) 