import { useEffect, useState } from 'react'
import './App.css'

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState("#1cba34");
    const [error, setError] = useState(null);

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
        const categoryData = {name: newCategoryName, color: newCategoryColor};

        fetch('http://localhost:5255/api/categories', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(categoryData),
        })
        .then(async (response) => {
            if (response.ok) {
                const newlyCreatedCategory = await response.json();
                setCategories(currentCategories => [...currentCategories, newlyCreatedCategory]);
                setNewCategoryName('');
                setError(null);
            } else if (response.status == 409) {
                // Erro de conflito.
                const errorMessage = await response.text(); 
                setError(errorMessage);
            } else {
                // Outros erros.
                setError('Ocorreu um erro ao criar a categoria.');
            }
        })
        .catch(networkError => {
            // Erros de rede.
            setError('Não foi possível conectar ao servidor.');
            console.error('Erro de rede:', networkError);
        });
    };

    const handleDelete = (idToDelete) => {
        fetch(`http://localhost:5255/api/categories/${idToDelete}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Cria um novo array contendo apenas as categorias que permanecem no sistema.
                setCategories(currentCategories =>
                    currentCategories.filter(category => category.id !== idToDelete)
                );
            } else {
                alert('Não foi possível remover a categoria.');rt
            }
        });
    };

    return (
    <div>
        <h1>Categorias</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nome da nova categoria:</label>
                <input 
                    type="text"
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                />
            </div>
            <div>
                <label>Cor da categoria:</label>
                <input
                    type='color'
                    value={newCategoryColor}
                    onChange={e => setNewCategoryColor(e.target.value)}
                />
            </div>
            <button type="submit">Adicionar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <hr/>
        <ul>
        {
            categories.map(category => (
                <li key={category.id}>
                    {category.name}
                    <button onClick={() => handleDelete(category.id)}>Remover</button>
                </li>
            ))
        }
        </ul>
    </div>
  );
}

export default CategoriesPage
