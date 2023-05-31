import { prisma } from "@/helpers/api";
import dayjs from "dayjs";

export class CaixaController {
  async caixaLista() {
    try {
      const lista = await prisma.caixa.findMany({
        orderBy: {
          dataAbertura: "desc",
        },
      });
      return lista;
    } catch (error: any) {
      return error.message;
    }
  }

  async addValueToCaixa(
    vendaId: string,
    caixaId: string,
    valorTotal: number,
    desconto?: number
  ) {
    return await prisma.caixa.update({
      where: {
        id: caixaId,
      },
      data: {
        valorAtual: {
          increment: valorTotal,
        },
        Fluxo: {
          create: {
            movimento: "e",
            fluxoCaixa_CategoriasId: 1,
            valor: valorTotal,
            desconto: desconto ? desconto : 0,
            idVenda: vendaId,
            descricao: `Pagamento Total de venda do dia ${new Date().toLocaleDateString()}`,
          },
        },
      },
      include: {
        Fluxo: true,
      },
    });
  }

  async createCaixa(valorAbertura: number) {
    try {
      const day = dayjs().startOf("day").format();
      const notDistinct = await prisma.caixa.findFirst({
        where: {
          dataAbertura: {
            gt: day,
          },
        },
      });
      const count = await prisma.caixa.count({
        where: {
          dataFechamento: null,
        },
      });
      if (notDistinct || count > 0) {
        throw new Error(
          `Você não precisa abrir um caixa. Já existe um aberto para o dia ${dayjs(
            notDistinct?.dataAbertura
          ).format("DD/MM/YY")}`
        );
      }
      const caixa = await prisma.caixa.create({
        data: {
          valorFechamento: 0,
          status: "aberto",
          valorAbertura: valorAbertura,
          valorAtual: valorAbertura,
        },
      });
      return caixa;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async estadoCaixa() {
    const caixa = await prisma.caixa.findMany();
    const caixaAberto = caixa.find((c) => c.status === "aberto");
    const day = dayjs().format("DD/MM/YYYY");
    // se existe um caixa aberto
    // se o caixa está atrasado (dataAbertura > data de hoje)

    if (!caixaAberto) {
      return {
        status: "isClosed",
        data: null,
      };
    }

    if (day > dayjs(caixaAberto?.dataAbertura).format("DD/MM/YYYY")) {
      return {
        status: "isLate",
        data: caixaAberto,
      };
    }

    if (caixaAberto) {
      return {
        status: "isOpen",
        data: caixaAberto,
      };
    }

    return caixaAberto;
  }

  async caixaById(caixaId: string) {
    try {
      const query = await prisma.caixa.findUnique({
        where: {
          id: caixaId,
        },
      });
      return query;
    } catch (error: any) {
      return error.message;
    }
  }
}
