import { CaixaController } from "@/controllers/caixa";
import { prisma } from "@/helpers/api";
import { Caixa } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const lista = await new CaixaController().caixaLista();
        res.status(200).json(lista);
      } catch (error: any) {
        return res.status(400).json({
          error: true,
          message: error.message,
        });
      }
      break;

    case "POST":
      const { valorAbertura }: Caixa = req.body;
      try {
        const caixa = await new CaixaController().createCaixa(valorAbertura);
        return res.json(caixa);
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
