import { EstoqueController } from "@/controllers/estoque";
import { VendasController } from "@/controllers/vendas";
import { prisma } from "@/helpers/api";
import { NextApiRequest, NextApiResponse } from "next";

// REGRAS
// - Recebe o cliente, a forma de pagamento e a lista de produtos que comprou.
// - Tem que poder dar desconto sobre a venda
// - Se o pagamento for a vista, bonificação ou troca o status é concluido
// - Se o pagamento for a prazo, o status é aberto
//  - Se eu Bonificar ou Trocar: Movimentar so o estoque
//  - Se eu Vender A vista Gerar Entrada no Fluxo de Caixa
//  - Atualizar status e dataPagamento quando o status é concluido.

export interface iVendasProdutos {
  idVenda?: string;
  idProduto: string;
  desconto?: number;
  quantidade: number;
  valor: number;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      const {
        idCliente,
        caixaId,
        idFormaPagamento,
        produtos,
        desconto,
        idEstoque,
      }: any = req.body;

      try {
        if (!caixaId) {
          throw new Error("Sem caixa aberto. Por favor abre um caixa primeiro");
        }

        const venda: any = await new VendasController().createVenda({
          caixaId: caixaId,
          idCliente: idCliente,
          idEstoque: idEstoque,
          desconto: desconto,
          idFormaPagamento: idFormaPagamento,
          produtos: produtos,
        });
        if (venda.error) {
          throw new Error(venda.message);
        }
        const movEstoque = await new EstoqueController().movVendaEstoque({
          produtos: produtos,
          estoqueId: idEstoque,
          vendaId: venda.id,
        });

        return res.status(200).json({ venda, movEstoque });
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message });
      }

      break;

    default:
      try {
        const vendas = await prisma.vendas.findMany({
          orderBy: {
            data: "desc",
          },
          include: {
            Clientes: true,
            ItemVenda: {
              include: {
                Produto: true,
              },
            },
            FluxoCaixa: true,
          },
          take: 100,
        });
        return res.status(200).json(vendas);
      } catch (error: any) {
        return res.status(400).json({ error: true, message: error.message });
      }
      break;
  }
}
