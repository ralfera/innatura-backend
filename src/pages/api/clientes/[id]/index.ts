import { prisma } from "@/helpers/api"
import { NextApiRequest, NextApiResponse } from "next"
import { iClientes } from ".."

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { id }: any = req.query
  switch (req.method) {
    case 'PATCH':
      const { diasEntregas, telefone, ...rest }: iClientes = req.body

      const edit = await prisma.clientes.update({
        data: {
          ...rest,
          telefone: telefone?.toString(),
          diasEntregas: diasEntregas?.join(',')
        },
        where: {
          id: id
        }
      })
      return res.status(200).json(edit)
      break

    case 'DELETE':
      try {
        const deleteClient = await prisma.clientes.delete({
          where: {
            id: id
          }
        })
        if (deleteClient) return res.status(200).json(deleteClient)
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message })
      }
      break

    default:
      try {
        const cliente = await prisma.clientes.findFirstOrThrow({
          where: {
            id: id
          },
          include: {
            Vendas: {
              take: 25,
              include: {
                ItemVenda: true
              }
            }
          }

        })
        return res.json(cliente)
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message })
      }
      break;
  }

}