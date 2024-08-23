from flask import Blueprint, jsonify, request
from models import db, TodoItem

main = Blueprint('main', __name__)

@main.route('/todos', methods=['GET'])
def get_todos():
    todos = TodoItem.query.all()
    return jsonify([todo.todo_list() for todo in todos])

@main.route('/todos', methods=['POST'])
def add_todo():
    data = request.json
    new_todo = TodoItem(content=data['content'])
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.todo_list()), 201

@main.route('/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    data = request.json
    todo = TodoItem.query.get(id)
    if todo:
        todo.content = data['content']
        todo.completed = data['completed']
        db.session.commit()
        return jsonify(todo.todo_list())
    return jsonify({'error': 'Todo not found'}), 404

@main.route('/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    todo = TodoItem.query.get(id)
    if todo:
        db.session.delete(todo)
        db.session.commit()
        return jsonify({'message': 'Todo deleted successfully'})
    return jsonify({'error': 'Todo not found'}), 404

@main.route('/todos/search', methods=['GET'])
def search_todo():
    query = request.args.get('query')
    todos = TodoItem.query.filter(TodoItem.content.ilike(f'%{query}%')).all()
    return jsonify([todo.todo_list() for todo in todos])
