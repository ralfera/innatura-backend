import { CaixaController } from "@/controllers/caixa";
import { EstoqueController } from "@/controllers/estoque";
import { PedidosController } from "@/controllers/pedidos";
import { VendasController } from "@/controllers/vendas";
import { api, prisma } from "@/helpers/api";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export interface iEntregaPedido {
  idEstoque: number,
  idFormaPagamento: number,
  desconto?: number,
  caixaId: string
}


export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PATCH':
      const { id }: any = req.query
      const { idEstoque, idFormaPagamento, desconto, caixaId }: iEntregaPedido = req.body

      try {
        const pedidoQuery: any = await prisma.pedidos.findUnique({
          where: {
            id: id
          },
          include: {
            itemPedido: {
              include: {
                Produtos: {
                  select: {
                    nome: true,
                    quantidadeEstoque: true,
                    id: true
                  }
                }
              }
            },
            Clientes: true
          }
        })
        if (pedidoQuery.status == 'concluido') throw new Error("Pedido já encontra-se concluído")

        const venda: any = await new VendasController().createVenda({
          caixaId: caixaId,
          idCliente: pedidoQuery.clientesId,
          idEstoque: idEstoque,
          desconto: desconto,
          idFormaPagamento: idFormaPagamento,
          produtos: pedidoQuery.itemPedido.map((item: any) => {
            return (
              {
                idProduto: item.produtosId,
                quantidade: item.quantidade
              }
            )
          }),
        })
        if (venda.error) {
          throw new Error(venda.message)
        }
        const baixaPedido = await new PedidosController().entregaPedido(id, venda.id)
        const movEstoque = await new EstoqueController().movVendaEstoque({
          produtos: pedidoQuery.itemPedido.map((item: any) => {
            return (
              {
                idProduto: item.produtosId,
                quantidade: item.quantidade
              }
            )
          }), estoqueId: idEstoque, vendaId: venda.id
        })

        return res.json({ venda, baixaPedido, movEstoque })
      } catch (error: any) {
        console.log(error)
        return res.status(400).json(error.message)
      }

      break;

    case 'POST':
      break

    default:
      return res.status(400).json({ error: true, message: "Method not allowed" })
      break;
  }
}