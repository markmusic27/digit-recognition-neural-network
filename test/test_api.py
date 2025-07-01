import requests
import numpy as np
from utils.data_loader import load_data

def test_api_basic():
    """Test the API with a sample from the test dataset"""
    
    # Load some test data
    _, _, X_test, y_test = load_data()
    
    # Take the first test sample
    sample_image = X_test[0]  # Should be normalized 0-1 already
    actual_label = y_test[0]
    
    print(f"Testing API with sample that should be digit: {actual_label}")
    
    # Test the /predict endpoint
    url = "http://localhost:8000/predict"
    payload = {
        "pixels": sample_image.tolist()  # Convert numpy array to list
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        result = response.json()
        predicted_digit = result["predicted_digit"]
        confidence_scores = result["confidence_scores"]
        
        print(f"Predicted digit: {predicted_digit}")
        print(f"Actual digit: {actual_label}")
        print(f"Correct: {predicted_digit == actual_label}")
        print(f"Confidence for predicted digit: {confidence_scores[predicted_digit]:.4f}")
        
        # Show top 3 predictions
        sorted_indices = np.argsort(confidence_scores)[::-1][:3]
        print("\nTop 3 predictions:")
        for i, idx in enumerate(sorted_indices):
            print(f"  {i+1}. Digit {idx}: {confidence_scores[idx]:.4f}")
            
    except requests.exceptions.RequestException as e:
        print(f"Error calling API: {e}")
        print("Make sure the API is running with: python api.py")



def test_health_check():
    """Test the health check endpoint"""
    
    try:
        response = requests.get("http://localhost:8000/")
        response.raise_for_status()
        
        result = response.json()
        print(f"Health check: {result}")
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling health check: {e}")

if __name__ == "__main__":
    print("Testing Digit Recognition API")
    print("=" * 40)
    
    # Test health check first
    test_health_check()
    
    # Test main prediction endpoint
    test_api_basic()
    
    print("\nTo view the interactive API docs, visit: http://localhost:8000/docs") 