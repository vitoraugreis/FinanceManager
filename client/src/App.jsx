import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
    const [categories, setCategories] = useState([])
    useEffect(() => {
        fetch('http://localhost:5255/api/categories')
        .then(res => res.json())
        .then(data => {
            setCategories(data);
        })
    }, []);
    return (
    <div>
        <h1>Categorias</h1>
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
