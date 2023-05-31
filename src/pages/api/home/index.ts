import { EstoqueController } from "@/controllers/estoque";
import { PedidosController } from "@/controllers/pedidos";
import { VendasController } from "@/controllers/vendas";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      try {
        const vendasAberto = await new VendasController().vendasAberto();
        const pedidosAberto = await new PedidosController().pedidosAbertos();
        const estoque = await new EstoqueController().byEstoque();
        res.json({
          emAberto: vendasAberto,
          pedidosAberto: pedidosAberto,
          estoque,
        });
      } catch (error: any) {
        res.status(400).json(error?.message);
      }

      break;

    default:
      res.status(400).json("Method not allowed");
      break;
  }
}
