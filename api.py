from fastapi import FastAPI, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import List
from contextlib import asynccontextmanager
import numpy as np
from model.model import NeuralNetwork
import uvicorn
import os
from dotenv import load_dotenv

# Global model variable - loaded once at startup
model = None

# Load .env
load_dotenv()
API_KEY = os.environ.get("DIGIT_API_KEY")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan - startup and shutdown events"""
    # Startup
    global model
    print("Loading neural network model...")
    
    try:
        model = NeuralNetwork([784, 16, 16, 10])
        model.load("model/saved_models/model_ep300_lr0_1.pkl")
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        raise e
    
    yield
    
    # Shutdown (cleanup if needed)
    print("Shutting down...")

app = FastAPI(
    title="Digit Recognition API", 
    version="1.0.0",
    lifespan=lifespan
)

class PredictionRequest(BaseModel):
    pixels: List[float]  # 784 pixel values (0-1 normalized)

class PredictionResponse(BaseModel):
    predicted_digit: int
    h1: List[float]  # Activations for hidden layer 1 (16 elements)
    h2: List[float]  # Activations for hidden layer 2 (16 elements)
    o: List[float]   # Activations for output layer (10 elements)

async def verify_api_key(request: Request):
    api_key = request.headers.get("X-API-Key")
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")

@app.get("/", dependencies=[Depends(verify_api_key)])
async def root():
    """Health check endpoint"""
    return {"message": "Digit Recognition API is running!", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse, dependencies=[Depends(verify_api_key)])
async def predict_digit(request: PredictionRequest):
    """
    Predict a digit from 784 pixel values.
    Expects normalized pixel values (0-1) in row-major order (28x28 flattened).
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Validate input
    if len(request.pixels) != 784:
        raise HTTPException(
            status_code=400, 
            detail=f"Expected 784 pixel values, got {len(request.pixels)}"
        )
    
    try:
        # Convert to numpy array and reshape for model
        pixels = np.array(request.pixels).reshape(-1, 1)
        
        # Manually run forward pass to capture intermediate activations
        current_x = pixels
        
        # Get h1 (first hidden layer activations)
        h1_layer = model.layers[0]
        h1 = h1_layer.forward(current_x)
        current_x = h1
        
        # Get h2 (second hidden layer activations)
        h2_layer = model.layers[1]
        h2 = h2_layer.forward(current_x)
        current_x = h2
        
        # Get o (output layer activations)
        o_layer = model.layers[2]
        o = o_layer.forward(current_x)
        
        # Get prediction
        predicted_digit = np.argmax(o)
        
        # Convert to lists and set small values to 0
        h1_list = h1.flatten().tolist()
        h2_list = h2.flatten().tolist()
        o_list = o.flatten().tolist()
        
        # Set activations less than 0.001 to 0 and round to 4 decimal places
        h1_list = [0 if abs(val) < 0.001 else round(val, 4) for val in h1_list]
        h2_list = [0 if abs(val) < 0.001 else round(val, 4) for val in h2_list]
        o_list = [0 if abs(val) < 0.001 else round(val, 4) for val in o_list]
        
        return PredictionResponse(
            predicted_digit=int(predicted_digit),
            h1=h1_list,
            h2=h2_list,
            o=o_list
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")



if __name__ == "__main__":
    # Run the API server
    uvicorn.run(app, host="0.0.0.0", port=8000)