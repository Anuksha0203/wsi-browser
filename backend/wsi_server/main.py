# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
#CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  #Integrate with frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hello")
async def read_hello():
    return {"message": "Hello World!"}