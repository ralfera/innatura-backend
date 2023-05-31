import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    default:
      try {
        const count = await prisma.vendas.count({
          where: {
            NOT: {
              status: 'concluido'
            }
          }
        })
        const venda = await prisma.vendas.findMany({
          orderBy: {
            data: 'asc'
          },
          where: {
            NOT: {
              status: 'concluido'
            }
          },
          include: {
            Clientes: {
              select: {
                id: true,
                nome: true,
                nomeContato: true,
                telefone: true
              }
            },
            ItemVenda: {
              select: {
                Produto: {
                  select: {
                    id: true,
                    nome: true,
                  }
                },
                quantidade: true,
                valor: true,
                id: true
              }
            }
          }
        })
        return res.json({ count, data: venda })
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message })
      }
      break;
  }
}