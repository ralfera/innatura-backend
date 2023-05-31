import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export interface iLancamentoFluxo {
  movimento: string,
  valor: number,
  descricao: string,
  data?: Date,
  desconto?: number
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id }: { id?: string } = req.query

  switch (req.method) {
    case 'GET':
      try {
        const fluxo = await prisma.fluxoCaixa.findUniqueOrThrow({
          where: {
            id: id
          },
          include: {
            Vendas: {
              select: {
                data: true,
                valorVenda: true,
                saldoAPagar: true,
                status: true,
                Clientes: {
                  select: {
                    nome: true
                  }
                },
                ItemVenda: {
                  select: {
                    quantidade: true,
                    Produto: {
                      select: {
                        nome: true
                      }
                    }
                  }
                }
              }
            }
          }

        })
        return res.json(fluxo)
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message })
      }

    default:
      return res.status(400).json({ error: true, message: "Method Não Permitido" })
      break
  }
}