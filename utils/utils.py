import matplotlib.pyplot as plt
import numpy as np
import json

def visualize_datapoint(X, y):
    plt.imshow(X.reshape(28, 28), cmap="gray")
    plt.title(f"Label: {y}")
    plt.axis("off")
    plt.show()
    
def one_hot_encode(y, num_classes=10):
    return np.eye(num_classes)[y]

def loss(a, y):
    sum = 0
    
    if len(a) != len(y):
        raise ValueError("Vectors did not have the same length")
    
    for i in range(len(a)):
        sum += (a[i] - y[i])**2
    
    return float(0.5 * sum) 
    

def loss_derivative(a, y):
    return a - y
    
from utils.data_loader import load_data
import json

def get_test_sample(index=0):
    """Get a test sample and format it for API testing"""
    
    # Load the data
    print("Loading MNIST data...")
    X_train, y_train, X_test, y_test = load_data()
    
    # Get a specific test sample
    if index >= len(X_test):
        print(f"Index {index} too large. Max index is {len(X_test) - 1}")
        return
    
    sample_pixels = X_test[index]
    actual_label = y_test[index]
    
    print(f"Test sample #{index}")
    print(f"Actual digit: {actual_label}")
    print(f"Pixel values shape: {sample_pixels.shape}")
    print(f"Pixel value range: {sample_pixels.min():.3f} to {sample_pixels.max():.3f}")
    
    # Convert to list for JSON serialization
    pixels_list = sample_pixels.tolist()
    
    # Create the JSON payload
    payload = {"pixels": pixels_list}
    
    print(f"\n{'='*60}")
    print("CURL COMMAND:")
    print(f"{'='*60}")
    
    # Create a properly formatted cURL command
    json_payload = json.dumps(payload)
    
    curl_command = f'''curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: KEY" \
  -d '{json_payload}' '''
    
    print(curl_command)
    
    print(f"\n{'='*60}")
    print("EXPECTED RESULT:")
    print(f"{'='*60}")
    print(f"The API should predict digit: {actual_label}")
    
    return pixels_list, actual_label

def show_multiple_samples(count=5):
    """Show multiple test samples for variety"""
    print(f"Showing {count} different test samples:\n")
    
    for i in range(count):
        print(f"SAMPLE {i+1}:")
        print("-" * 40)
        get_test_sample(i)
        print("\n")