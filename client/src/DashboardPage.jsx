import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Registro dos componentes do Chart.js que serão
ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardPage() {
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;

        fetch(`http://localhost:5255/api/dashboard/summary?year=${year}&month=${month}`)
            .then(res => res.json())
            .then(data => {
                setSummaryData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar dados do dashboard:", error);
                setLoading(false);
            });
    }, []);

    const chartData = {
        labels: summaryData?.expensesByCategory.map(item => item.categoryName) || [],
        datasets: [
        {
            label: 'Despesas por Categoria',
            data: summaryData?.expensesByCategory.map(item => item.totalAmount) || [],
            backgroundColor: summaryData?.expensesByCategory.map(item => item.categoryColor) || [],
            borderColor: summaryData?.expensesByCategory.map(item => item.categoryColor) || [],
            borderWidth: 1,
        },],
    };

    if (loading)
        return <div>Carregando dashboard...</div>;

    if (!summaryData)
        return <div>Não foi possível carregar os dados.</div>;

  return (
    <div>
      <h2>Dashboard de {new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
      <div>
        <h3>Resumo do Mês</h3>
        <p>Total de Receitas: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summaryData.totalIncomes)}</p>
        <p>Total de Despesas: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summaryData.totalExpenses)}</p>
        <p>Saldo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summaryData.totalIncomes - summaryData.totalExpenses)}</p>
      </div>

      <hr />
      <div style={{ maxWidth: '400px', margin: 'auto' }}>
        <h3>Despesas por Categoria</h3>
        {summaryData.expensesByCategory.length > 0 ? (
          <Pie data={chartData} />
        ) : (
          <p>Nenhuma despesa registrada para este período.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage