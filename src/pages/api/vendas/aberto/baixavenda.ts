import { prisma } from "@/helpers/api";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";
import { iVendas, iVendasProdutos } from "..";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "PATCH":
      const { valorRecebido, vendas, caixaId }: any = req.body;

      try {
        if (!caixaId) {
          throw new Error(
            "Caixa não informado. Verifique se existe um aberto."
          );
        }
        const vendasAPI = await prisma.vendas.findMany({
          orderBy: {
            data: "asc",
          },
          where: {
            id: {
              in: vendas,
            },
            NOT: {
              status: "concluido",
            },
          },
        });

        if (vendasAPI.length <= 0)
          throw new Error("Vendas não possuem saldo em aberto.");

        const valorTotal = vendasAPI.reduce((acc: any, v: any) => {
          return (acc += v.status === "parcial" ? v.saldoAPagar : v.valorVenda);
        }, 0);

        let acc: any = valorRecebido;
        if (valorRecebido < valorTotal) {
          for (const venda of vendasAPI as any) {
            if ((venda.saldoAPagar || venda.valorVenda) > acc) {
              await prisma.vendas.update({
                where: {
                  id: venda.id,
                },
                data: {
                  status: "parcial",
                  ...(venda.status === "parcial" && {
                    saldoAPagar: venda.saldoAPagar - acc,
                  }),
                  ...(venda.status === "aberto" && {
                    saldoAPagar: venda.valorVenda - acc,
                  }),
                  FluxoCaixa: {
                    create: {
                      movimento: "e",
                      fluxoCaixa_CategoriasId: 2,
                      caixaId: caixaId,
                      descricao: `Pagamento parcial da venda do dia ${dayjs(
                        venda?.data
                      ).format("DD/MM/YYYY")}`,
                      valor: acc,
                    },
                  },
                },
              });
              break;
            }
            await prisma.vendas.update({
              where: {
                id: venda.id,
              },
              data: {
                status: "concluido",
                saldoAPagar: 0,
                dataPagamento: new Date(),
                ...(venda.saldoAPagar
                  ? { valorVenda: venda.saldoAPagar }
                  : { valorVenda: venda.valorVenda }),
                FluxoCaixa: {
                  create: {
                    movimento: "e",
                    fluxoCaixa_CategoriasId: 2,
                    caixaId: caixaId,
                    ...(venda.saldoAPagar
                      ? { valor: venda.saldoAPagar }
                      : { valor: venda.valorVenda }),
                    descricao: `Pagamento da venda do dia ${dayjs(
                      venda?.data
                    ).format("DD/MM/YYYY")}`,
                  },
                },
              },
            });
            if (typeof caixaId !== "undefined") {
              await prisma.caixa.update({
                where: {
                  id: caixaId,
                },
                data: {
                  valorAtual: {
                    increment:
                      venda.status === "parcial"
                        ? venda.saldoAPagar
                        : venda.valorVenda,
                  },
                },
              });
            }
            acc -=
              venda.status === "parcial" ? venda.saldoAPagar : venda.valorVenda;
          }
          return res.json({ status: true });
        } else {
          // VALOR RECEBIDO É MAIOR QUE O VALOR DA VENDA OU DO SALDO
          const troco = valorRecebido - valorTotal;
          for (const venda of vendasAPI as any) {
            await prisma.vendas.update({
              where: {
                id: venda.id,
              },
              data: {
                status: "concluido",
                dataPagamento: dayjs().startOf("day").format(),
                saldoAPagar: 0,
                FluxoCaixa: {
                  create: {
                    movimento: "e",
                    fluxoCaixa_CategoriasId: 2,
                    caixaId: caixaId,
                    ...(venda.status === "parcial" && {
                      valor: venda.saldoAPagar,
                      descricao: `Pagamento de saldo final da venda do dia ${dayjs(
                        venda?.data
                      ).format("DD/MM/YYY")}`,
                    }),
                    ...(venda.status === "aberto" && {
                      valor: venda.valorVenda,
                      descricao: `Pagamento total de venda do dia ${dayjs(
                        venda?.data
                      ).format("DD/MM/YYY")}`,
                    }),
                  },
                },
              },
            });
            if (typeof caixaId !== "undefined") {
              await prisma.caixa.update({
                where: {
                  id: caixaId,
                },
                data: {
                  valorAtual: {
                    increment: venda.valorVenda,
                  },
                },
              });
            }
          }
          return res.json({ status: true, troco });
        }
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message });
      }
      break;

    default:
      return res
        .status(400)
        .json({ error: true, message: "method not allowed" });
  }
}
