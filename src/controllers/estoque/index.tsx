import { prisma } from "@/helpers/api";

interface iMovEstoque {
  produtoId: string;
  quantidade: number;
  observacao?: string;
  estoqueId: number;
  vendaId?: string;
}

interface iTransferenciaEstoque {
  estoqueDe: number;
  estoquePara: number;
  produtos: [];
  observacao: string;
}

export class EstoqueController {
  async addEstoque(mov: iMovEstoque) {
    try {
      const query = await prisma.movimentacao_Estoque.create({
        data: {
          movimento: "e",
          quantidade: mov.quantidade,
          idProduto: mov.produtoId,
          nomeEstoqueId: mov.estoqueId,
          observacao: mov.observacao,
        },
      });
      await prisma.produtos.update({
        where: {
          id: mov.produtoId,
        },
        data: {
          quantidadeEstoque: {
            increment: mov.quantidade,
          },
        },
      });
      return query;
    } catch (error) {
      return error;
    }
  }

  async removeEstoque(mov: iMovEstoque) {
    try {
      const query = await prisma.movimentacao_Estoque.create({
        data: {
          movimento: "s",
          quantidade: mov.quantidade,
          idProduto: mov.produtoId,
          nomeEstoqueId: mov.estoqueId,
          observacao: mov.observacao,
        },
      });
      await prisma.produtos.update({
        where: {
          id: mov.produtoId,
        },
        data: {
          quantidadeEstoque: {
            decrement: mov.quantidade,
          },
        },
      });
      return query;
    } catch (error) {
      return error;
    }
  }

  async transferenciaEstoque({
    estoqueDe,
    estoquePara,
    produtos,
    observacao = "Transferencia de Produtos Estoque",
  }: iTransferenciaEstoque) {
    if (!estoqueDe || !estoquePara) {
      throw new Error(
        "Nenhum estoque foi selecionado. Por favor, selecione o estoque de origem!"
      );
    }
    const estoque = await this.byEstoque(estoqueDe);

    for (let produtoPedido of produtos) {
      const { quantidade, nome } = estoque.find(
        (p) => p.idProduto === produtoPedido.produtoId
      );
      console.log(quantidade, produtoPedido.quantidade);
      if (quantidade < produtoPedido.quantidade) {
        throw new Error(
          `Produto ${nome} não possui quantidade suficiente neste estoque.`
        );
      }
    }

    const parsed = produtos
      .map((produto: any) => [
        {
          quantidade: produto.quantidade,
          idProduto: produto.produtoId,
          movimento: "s",
          observacao: `${observacao} [SAIDA]`,
          nomeEstoqueId: estoqueDe,
        },
        {
          quantidade: produto.quantidade,
          idProduto: produto.produtoId,
          movimento: "e",
          observacao: `${observacao} [ENTRADA]`,
          nomeEstoqueId: estoquePara,
        },
      ])
      .reduce((acc, val) => acc.concat(val), []);

    const transferencia = await prisma.movimentacao_Estoque.createMany({
      data: parsed,
    });

    return transferencia;
  }

  async estoqueByProdutoId(produtoId: string) {
    try {
      const estoque = await prisma.produtos.findFirst({
        where: {
          id: produtoId,
        },
        select: {
          quantidadeEstoque: true,
          nome: true,
          id: true,
          preco: true,
        },
      });
      return estoque;
    } catch (error: any) {
      return error.message;
    }
  }

  async byEstoque(id?: number) {
    try {
      const produtos = await prisma.produtos.findMany({
        select: {
          id: true,
          nome: true,
          preco: true,
          imagem: true,
          quantidadeEstoque: true,
        },
      });
      const saldoPorEstoque: any = await prisma.movimentacao_Estoque.groupBy({
        by: ["idProduto", "nomeEstoqueId", "movimento"],
        orderBy: { nomeEstoqueId: "asc" },
        _sum: {
          quantidade: true,
        },
        ...(id && {
          where: {
            nomeEstoqueId: id,
          },
        }),
      });
      const retorno = saldoPorEstoque.reduce((acc: any, item: any) => {
        const {
          idProduto,
          nomeEstoqueId,
          movimento,
          _sum: { quantidade },
        } = item;
        const nomeProduto = produtos.find((e) => e.id === idProduto);
        const index = acc.findIndex(
          (e: any) =>
            e.idProduto === idProduto && e.nomeEstoqueId === nomeEstoqueId
        );

        if (index === -1) {
          acc.push({
            idProduto,
            nome: nomeProduto?.nome,
            preco: nomeProduto?.preco,
            imagem: nomeProduto?.imagem,
            nomeEstoqueId,
            estoque: nomeEstoqueId === 1 ? "Matriz" : "Ceasa",
            quantidade: movimento === "e" ? quantidade : -quantidade,
          });
        } else {
          acc[index].quantidade += movimento === "e" ? quantidade : -quantidade;
        }

        return acc;
      }, []);
      return retorno;
    } catch (error: any) {
      return error.message;
    }
  }

  async verificaSaldo({ produtos, estoqueId }) {
    const estoque = await this.byEstoque();
    console.log(estoque);
    for (let prod of produtos) {
      const produtoEstoque = estoque.find(
        (item: any) =>
          item.idProduto === prod.idProduto && item.nomeEstoqueId === estoqueId
      );
      if (
        typeof produtoEstoque === "undefined" ||
        produtoEstoque?.quantidade < prod.quantidade
      ) {
        throw new Error(
          `O produto ${
            estoque.find((v) => v.idProduto === prod.idProduto)?.nome
          } não foi encontrado ou não tem unidades suficientes no estoque ${
            estoqueId === 1 ? "Matriz" : "Ceasa"
          }.`
        );
      }
    }
    return true;
  }

  async movVendaEstoque({ produtos, estoqueId, vendaId }) {
    // data;
    // idProduto;
    // movimento;
    // quantidade;
    // observacao;
    // idVenda;
    // nomeEstoqueId;

    const movimentoEstoque = produtos.map((prod: any) => ({
      nomeEstoqueId: estoqueId,
      idVenda: vendaId,
      idProduto: prod.idProduto,
      quantidade: prod.quantidade,
      movimento: "s",
      observacao: `Venda de Produto ${vendaId}`,
    }));
    console.log(movimentoEstoque);
    await prisma.movimentacao_Estoque.createMany({
      data: movimentoEstoque,
    });
    await movimentoEstoque.map(
      async (prod: any) =>
        await prisma.produtos.update({
          where: {
            id: prod.idProduto,
          },
          data: {
            quantidadeEstoque: {
              decrement: prod.quantidade,
            },
          },
        })
    );

    return movimentoEstoque;
  }

  async getEstoque() {
    const estoque = await prisma.movimentacao_Estoque.groupBy({
      by: ['nomeEstoqueId', 'idProduto'],
      _count: {}
    });
  }
}
