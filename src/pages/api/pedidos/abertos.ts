import { PedidosController } from "@/controllers/pedidos";
import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export interface iPedido {
  clientesId: string,
  dataEntrega: Date,
  pedido: []
}


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      const listagem = await new PedidosController().pedidosAbertos()
      return res.json(listagem)

    default:
      return res.status(400).json({ error: true, message: "Method not allowed" })
      break;
  }
}