import { EstoqueController } from "@/controllers/estoque";
import { api, prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export interface iLancamentoEstoque {
  estoqueId: number;
  movimento: "e" | "s";
  produtosId: string;
  quantidade: number;
  observacao?: string;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      try {
        const { estoqueDe, estoquePara, observacao, produtos } = req.body;

        try {
          const transferencia =
            await new EstoqueController().transferenciaEstoque({
              estoqueDe,
              estoquePara,
              produtos,
              observacao,
            });

          return res.status(200).json(transferencia);
        } catch (error: any) {
          return res.status(400).json(error?.message);
        }
        break;
      } catch (error: any) {
        console.log(error.message);
        return res.status(400).json({ error: true, message: error.message });
      }

    default:
      return res
        .status(400)
        .json({ error: true, message: "Method not allowed" });
      break;
  }
}
