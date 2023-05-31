import { prisma } from "@/helpers/api";

export class ClientesController {
  async clienteExists(clienteId: string) {
    try {
      const cliente = await prisma.clientes.findFirstOrThrow({
        where: {
          id: clienteId,
        },
      });
      return true;
    } catch (error:any) {
      return false;
    }
  }

  async Favoritos() {
    const clientes = await prisma.clientes.findMany();
  }
}
