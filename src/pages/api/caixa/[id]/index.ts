import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const { id }: any = req.query;
      try {
        const teste = await prisma.caixa.findFirst({
          where: {
            id: id,
          },
          include: {
            Fluxo: {
              orderBy: {
                data: "desc",
              },
              include: {
                fluxoCaixa_Categoria: true,
                Vendas: {
                  include: {
                    FormaPagamento: true,
                    MovimentacaoEstoque: true,
                    Clientes: true,
                  },
                },
              },
            },
          },
        });
        return res.json(teste);
      } catch (error: any) {
        return res.status(400).json({
          error: true,
          message: error.message,
        });
      }

    default:
      return res
        .status(400)
        .json({ error: true, message: "Method Não Permitido" });
      break;
  }
}
