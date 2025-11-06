from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import google.generativeai as genai
import os
from dotenv import load_dotenv
import random



load_dotenv()

app = Flask(__name__)

CORS(app, origins="*")  



genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


MONGO_URI = os.getenv("MONGO_URI")

mongo_client = MongoClient(MONGO_URI)



db = mongo_client["movieDB"]
collection = db["recommendations"]








@app.route("/recommend", methods=["POST"])

def recommend_movies():

    data = request.get_json()

    preference = data.get("preference", "")

    if not preference:

        return jsonify({"error": "No preference provided"}), 400

    prompt = f"Recommend 5 movies based on: {preference}. Give only the movie titles in a simple list."

    try:
        model = genai.GenerativeModel("gemini-pro")

        response = model.generate_content(prompt)

        movies_text = response.text.strip()

        movies = [m.strip(" -0123456789. ") for m in movies_text.split("\n") if m.strip()]

    except Exception as e:

        print("Gemini API Error:", str(e))

        fallback_sets = [
            ["Inception", "Interstellar", "Tenet", "The Dark Knight", "Memento"],

            ["Dunki", "Jawan", "Pathaan", "War", "Tiger Zinda Hai"],

            ["3 Idiots", "PK", "Lagaan", "Chhichhore", "Taare Zameen Par"],
        ]

        movies = random.choice(fallback_sets)


    collection.insert_one({
        
        "user_input": preference,

        "recommended_movies": movies,

        "timestamp": datetime.now()
    })

    return jsonify({"recommended_movies": movies})









@app.route("/history", methods=["GET"])

def get_history():

    history = list(collection.find({}, {"_id": 0}).sort("timestamp", -1))
    return jsonify(history)











if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
