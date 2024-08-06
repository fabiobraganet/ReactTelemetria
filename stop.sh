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

# Para e remove os contêineres
echo "Parando o ambiente Docker..."
docker-compose down

echo "Ambiente Docker parado e limpo com sucesso!"
