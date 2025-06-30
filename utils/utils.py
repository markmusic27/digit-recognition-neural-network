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
    return 0.5 * np.sum((a - y) ** 2)

def loss_derivative(output, y):
    return output - y
    