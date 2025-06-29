import numpy as np

# Activation function (TODO: Test in comparison with ReLU)
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# Note that this assumes that a = sigmoid(z)
def sigmoid_derrivative(a):
    return a * (1-a)

class Layer:
    def __init__(self, input_size, output_size):
        # implement function
        return 1
        
    def forward(self, x):
        return 1
    
    def backward(sekf, da, learning_rate):
        return 1
    