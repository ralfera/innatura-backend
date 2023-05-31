import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id }: Partial<{ id: string }> = req.query;

  switch (req.method) {
    case 'POST':
      break
    default:
      try {
        const produto = await prisma.produtos.findFirstOrThrow({
          where: {
            id: id
          },
          include: {
            categoria: true,
            Movimentacao: {
              take: 10
            },
            itensVenda: {
              include: {
                Venda: {
                  include: {
                    Clientes: true
                  }
                }
              },
              take: 10
            }
          }
        })
        return res.json(produto)
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message })
      }
      break
  }
}