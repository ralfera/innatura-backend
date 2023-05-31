import { api, prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export interface iLancamentoEstoque {
  estoqueId: number,
  movimento: 'e' | 's',
  produtoId: string,
  quantidade: number,
  observacao?: string,
}


export default async function estoquehandle(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      const produtos = await prisma.produtos.findMany()
      const saldoPorEstoque: any = await prisma.movimentacao_Estoque.groupBy({
        by: ['idProduto', 'nomeEstoqueId', 'movimento'],
        _sum: {
          quantidade: true
        },
      })
      const retorno = saldoPorEstoque.reduce((acc: any, item: any) => {
        const { idProduto, nomeEstoqueId, movimento, _sum: { quantidade } } = item;
        const nomeProduto = produtos.find(e => e.id === idProduto)
        const index = acc.findIndex((e: any) => e.idProduto === idProduto && e.nomeEstoqueId === nomeEstoqueId);

        if (index === -1) {
          acc.push({ idProduto, nome: nomeProduto?.nome, imagem: nomeProduto?.imagem, nomeEstoqueId, estoque: nomeEstoqueId === 1 ? 'Matriz' : 'Ceasa', quantidade: movimento === 'e' ? quantidade : -quantidade });
        } else {
          acc[index].quantidade += movimento === 'e' ? quantidade : -quantidade;
        }

        return acc;
      }, []).filter((item: any) => item.quantidade !== 0);
      res.json(retorno)

      break;



    case 'POST':
      const { estoqueId, observacao, movimento, produtoId, quantidade }: iLancamentoEstoque = req.body
      const lancamentoQuery = await prisma.movimentacao_Estoque.create({
        data: {
          nomeEstoqueId: estoqueId,
          movimento,
          observacao,
          idProduto: produtoId,
          quantidade
        }
      })
      return res.json(lancamentoQuery)
      break

    default:
      return res.status(400).json({ error: true, message: "Method not allowed" })
      break;
  }
}