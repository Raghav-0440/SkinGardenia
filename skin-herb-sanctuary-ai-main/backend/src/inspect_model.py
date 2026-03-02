import tensorflow as tf
import h5py
import numpy as np
from pathlib import Path

def inspect_model(model_path):
    print(f"Inspecting model at: {model_path}")
    
    # Try to load with h5py first
    with h5py.File(model_path, 'r') as f:
        print("\nH5 File Structure:")
        def print_attrs(name, obj):
            print(f"{name}: {list(obj.attrs.keys())}")
        f.visititems(print_attrs)
        
        print("\nModel Config:")
        if 'model_config' in f.attrs:
            print(f.attrs['model_config'])
        
        print("\nLayer Names:")
        if 'model_weights' in f:
            for layer_name in f['model_weights'].keys():
                print(f"- {layer_name}")
                if 'vars' in f['model_weights'][layer_name]:
                    for var_name in f['model_weights'][layer_name]['vars'].keys():
                        print(f"  * {var_name}")

    # Try to load with TensorFlow
    try:
        print("\nAttempting to load with TensorFlow...")
        model = tf.keras.models.load_model(model_path, compile=False)
        print("\nModel Summary:")
        model.summary()
    except Exception as e:
        print(f"\nError loading with TensorFlow: {e}")

if __name__ == "__main__":
    model_path = Path("../Model/skin_conditions_model.h5")
    inspect_model(str(model_path)) 