// src/otel-config.tsx

import { trace, diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const resource = new Resource({
  [SEMRESATTRS_SERVICE_NAME]: 'React Telemetria',
});

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
});

const tracerProvider = new WebTracerProvider({
  resource,
});

tracerProvider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
tracerProvider.register();

export const tracer = trace.getTracer('app-tracer');

// Configuração do MeterProvider para métricas
const metricExporter = new OTLPMetricExporter({
  url: 'http://localhost:4318/v1/metrics', 
});

const meterProvider = new MeterProvider({
  resource, 
  readers: [
    new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 60000,
    }),
  ],
});

export const meter = meterProvider.getMeter('app-meter');

export const selectionCounter = meter.createCounter('usuario_selection_count', {
  description: 'Número de seleções de usuário',
});

export const deleteCounter = meter.createCounter('usuario_delete_count', {
  description: 'Número de exclusões de usuário',
});

export const navigationCounter = meter.createCounter('navegacao_count', {
  description: 'Contador de navegações entre rotas',
});

export const buttonClickCounter = meter.createCounter('click_botao_count', {
  description: 'Contador de cliques em botões',
});

export const pageLoadHistogram = meter.createHistogram('tempo_carregamento_pagina', {
  description: 'Tempo de carregamento das páginas',
});

export const fetchDurationHistogram = meter.createHistogram('duracao_requisicao_api', {
  description: 'Duração das requisições de API',
});

export const fetchErrorCounter = meter.createCounter('erros_requisicao_api', {
  description: 'Contador de erros nas requisições de API',
});

export const fetchSuccessCounter = meter.createCounter('sucesso_requisicao_api', {
  description: 'Contador de requisições de API bem-sucedidas',
});

// Retry Policy
export const retryCount = meter.createCounter('tentativas_retry', {
  description: 'Número de tentativas de repetição',
});

export const retrySuccessRate = meter.createHistogram('taxa_sucesso_retry', {
  description: 'Taxa de sucesso após tentativas de repetição',
});

// Circuit Breaker
export const circuitBreakerState = meter.createObservableGauge('estado_circuito', {
  description: 'Estado atual do circuit breaker (aberto, fechado, meio aberto)',
});

export const circuitOpenDuration = meter.createHistogram('duracao_circuito_aberto', {
  description: 'Duração média do circuito aberto',
});

// Timeouts
export const timeoutCount = meter.createCounter('contagem_timeout', {
  description: 'Número de requisições que ultrapassaram o tempo limite',
});

// Bulkhead
export const bulkheadUsage = meter.createHistogram('uso_bulkhead', {
  description: 'Percentual de uso dos compartimentos (bulkheads)',
});

// Fallback
export const fallbackTriggeredCount = meter.createCounter('contagem_fallbacks_acionados', {
  description: 'Número de vezes que o fallback foi acionado',
});

// Throttling
export const throttledRequestsCount = meter.createCounter('contagem_requisicoes_limitadas', {
  description: 'Número de requisições limitadas por throttling',
});

// Caching
export const cacheHitRate = meter.createHistogram('taxa_acerto_cache', {
  description: 'Taxa de acertos do cache',
});

// Load Shedding
export const rejectedRequestsCount = meter.createCounter('contagem_requisicoes_rejeitadas', {
  description: 'Número de requisições rejeitadas devido a sobrecarga',
});

// Rate Limiting
export const rateLimitedRequestsCount = meter.createCounter('contagem_requisicoes_bloqueadas', {
  description: 'Número de requisições bloqueadas por limitação de taxa',
});

// Graceful Degradation
export const degradationCount = meter.createCounter('contagem_degradacao', {
  description: 'Número de vezes que a degradação foi acionada',
});

// === Monitoramento de Estados do Circuit Breaker ===
circuitBreakerState.addCallback((observableResult) => {
  // Simulação de estados do circuit breaker
  const circuitState = Math.random() < 0.5 ? 1 : 0; // 1 para aberto, 0 para fechado
  observableResult.observe(circuitState, {
    estado: circuitState ? 'aberto' : 'fechado',
  });
});
