import { useEffect, useState } from 'react'

function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newTransactionData, setNewTransactionData] = useState({
        name: '',
        description: '',
        amount: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        accountId: '',
        categoryId: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5255/api/transactions')
        .then(res => res.json())
        .then(data => {
            setTransactions(data);
        })
    }, []);

    useEffect(() => {
        fetch('http://localhost:5255/api/accounts')
        .then(res => res.json())
        .then(data => {
            setAccounts(data);
        })
    }, []);

    useEffect(() => {
        fetch('http://localhost:5255/api/categories')
        .then(res => res.json())
        .then(data => {
            setCategories(data);
        })
    }, []);

    const formChange = (event) => {
        const {name, value} = event.target;

        // Copia os valores antigos do estado e sobrescreve a propriedade que mudou.
        setNewTransactionData(prevNewTransactionData => ({
            ...prevNewTransactionData,
            [name]: value
        }));
    };

    const formSubmit = (e) => {
        e.preventDefault();

        const transactionData = {
            ...newTransactionData,
            amount: parseFloat(newTransactionData.amount) || 0,
            type: parseInt(newTransactionData.type, 10),
            accountId: parseInt(newTransactionData.accountId, 10),
            categoryId: parseInt(newTransactionData.categoryId, 10)
        }

        fetch('http://localhost:5255/api/transactions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(transactionData),
        })
        .then(async (response) => {
            if (response.ok) {
                fetch('http://localhost:5255/api/transactions')
                .then(res => res.json())
                .then(data => {
                  setTransactions(data);
                });
                setNewTransactionData({
                    name: '',
                    description: '',
                    amount: '',
                    type: 0,
                    date: new Date().toISOString().split('T')[0],
                    accountId: '',
                    categoryId: ''
                });
                setError(null);
            } else if (response.status == 400) {
                // Bad Request
                const errorMessage = await response.text(); 
                setError(errorMessage);
            } else {
                // Outros erros.
                setError('Ocorreu um erro ao criar a conta.');
            }
        })
        .catch(networkError => {
            // Erros de rede.
            setError('Não foi possível conectar ao servidor.');
            console.error('Erro de rede:', networkError);
        });
    }

    return (
        <div>
            <h2>Transações</h2>
            <form onSubmit={formSubmit}>
                <div>
                    <label>Nome:</label>
                    <input
                        type='text'
                        name='name'
                        value={newTransactionData.name}
                        onChange={formChange}
                    />
                </div>
                <div>
                    <label>Descrição:</label>
                    <input
                        type='text'
                        name='description'
                        value={newTransactionData.description}
                        onChange={formChange}
                    />
                </div>
                <div>
                    <label>Valor:</label>
                    <input
                        type='number'
                        name='amount'
                        value={newTransactionData.amount}
                        onChange={formChange}
                    />
                </div>
                <div>
                    <label>Tipo:</label>
                    <select name='type' value={newTransactionData.type} onChange={formChange}>
                        <option value="">-- Selecione o tipo de transferência --</option>
                        <option value={0}>Despesa</option>
                        <option value={1}>Receita</option>
                    </select>
                </div>
                <div>
                    <label>Data:</label>
                    <input 
                        type='date'
                        name='date'
                        value={newTransactionData.date}
                        onChange={formChange}
                    />
                </div>
                <div>
                    <label>Conta:</label>
                    <select name='accountId' value={newTransactionData.accountId} onChange={formChange}>
                        <option value="">-- Selecione uma Conta --</option>
                        {accounts.map(account => (
                            <option key={account.id} value={account.id}>
                                {account.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Categoria:</label>
                    <select name='categoryId' value={newTransactionData.categoryId} onChange={formChange}>
                        <option value="">-- Selecione uma Categoria --</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type='submit'>Lançar</button>
            </form>
            <hr />
            <table style={{ border: '1px solid black' }}>
                <thead>
                    <tr>
                        <th>Conta</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Valor</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map (transaction => (
                        <tr key={transaction.id}>
                            <td>{transaction.account.name}</td>
                            <td>{transaction.name}</td>
                            <td>{transaction.category.name}</td>
                            <td style={{ color: transaction.type === 1 ? 'green' : 'red' }}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                            </td>
                            <td>{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionsPage
