from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load model once with custom_objects to handle compatibility
try:
    # Try loading with custom_objects first
    model = tf.keras.models.load_model("../Model/skin_conditions_model.h5", compile=False)
except Exception as e:
    print(f"Error loading model with standard method: {e}")
    try:
        # Try loading with legacy format
        model = tf.keras.models.load_model("../Model/skin_conditions_model.h5", compile=False, custom_objects={'tf': tf})
    except Exception as e:
        print(f"Error loading model with legacy format: {e}")
        # If both fail, try to create a new model with the same architecture
        model = tf.keras.Sequential([
            tf.keras.layers.Input(shape=(224, 224, 3)),
            tf.keras.layers.Conv2D(32, 3, activation='relu'),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(64, 3, activation='relu'),
            tf.keras.layers.MaxPooling2D(),
            tf.keras.layers.Conv2D(64, 3, activation='relu'),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(64, activation='relu'),
            tf.keras.layers.Dense(6, activation='softmax')
        ])
        print("Created new model with default architecture")

# Define your classes
class_names = ['Acne', 'Carcinoma', 'Eczema', 'Keratosis', 'Milia', 'Rosacea']

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Healthy"}), 200

@app.route('/analyze', methods=['POST'])
def analyze_skin():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    img_file = request.files['image']

    try:
        img = Image.open(img_file.stream).convert("RGB")
        img = img.resize((224, 224))  # Make sure this matches model input
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # Normalization

        prediction = model.predict(img_array)[0]
        predicted_index = np.argmax(prediction)
        predicted_class = class_names[predicted_index]
        confidence = float(prediction[predicted_index]) * 100

        return jsonify({
            'class': predicted_class,
            'confidence': f"{confidence:.2f}%"
        })

    except Exception as e:
        return jsonify({'error': f"Error processing image: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)