"""
Data loading and preprocessing utilities for skin condition classification.
"""
import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
try:
    from tensorflow.keras.preprocessing.image import ImageDataGenerator
except ImportError:
    from keras.preprocessing.image import ImageDataGenerator


def load_data(data_dir='Skin_Conditions', img_size=(224, 224), test_size=0.2, val_size=0.1, random_state=42):
    """
    Load and split the dataset into train, validation, and test sets.
    
    Args:
        data_dir: Path to the dataset directory
        img_size: Target image size (height, width)
        test_size: Proportion of data for testing
        val_size: Proportion of training data for validation
        random_state: Random seed for reproducibility
    
    Returns:
        Tuple of (train_gen, val_gen, test_gen, class_names)
    """
    # Get class names from folder names
    class_names = sorted([d for d in os.listdir(data_dir) 
                         if os.path.isdir(os.path.join(data_dir, d))])
    
    print(f"Found {len(class_names)} classes: {class_names}")
    
    # Collect all image paths and labels
    image_paths = []
    labels = []
    
    for class_idx, class_name in enumerate(class_names):
        class_dir = os.path.join(data_dir, class_name)
        images = [f for f in os.listdir(class_dir) 
                 if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        for img in images:
            image_paths.append(os.path.join(class_dir, img))
            labels.append(class_idx)
        
        print(f"  {class_name}: {len(images)} images")
    
    # Convert to numpy arrays
    image_paths = np.array(image_paths)
    labels = np.array(labels)
    
    # Split into train+val and test
    X_train_val, X_test, y_train_val, y_test = train_test_split(
        image_paths, labels, test_size=test_size, 
        stratify=labels, random_state=random_state
    )
    
    # Split train+val into train and val
    X_train, X_val, y_train, y_val = train_test_split(
        X_train_val, y_train_val, test_size=val_size/(1-test_size),
        stratify=y_train_val, random_state=random_state
    )
    
    print(f"\nDataset splits:")
    print(f"  Train: {len(X_train)} images")
    print(f"  Validation: {len(X_val)} images")
    print(f"  Test: {len(X_test)} images")
    
    # Create dataframes - use class names as labels for proper encoding
    train_labels = [class_names[label] for label in y_train]
    val_labels = [class_names[label] for label in y_val]
    test_labels = [class_names[label] for label in y_test]
    
    train_df = pd.DataFrame({'path': X_train, 'label': train_labels})
    val_df = pd.DataFrame({'path': X_val, 'label': val_labels})
    test_df = pd.DataFrame({'path': X_test, 'label': test_labels})
    
    # Enhanced data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=30,
        width_shift_range=0.3,
        height_shift_range=0.3,
        shear_range=0.2,
        zoom_range=0.3,
        horizontal_flip=True,
        vertical_flip=True,
        brightness_range=[0.8, 1.2],
        fill_mode='nearest'
    )
    
    # No augmentation for validation and test
    val_test_datagen = ImageDataGenerator(rescale=1./255)
    
    # Create data generators
    batch_size = 32
    
    train_gen = train_datagen.flow_from_dataframe(
        dataframe=train_df,
        x_col='path',
        y_col='label',
        target_size=img_size,
        batch_size=batch_size,
        class_mode='sparse',
        shuffle=True,
        seed=random_state
    )
    
    val_gen = val_test_datagen.flow_from_dataframe(
        dataframe=val_df,
        x_col='path',
        y_col='label',
        target_size=img_size,
        batch_size=batch_size,
        class_mode='sparse',
        shuffle=False,
        seed=random_state
    )
    
    test_gen = val_test_datagen.flow_from_dataframe(
        dataframe=test_df,
        x_col='path',
        y_col='label',
        target_size=img_size,
        batch_size=batch_size,
        class_mode='sparse',
        shuffle=False,
        seed=random_state
    )
    
    return train_gen, val_gen, test_gen, class_names

