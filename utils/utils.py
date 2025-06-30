import matplotlib.pyplot as plt
import numpy as np

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
    