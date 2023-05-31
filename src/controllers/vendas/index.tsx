import { prisma } from "@/helpers/api";
import { CaixaController } from "../caixa";
import { ClientesController } from "../clientes";
import { EstoqueController } from "../estoque";

export interface iVendas {
  idCliente: string | any;
  caixaId: string;
  idFormaPagamento: number;
  status?: string;
  valorVenda?: number;
  dataVencimento?: string | Date;
  dataPagamento?: string | Date;
  produtos: [];
  desconto?: number;
  idEstoque: number;
}

export class VendasController {
  async createVenda(venda: iVendas) {
    const estoqueService = new EstoqueController();
    const caixaService = new CaixaController();
    const estoque = await estoqueService.byEstoque();

    try {
      const caixa = await caixaService.caixaById(venda.caixaId);
      const verifyClient = await new ClientesController().clienteExists(
        venda.idCliente
      );
      if (!verifyClient) {
        throw new Error("Cliente inexistente");
      }
      if (!caixa) {
        throw new Error(
          "Caixa não existe ou não criado. Por favor abra um caixa primeiro antes de realizar uma venda"
        );
      }
      await estoqueService.verificaSaldo({
        produtos: venda.produtos,
        estoqueId: venda.idEstoque,
      });

      // Reduce para valor da venda
      let vendaProdutoArray: any = [];
      const valorTotal =
        venda.produtos.reduce((acc: any, prod: any) => {
          const produtoData = estoque.find(
            (p: any) => p.idProduto === prod.idProduto
          );
          if (produtoData) {
            vendaProdutoArray.push({
              idProduto: prod.idProduto,
              quantidade: prod.quantidade,
              valor: prod.quantidade * produtoData.preco,
            });
            return acc + prod.quantidade * produtoData.preco;
          }
          return acc;
        }, 0) - (venda.desconto ? venda.desconto : 0);

      const queryVenda = await prisma.vendas.create({
        data: {
          idCliente: venda.idCliente,
          idFormaPagamento: venda.idFormaPagamento,
          ...(venda.idFormaPagamento !== 2 && { dataPagamento: new Date() }),
          ...(venda.idFormaPagamento === 2 && {
            dataVencimento: new Date(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              0
            ),
          }),
          status: venda.idFormaPagamento !== 2 ? "concluido" : "aberto",
          valorVenda: valorTotal,
          saldoAPagar: venda.idFormaPagamento === 1 ? 0 : valorTotal,
          ItemVenda: {
            create: vendaProdutoArray,
          },
        },
        include: {
          ItemVenda: true,
        },
      });
      if (venda.idFormaPagamento === 1) {
        await new CaixaController().addValueToCaixa(
          queryVenda.id,
          venda.caixaId,
          valorTotal,
          venda.desconto
        );
      }

      return queryVenda;
    } catch (error: any) {
      return { error: true, message: error.message };
    }
  }

  async vendasAberto() {
    const count = await prisma.vendas.count({
      where: {
        NOT: {
          status: "concluido",
        },
      },
    });
    const venda = await prisma.vendas.findMany({
      orderBy: {
        data: "asc",
      },
      where: {
        NOT: {
          status: "concluido",
        },
      },
      include: {
        Clientes: {
          select: {
            id: true,
            nome: true,
            nomeContato: true,
            telefone: true,
          },
        },
        ItemVenda: {
          select: {
            Produto: {
              select: {
                id: true,
                nome: true,
              },
            },
            quantidade: true,
            valor: true,
            id: true,
          },
        },
      },
    });
    return { count, data: venda };
  }
}
