# Digit Recognition API

A lightweight FastAPI-based web service for digit recognition using your trained neural network.

## Memory Usage Recommendation

**✅ Load weights once at startup** - This is the recommended approach I've implemented. Your model has only ~13K parameters (~100KB memory), so keeping it loaded is efficient and fast.

**❌ Loading weights per request** - Would be much slower and unnecessary for this small model.

## Quick Start

1. **Install dependencies** (if not already installed):
```bash
pip install -r requirements.txt
```

2. **Start the API server**:
```bash
python api.py
```

The server will start on `http://localhost:8000`

3. **View interactive API documentation**:
Open `http://localhost:8000/docs` in your browser for Swagger UI docs.

## API Endpoints

### `GET /` - Health Check
Returns API status and whether the model is loaded.

### `POST /predict` - Predict digit from pixel values
Accepts 784 normalized pixel values (0-1) as a flat array.

**Request body:**
```json
{
  "pixels": [0.0, 0.0, 0.1, ..., 0.9, 0.0]  // 784 values
}
```

**Response:**
```json
{
  "predicted_digit": 7,
  "confidence_scores": [0.01, 0.02, 0.1, 0.05, 0.03, 0.02, 0.08, 0.85, 0.01, 0.03]
}
```



## Testing the API

Run the test script to see the API in action:

```bash
python test_api.py
```

This will test the API with actual MNIST data and show predictions vs. actual labels.

## Usage Examples

### Python with requests:
```python
import requests
import numpy as np

# Example with flattened pixels
response = requests.post(
    "http://localhost:8000/predict",
    json={"pixels": your_784_pixel_array.tolist()}
)
result = response.json()
print(f"Predicted digit: {result['predicted_digit']}")
```

### cURL:
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"pixels": [0.0, 0.0, 0.1, ...]}'  # 784 values
```

## Model Information

- **Architecture**: 784 → 16 → 16 → 10 neurons
- **Memory footprint**: ~100KB 
- **Loaded**: Once at startup for optimal performance
- **Model file**: `model/saved_models/model_ep300_lr0_1.pkl`

## Performance Notes

- **Cold start**: ~1-2 seconds (model loading)
- **Prediction time**: ~1-5ms per request
- **Memory usage**: ~100KB + FastAPI overhead
- **Concurrent requests**: Supported (model is thread-safe for inference) 