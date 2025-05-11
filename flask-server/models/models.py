from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

class User:
    def __init__(self, db):
        self.collection = db['users']

    def create_user(self, username, email, password):
        hashed_password = generate_password_hash(password)
        result = self.collection.insert_one({
            'username': username,
            'email': email,
            'password': hashed_password
        })
        return str(result.inserted_id)

    def find_by_email(self, email):
        return self.collection.find_one({'email': email})

    def check_password(self, hashed_password, password):
        return check_password_hash(hashed_password, password)

class Entry:
    def __init__(self, db):
        self.collection = db['entries']

    def create_entry(self, user_id, text, date):
        result = self.collection.insert_one({
            'userId': user_id,
            'text': text,
            'date': date
        })
        return str(result.inserted_id)
    
    def update_entry(self, user_id, text, date):
        result = self.collection.update_one(
                    {'userId': user_id, 'date': date},
                    {'$set': {'text': text}}
                )

    def get_entries_by_user(self, user_id):
        return list(self.collection.find({'userId': user_id}))
    
    def get_entries_by_user_and_date(self, user_id, date):
        return self.collection.find_one({'userId': user_id, 'date': date})
