import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoSearch from './TodoSearch';

function Todo() {
    const [todos, setTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingTodo, setEditingTodo] = useState(null);
    const [editingContent, setEditingContent] = useState('');

    useEffect(() => {
        axios.get('/api/todos')
            .then(response => {
                setTodos(response.data);
                setFilteredTodos(response.data);
            })
            .catch(error => console.error('There was an error fetching the todos!', error));
    }, []);

    useEffect(() => {
        setFilteredTodos(todos);
    }, [todos]);

    function addTodo() {
        const newTodoItem = { content: newTodo, completed: false };
        setTodos([...todos, newTodoItem]);                            // Update UI immediately
        setNewTodo('');

        axios.post('/api/todos', newTodoItem)
            .then(response => {
                // Update the new todo item with the response data
                setTodos(todos => todos.map(todo => todo === newTodoItem ? response.data : todo));
            })
            .catch(error => {
                console.error('There was an error adding the todo!', error);
                // Revert UI if there's an error
                setTodos(todos => todos.filter(todo => todo !== newTodoItem));
            });
    }

    function toggleComplete(id) {
        const todo = todos.find(todo => todo.id === id);
        const updatedTodo = { ...todo, completed: !todo.completed };
        setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo)); // Update UI immediately

        axios.put(`/api/todos/${id}`, updatedTodo)
            .then(response => {
                setTodos(todos.map(todo => todo.id === id ? response.data : todo));
            })
            .catch(error => {
                console.error('There was an error updating the todo!', error);
                setTodos(todos.map(todo => todo.id === id ? todo : updatedTodo)); // Revert UI if there's an error
            });
    }

    function deleteTodo(id) {
        const remainingTodos = todos.filter(todo => todo.id !== id);
        setTodos(remainingTodos); // Update UI immediately

        axios.delete(`/api/todos/${id}`)
            .then(() => {
                console.log('Todo deleted successfully');
            })
            .catch(error => {
                console.error('There was an error deleting the todo!', error);
                setTodos(todos); // Revert UI if there's an error
            });
    }

    function startEditing(todo) {
        setEditingTodo(todo);
        setEditingContent(todo.content);
    }

    function updateTodo(id) {
        const updatedTodo = { ...editingTodo, content: editingContent };
        setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo)); // Update UI immediately
        setEditingTodo(null);
        setEditingContent('');

        axios.put(`/api/todos/${id}`, updatedTodo)
            .then(response => {
                setTodos(todos.map(todo => todo.id === id ? response.data : todo));
            })
            .catch(error => {
                console.error('There was an error updating the todo!', error);
                setTodos(todos.map(todo => todo.id === id ? todo : updatedTodo)); // Revert UI if there's an error
            });
    }

    return (
        <div>
            <h1>Todo List</h1>
            <input 
                type="text" 
                value={newTodo} 
                onChange={e => setNewTodo(e.target.value)} 
                placeholder="Enter new todo" 
            />
            <br/>
            <br/>
            <button onClick={addTodo}>Add Todo</button>
            <TodoSearch todos={todos} setFilteredTodos={setFilteredTodos} />
            <ul>
                {filteredTodos.map(todo => (
                    <li key={todo.id}>
                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                            {todo.content}
                        </span>
                        <button onClick={() => toggleComplete(todo.id)}>Toggle Complete</button>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                        <button onClick={() => startEditing}>Edit</button>
                    </li>
                ))}
            </ul>
            {editingTodo && (
                <div>
                    <input 
                        type="text" 
                        value={editingContent} 
                        onChange={e => setEditingContent(e.target.value)} 
                    />
                    <button onClick={() => updateTodo(editingTodo.id)}>Update Todo</button>
                </div>
            )}
        </div>
    );
}

export default Todo;
