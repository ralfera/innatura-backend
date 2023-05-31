import { api, prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const { usuario, senha, nome, idPerfil } = req.body;
      if (!req.body.usuario || !req.body.senha)
        return res
          .status(400)
          .json({ error: true, message: "Campo senha ou usuário vazio" });

      try {
        const user = await prisma.usuarios.create({
          data: {
            usuario,
            senha: senha.toString(),
            nome,
            idPerfil,
          },
        });
        res.status(201).json(user);
      } catch (error: any) {
        res.status(400).json({ error: true, message: error.message });
      }

      break;

    default:
      try {
        const users = await prisma.usuarios.findMany({
          select: {
            createdAt: true,
            id: true,
            nome: true,
            Perfil: {
              select: {
                nome: true,
              },
            },
            updatedAt: true,
            usuario: true,
            senha: false,
          },
          orderBy: {
            nome: "asc",
          },
        });
        res.status(200).json(users);
      } catch (error: any) {
        res.status(500).json(error?.message);
      }

      break;
  }
}
