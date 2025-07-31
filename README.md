# FinanceManager - Gerenciador de Finanças Pessoal
### Status do Projeto: Em Desenvolvimento Ativo
Um aplicativo web full-stack para gerenciamento de finanças pessoais, permitindo ao usuário controlar suas contas, categorizar despesas/receitas e visualizar resumos financeiros de forma intuitiva. Este projeto está sendo construído do zero com o objetivo de aprender, aplicar e demonstrar conceitos modernos de desenvolvimento de software.

## 📜 Sobre o Projeto
O FinanceManager nasceu da necessidade de uma ferramenta simples e visual para acompanhar o fluxo financeiro diário. Em vez de depender de planilhas complexas, esta aplicação oferece uma interface limpa e reativa para cadastrar transações, associá-las a contas (débito e crédito) e categorias personalizadas, e entender para onde o dinheiro está indo através de um dashboard com gráficos interativos.

## ✨ Funcionalidades Atuais
- **Gerenciamento de Contas**: Crie, liste e apague múltiplas contas, separadas por tipo (Débito e Crédito).
- **Categorias Personalizadas**: Crie, liste e apague categorias para suas transações, personalizando-as com cores únicas.
- **Lançamento de Transações**: Registre despesas e receitas de forma rápida, associando-as a uma conta e a uma categoria.
- **Dashboard Visual**: Visualize um resumo mensal de suas finanças.
- **API Flexível**: O dashboard pode ser filtrado para exibir um resumo geral ou os dados de uma conta específica.
- **Navegação SPA**: Uma experiência de usuário fluida com roteamento no lado do cliente, sem recarregamentos de página.

## 🚀 Tecnologias Utilizadas
Este projeto foi construído com uma arquitetura moderna de Aplicação de Página Única (SPA) e uma API RESTful.
#### Back-End
- **C# / .NET 9**: Plataforma de desenvolvimento.
- **ASP.NET Core Web API**: Para a construção da API RESTful.
- **Entity Framework Core**: ORM para a comunicação com o banco de dados.
#### Front-End
- **React (com Vite)**: Biblioteca para a construção da interface de usuário.
- **React Hooks**: Para gerenciamento de estado e ciclo de vida (useState, useEffect).
- **React Router**: Para o roteamento e navegação no lado do cliente (SPA).
- **Chart.js**: Para a criação de gráficos dinâmicos e interativos.
#### Banco de Dados
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional.
