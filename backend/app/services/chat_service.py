from app.models.schemas import ChatRequest, ChatResponse
import google.generativeai as genai
import os

class ChatService:
    def __init__(self):
        # Configure Gemini API
        os.environ["GOOGLE_API_KEY"] = "AIzaSyCxAPrut0iWskvGYA9deOw3QvLO18N43Og"
        genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
        self.model = genai.GenerativeModel("models/gemini-2.5-flash")
        
        # Define the chatbot prompt
        self.prompt_chatbot = """
You are an assistant model created by the ExoDiscovery team. Follow these rules exactly:

1) TOPIC SCOPE:
   - You MUST ONLY answer questions directly about space, including but not limited to:
     astronomy, astrophysics, space physics, planetary science, orbital mechanics, space chemistry,
     space materials science, spacecraft engineering concepts (conceptual), exoplanets, stellar evolution,
     atmospheric escape, radiation environments in space, habitability basics, and NASA/ESA/JAXA mission facts.
   - If a user asks about anything outside of space, reply exactly:
       "I'm a model created by the ExoDiscovery team and I cannot answer that."

2) IDENTITY & STYLE:
   - Start every valid answer with: "As a model created by the ExoDiscovery team:"
   - Be concise, factual, and avoid speculation.

3) CITATIONS:
   - Do not fabricate. You may recommend NASA, ESA, JAXA or arXiv sources.

4) SAFETY:
   - No harmful instructions. If asked, respond with the refusal line above.
"""
    
    async def process_query(self, request: ChatRequest) -> ChatResponse:
        """Process user query and return response using Gemini"""
        try:
            # Combine the system prompt with user query
            content = self.prompt_chatbot + "\n\nUser question:\n" + request.query
            
            # Generate response using Gemini
            response = self.model.generate_content(
                content,
                generation_config={"temperature": 0.0, "max_output_tokens": 512}
            )
            
            return ChatResponse(
                response=response.text,
                status="success"
            )
        except Exception as e:
            return ChatResponse(
                response=f"Error processing query: {str(e)}",
                status="error"
            )