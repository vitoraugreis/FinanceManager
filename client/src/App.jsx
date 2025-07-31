import { Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import AccountsPage from './AccountsPage';
import CategoriesPage from './CategoriesPage';
import TransactionsPage from './TransactionsPage';
import DashboardPage from './DashboardPage';
import './App.css'

function App() {
  return (
    <div>
      <h1>Meu Gerenciador Financeiro</h1>
      
      {/* 1. Barra de Navegação com os Links */}
      <nav style={{ paddingBottom: '20px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <Link to="/categories" style={{ marginRight: '10px' }}>Categorias</Link>
        <Link to="/accounts" style={{ marginRight: '10px' }}>Contas</Link>
        <Link to="/transactions" style={{ marginRight: '10px' }}>Transações</Link>
        <Link to="/dashboard" style={{ marginRight: '10px' }}>Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;