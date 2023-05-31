import { PedidosController } from "@/controllers/pedidos";
import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      const { id }: any = req.query
      try {
        const query = await new PedidosController().viewPedido(id)
        if (!query) {
          throw new Error("Pedido inexistente")
        }
        return res.status(200).json(query)
      } catch (error: any) {
        return res.status(400).json(error.message)
      }


      break;

    default:
      res.status(400).json({ error: true, message: "Method not allowed" })
      break
  }
}