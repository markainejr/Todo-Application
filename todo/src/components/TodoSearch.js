import React, { useState } from 'react';

function TodoSearch({ todos = [], setFilteredTodos }) {
    const [searchTerm, setSearchTerm] = useState('');

    function handleSearch (e) {
        const term = e.target.value;
        setSearchTerm(term);
        const filtered = todos.filter(todo => todo.content.toLowerCase().includes(term.toLowerCase()));
        setFilteredTodos(filtered);
    };

    return (
        <div>
            <br/>
            <br/>
            <input 
                type="text" 
                value={searchTerm} 
                onChange={handleSearch} 
                placeholder="Search todos" 
            />
        </div>
    );
}

export default TodoSearch;
