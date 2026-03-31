# from fastapi import FastAPI
# from pydantic import BaseModel
# from model import EmotionClassifier
# import uvicorn

# app = FastAPI()
# classifier = EmotionClassifier()


# class Query(BaseModel):
#     text: str


# @app.get("/")
# def read_root():
#     return {"Hello": "World"}


# # @app.post("/query")
# # def handle_query(query: Query):
# #     return classifier.classify(query.text)

# @app.post("/query")
# def handle_query(query: Query):
#     # Get model predictions
#     results = classifier.classify(query.text)

#     # Pick the label with the highest confidence
#     top = max(results, key=lambda r: r["score"])
#     emotion = top["label"]

#     # Map emotions to RGB values (check with Nicky for preferred mapping)
#     rgb_map = {
#         "joy": [255, 223, 0],       # yellow
#         "sadness": [0, 0, 255],     # blue
#         "anger": [255, 0, 0],       # red
#         "surprise": [128, 0, 128],  # purple
#         "neutral": [128, 128, 128], # grey
#         "disgust": [0, 128, 0],     # green
#         "fear": [255, 165, 0],      # orange
#     }

#     # Fallback if emotion not in map
#     rgb = rgb_map.get(emotion, [128, 128, 128])

#     return {"colour": rgb}


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
    # Run the model on the input text
    results = classifier.classify(query.text)

    # Pick the emotion with the highest confidence score
    top = max(results, key=lambda r: r["score"])
    emotion = top["label"]

    # Map emotions to RGB values
    rgb_map = {
        "joy": [255, 223, 0],       # yellow
        "sadness": [0, 0, 255],     # blue
        "anger": [255, 0, 0],       # red
        "surprise": [128, 0, 128],  # purple
        "neutral": [128, 128, 128], # grey
        "disgust": [0, 128, 0],     # green
        "fear": [255, 165, 0],      # orange
    }

    # Return the RGB for the top emotion (fallback to grey if unknown)
    rgb = rgb_map.get(emotion, [128, 128, 128])

    # Assignment requirement: return one colour value, not the full ratings payload.
    return {"colour": rgb}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)
