from transformers import pipeline
import torch


class EmotionClassifier:
    def __init__(self):
        self.classifier = pipeline(
            "text-classification",
            model="j-hartmann/emotion-english-distilroberta-base",
            top_k=None
        )

    def classify(self, text: str) -> list:
        result = self.classifier(text)
        print("result:", result)
        return result[0]