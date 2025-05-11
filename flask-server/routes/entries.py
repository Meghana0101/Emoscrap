from flask import Blueprint, request, jsonify, current_app
from models.models import Entry

entries_bp = Blueprint('entries', __name__)

@entries_bp.route('/<user_id>', methods=['POST'])
def create_entry(user_id):
    data = request.get_json()
    db = current_app.config['DB']
    entry_model = Entry(db)
    
    if 'id' in data:
        entry_id = entry_model.update_entry(user_id, data['text'], data['date'])
    else:
        entry_id = entry_model.create_entry(user_id, data['text'], data['date'])
    return jsonify({'message': 'Entry created', 'entryId': entry_id})

@entries_bp.route('/<user_id>', methods=['GET'])
def get_entries(user_id):
    db = current_app.config['DB']
    entry_model = Entry(db)

    entries = entry_model.get_entries_by_user(user_id)
    for entry in entries:
        entry['_id'] = str(entry['_id'])
    return jsonify(entries)

@entries_bp.route('/<user_id>/<date>', methods=['GET'])
def get_entries_by_date(user_id, date):
    db = current_app.config['DB']
    entry_model = Entry(db)
    entry = entry_model.get_entries_by_user_and_date(user_id, date)
    if entry:
        entry['_id'] = str(entry['_id'])
        return jsonify(entry)
    else:
        return jsonify({'message': 'No entry found'})
