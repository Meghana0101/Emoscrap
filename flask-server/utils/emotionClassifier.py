import torch
import torch.nn as nn
from transformers import BertTokenizer, BertModel
import sys
import json

# Define emotion labels
emotion_labels = [
    "admiration", "amusement", "anger", "annoyance", "approval", "caring",
    "confusion", "curiosity", "desire", "disappointment", "disapproval",
    "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief",
    "joy", "love", "nervousness", "neutral", "optimism", "pride",
    "realization", "relief", "remorse", "sadness", "surprise"
]

# Emotion classification model
class EmotionClassifier(nn.Module):
    def __init__(self, num_labels=28):
        super(EmotionClassifier, self).__init__()
        self.bert = BertModel.from_pretrained("bert-base-uncased")
        self.dropout = nn.Dropout(0.3)
        self.classifier = nn.Linear(self.bert.config.hidden_size, num_labels)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.pooler_output
        x = self.dropout(pooled_output)
        return self.classifier(x)

# Prediction function
def predict_emotions(text, threshold=0.5):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    model = EmotionClassifier(num_labels=len(emotion_labels))
    model.load_state_dict(torch.load("best_emotion_model.pt", map_location=device))
    model.to(device)
    model.eval()

    encoding = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    )

    input_ids = encoding["input_ids"].to(device)
    attention_mask = encoding["attention_mask"].to(device)

    with torch.no_grad():
        outputs = model(input_ids, attention_mask)
        probs = torch.sigmoid(outputs).cpu().numpy()[0]

    predicted_labels = [emotion_labels[i] for i, prob in enumerate(probs) if prob >= threshold]
    confidence_scores = {emotion_labels[i]: float(f"{prob:.2f}") for i, prob in enumerate(probs)}

    return predicted_labels, confidence_scores

# CLI execution
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide input text as a command line argument.")
        sys.exit(1)

    text = sys.argv[1]
    labels, scores = predict_emotions(text)
    print(json.dumps({"labels": labels, "scores": scores}))
