import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id }: any = req.query;

  try {
    const vendas = await prisma.vendas.findMany({
      orderBy: [
        {
          status: "asc",
        },
        {
          data: "desc",
        },
      ],
      where: {
        idCliente: id,
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
            valor: true,
            quantidade: true,
            Produto: {
              select: {
                id: true,
                nome: true,
              },
            },
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
    res.status(400).json({ error: true, message: error.message });
  }
}
