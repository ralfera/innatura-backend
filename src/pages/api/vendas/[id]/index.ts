import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";
import { iVendas, iVendasProdutos } from "..";

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id }: Partial<{ id: string }> = req.query
  switch (req.method) {
    case 'PATCH':
      const { status, dataVencimento, dataPagamento }: any = req.body

      const fixDataToIso = (data: string) => {
        const [dia, mes, ano] = data.split('/')
        const dataIso = new Date(`${ano}/${mes}/${dia}`)
        return dataIso
      }

      try {
        if (!id) throw new Error("NO ID, NO PERMISSION")

        const update = await prisma.vendas.update({
          where: {
            id: id
          },
          data: {
            ...(status && { status: status }),
            ...(dataPagamento && { dataPagamento: fixDataToIso(dataPagamento) }),
            ...(dataVencimento && { dataVencimento: fixDataToIso(dataVencimento) })
          }
        })
        return res.json({ update })
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message })
      }
      break;

    case 'DELETE':
      try {
        if (!id) throw new Error("NO ID, NO PERMISSION")

        const deleted = await prisma.vendas.delete({ where: { id: id } })
        return res.json(deleted)
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message })
      }
      break

    default:
      try {
        if (!id) throw new Error("NO ID, NO PERMISSION")

        const venda = await prisma.vendas.findUniqueOrThrow({
          where: {
            id: id
          },
          include: {
            ItemVenda: {
              include: {
                Produto: {
                  select: {
                    imagem: true,
                    nome: true
                  }
                }
              }
            },
            Clientes: {
              select: {
                id: true,
                nome: true,
                nomeContato: true,
                telefone: true
              }
            },
            FluxoCaixa: true,


          }
        })
        return res.json(venda)
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message })
      }
      break;
  }
}