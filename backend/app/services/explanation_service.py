# import google.generativeai as genai
# import os
# import pandas as pd
# from typing import Dict, List, Any

# class ExplanationService:
#     def __init__(self):
#         # Configure Gemini API
#         os.environ["GOOGLE_API_KEY"] = "AIzaSyCxAPrut0iWskvGYA9deOw3QvLO18N43Og"
#         genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
#         self.model = genai.GenerativeModel("models/gemini-2.5-flash")
        
#         # Define the explanation prompt
#         self.explanation_prompt = """
# You are an expert AI assistant created by the ExoDiscovery team specializing in exoplanet data analysis and machine learning predictions. 

# Your task is to explain exoplanet classification predictions in a clear, scientific, and accessible way.

# Guidelines:
# 1. Start every response with: "As a model created by the ExoDiscovery team:"
# 2. Focus on the scientific significance of the prediction
# 3. Explain what the prediction means in terms of exoplanet characteristics
# 4. Use bullet points for clarity
# 5. Keep explanations concise but informative
# 6. Reference the key features that influenced the prediction
# 7. Provide context about what makes a planet "confirmed" vs "candidate"

# For prediction explanations, include:
# - What the prediction means (confirmed planet, candidate, false positive)
# - Key features that influenced the decision
# - Scientific significance of the result
# - What this means for exoplanet research
# """
    
#     async def explain_predictions(self, predictions: List[Any], sample_data: Dict, 
#                                 dataset_type: str, preprocessing_info: Dict) -> Dict:
#         """Generate explanations for batch predictions"""
#         explanations = []
        
#         for i, prediction in enumerate(predictions):
#             # Get sample data for this prediction
#             sample_row = sample_data.get('sample_data', {})
            
#             # Create explanation for this prediction
#             explanation = await self._generate_single_explanation(
#                 prediction, sample_row, dataset_type, i
#             )
#             explanations.append(explanation)
        
#         return {
#             'explanations': explanations,
#             'summary': await self._generate_summary_explanation(
#                 predictions, dataset_type, preprocessing_info
#             )
#         }
    
#     async def _generate_single_explanation(self, prediction: Any, sample_data: Dict, 
#                                          dataset_type: str, index: int) -> str:
#         """Generate explanation for a single prediction"""
#         try:
#             # Convert prediction to readable format
#             pred_label = self._get_prediction_label(prediction, dataset_type)
            
#             # Create feature summary for the sample
#             feature_summary = self._create_feature_summary(sample_data, dataset_type)
            
#             prompt = f"""
# {self.explanation_prompt}

# Dataset Type: {dataset_type.upper()}
# Prediction: {pred_label}
# Sample Data Features: {feature_summary}

# Please explain this exoplanet classification prediction, focusing on:
# 1. What this prediction means scientifically
# 2. Key features that likely influenced this result
# 3. The significance for exoplanet research
# 4. What makes this a {pred_label} classification

# Keep the explanation concise but informative, using bullet points.
# """
            
#             response = self.model.generate_content(
#                 prompt,
#                 generation_config={"temperature": 0.3, "max_output_tokens": 300}
#             )
            
#             return response.text
            
#         except Exception as e:
#             return f"Error generating explanation: {str(e)}"
    
#     async def _generate_summary_explanation(self, predictions: List[Any], 
#                                           dataset_type: str, preprocessing_info: Dict) -> str:
#         """Generate summary explanation for all predictions"""
#         try:
#             # Count prediction types
#             pred_counts = {}
#             for pred in predictions:
#                 label = self._get_prediction_label(pred, dataset_type)
#                 pred_counts[label] = pred_counts.get(label, 0) + 1
            
#             # Create summary
#             total_predictions = len(predictions)
#             original_rows = preprocessing_info.get('original_rows', 0)
            
#             prompt = f"""
# {self.explanation_prompt}

# Dataset Analysis Summary:
# - Dataset Type: {dataset_type.upper()}
# - Total Predictions: {total_predictions}
# - Original Data Rows: {original_rows}
# - Prediction Distribution: {pred_counts}

# Please provide a summary analysis of these exoplanet predictions, including:
# 1. Overall assessment of the dataset quality
# 2. What the prediction distribution tells us
# 3. Scientific insights from the results
# 4. Recommendations for further analysis

# Keep it concise and scientific.
# """
            
#             response = self.model.generate_content(
#                 prompt,
#                 generation_config={"temperature": 0.3, "max_output_tokens": 400}
#             )
            
#             return response.text
            
#         except Exception as e:
#             return f"Error generating summary: {str(e)}"
    
#     def _get_prediction_label(self, prediction: Any, dataset_type: str) -> str:
#         """Convert numerical prediction to readable label"""
#         if isinstance(prediction, (int, float)):
#             if dataset_type == 'kepler':
#                 if prediction == 1:
#                     return "CONFIRMED PLANET"
#                 elif prediction == 0:
#                     return "CANDIDATE PLANET"
#                 else:
#                     return "FALSE POSITIVE"
#             elif dataset_type == 'tess':
#                 if prediction == 1:
#                     return "PLANET CANDIDATE"
#                 else:
#                     return "FALSE POSITIVE"
#             elif dataset_type == 'k2':
#                 if prediction == 1:
#                     return "CONFIRMED PLANET"
#                 elif prediction == 0:
#                     return "CANDIDATE PLANET"
#                 else:
#                     return "FALSE POSITIVE"
        
#         return str(prediction)
    
#     def _create_feature_summary(self, sample_data: Dict, dataset_type: str) -> str:
#         """Create a summary of key features for explanation"""
#         key_features = []
        
#         if dataset_type == 'kepler':
#             key_features = ['koi_period', 'koi_prad', 'koi_teq', 'koi_depth', 'koi_model_snr']
#         elif dataset_type == 'tess':
#             key_features = ['pl_orbper', 'pl_rade', 'pl_eqt', 'pl_trandep', 'st_tmag']
#         elif dataset_type == 'k2':
#             key_features = ['pl_rade', 'sy_dist', 'sy_vmag', 'st_rad']
        
#         summary_parts = []
#         for feature in key_features:
#             if feature in sample_data:
#                 value = sample_data[feature]
#                 if isinstance(value, (int, float)):
#                     summary_parts.append(f"{feature}: {value:.2f}")
#                 else:
#                     summary_parts.append(f"{feature}: {value}")
        
#         return ", ".join(summary_parts[:5])  # Limit to 5 key features
