// src/routers/index.tsx

import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import ProdutosPage from '@/pages/produtos';
import UsuariosPage from '@/pages/usuarios';
import { tracer, navigationCounter } from '@/otel-config'; // Importa o tracer e o contador

const AppRouter: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    // Cria um span para rastrear a navegação
    const span = tracer.startSpan(`Navegação para ${location.pathname}`);
    span.setAttribute("currentPath", location.pathname);
    
    // Termina o span após um pequeno atraso para simular um tempo de processamento
    setTimeout(() => {
      span.end();
    }, 100);

    // Incrementa o contador de navegação
    navigationCounter.add(1, { rota: location.pathname });
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/usuarios" replace />} />
      <Route path="/usuarios" element={<UsuariosPage />} />
      <Route path="/produtos" element={<ProdutosPage />} />
    </Routes>
  );
};

export default AppRouter;
