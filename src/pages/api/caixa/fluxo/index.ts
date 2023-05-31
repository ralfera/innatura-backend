import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export interface iLancamentoFluxo {
  data?: Date;
  caixaId?: string;
  movimento: any;
  valor: number;
  descricao: string;
  desconto?: number;
  fluxoCaixa_categoriaId: number;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      const temFiltro = Object.keys(req.query).length > 0 ? true : false;

      const teste = await prisma.fluxoCaixa.groupBy({
        by: ["data", "id", "movimento", "descricao"],
        _sum: {
          valor: true,
        },
        orderBy: {
          data: "desc",
        },
      });

      const saldoPorDia = teste.reduce((saldo: any, movimento: any) => {
        const data = new Date(movimento.data).toLocaleDateString();
        saldo[data] = saldo[data] || 0;

        if (movimento.movimento === "e") {
          saldo[data] += movimento._sum.valor;
        } else {
          saldo[data] -= movimento._sum.valor;
        }

        return saldo;
      }, {});

      const fluxo = await prisma.fluxoCaixa.findMany({
        orderBy: {
          data: "desc",
        },
        include: {
          Vendas: true,
        },
      });
      return res.json({ saldoPorDia, teste });
      break;

    case "POST":
      try {
        const {
          caixaId,
          movimento,
          valor,
          descricao,
          ...rest
        }: iLancamentoFluxo = req.body;

        if (valor === 0) {
          throw new Error("Movimento de caixa não pode ser igual a 0!");
        }
        if (!caixaId) {
          throw new Error("Caixa não informado.");
        }

        const query = await prisma.caixa.update({
          data: {
            valorAtual: {
              ...(movimento === "e" && {
                increment: valor,
              }),
              ...(movimento === "s" && {
                decrement: valor,
              }),
            },
            Fluxo: {
              create: {
                fluxoCaixa_CategoriasId: rest.fluxoCaixa_categoriaId,
                movimento: movimento,
                valor: valor,
                descricao: descricao,
              },
            },
          },
          where: {
            id: caixaId,
          },
        });
        return res.json(query);
      } catch (error: any) {
        return res.status(400).json({
          error: true,
          message: error.message,
        });
      }

    default:
      return res
        .status(400)
        .json({ error: true, message: "Method Não Permitido" });
      break;
  }
}
