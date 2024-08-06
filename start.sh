#!/bin/bash

# Caminho para o diretório docker
DOCKER_DIR="./docker"

# Verifica se o Docker está instalado
if ! command -v docker &> /dev/null
then
    echo "Docker não está instalado. Por favor, instale o Docker para continuar."
    exit
fi

# Verifica se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose não está instalado. Por favor, instale o Docker Compose para continuar."
    exit
fi

# Navega para o diretório docker
cd "$DOCKER_DIR" || exit

# Constrói e inicia os contêineres em modo de fundo
echo "Iniciando o ambiente Docker..."
docker-compose up --build -d

# Verifica o status dos contêineres
echo "Verificando o status dos contêineres..."
docker-compose ps

echo "Ambiente Docker iniciado com sucesso!"
echo "A aplicação React está disponível em http://localhost:3000"
echo "O Grafana está disponível em http://localhost:3001"
echo "O VictoriaMetrics está disponível em http://localhost:8428"
