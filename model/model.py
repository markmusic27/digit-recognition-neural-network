import numpy as np
from model.layers import Layer

class NeuralNetwork:
    def __init__(self, layer_sizes):
        
        self.layers = []
        
        for i in range(len(layer_sizes) - 1):
             layer = Layer(layer_sizes[i], layer_sizes[i+1])
             self.layers.append(layer)
    
    def forward(self, x):
        current_x = x
        
        for layer in self.layers:
            current_x = layer.forward(current_x)
        
        return current_x
    
    def backward(self, da, learning_rate):
        current_da = da # Will initially be (a-y)
        
        # Back to front
        for layer in reversed(self.layers):
            current_da = layer.backward(current_da, learning_rate)
            
    def predict(self, x):
        output = self.forward(x)
        
        # Picks output with highest activation
        return np.argmax(output)
    