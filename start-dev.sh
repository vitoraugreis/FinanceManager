#!/bin/bash
# Este script inicia o back-end e o front-end, cada um em sua própria janela de terminal.

echo "Abrindo terminais de desenvolvimento..."

gnome-terminal --title="Back-end API" -- bash -c "echo 'Iniciando Back-end (dotnet run)...'; cd server && dotnet run; exec bash"
gnome-terminal --title="Front-end Client" -- bash -c "echo 'Iniciando Front-end (npm run dev)...'; cd client && npm run dev; exec bash"

echo "Terminais abertos."