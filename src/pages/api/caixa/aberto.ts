import { CaixaController } from "@/controllers/caixa";
import { prisma } from "@/helpers/api";
import { Caixa } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      const statusCaixa = await new CaixaController().estadoCaixa()
      // try {
      //   return res.json(await prisma.caixa.findFirst({
      //     where: {
      //       dataFechamento: null
      //     }
      //   }))
      // } catch (error: any) {
      //   return res.status(400).json({
      //     error: true,
      //     message: error.message
      //   })
      // }
      res.json(statusCaixa)
      break

    default:
      return res.status(400).json({ error: true, message: "Method Não Permitido" })
      break
  }
}