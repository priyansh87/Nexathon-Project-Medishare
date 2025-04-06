from pymongo import MongoClient
from langchain_core.documents import Document
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings
from langchain_groq import ChatGroq
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from typing import Optional
import os
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()



# Initialize FastAPI app
app = FastAPI(title="MediShare Chatbot API", 
              description="API for querying the MediShare healthcare assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Pydantic model for request validation
class ChatRequest(BaseModel):
    query: str
    user_id: Optional[str] = None

# Pydantic model for response
class ChatResponse(BaseModel):
    answer: str

# Initialize global variables for chatbot components
global_retrieval_chain = None
global_vectorstore = None

# Setup function to initialize the chatbot
def setup_chatbot():
    global global_retrieval_chain, global_vectorstore

    # --- Load PDF Documents --- #
    try:
        pdf_loader = PyPDFLoader("medishareDocs.pdf")
        pdf_docs = pdf_loader.load()
    except Exception as e:
        print(f"Error loading PDF: {e}")
        pdf_docs = []

    # --- Load MongoDB Medicine Documents --- #
    def fetch_mongo_documents():
        try:
            MONGO_URI = os.environ.get("MONGO_URI")
            
            client = MongoClient(MONGO_URI)
            collection = client["test"]["medicines"]
            medicines = list(collection.find())
            mongo_docs = []
            for med in medicines:
                content = f"""
                Name: {med.get('name')}
                Description: {med.get('description')}
                Price: ₹{med.get('price')}
                Quantity: {med.get('quantity')}
                Expiration Date: {med.get('expirationDate')}
                Donated By (User ID): {med.get('donatedBy')}
                """
                mongo_docs.append(Document(page_content=content.strip()))
            return mongo_docs
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            return []

    # --- Combine PDF and MongoDB Documents --- #
    all_docs = pdf_docs + fetch_mongo_documents()

    if not all_docs:
        print("Warning: No documents loaded. Chatbot may not provide useful answers.")

    # --- Create Vector Store --- #
    embeddings = OllamaEmbeddings(model="llama2")
    global_vectorstore = FAISS.from_documents(all_docs, embeddings)
    retriever = global_vectorstore.as_retriever()

    # --- Initialize LLM --- #
    groq_api_key = os.environ.get("GROQ_API_KEY")
    llm = ChatGroq(
        groq_api_key=groq_api_key,
        model="llama3-8b-8192"
    )

    # --- Enhanced Prompt --- #
    prompt = ChatPromptTemplate.from_template("""
    You are a professional AI healthcare assistant for MediShare. Based on the user's query and the provided context, which may include available medicines and MediShare policies, provide a helpful and accurate response.
    Your goals:
    1. Understand the user's health concern or question.
    2. If medicines are mentioned in the context, recommend them only if relevant.
    3. Mention their **availability**, **price**, and **purpose** clearly.
    4. If no relevant medicine is found, politely inform the user.
    5. Always stay professional and medically aware. Never make up data.
    NOTE : give only relevant info if asked don't yap info. Concise answer is important.
    <context>
    {context}
    </context>
    User: {input}
    Your Response:
    """)

    # --- Create Chains --- #
    doc_chain = create_stuff_documents_chain(llm, prompt)
    global_retrieval_chain = create_retrieval_chain(retriever, doc_chain)

    print("Chatbot setup complete")

# Startup event to initialize chatbot
@app.on_event("startup")
async def startup_event():
    setup_chatbot()

# ChatBot endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if global_retrieval_chain is None:
        raise HTTPException(status_code=500, detail="Chatbot is not initialized. Please try again later.")

    try:
        context = {}
        if request.user_id:
            context["user_id"] = request.user_id

        response = global_retrieval_chain.invoke({"input": request.query})
        return ChatResponse(answer=response["answer"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "vectorstore_initialized": global_vectorstore is not None}

# Refresh data endpoint
@app.post("/refresh-data")
async def refresh_data():
    try:
        setup_chatbot()
        return {"status": "success", "message": "Data refreshed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refreshing data: {str(e)}")

# Run the app with uvicorn if executed directly
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=9100, reload=True)
