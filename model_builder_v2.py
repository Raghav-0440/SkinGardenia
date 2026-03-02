"""
Improved model building with a simpler, more reliable approach.
"""
try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras.applications import ResNet50, EfficientNetB0
    from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout, BatchNormalization
    from tensorflow.keras.models import Model
    from tensorflow.keras.optimizers import Adam
except ImportError:
    raise ImportError("Please install TensorFlow: pip install tensorflow")


def build_model(num_classes=6, img_size=(224, 224), base_model_name='ResNet50'):
    """
    Build a reliable transfer learning model.
    
    Args:
        num_classes: Number of skin condition classes
        img_size: Input image size (height, width)
        base_model_name: 'ResNet50' or 'EfficientNetB0'
    
    Returns:
        Compiled Keras model
    """
    # Choose base model
    if base_model_name == 'ResNet50':
        base_model = ResNet50(
            weights='imagenet',
            include_top=False,
            input_shape=(*img_size, 3)
        )
    else:  # EfficientNetB0
        base_model = EfficientNetB0(
            weights='imagenet',
            include_top=False,
            input_shape=(*img_size, 3)
        )
    
    # Freeze base model initially
    base_model.trainable = False
    
    # Build model
    inputs = keras.Input(shape=(*img_size, 3))
    x = base_model(inputs, training=False)
    x = GlobalAveragePooling2D()(x)
    x = BatchNormalization()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = BatchNormalization()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.3)(x)
    outputs = Dense(num_classes, activation='softmax')(x)
    
    model = Model(inputs, outputs)
    
    # Compile with a reasonable learning rate
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model, base_model


def unfreeze_model(base_model, model, learning_rate=0.0001):
    """
    Unfreeze the base model for fine-tuning.
    """
    base_model.trainable = True
    
    # Freeze batch norm layers
    for layer in base_model.layers:
        if isinstance(layer, keras.layers.BatchNormalization):
            layer.trainable = False
    
    # Recompile
    model.compile(
        optimizer=Adam(learning_rate=learning_rate),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

