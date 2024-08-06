// src/hooks/useProdutos.tsx

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/services/api';
import {
  tracer,
  fetchDurationHistogram,
  fetchErrorCounter,
  fetchSuccessCounter,
  retryCount,
  timeoutCount,
  fallbackTriggeredCount,
  cacheHitRate,
} from '@/otel-config';
import { notification } from 'antd';
import { Produto } from '@/types/Produto';

// Configuração do Circuit Breaker
let circuitBreakerStatus: 'aberto' | 'fechado' = 'fechado'; // Estado inicial do circuit breaker
let failureCount = 0; // Contador de falhas consecutivas
const maxFailures = 3; // Número máximo de falhas antes de abrir o circuito
const resetTimeout = 30000; // Tempo em milissegundos para resetar o circuit breaker

const fetchProdutos = async (): Promise<Produto[]> => {
  const span = tracer.startSpan('fetchProdutos', {
    attributes: {
      'service.name': 'React Telemetria',
      'http.method': 'GET',
      'http.url': '/produtos',
    },
  });

  const startTime = performance.now();

  // Circuit Breaker: Verifica se o circuito está aberto
  if (circuitBreakerStatus === 'aberto') {
    fallbackTriggeredCount.add(1);
    span.setAttribute('circuit.breaker', 'aberto');
    notification.warning({
      message: 'Serviço indisponível',
      description: 'O serviço de produtos está temporariamente indisponível. Tente novamente mais tarde.',
      placement: 'topRight',
      duration: 3,
    });
    return [];
  }

  try {
    const response = await api.get<Produto[]>('/produtos', {
      timeout: 5000, // Timeout de 5 segundos
    });

    const endTime = performance.now();
    const duration = endTime - startTime;
    fetchDurationHistogram.record(duration, { status: response.status.toString() });

    span.setAttribute('http.status_code', response.status);
    span.setAttribute('response.size', response.data.length);

    fetchSuccessCounter.add(1, { status: response.status.toString() });

    // Reset do Circuit Breaker após sucesso
    failureCount = 0;
    circuitBreakerStatus = 'fechado';

    return response.data;
  } catch (error: any) { // Corrigido o tipo de erro para 'any'
    span.recordException(error);
    span.setStatus({ code: 2, message: error.message });

    fetchErrorCounter.add(1, { error: error.message });

    notification.error({
      message: 'Erro ao buscar produtos',
      description: error.message,
      placement: 'topRight',
      duration: 3,
    });

    // Timeout
    if (error.message.includes('timeout')) {
      timeoutCount.add(1);
    }

    // Circuit Breaker: Incrementa contador de falhas
    failureCount += 1;
    if (failureCount >= maxFailures) {
      circuitBreakerStatus = 'aberto';
      setTimeout(() => {
        circuitBreakerStatus = 'fechado';
        failureCount = 0;
      }, resetTimeout);
    }
    return [];
  } finally {
    span.end();
  }
};

export const useProdutos = () => {
  return useQuery<Produto[]>({
    queryKey: ['produtos'],
    queryFn: fetchProdutos,
    retry: 2, // Retry Policy: Tentativas de repetição
    retryDelay: (attempt: number) => {
      retryCount.add(1);
      return Math.min(1000 * 2 ** attempt, 8000); // Atraso exponencial
    },
    cacheTime: 1000 * 60 * 5, // Caching: Cache de 5 minutos
    staleTime: 1000 * 60, // Tempo de expiração do cache
    onSuccess: (data: Produto[]) => { // Corrigido o tipo do parâmetro 'data'
      // Caching: Calcula a taxa de acerto do cache
      const cacheHit = data.length > 0;
      cacheHitRate.record(cacheHit ? 1 : 0);
    },
  } as UseQueryOptions<Produto[]>); // Adicionado tipo correto para o hook
};
