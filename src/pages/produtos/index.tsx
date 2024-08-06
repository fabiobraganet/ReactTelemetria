// src/pages/produtos/index.tsx

import React, { useState } from 'react';
import { useProdutos } from '@/hooks/useProdutos';
import { Table, Spin, notification, Button, Tooltip, Popconfirm, Skeleton } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Produto } from '@/types/Produto';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ProdutoList: React.FC = () => {
  const { data: produtos, isLoading, isError } = useProdutos();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleDelete = (id: number) => {
    notification.success({
      message: 'Produto excluído',
      description: `Produto com ID ${id} foi excluído com sucesso.`,
      placement: 'topRight',
      duration: 3,
    });
  };

  const columns: ColumnsType<Produto> = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      filterMultiple: false,
      filters: [
        { text: 'Produto A', value: 'Produto A' },
        { text: 'Produto B', value: 'Produto B' },
      ],
      onFilter: (value, record) => record.nome.includes(value as string),
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: 'Preço',
      dataIndex: 'preco',
      key: 'preco',
      sorter: (a, b) => a.preco - b.preco,
      render: (text) => `R$ ${text.toFixed(2)}`,
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => setSelectedRowKeys(selectedKeys),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  if (isLoading) {
    return (
      <Spin tip="Carregando produtos..." style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Skeleton active />
      </Spin>
    );
  }

  if (isError) {
    return <div>Erro ao carregar produtos.</div>;
  }

  return (
    <div>
      <h1>Lista de Produtos</h1>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={produtos}
        pagination={{ position: ['bottomRight'] }}
        bordered
        title={() => 'Produtos'}
        footer={() => 'Produzido por Fabio Braga'}
        scroll={{ y: 240 }}
        sticky
      />
    </div>
  );
};

export default ProdutoList;
