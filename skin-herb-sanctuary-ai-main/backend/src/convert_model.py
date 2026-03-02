import os
import tensorflow as tf
from tensorflow.keras.models import load_model, Model
from tensorflow.keras.applications.resnet50 import ResNet50
import numpy as np

def convert_model():
    try:
        # Get model path
        model_path = os.path.join(os.path.dirname(__file__), '..', 'Model', 'skin_conditions_model.h5')
        new_model_path = os.path.join(os.path.dirname(__file__), '..', 'Model', 'skin_conditions_model_v2.h5')
        
        print(f"Loading model from: {model_path}")
        
        # Create model architecture
        base_model = ResNet50(weights=None, include_top=False, input_shape=(224, 224, 3))
        x = base_model.output
        x = tf.keras.layers.GlobalAveragePooling2D()(x)
        x = tf.keras.layers.Dense(512, activation='relu')(x)
        x = tf.keras.layers.Dropout(0.5)(x)
        x = tf.keras.layers.Dense(256, activation='relu')(x)
        x = tf.keras.layers.Dropout(0.3)(x)
        outputs = tf.keras.layers.Dense(6, activation='softmax')(x)
        model = Model(inputs=base_model.input, outputs=outputs)
        
        # Load weights
        print("Loading weights...")
        model.load_weights(model_path)
        
        # Test prediction
        print("\nTesting model...")
        test_input = np.random.random((1, 224, 224, 3))
        predictions = model.predict(test_input)
        print(f"Test prediction shape: {predictions.shape}")
        print(f"Test prediction sum: {np.sum(predictions)}")  # Should be close to 1.0
        
        # Save model in TF 2.x format
        print(f"\nSaving model to: {new_model_path}")
        model.save(new_model_path, save_format='h5')
        print("Model converted successfully!")
        
        return True
    except Exception as e:
        print(f"Error converting model: {str(e)}")
        return False

if __name__ == "__main__":
    success = convert_model()
    exit(0 if success else 1) 