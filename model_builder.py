"""
Model building utilities for skin condition classification.
"""
try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras.applications import ResNet50
    from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
    from tensorflow.keras.models import Model
    from tensorflow.keras.optimizers import Adam
except ImportError:
    # Fallback for standalone Keras (if installed separately)
    try:
        import keras
        from keras.applications import ResNet50
        from keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
        from keras.models import Model
        from keras.optimizers import Adam
    except ImportError:
        raise ImportError("Please install TensorFlow: pip install tensorflow")


def build_model(num_classes=6, img_size=(224, 224), learning_rate=0.001):
    """
    Build a simpler, more reliable transfer learning model.
    Using ResNet50 which is more proven and stable.
    
    Args:
        num_classes: Number of skin condition classes
        img_size: Input image size (height, width)
        learning_rate: Learning rate for optimizer
    
    Returns:
        Compiled Keras model
    """
    # Use ResNet50 - more reliable than EfficientNetB3
    base_model = ResNet50(
        weights='imagenet',
        include_top=False,
        input_shape=(*img_size, 3)
    )
    
    # Freeze base model initially
    base_model.trainable = False
    
    # Simpler, more reliable classification head
    inputs = keras.Input(shape=(*img_size, 3))
    x = base_model(inputs, training=False)
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.3)(x)
    outputs = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs, outputs)
    
    # Compile with standard learning rate
    model.compile(
        optimizer=Adam(learning_rate=learning_rate),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model, base_model


def unfreeze_model(base_model, model, learning_rate=0.0001):
    """
    Unfreeze the base model for fine-tuning.
    
    Args:
        base_model: The base model
        model: The full model
        learning_rate: Learning rate for fine-tuning
    
    Returns:
        Recompiled model
    """
    # Unfreeze all layers
    base_model.trainable = True
    
    # Freeze batch normalization layers
    for layer in base_model.layers:
        if isinstance(layer, keras.layers.BatchNormalization):
            layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=Adam(learning_rate=learning_rate),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

