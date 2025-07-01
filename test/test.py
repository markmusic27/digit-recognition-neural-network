from model.model import NeuralNetwork

def test_accuracy(model: NeuralNetwork, X_test, y_test, verbose=True):
    """
    Test the accuracy of a neural network model on test data.
    
    Args:
        model: Trained NeuralNetwork instance
        X_test: Test input data (samples x features)
        y_test: Test labels (not one-hot encoded)
        verbose: Whether to print detailed results
    
    Returns:
        accuracy: Float between 0 and 1 representing the accuracy
    """
    correct_predictions = 0
    total_predictions = len(X_test)
    
    # Track predictions for confusion analysis
    predictions = []
    true_labels = []
    
    if verbose:
        print(f"Testing model on {total_predictions} samples...")
    
    for i, (x, true_label) in enumerate(zip(X_test, y_test)):
        # Reshape input to column vector for model
        x = x.reshape(-1, 1)
        
        # Get prediction
        predicted_label = model.predict(x)
        
        predictions.append(predicted_label)
        true_labels.append(true_label)
        
        if predicted_label == true_label:
            correct_predictions += 1
        
        # Show progress for large datasets
        if verbose and (i + 1) % 1000 == 0:
            current_acc = correct_predictions / (i + 1)
            print(f"Progress: {i + 1}/{total_predictions} - Current accuracy: {current_acc:.4f}")
    
    accuracy = correct_predictions / total_predictions
    
    if verbose:
        print(f"\n=== Model Test Results ===")
        print(f"Total samples: {total_predictions}")
        print(f"Correct predictions: {correct_predictions}")
        print(f"Incorrect predictions: {total_predictions - correct_predictions}")
        print(f"Accuracy: {accuracy:.4f} ({accuracy * 100:.2f}%)")
        
        # Show some example misclassifications
        misclassified = [(i, predictions[i], true_labels[i]) 
                        for i in range(len(predictions)) 
                        if predictions[i] != true_labels[i]]
        
        if misclassified:
            print(f"\nFirst 5 misclassifications:")
            for i, (idx, pred, true) in enumerate(misclassified[:5]):
                print(f"  Sample {idx}: Predicted {pred}, Actual {true}")
    
    return accuracy