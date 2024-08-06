# React Telemetria com OpenTelemetry, VictoriaMetrics, Jaeger e Grafana

## Visão Geral

Este projeto é um exemplo de como monitorar uma aplicação React utilizando OpenTelemetry para coletar logs, traces e métricas, VictoriaMetrics como banco de dados de métricas, Jaeger para visualização de traces, e Grafana para a criação de dashboards interativos.

## Tabela de Conteúdos

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Execução do Projeto](#execução-do-projeto)
- [Métricas e Monitoramento](#métricas-e-monitoramento)
- [Dashboard Grafana](#dashboard-grafana)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para construção de interfaces de usuário.
- **TypeScript**: Superconjunto de JavaScript que adiciona tipagem estática.
- **Ant Design**: Biblioteca de componentes UI para React.
- **React Query**: Biblioteca para gerenciamento de estado de requisições.
- **OpenTelemetry**: Ferramenta para observabilidade de aplicações, usada para coletar logs, traces e métricas.
- **VictoriaMetrics**: Banco de dados para armazenamento de métricas.
- **Jaeger**: Sistema para rastreamento de transações distribuídas.
- **Grafana**: Plataforma de análise e monitoramento interativo.
- **Axios**: Cliente HTTP para realizar requisições a APIs.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

- Node.js (versão 14 ou superior)
- Docker
- Docker Compose

## Configuração do Ambiente

1. **Clone o Repositório**

   ```bash
   git clone https://github.com/fabiobraganet/react-telemetria.git
   cd react-telemetria
   ```

2. **Instale as Dependências**

   ```bash
   npm install
   ```

3. **Configuração do Docker**

   Para facilitar a configuração dos serviços necessários (VictoriaMetrics, Jaeger e Grafana), utilizamos o Docker Compose. Certifique-se de que o Docker está em execução e execute:

   ```bash
   docker-compose up -d
   ```

   O arquivo `docker-compose.yml` configurará e iniciará os serviços mencionados acima.

   Você pode facilitar as coisas usando o start.sh e o stop.sh

5. **Configurar Variáveis de Ambiente**

   Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

   ```plaintext
   REACT_APP_OTEL_COLLECTOR_URL=http://localhost:4318/v1/traces
   REACT_APP_VICTORIAMETRICS_URL=http://localhost:8428
   REACT_APP_JAEGER_URL=http://localhost:16686
   REACT_APP_GRAFANA_URL=http://localhost:3001
   ```

## Execução do Projeto

Após configurar o ambiente, você pode iniciar o projeto com o seguinte comando:

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3010`.

## Métricas e Monitoramento

### OpenTelemetry

OpenTelemetry é usado para coletar:

- **Logs**: Mensagens detalhadas sobre eventos de execução.
- **Traces**: Informações sobre a execução de requests e caminhos percorridos.
- **Métricas**: Dados quantitativos sobre a aplicação, como tempo de carregamento de página e contadores de eventos.

### VictoriaMetrics

VictoriaMetrics é utilizado para armazenar as métricas coletadas, sendo configurado para receber dados via OpenTelemetry e disponibilizar para visualização no Grafana.

### Jaeger

Jaeger é utilizado para visualizar as traces da aplicação. Você pode acessar o dashboard do Jaeger em `http://localhost:16686` para analisar o fluxo de requests em detalhes.

### Grafana

Grafana é configurado para consumir dados do VictoriaMetrics e do Jaeger, permitindo a criação de dashboards personalizados para visualizar as métricas e traces.

#### Dashboard Configurado

- **Contador de Cliques em Botões**: `sum(rate(button_click_count_total[5m])) by (job)`
- **Navegações entre Rotas**: `sum(rate(navegacao_count_total[5m])) by (job)`
- **Tempo de Carregamento de Páginas**: `avg_over_time(tempo_carregamento_pagina_sum[5m])`
- **Duração das Requisições de API**: `avg(rate(duracao_requisicao_api_sum[5m])) by (job)`
- **Taxa de Acertos do Cache**: `avg(rate(taxa_acerto_cache[5m])) by (job)`
- **Seleções de Usuário**: `sum(rate(usuario_selection_count_total[5m])) by (job)`
- **Exclusões de Usuário**: `sum(rate(usuario_delete_count_total[5m])) by (job)`

### Configuração de Logs e Métricas

Os logs e métricas são configurados em `src/otel-config.tsx`, onde definimos o uso de **MeterProvider** e **TracerProvider** para capturar informações detalhadas sobre a aplicação.

## Dashboard Grafana

O Grafana está configurado para se conectar com o VictoriaMetrics e Jaeger. Você pode acessar o Grafana em `http://localhost:3000` com as credenciais padrão (`admin`/`admin`).

### Exemplos de Dashboards

1. **Usuários Carregados:** Monitora o sucesso no carregamento de dados de usuários.
2. **Desempenho da API:** Analisa o tempo de resposta das requisições de API.
3. **Interatividade:** Visualiza a frequência de cliques em botões e navegação entre rotas.
4. **Monitoramento de Estado do Circuit Breaker:** Exibe o estado atual do Circuit Breaker para detectar falhas.

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para enviar pull requests ou abrir issues com sugestões, correções ou novas ideias.

### Como Contribuir

1. Faça um fork do projeto.
2. Crie uma nova branch (`git checkout -b feature/MinhaFeature`).
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`).
4. Faça push para a branch criada (`git push origin feature/MinhaFeature`).
5. Abra um Pull Request.


