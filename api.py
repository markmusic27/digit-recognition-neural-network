from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from contextlib import asynccontextmanager
import numpy as np
from model.model import NeuralNetwork
import uvicorn

# Global model variable - loaded once at startup
model = None

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
    confidence_scores: List[float]  # Raw output probabilities for all 10 digits

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Digit Recognition API is running!", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
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
        
        # Get raw output from model (before argmax)
        raw_output = model.forward(pixels)
        confidence_scores = raw_output.flatten().tolist()
        
        # Get prediction
        predicted_digit = model.predict(pixels)
        
        return PredictionResponse(
            predicted_digit=int(predicted_digit),
            confidence_scores=confidence_scores
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")



if __name__ == "__main__":
    # Run the API server
    uvicorn.run(app, host="0.0.0.0", port=8000)