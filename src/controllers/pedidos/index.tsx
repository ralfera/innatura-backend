import { prisma } from "@/helpers/api";

export class PedidosController {
  async viewPedido(pedidoId: string) {
    try {
      const query = await prisma.pedidos.findUnique({
        where: { id: pedidoId },
        include: {
          Clientes: true,
          itemPedido: {
            include: {
              Produtos: true,
            },
          },
          Venda: true,
        },
      });
      return query;
    } catch (error: any) {
      return error.message;
    }
  }

  async getAll() {
    try {
      const query = await prisma.pedidos.findMany({
        take: 35,
        orderBy: [{ status: "asc" }, { dataAbertura: "asc" }],
        include: {
          itemPedido: {
            include: {
              Produtos: {
                select: {
                  nome: true,
                  imagem: true,
                  preco: true,
                  quantidadeEstoque: true,
                },
              },
            },
          },
          Clientes: {
            select: {
              nome: true,
              tipo: true,
            },
          },
        },
      });
      return query;
    } catch (error: any) {
      return error.message;
    }
  }

  async pedidosAbertos() {
    try {
      const query = await prisma.pedidos.findMany({
        orderBy: [{ status: "asc" }, { dataAbertura: "asc" }],
        where: {
          status: {
            contains: "aberto",
          },
        },
        include: {
          itemPedido: {
            include: {
              Produtos: {
                select: {
                  nome: true,
                  imagem: true,
                  preco: true,
                  quantidadeEstoque: true,
                },
              },
            },
          },
          Clientes: {
            select: {
              nome: true,
              tipo: true,
            },
          },
        },
      });
      return { count: query.length, data: query };
    } catch (error: any) {
      return error.message;
    }
  }

  async createPedido({
    clienteId,
    dataEntrega,
    pedido,
  }: {
    clienteId: string;
    dataEntrega: Date;
    pedido: [];
  }) {
    const query = await prisma.pedidos.create({
      data: {
        dataAbertura: new Date(),
        dataEntrega: new Date(dataEntrega),
        clientesId: clienteId,
        status: "aberto",
        itemPedido: {
          createMany: {
            data: pedido,
          },
        },
      },
    });
    return query;
  }

  async entregaPedido(pedidoId: string, vendaId: string) {
    try {
      const query = await prisma.pedidos.update({
        where: {
          id: pedidoId,
        },
        data: {
          vendasId: vendaId,
          status: "concluido",
        },
      });
      return query;
    } catch (error: any) {
      return error.message;
    }
  }

  async removePedido() {}
}
