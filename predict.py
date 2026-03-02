"""
Production-ready inference script for skin condition classification.
"""
import os
import json
import numpy as np
from PIL import Image
try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras.preprocessing import image
except ImportError:
    import keras
    from keras.preprocessing import image


class SkinConditionClassifier:
    """Production-ready skin condition classifier."""
    
    def __init__(self, model_path='models/final_model.h5', class_names_path='class_names.json'):
        """
        Initialize the classifier.
        
        Args:
            model_path: Path to saved model
            class_names_path: Path to class names JSON file
        """
        self.model = keras.models.load_model(model_path)
        self.img_size = (224, 224)
        
        # Load class names
        with open(class_names_path, 'r') as f:
            self.class_names = json.load(f)
        
        print(f"Model loaded successfully!")
        print(f"Classes: {self.class_names}")
    
    def preprocess_image(self, img_path):
        """
        Preprocess image for prediction.
        
        Args:
            img_path: Path to image file
        
        Returns:
            Preprocessed image array
        """
        # Load and resize image
        img = image.load_img(img_path, target_size=self.img_size)
        
        # Convert to array
        img_array = image.img_to_array(img)
        
        # Expand dimensions for batch
        img_array = np.expand_dims(img_array, axis=0)
        
        # Normalize
        img_array = img_array / 255.0
        
        return img_array
    
    def predict(self, img_path, top_k=1):
        """
        Predict skin condition from image.
        
        Args:
            img_path: Path to image file
            top_k: Number of top predictions to return
        
        Returns:
            Dictionary with predictions
        """
        # Preprocess image
        img_array = self.preprocess_image(img_path)
        
        # Make prediction
        predictions = self.model.predict(img_array, verbose=0)
        
        # Get top k predictions
        top_indices = np.argsort(predictions[0])[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            results.append({
                'class': self.class_names[idx],
                'confidence': float(predictions[0][idx])
            })
        
        return {
            'predicted_class': results[0]['class'],
            'confidence': results[0]['confidence'],
            'all_predictions': results
        }
    
    def predict_from_array(self, img_array, top_k=1):
        """
        Predict from numpy array (for batch processing).
        
        Args:
            img_array: Preprocessed image array
            top_k: Number of top predictions to return
        
        Returns:
            Dictionary with predictions
        """
        # Ensure proper shape
        if len(img_array.shape) == 3:
            img_array = np.expand_dims(img_array, axis=0)
        
        # Normalize if not already
        if img_array.max() > 1.0:
            img_array = img_array / 255.0
        
        # Make prediction
        predictions = self.model.predict(img_array, verbose=0)
        
        # Get top k predictions
        top_indices = np.argsort(predictions[0])[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            results.append({
                'class': self.class_names[idx],
                'confidence': float(predictions[0][idx])
            })
        
        return {
            'predicted_class': results[0]['class'],
            'confidence': results[0]['confidence'],
            'all_predictions': results
        }


def main():
    """Example usage of the classifier."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Classify skin condition from image')
    parser.add_argument('image_path', type=str, help='Path to image file')
    parser.add_argument('--model', type=str, default='models/final_model.h5',
                       help='Path to model file')
    parser.add_argument('--classes', type=str, default='class_names.json',
                       help='Path to class names file')
    parser.add_argument('--top-k', type=int, default=3,
                       help='Number of top predictions to show')
    
    args = parser.parse_args()
    
    # Initialize classifier
    classifier = SkinConditionClassifier(
        model_path=args.model,
        class_names_path=args.classes
    )
    
    # Make prediction
    print(f"\nAnalyzing image: {args.image_path}")
    result = classifier.predict(args.image_path, top_k=args.top_k)
    
    # Display results
    print("\n" + "=" * 60)
    print("PREDICTION RESULTS")
    print("=" * 60)
    print(f"Predicted Skin Condition: {result['predicted_class']}")
    print(f"Confidence: {result['confidence']:.2%}")
    print("\nTop Predictions:")
    for i, pred in enumerate(result['all_predictions'], 1):
        print(f"  {i}. {pred['class']}: {pred['confidence']:.2%}")
    print("=" * 60)


if __name__ == '__main__':
    main()

