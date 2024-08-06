// src/App.tsx

import React, { useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Layout, ConfigProvider, Menu, theme, Button } from "antd"; // Importa Button para interação
import ptBR from "antd/es/locale/pt_BR";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./routers";
import { tracer, buttonClickCounter, pageLoadHistogram } from "@/otel-config"; // Importa métricas e tracer
import "./App.css";

const { Header, Content, Footer } = Layout;

// Crie uma instância do QueryClient
const queryClient = new QueryClient();

const items = [
  { key: "usuarios", label: "Usuários", path: "/usuarios" },
  { key: "produtos", label: "Produtos", path: "/produtos" },
];

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Monitorar tempo de carregamento da página
  useEffect(() => {
    const span = tracer.startSpan('App Load');
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      span.end();
      pageLoadHistogram.record(loadTime, { page: 'App' });
    };
  }, []);

  const handleButtonClick = (label: string) => {
    buttonClickCounter.add(1, { button: label });
  };

  return (
    <ConfigProvider locale={ptBR}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Header style={{ display: "flex", alignItems: "center" }}>
              <h1 style={{ color: "white" }}>React Telemetria</h1>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={["usuarios"]}
                style={{ flex: 1, minWidth: 0 }}
              >
                {items.map((item) => (
                  <Menu.Item key={item.key}>
                    <Link to={item.path} onClick={() => handleButtonClick(item.label)}>
                      {item.label}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu>
              <Button type="primary" onClick={() => handleButtonClick('Header Button')}>
                Clique-me
              </Button>
            </Header>
            <Content>
              <div
                style={{
                  background: colorBgContainer,
                  minHeight: 280,
                  padding: 24,
                  borderRadius: borderRadiusLG,
                }}
              >
                <AppRouter />
              </div>
            </Content>
            <Footer>
              React Telemetria {new Date().getFullYear()} Criado por Fabio
            </Footer>
          </Layout>
        </Router>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;
