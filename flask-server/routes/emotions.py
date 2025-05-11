from flask import Blueprint, request, jsonify
from utils.emotionClassifier import predict_emotions
from collections import Counter

emotions_bp = Blueprint('emotions', __name__)

emotion_polarity = {
    "admiration": "positive", "amusement": "positive", "approval": "positive",
    "caring": "positive", "curiosity": "positive", "desire": "positive",
    "excitement": "positive", "gratitude": "positive", "joy": "positive",
    "love": "positive", "optimism": "positive", "pride": "positive",
    "relief": "positive",

    "anger": "negative", "annoyance": "negative", "disappointment": "negative",
    "disapproval": "negative", "disgust": "negative", "embarrassment": "negative",
    "fear": "negative", "grief": "negative", "nervousness": "negative",
    "remorse": "negative", "sadness": "negative",

    "confusion": "neutral", "realization": "neutral", "surprise": "neutral",
    "neutral": "neutral"
}

def classify_overall_sentiment(predicted_emotions):
    if not predicted_emotions:
        return "positive"
    
    polarities = [emotion_polarity.get(emotion, "") for emotion in predicted_emotions]
    polarity_counts = Counter(polarities)
    most_common = polarity_counts.most_common(1)[0][0]
    return most_common

@emotions_bp.route('/classify', methods=['POST'])
def classify():
    data = request.get_json()
    entries = data.get('entries')
    emotions = []
    print(entries)
    for entry in entries:
        predictions, _ = predict_emotions(entry['text'])
        overall_sentiment = classify_overall_sentiment(predictions)
        emotions.append({
            'date': entry['date'],
            'emotions': predictions,
            'sentiment': overall_sentiment
        })
    return jsonify({'emotions': emotions})
