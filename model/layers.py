import numpy as np

# Activation function (TODO: Test in comparison with ReLU)
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Note that this assumes that a = sigmoid(z)
def sigmoid_derivative(a):
    return a * (1-a)

class Layer:
    def __init__(self, input_size, output_size):
        
        # Xavier initialization (normalizes matrix)
        self.W = np.random.randn(output_size, input_size) * np.sqrt(1/input_size)
        
        # Set bias to zero at first
        self.b = np.zeros((output_size, 1))
    
    # Returns activation given, old activations, and weights
    def forward(self, x):
        self.x = x
        self.z = np.dot(self.W, x) + self.b
        self.a = sigmoid(self.z)
        
        return self.a
        
    # Propagate error backwards, takes in da from next layer
    def backward(self, da, learning_rate):
        # Step 1: dz = da * sigmoid'(z) 
        sig_der_at_z = sigmoid_derivative(self.a)  # Shape: (output_size, 1)
        dz = da * sig_der_at_z

        # Step 2: dW = dz @ x.T
        dW = dz @ self.x.T

        # Step 3: db = dzs
        db = dz

        # Step 4: Gradient descent step
        self.W -= learning_rate * dW
        self.b -= learning_rate * db

        # Step 5: dx = W.T @ dz
        dx = self.W.T @ dz

        return dx

        
    