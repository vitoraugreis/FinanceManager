#!/bin/bash
# Este script inicia o back-end e o front-end, cada um em sua própria janela de terminal.

gnome-terminal --title="Back-end API" -- bash -c "echo 'Iniciando Back-end...'; cd server && dotnet run; exec bash"
gnome-terminal --title="Front-end Client" -- bash -c "echo 'Iniciando Front-end...'; cd client && npm run dev; exec bash"