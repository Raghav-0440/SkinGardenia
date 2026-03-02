"""
Quick test script to verify the setup is correct.
"""
import os

def test_setup():
    """Test if dataset structure is correct."""
    data_dir = 'Skin_Conditions'
    
    if not os.path.exists(data_dir):
        print(f"ERROR: Dataset directory '{data_dir}' not found!")
        return False
    
    # Get class names
    class_names = sorted([d for d in os.listdir(data_dir) 
                         if os.path.isdir(os.path.join(data_dir, d))])
    
    if len(class_names) == 0:
        print(f"ERROR: No class folders found in '{data_dir}'!")
        return False
    
    print(f"Found {len(class_names)} classes: {class_names}")
    
    # Check each class
    total_images = 0
    for class_name in class_names:
        class_dir = os.path.join(data_dir, class_name)
        images = [f for f in os.listdir(class_dir) 
                 if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        total_images += len(images)
        print(f"  {class_name}: {len(images)} images")
    
    print(f"\nTotal images: {total_images}")
    print("\nSetup looks good! You can now run 'python train.py' to train the model.")
    return True

if __name__ == '__main__':
    test_setup()

