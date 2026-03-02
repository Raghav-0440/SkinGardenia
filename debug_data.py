"""
Debug script to verify data loading and label encoding.
"""
import numpy as np
from data_loader import load_data

# Load data
train_gen, val_gen, test_gen, class_names = load_data()

print("\n" + "="*60)
print("DEBUGGING DATA PIPELINE")
print("="*60)

# Get a batch from training generator
batch_x, batch_y = next(train_gen)

print(f"\nBatch shape: {batch_x.shape}")
print(f"Labels shape: {batch_y.shape}")
print(f"Labels dtype: {batch_y.dtype}")
print(f"Label values in batch: {np.unique(batch_y)}")
print(f"Expected label range: 0 to {len(class_names)-1}")

# Check class indices
print(f"\nClass names: {class_names}")
print(f"Generator class indices: {train_gen.class_indices}")

# Verify label distribution
unique, counts = np.unique(batch_y, return_counts=True)
print(f"\nLabel distribution in batch:")
for u, c in zip(unique, counts):
    print(f"  Class {int(u)} ({class_names[int(u)]}): {c} samples")

# Check if labels match class indices
if hasattr(train_gen, 'class_indices'):
    print(f"\nGenerator class mapping:")
    for class_name, idx in train_gen.class_indices.items():
        print(f"  {class_name} -> {idx}")

# Test a few samples
print(f"\nFirst 10 labels in batch: {batch_y[:10]}")
print(f"Label min: {batch_y.min()}, max: {batch_y.max()}")

# Check if images are valid
print(f"\nImage stats:")
print(f"  Min pixel value: {batch_x.min():.4f}")
print(f"  Max pixel value: {batch_x.max():.4f}")
print(f"  Mean pixel value: {batch_x.mean():.4f}")
print(f"  Image shape: {batch_x[0].shape}")

print("\n" + "="*60)
print("If labels are not 0-5, there's a problem with encoding!")
print("="*60)

