import { useEffect, useState } from 'react'

function AccountsPage() {
    const [accounts, setAccounts] = useState([]);
    const [newAccountData, setNewAccountData] = useState({
        name: '',
        description: '',
        type: 0,
        initialBalance: 0,
        closingDay: null,
        dueDay: null
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5255/api/accounts')
        .then(res => res.json())
        .then(data => {
            setAccounts(data);
        })
    }, []);

    const formChange = (event) => {
        const {name, value} = event.target;

        // Copia os valores antigos do estado e sobrescreve a propriedade que mudou.
        setNewAccountData(prevNewAccountData => ({
            ...prevNewAccountData,
            [name]: value
        }));
    };

    const formSubmit = (event) => {
        event.preventDefault();

        const accountData = {
            ...newAccountData,
            type: parseInt(newAccountData.type, 10),
            initialBalance: parseFloat(newAccountData.initialBalance) || 0,
            closingDay: newAccountData.closingDay ? parseInt(newAccountData.closingDay, 10) : null,
            dueDay: newAccountData.dueDay ? parseInt(newAccountData.dueDay, 10) : null,
        }

        fetch('http://localhost:5255/api/accounts', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(accountData),
        })
        .then(async (response) => {
            if (response.ok) {
                const newlyCreatedAccount = await response.json();
                setAccounts(currentAccounts => [...currentAccounts, newlyCreatedAccount]);
                setNewAccountData({
                    name: '',
                    description: '',
                    type: 0,
                    initialBalance: 0,
                    closingDay: null,
                    dueDay: null
                });
                setError(null);
            } else if (response.status == 409) {
                // Erro de conflito.
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

    const AccountDelete = (idToDelete) => {
        // Confirmação de intenção de remover a conta.
        if (!window.confirm("Tem certeza que deseja remover esta conta?")) return;

        fetch(`http://localhost:5255/api/accounts/${idToDelete}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                // Cria um novo array contendo apenas as contas que permanecem no sistema.
                setAccounts(currentAccounts =>
                    currentAccounts.filter(account => account.id !== idToDelete)
                );
            } else {
                alert('Não foi possível remover a categoria.');rt
            }
        });
    }

    return (
    <div>
        <h2>Minhas Contas</h2>
        <form onSubmit={formSubmit}>
            <div>
                <label>Nome da Conta:</label>
                <input 
                    type='text'
                    name='name'
                    value={newAccountData.name}
                    onChange={formChange}
                />
            </div>
            <div>
                <label>Descrição da Conta:</label>
                <input 
                    type='text'
                    name='description'
                    value={newAccountData.description}
                    onChange={formChange}
                />
            </div>
            <div>
                <label>Tipo:</label>
                <select name='type' value={newAccountData.type} onChange={formChange}>
                    <option value={0}>Débito</option>
                    <option value={1}>Crédito</option>
                </select>
            </div>
            <div>
                <label>Saldo Inicial:</label>
                <input 
                    type='number'
                    name='initialBalance'
                    value={newAccountData.initialBalance}
                    onChange={formChange}
                />
            </div>
            {newAccountData.type == 1 && (
                <>
                    <div>
                        <label>Dia de Fechamento da Fatura:</label>
                        <input
                            type='number'
                            name='closingDay'
                            value={newAccountData.closingDay}
                            onChange={formChange}
                        />
                    </div>
                    <div>
                        <label>Dia de Vencimento da Fatura:</label>
                        <input
                            type='number'
                            name='dueDay'
                            value={newAccountData.dueDay}
                            onChange={formChange}
                        />
                    </div>
                </>
            )}
            <button type='submit'>Adicionar Conta</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <hr/>

        <table style={{ border: '1px solid black' }}>
            <thead>
                <tr>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Saldo Inicial</th>
                  <th>Ações</th>
                </tr>
            </thead>
          <tbody>
                {accounts.map(account => (
                <tr key={account.id}>
                    <td>{account.name}</td>
                    <td>{account.type === 0 ? 'Débito' : 'Crédito'}</td>
                    <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.initialBalance)}</td>
                    <td><button onClick={() => AccountDelete(account.id)}>Remover</button></td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  );
}

export default AccountsPage
