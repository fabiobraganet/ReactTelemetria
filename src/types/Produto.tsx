// src/types/Produto.tsx

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
}

export interface ProdutoWithKey extends Produto {
  key: number; // Adiciona uma chave única para identificação na tabela
}