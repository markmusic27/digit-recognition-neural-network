from utils.data_loader import load_data
from utils.utils import one_hot_encode, loss, loss_derivative
from model.model import NeuralNetwork
import numpy as np
import time

# Note that y_train must be one hot encoded
def train(model: NeuralNetwork, X_train, y_train, epochs, learning_rate):
    start_time = time.time()
    
    for epoch in range(epochs):
        epoch_start_time = time.time()
        total_loss = 0
        correct = 0
        
        # Itterate through all training examples
        for x, y, in zip(X_train, y_train):
            # Transform matrix into column vectors
            x = x.reshape(-1, 1)
            y = y.reshape(-1, 1)
            
            output = model.forward(x)
            
            # Check if correct to track accuracy
            pred = np.argmax(output)
            
            if (pred == np.argmax(y)):
                correct+= 1
            
            
            # Compute loss
            total_loss += loss(output, y)
            
            # Compares output probabilities to expected probability
            da = loss_derivative(output, y)
            
            model.backward(da, learning_rate)
        
        avg_loss = total_loss / len(X_train)
        acc = correct / len(X_train)
        
        # Calculate timing information
        elapsed_time = time.time() - start_time
        avg_epoch_time = elapsed_time / (epoch + 1)
        remaining_epochs = epochs - (epoch + 1)
        estimated_remaining = avg_epoch_time * remaining_epochs
        
        # Format time strings
        elapsed_str = f"{int(elapsed_time//60):02d}:{int(elapsed_time%60):02d}"
        remaining_str = f"{int(estimated_remaining//60):02d}:{int(estimated_remaining%60):02d}"
        
        # Prints loss after each epoch
        print(f"Epoch {epoch + 1}/{epochs}, Loss: {avg_loss:.4f}, Acc: {acc:.4f}, Time: {elapsed_str}, ETA: {remaining_str}")
        
        

if __name__ == "__main__":
    model = NeuralNetwork([784, 16, 16, 10])
    X_train, y_train, _, _ = load_data()
    
    y_encoded = one_hot_encode(y_train)
    
    train(model, X_train, y_encoded, epochs=3, learning_rate=0.1)
    