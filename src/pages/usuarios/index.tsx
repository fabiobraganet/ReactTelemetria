import React, { useState, useCallback, useEffect } from 'react';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Table, Spin, notification, Button, Tooltip, Popconfirm, Skeleton } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Usuario } from '@/types/Usuario';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  tracer,
  fetchErrorCounter,
  fetchSuccessCounter,
  selectionCounter,
  deleteCounter,
} from '@/otel-config'; // Usando o tracer e as métricas do otel-config.tsx

// Definindo uma função de log para centralizar o logging
const log = (message: string, data?: any) => {
  console.log(message, data);
  // Aqui você pode adicionar integração com uma plataforma de logs externa, como Datadog ou Splunk
};

const UsuarioList: React.FC = () => {
  const { data: usuarios, isLoading, isError } = useUsuarios();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const span = tracer.startSpan('renderUsuarioList');

    if (isLoading) {
      span.setAttribute('loading', true);
    } else {
      span.setAttribute('loading', false);
    }

    if (isError) {
      span.setAttribute('error', true);
      log('Erro ao carregar usuários');
      fetchErrorCounter.add(1, { error: 'Erro ao carregar usuários' });
    } else {
      span.setAttribute('error', false);
      if (usuarios) {
        fetchSuccessCounter.add(1, { result: 'Sucesso ao carregar usuários' });
      }
    }

    span.end();
  }, [isLoading, isError, usuarios]);

  // Função para manipular a exclusão de usuário
  const handleDelete = useCallback((id: number) => {
    const span = tracer.startSpan('handleDelete');
    span.setAttribute('userId', id);

    notification.success({
      message: 'Usuário excluído',
      description: `Usuário com ID ${id} foi excluído com sucesso.`,
      placement: 'topRight',
      duration: 3,
    });

    // Incrementa a métrica de exclusão
    deleteCounter.add(1, { userId: id });

    log(`Usuário com ID ${id} foi excluído.`);

    span.end();

    // Aqui você pode adicionar a lógica de exclusão do usuário no backend
  }, []);

  // Configuração das colunas da tabela
  const columns: ColumnsType<Usuario> = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      filterMultiple: false,
      filters: [
        { text: 'Usuário A', value: 'Usuário A' },
        { text: 'Usuário B', value: 'Usuário B' },
      ],
      onFilter: (value, record) => record.nome.includes(value as string),
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_, record) => (
        <>
          <Button icon={<EditOutlined />} style={{ marginRight: 8 }} />
          <Popconfirm title="Tem certeza?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  // Configuração de seleção de linhas na tabela
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
      selectionCounter.add(selectedKeys.length);
      log('Selecionados: ', selectedKeys);
    },
    selections: [
      {
        key: 'all',
        text: 'Selecionar Todos',
        onSelect: () => setSelectedRowKeys(usuarios ? usuarios.map((user) => user.id) : []),
      },
      {
        key: 'invert',
        text: 'Inverter Seleção',
        onSelect: () => {
          const newSelectedRowKeys = usuarios ? usuarios.map((user) => user.id).filter((id) => !selectedRowKeys.includes(id)) : [];
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'none',
        text: 'Limpar Seleção',
        onSelect: () => setSelectedRowKeys([]),
      },
    ],
  };

  if (isLoading) {
    return (
      <Spin tip="Carregando usuários..." style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Skeleton active />
      </Spin>
    );
  }

  if (isError) {
    return <div>Erro ao carregar usuários.</div>;
  }

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={usuarios}
        pagination={{ position: ['bottomRight'], pageSize: 10 }} // Definindo o tamanho da página
        bordered
        title={() => 'Usuários'}
        footer={() => 'Fim da lista'}
        scroll={{ y: 240 }}
        sticky
        rowKey={(record) => record.id} // Usando a propriedade rowKey para otimizar a renderização
      />
    </div>
  );
};

export default UsuarioList;
