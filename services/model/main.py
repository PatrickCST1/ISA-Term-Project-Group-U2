from fastapi import FastAPI
from pydantic import BaseModel
from model import EmotionClassifier
import uvicorn

app = FastAPI()
classifier = EmotionClassifier()


class Query(BaseModel):
    text: str


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/query")
def handle_query(query: Query):
    return classifier.classify(query.text)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)
