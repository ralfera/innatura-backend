import { api, prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id }: Partial<{ id: string }> = req.query
  switch (req.method) {
    default:
      try {
        const users = await prisma.usuarios.findFirst({
          select: {
            createdAt: true,
            id: true,
            nome: true,
            Perfil: {
              select: {
                nome: true
              }
            },
            updatedAt: true,
            usuario: true,
            senha: true
          },
          where: {
            id: id
          }
        })
        if (!users) throw new Error("Usuário não encontrado")
        res.status(200).json(users)
      } catch (error: any) {
        res.status(500).json({ error: true, message: error.message })
      }

  }
}