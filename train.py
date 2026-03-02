"""
Training script for skin condition classification model.
"""
import os
import json
from datetime import datetime
try:
    from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
except ImportError:
    from keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from data_loader import load_data
from model_builder import build_model, unfreeze_model


def train_model(data_dir='Skin_Conditions', epochs=80, img_size=(224, 224), 
                initial_epochs=25, fine_tune_epochs=30):
    """
    Train the skin condition classification model.
    
    Args:
        data_dir: Path to dataset directory
        epochs: Total number of epochs
        img_size: Input image size
        initial_epochs: Epochs for initial training (frozen base)
        fine_tune_epochs: Epochs for fine-tuning (unfrozen base)
    """
    print("=" * 60)
    print("Loading and preprocessing data...")
    print("=" * 60)
    
    # Load data
    train_gen, val_gen, test_gen, class_names = load_data(
        data_dir=data_dir, 
        img_size=img_size
    )
    
    # Save class names for inference
    with open('class_names.json', 'w') as f:
        json.dump(class_names, f)
    
    print("\n" + "=" * 60)
    print("Building model...")
    print("=" * 60)
    
    # Build model
    model, base_model = build_model(
        num_classes=len(class_names),
        img_size=img_size
    )
    
    print(f"\nModel summary:")
    model.summary()
    
    # Create improved callbacks
    callbacks = [
        ModelCheckpoint(
            'models/best_model.h5',
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1,
            save_weights_only=False
        ),
        EarlyStopping(
            monitor='val_accuracy',
            patience=15,
            restore_best_weights=True,
            verbose=1,
            min_delta=0.001
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.3,
            patience=7,
            min_lr=1e-8,
            verbose=1,
            mode='min'
        )
    ]
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    print("\n" + "=" * 60)
    print("Phase 1: Training with frozen base model...")
    print("=" * 60)
    
    # Phase 1: Train with frozen base model
    history1 = model.fit(
        train_gen,
        epochs=initial_epochs,
        validation_data=val_gen,
        callbacks=callbacks,
        verbose=1
    )
    
    print("\n" + "=" * 60)
    print("Phase 2: Fine-tuning (unfreezing base model)...")
    print("=" * 60)
    
    # Phase 2: Fine-tune with unfrozen base model
    model = unfreeze_model(base_model, model)
    
    # Update callbacks for fine-tuning
    callbacks_ft = [
        ModelCheckpoint(
            'models/best_model_finetuned.h5',
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1,
            save_weights_only=False
        ),
        EarlyStopping(
            monitor='val_accuracy',
            patience=20,
            restore_best_weights=True,
            verbose=1,
            min_delta=0.001
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.2,
            patience=6,
            min_lr=1e-9,
            verbose=1,
            mode='min'
        )
    ]
    
    history2 = model.fit(
        train_gen,
        epochs=fine_tune_epochs,
        validation_data=val_gen,
        callbacks=callbacks_ft,
        verbose=1
    )
    
    print("\n" + "=" * 60)
    print("Evaluating on test set...")
    print("=" * 60)
    
    # Evaluate on test set
    test_loss, test_accuracy = model.evaluate(test_gen, verbose=1)
    print(f"\nTest Accuracy: {test_accuracy:.4f}")
    print(f"Test Loss: {test_loss:.4f}")
    
    # Save final model
    model.save('models/final_model.h5')
    print("\nModel saved to 'models/final_model.h5'")
    
    # Save training history
    import pickle
    history = {
        'initial': history1.history,
        'fine_tune': history2.history
    }
    with open('models/training_history.pkl', 'wb') as f:
        pickle.dump(history, f)
    
    print("\nTraining completed successfully!")
    return model, history


if __name__ == '__main__':
    train_model()

