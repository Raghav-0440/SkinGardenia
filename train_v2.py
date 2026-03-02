"""
Improved training script with better strategy.
"""
import os
import json
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, CSVLogger
from data_loader import load_data
from model_builder_v2 import build_model, unfreeze_model


def train_model(data_dir='Skin_Conditions', img_size=(224, 224), 
                initial_epochs=25, fine_tune_epochs=30, base_model='ResNet50'):
    """
    Train with improved strategy.
    """
    print("=" * 60)
    print("Loading and preprocessing data...")
    print("=" * 60)
    
    train_gen, val_gen, test_gen, class_names = load_data(
        data_dir=data_dir, 
        img_size=img_size
    )
    
    # Save class names
    with open('class_names.json', 'w') as f:
        json.dump(class_names, f)
    
    print("\n" + "=" * 60)
    print(f"Building model with {base_model}...")
    print("=" * 60)
    
    model, base_model = build_model(
        num_classes=len(class_names),
        img_size=img_size,
        base_model_name=base_model
    )
    
    print(f"\nModel summary:")
    model.summary()
    
    # Create directories
    os.makedirs('models', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    # Phase 1: Train with frozen base
    print("\n" + "=" * 60)
    print("Phase 1: Training with frozen base model...")
    print("=" * 60)
    
    callbacks_phase1 = [
        ModelCheckpoint(
            'models/best_model_phase1.h5',
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        EarlyStopping(
            monitor='val_accuracy',
            patience=10,
            restore_best_weights=True,
            verbose=1,
            min_delta=0.001
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1
        ),
        CSVLogger('logs/training_phase1.csv')
    ]
    
    history1 = model.fit(
        train_gen,
        epochs=initial_epochs,
        validation_data=val_gen,
        callbacks=callbacks_phase1,
        verbose=1
    )
    
    # Phase 2: Fine-tuning
    print("\n" + "=" * 60)
    print("Phase 2: Fine-tuning (unfreezing base model)...")
    print("=" * 60)
    
    model = unfreeze_model(base_model, model, learning_rate=0.0001)
    
    callbacks_phase2 = [
        ModelCheckpoint(
            'models/best_model_finetuned.h5',
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
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
            patience=6,
            min_lr=1e-8,
            verbose=1
        ),
        CSVLogger('logs/training_phase2.csv')
    ]
    
    history2 = model.fit(
        train_gen,
        epochs=fine_tune_epochs,
        validation_data=val_gen,
        callbacks=callbacks_phase2,
        verbose=1
    )
    
    # Evaluate
    print("\n" + "=" * 60)
    print("Evaluating on test set...")
    print("=" * 60)
    
    test_loss, test_accuracy = model.evaluate(test_gen, verbose=1)
    print(f"\nTest Accuracy: {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")
    print(f"Test Loss: {test_loss:.4f}")
    
    # Save final model
    model.save('models/final_model.h5')
    print("\nModel saved to 'models/final_model.h5'")
    
    # Save history
    import pickle
    history = {
        'phase1': history1.history,
        'phase2': history2.history,
        'test_accuracy': float(test_accuracy),
        'test_loss': float(test_loss)
    }
    with open('models/training_history.pkl', 'wb') as f:
        pickle.dump(history, f)
    
    print("\nTraining completed successfully!")
    return model, history


if __name__ == '__main__':
    # Try ResNet50 first (more reliable)
    train_model(base_model='ResNet50')

