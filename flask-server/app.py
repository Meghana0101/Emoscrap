from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database()
app.config['DB'] = db

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-here')
jwt = JWTManager(app)

# Blueprints
from routes.auth import auth_bp
from routes.entries import entries_bp
from routes.emotions import emotions_bp

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(entries_bp, url_prefix="/api/entries")
app.register_blueprint(emotions_bp, url_prefix="/api/emotions")

if __name__ == '__main__':
    app.run(debug=True, port=int(os.getenv("PORT", 5000)))
