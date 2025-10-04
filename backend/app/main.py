from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from app.routes import chat, predict, train

app = FastAPI(title="ML Model API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
app.include_router(predict.router, prefix="/api/v1", tags=["prediction"])
app.include_router(train.router, prefix="/api/v1", tags=["training"])

@app.get("/")
async def root():
    return {"message": "ML Model API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}