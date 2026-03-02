# Troubleshooting Guide

## PowerShell Extension Errors

If you're seeing PowerShell extension errors in VS Code/Cursor, these are usually false positives from the PowerShell extension trying to analyze Python files. Here are solutions:

### Solution 1: Ignore the Extension Warning
The PowerShell extension may show warnings for Python files, but these don't affect the actual functionality. You can safely ignore them if:
- The Python code runs correctly
- Python linter shows no errors
- The scripts execute without issues

### Solution 2: Disable PowerShell Extension for Python Files
Add this to your VS Code/Cursor settings (`.vscode/settings.json`):
```json
{
    "powershell.scriptAnalysis.enable": false,
    "files.associations": {
        "*.py": "python"
    }
}
```

### Solution 3: Verify Python Installation
Make sure Python is properly installed:
```powershell
python --version
pip --version
```

## Common Import Errors

### TensorFlow Not Found
If you see `ImportError: No module named 'tensorflow'`:
```bash
pip install tensorflow
```

### Other Missing Packages
Install all requirements:
```bash
pip install -r requirements.txt
```

## Dataset Issues

### Dataset Not Found
Make sure the dataset folder is named exactly `Skin_Conditions` (with underscore) and is in the project root directory.

### No Images Found
Verify images are in the correct format (.jpg, .jpeg, .png) and in the class folders.

## Model Training Issues

### Out of Memory
- Reduce batch size in `data_loader.py` (change `batch_size = 32` to `batch_size = 16`)
- Use a smaller EfficientNet model (EfficientNetB0 instead of B3)

### Slow Training
- Reduce number of epochs
- Use GPU if available (TensorFlow will automatically use GPU if detected)

## Prediction Issues

### Model File Not Found
Make sure you've trained the model first:
```bash
python train.py
```

This will create `models/final_model.h5` and `class_names.json`.

### Image Loading Errors
- Ensure image path is correct
- Check image format is supported (.jpg, .jpeg, .png)
- Verify image file is not corrupted

