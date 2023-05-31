import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import { EstoqueController } from "@/controllers/estoque";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const { valorFechamento, caixaId } = req.body;

      if (valorFechamento <= 0) {
        throw new Error("Valor não pode ser zero.");
      }

      try {
        const caixa = await prisma.caixa.findFirst({
          where: {
            id: caixaId,
          },
        });

        if (!caixa) {
          throw new Error("Caixa não encontrado");
        }

        if (caixa.dataFechamento) {
          throw new Error("Caixa já encontra-se encerrado");
        }

        const updated = await prisma.caixa.update({
          where: {
            id: caixaId,
          },
          data: {
            dataFechamento: dayjs().format(),
            valorFechamento: valorFechamento,
            status: "fechado",
          },
        });

        return res.status(201).json(updated);
      } catch (error: any) {
        return res.status(400).json({
          error: true,
          message: error.message,
        });
      }

    case "GET":
      const { id }: Partial<{ id: string }> = req.query;
      const caixa: any = await prisma.caixa.findFirst({ where: { id: id } });
      const estoque = await new EstoqueController().byEstoque(2);
      const fluxos = await prisma.fluxoCaixa.findMany({
        orderBy: {
          movimento: "asc",
        },
        where: {
          caixaId: id,
        },
      });
      console.log(dayjs(caixa?.dataAbertura).startOf("day").format());

      const vendas = await prisma.vendas.findMany({
        where: {
          data: {
            gt: dayjs(caixa?.dataAbertura).startOf("day").format(),
          },
        },
        include: {
          FormaPagamento: true,
          ItemVenda: {
            select: {
              idProduto: true,
              quantidade: true,
              valor: true,
              Produto: {
                select: {
                  nome: true,
                },
              },
            },
          },
        },
      });
      const saidas = fluxos.reduce((acc, atual) => {
        if (atual.movimento === "s") {
          acc += atual.valor;
        }
        return acc;
      }, 0);

      const entradas = fluxos.reduce((acc, atual) => {
        if (atual.movimento === "e") {
          acc += atual.valor;
        }
        return acc;
      }, 0);

      console.log(JSON.stringify(vendas));
      const fechamentoProdutos: any = [];
      for (const venda of vendas) {
        for (const itemVenda of venda.ItemVenda) {
          const nomeProduto = itemVenda.Produto.nome;
          const formaPagamento = venda.FormaPagamento.nome;
          const quantidade = itemVenda.quantidade;

          const produtoExistente = fechamentoProdutos.find(
            (produto: any) => produto.nomeProduto === nomeProduto
          );

          if (produtoExistente) {
            // O objeto do produto já existe, atualiza a quantidade de venda conforme a forma de pagamento
            produtoExistente[venda.FormaPagamento.nome] =
              (produtoExistente[venda.FormaPagamento.nome] || 0) +
              itemVenda.quantidade;
          } else {
            // O objeto do produto ainda não existe, cria um novo objeto com a quantidade de venda para a forma de pagamento atual
            const novoProduto = {
              nomeProduto,
              [venda.FormaPagamento.nome]: itemVenda.quantidade,
            };
            fechamentoProdutos.push(novoProduto);
          }
        }
      }

      res.json({
        caixa,
        estoque,
        fluxos,
        fechamentoProdutos,
        fechamentoCaixa: {
          entrada: entradas,
          saida: saidas,
          saldo: entradas + caixa?.valorAbertura - saidas,
        },
      });

      break;

    default:
      return res
        .status(400)
        .json({ error: true, message: "Method Não Permitido" });
      break;
  }
}
