import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id }: Partial<{ id: string }> = req.query;
  switch (req.method) {
    default:
      try {
        const vendas = await prisma.vendas.findMany({
          orderBy: {
            data: "asc",
          },
          where: {
            idCliente: id,
            NOT: {
              status: "concluido",
            },
          },
          include: {
            Clientes: {
              select: {
                nome: true,
              },
            },
            FluxoCaixa: true,
            ItemVenda: {
              select: {
                Produto: {
                  select: {
                    id: true,
                    nome: true,
                  },
                },
                quantidade: true,
              },
            },
          },
        });
        const valorTotal = vendas.reduce((acc: number, v: any): any => {
          return (acc =
            acc + (v.status === "parcial" ? v.saldoAPagar : v.valorVenda));
        }, 0);
        return res.json({
          total: valorTotal,
          data: vendas,
        });
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message });
      }
      break;
  }
}
