# Skin Condition Classification Model

A production-ready deep learning model for classifying skin conditions using transfer learning with EfficientNetB3.

## Dataset

The model is trained on the "Augmented Skin Conditions Image Dataset" containing 6 skin condition classes:
- Acne
- Carcinoma
- Eczema
- Keratosis
- Milia
- Rosacea

Each class contains approximately 400 images.

## Project Structure

```
.
├── Skin_Conditions/          # Dataset directory
│   ├── Acne/
│   ├── Carcinoma/
│   ├── Eczema/
│   ├── Keratosis/
│   ├── Milia/
│   └── Rosacea/
├── data_loader.py            # Data loading and preprocessing
├── model_builder.py          # Model architecture
├── train.py                  # Training script
├── predict.py                # Inference script
├── requirements.txt          # Python dependencies
└── README.md                 # This file
```

## Installation

1. Install required packages:
```bash
pip install -r requirements.txt
```

## Usage

### 1. Training the Model

Train the model on your dataset:

```bash
python train.py
```

The training process includes:
- **Phase 1**: Training with frozen base model (EfficientNetB3)
- **Phase 2**: Fine-tuning with unfrozen top layers

The script will:
- Automatically split data into train/validation/test sets (70%/10%/20%)
- Apply data augmentation for training
- Save the best model checkpoints
- Evaluate on test set
- Save final model to `models/final_model.h5`

### 2. Making Predictions

Classify a skin condition image:

```bash
python predict.py path/to/image.jpg
```

For more options:
```bash
python predict.py path/to/image.jpg --top-k 3
```

### 3. Using in Your Code

```python
from predict import SkinConditionClassifier

# Initialize classifier
classifier = SkinConditionClassifier(
    model_path='models/final_model.h5',
    class_names_path='class_names.json'
)

# Make prediction
result = classifier.predict('path/to/image.jpg')

print(f"Predicted: {result['predicted_class']}")
print(f"Confidence: {result['confidence']:.2%}")
```

## Model Architecture

- **Base Model**: EfficientNetB3 (pre-trained on ImageNet)
- **Custom Head**: 
  - Global Average Pooling
  - Dense(512) + Dropout(0.5)
  - Dense(256) + Dropout(0.3)
  - Dense(6) with softmax activation

## Training Details

- **Image Size**: 224x224
- **Batch Size**: 32
- **Optimizer**: Adam
- **Loss**: Sparse Categorical Crossentropy
- **Data Augmentation**: Rotation, shifts, shear, zoom, horizontal flip
- **Callbacks**: ModelCheckpoint, EarlyStopping, ReduceLROnPlateau

## Output Files

After training, the following files will be created:

- `models/best_model.h5` - Best model from Phase 1
- `models/best_model_finetuned.h5` - Best model from Phase 2
- `models/final_model.h5` - Final saved model
- `models/training_history.pkl` - Training history
- `class_names.json` - Class labels mapping

## Notes

- The model uses transfer learning for better performance with limited data
- Data augmentation helps prevent overfitting
- The two-phase training approach (frozen then fine-tuned) is a best practice for transfer learning
- Make sure your images are in JPG, JPEG, or PNG format

## License

This project is for educational purposes.

