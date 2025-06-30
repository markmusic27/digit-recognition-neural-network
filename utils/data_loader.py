import numpy as np
import struct

def load_images(path):
    file = open(path, "rb")
    
    try:
        magic, num, rows, cols = struct.unpack(">IIII", file.read(16))
        
        image_data = file.read()
        images = np.frombuffer(image_data, dtype=np.uint8).reshape(num, rows * cols)
        
        return images / 255.0
    finally:
        file.close()
        
def load_labels(path):
    file = open(path, "rb")
    
    try:
        magic, num = struct.unpack(">II", file.read(8))
        labels = np.frombuffer(file.read(), dtype=np.uint8)
        
        return labels
    finally:
        file.close()

def load_data():
    path = "data"
    X_train = load_images(f"{path}/train-images.idx3-ubyte")
    y_train = load_labels(f"{path}/train-labels.idx1-ubyte")
    
    X_test = load_images(f"{path}/train-images.idx3-ubyte")
    y_test = load_labels(f"{path}/train-labels.idx1-ubyte")
    
    return X_train, y_train, X_test, y_test

