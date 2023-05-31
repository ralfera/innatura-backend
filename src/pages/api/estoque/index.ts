import { api, prisma } from "@/helpers/api";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export interface iLancamentoEstoque {
  estoqueId: number,
  movimento: 'e' | 's',
  produtoId: string,
  quantidade: number,
  observacao?: string,
}


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      const produtos = await prisma.produtos.findMany({
        select: {
          id: true,
          imagem: true,
          nome: true,
          preco: true,
          categoria: {
            select: {
              descricao: true
            }
          },
          quantidadeEstoque: true
        }
      })

      const movEstoque = await prisma.movimentacao_Estoque.groupBy({
        by: ['idProduto', 'movimento', 'nomeEstoqueId'],
        _sum: {
          quantidade: true
        }
      })

      const saldoPorEstoque = movEstoque.reduce((saldo: any, item: any) => {
        const { idProduto, movimento, nomeEstoqueId, _sum: { quantidade } } = item;
        const estoque = saldo[nomeEstoqueId] || {};
        const produto = estoque[idProduto] || { saldo: 0 };

        if (movimento === 'e') {
          produto.saldo += quantidade;
        } else if (movimento === 's') {
          produto.saldo -= quantidade;
        }

        estoque[idProduto] = produto;
        saldo[nomeEstoqueId] = estoque;

        return saldo;
      }, {});

      return res.json(produtos)
      break

    default:
      return res.status(400).json({ error: true, message: "Method not allowed" })
      break;
  }
}