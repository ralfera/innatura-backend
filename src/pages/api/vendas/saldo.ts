import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":

      const caixaAberto: any = await prisma.caixa.findFirst({
        where: {
          dataFechamento: null
        }
      })

      const teste = await prisma.vendas.findMany({
        orderBy: {
          idCliente: 'asc'
        },
        where: {
          data: {
            gt: new Date(caixaAberto?.dataAbertura).toISOString(),
            lte: new Date()
          },
        },
        include: {
          FluxoCaixa: true
        }
      })
      res.json(teste);
      break;


    default:
      break;
  }
}