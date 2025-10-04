import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import os

class MLModel:
    def __init__(self):
        self.model = None
        self.model_path = "models/trained_model.pkl"
        self.load_model()
    
    def load_model(self):
        """Load the trained model from disk"""
        try:
            if os.path.exists(self.model_path):
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                print("Model loaded successfully")
            else:
                # Initialize a default model (you can replace this with your actual model)
                self.model = RandomForestClassifier(n_estimators=100, random_state=42)
                print("Initialized new model")
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
    
    def save_model(self):
        """Save the trained model to disk"""
        try:
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            with open(self.model_path, 'wb') as f:
                pickle.dump(self.model, f)
            print("Model saved successfully")
        except Exception as e:
            print(f"Error saving model: {e}")
    
    def predict(self, features: List[float]) -> Any:
        """Make prediction for single input"""
        try:
            features_array = np.array(features).reshape(1, -1)
            prediction = self.model.predict(features_array)
            return prediction[0]
        except Exception as e:
            print(f"Prediction error: {e}")
            return None
    
    def predict_batch(self, features_list: List[List[float]]) -> List[Any]:
        """Make predictions for multiple inputs"""
        try:
            features_array = np.array(features_list)
            predictions = self.model.predict(features_array)
            return predictions.tolist()
        except Exception as e:
            print(f"Batch prediction error: {e}")
            return []
    
    def train(self, X, y):
        """Train the model with new data"""
        try:
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            self.model.fit(X_train, y_train)
            
            # Calculate accuracy
            y_pred = self.model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            
            self.save_model()
            return accuracy
        except Exception as e:
            print(f"Training error: {e}")
            return None