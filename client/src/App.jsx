import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [categories, setCategories] = useState([])
    const [newCategoryName, setNewCategoryName] = useState('')
    useEffect(() => {
        fetch('http://localhost:5255/api/categories')
        .then(res => res.json())
        .then(data => {
            setCategories(data);
        })
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        // Objeto com os dados que a API espera.
        const categoryData = {
            name: newCategoryName
        };

        fetch('http://localhost:5255/api/categories', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(categoryData),
        })
        .then(response => response.json())
        .then(newlyCreatedCategory => {
            // Adiciona a nova categoria à lista existente na tela.
            setCategories(currentCategories => [...currentCategories, newlyCreatedCategory]);
            setNewCategoryName('');
        });
    };

    return (
    <div>
        <h1>Categorias</h1>
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="Nome da nova categoria"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
            />
            <button type="submit">Adicionar</button>
        </form>
        <hr/>
        <ul>
        {
            categories.map(category => (
                <li key={category.id}>{category.name}</li>
            ))
        }
        </ul>
    </div>
  );
}

export default App
