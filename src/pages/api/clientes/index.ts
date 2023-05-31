import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export interface iClientes {
  id?: string,
  nome?: string
  placa?: string
  nomeContato?: string
  tipo?: string
  telefone?: string | number
  endereco?: string
  diasEntregas?: string[]
  tabelaPreco?: number | null | undefined
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      const {
        diasEntregas,
        ...rest
      } = req.body
      try {
        if (!req.body.nome) throw new Error("Nome do cliente não pode ser nulo.")
        const user: any = await prisma.clientes.create({
          data: {
            ...rest,
            diasEntregas: diasEntregas.join(',') + ',',
          }
        })
        return res.status(201).json(user)
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message })
      }
      break
    default:
      try {
        const users = await prisma.clientes.findMany({
          orderBy: {
            nome: 'asc'
          },
          include: {
            Vendas: {
              take: 10,
              include: {
                FluxoCaixa: {
                  include: {
                    Caixa: true
                  }
                },

              }
            }
          },
        })
        const modifiedUsers = users.map((user) => {
          // Modifica a propriedade 'diasEntregas' de cada objeto
          const diasEntregasArray: any = user.diasEntregas?.split(',').filter(Boolean)
          user.diasEntregas = diasEntregasArray
          return user
        })
        res.status(200).json(modifiedUsers)
      } catch (error) {
        res.status(500).json(error)
      }
      break

  }
}