import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export interface iLancamentoEstoque {
  estoqueId: number;
  movimento: "e" | "s";
  produtoId: string;
  quantidade: number;
  observacao?: string;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const { estoqueId, observacao, movimento, produtoId, quantidade }: any =
        req.body;

      try {
        if (!quantidade || quantidade === 0) {
          throw new Error("Quantidade movimentanda não pode ser 0!");
        }
        const { quantidadeEstoque }: any = await prisma.produtos.findFirst({
          where: {
            id: produtoId,
          },
        });

        if (quantidade > quantidadeEstoque && movimento === "s")
          throw new Error("Estoque insuficiente para lançamento");

        const lancamento: any = await prisma.produtos.update({
          where: {
            id: produtoId,
          },
          data: {
            quantidadeEstoque: {
              ...(movimento === "e" && {
                increment: quantidade,
              }),
              ...(movimento === "s" && {
                decrement: quantidade,
              }),
            },
            Movimentacao: {
              create: {
                nomeEstoqueId: estoqueId,
                movimento,
                observacao,
                quantidade,
              },
            },
          },
          include: {
            Movimentacao: true,
          },
        });

        return res.json(lancamento);
        break;
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message });
      }

    default:
      return res
        .status(400)
        .json({ error: true, message: "Method not allowed" });
      break;
  }
}
