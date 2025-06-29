import numpy as np

# Activation function (TODO: Test in comparison with ReLU)
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Note that this assumes that a = sigmoid(z)
def sigmoid_derrivative(a):
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
        
    # Propagate error backwards, takes in
    def backward(self, da, learning_rate):
        # da comes from next layer or loss function (mean squared error)
        dz = da * sigmoid_derrivative(self.a)
        
        # Compute dW and db
        dW = np.dot(dz, self.x.T)
        db = dz * 1
        
        # Compute gradient w.r.t input
        dx = np.dot(self.W.T, dz)
        
        # Gradient descent
        self.W = self.W - learning_rate*dW
        self.b = self.b - learning_rate*db
        
        return dx
        
        
    