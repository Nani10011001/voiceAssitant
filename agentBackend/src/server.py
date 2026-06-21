from fastapi import FastAPI

app = FastAPI()

@app.get("/hello-docs")
def get_data():
    return {
        "Greeting":"hi i am Nani"
    }