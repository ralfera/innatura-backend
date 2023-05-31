import { api, prisma } from "@/helpers/api";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export interface iLancamentoProducao {
  estoqueId: number,
  produtoId: string,
  quantidade: number,
  observacao?: string,
}


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return res.json("Smile")
      break;



    case 'POST':
      const { estoqueId = 1, produtoId, quantidade, observacao }: iLancamentoProducao = req.body

      // const producaoQuery = await prisma.movimentacao_Estoque.create({
      //   data: {
      //     movimento: 'e',
      //     quantidade: quantidade,
      //     idProduto: produtoId,
      //     nomeEstoqueId: estoqueId,
      //     observacao: observacao
      //   }
      // })
      const producaoQuery = await prisma.produtos.update({
        where: {
          id: produtoId
        },
        data: {
          quantidadeEstoque: {
            increment: quantidade
          },
          Movimentacao: {
            create: {
              movimento: 'e',
              quantidade: quantidade,
              nomeEstoqueId: estoqueId,
              observacao: observacao
            }
          }
        },
        include: {
          Movimentacao: true
        }
      })
      return res.json(producaoQuery)
      break

    default:
      return res.status(400).json({ error: true, message: "Method not allowed" })
      break;
  }
}