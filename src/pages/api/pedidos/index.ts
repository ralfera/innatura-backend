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
      const listagem = await new PedidosController().getAll()
      return res.json(listagem)

    case 'POST':
      const { clientesId, dataEntrega, pedido }: iPedido = req.body
      const pedidoServ = new PedidosController()

      try {
        const cadastroPedido = await pedidoServ.createPedido({ clienteId: clientesId, dataEntrega: dataEntrega, pedido: pedido })
        res.json(cadastroPedido)
      } catch (error: any) {
        res.status(400).json({ error: true, message: error.message })
      }

      break

    default:
      return res.status(400).json({ error: true, message: "Method not allowed" })
      break;
  }
}