import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

export interface iProduto {
  nome: string;
  preco: number;
  idCategoria: number;
  imagem: string;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const { nome, idCategoria, preco, imagem }: iProduto = req.body;

      try {
        const cadastro = await prisma.produtos.create({
          data: {
            nome,
            preco: Number(preco),
            ...(imagem && { imagem }),
            idCategoria,
          },
        });
        return res.status(200).json(cadastro);
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message });
      }
      break;

    default:
      const produtos = await prisma.produtos.findMany({
        orderBy: {
          nome: "asc",
        },
        include: {
          categoria: true,
        },
      });
      return res.status(200).json(produtos);
      break;
  }
}
