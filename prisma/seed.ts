import { prisma } from "../src/helpers/api";

async function main() {
  const clientes = await prisma.clientes.createMany({
    data: [
      { nome: "Venda Balcão", diasEntregas: "2,3,4,5,6" },
      {
        nome: "Cachoeirense Supermercados",
        placa: "5949",
        diasEntregas: "2,3,5",
        nomeContato: "Isair Cardoso",
        telefone: "53981351255",
      },
      {
        nome: "Lotterman Frutas",
        placa: "6808",
        diasEntregas: "2,3,5",
        nomeContato: "Paulo Lottermann",
        telefone: "51999140640",
      },
      {
        nome: "Bresciense Supermercado",
        nomeContato: "Alexandre",
        diasEntregas: "3,5",
        telefone: "51984248187",
      },
      {
        nome: "Gomes Supermercado",
        nomeContato: "Andre",
        diasEntregas: "2,3,5",
        telefone: "51995554572",
      },
      {
        nome: "Lenz Supermercados",
        nomeContato: "Jovane",
        diasEntregas: "2,3,5",
        telefone: "51996351267",
      },
      {
        nome: "Miller Supermercados",
        nomeContato: "Lorimar",
        diasEntregas: "2,3,5",
        telefone: "51999777607",
      },
      {
        nome: "Rede Grande Sul",
        nomeContato: "Fabricio ou Igor",
        diasEntregas: "3,5",
        telefone: "51984244779",
      },
      {
        nome: "Zanella supermercados",
        nomeContato: "Mano",
        diasEntregas: "2,3,5,6",
        telefone: "51984308682",
      },
      {
        nome: "Gauchão Supermercados",
        nomeContato: "Wagner",
        diasEntregas: "3,5",
        telefone: "51993596691",
      },
      {
        nome: "Macla Supermercado",
        nomeContato: "Alex",
        placa: "2604",
        diasEntregas: "3,5",
        telefone: "51996669627",
      },
      {
        nome: "Lauricio",
        nomeContato: "Lauricio ou Moises",
        placa: "1A36",
        diasEntregas: "2,3,5",
        telefone: "51998250194",
      },
      {
        nome: "Cotriel",
        nomeContato: "",
        placa: "A4",
        diasEntregas: "3,5",
        telefone: "",
      },
      {
        nome: "Modelo Fruteira",
        nomeContato: "Celio",
        placa: "",
        diasEntregas: "3,5",
        telefone: "",
      },
      {
        nome: "Hamilton",
        nomeContato: "Hamilton",
        placa: "",
        diasEntregas: "3,5",
        telefone: "",
      },
      {
        nome: "Emerson Machado",
        nomeContato: "Emerson ou Jefferson",
        placa: "",
        diasEntregas: "2,3,5,6",
        telefone: "",
      },
      {
        nome: "Horta&Pomar",
        nomeContato: "Lucas",
        placa: "TC6",
        diasEntregas: "2,3,5",
        telefone: "",
      },
      {
        nome: "Sacolão do Parque",
        nomeContato: "",
        placa: "",
        diasEntregas: "3,5",
        telefone: "",
      },
      {
        nome: "Borelli",
        nomeContato: "Borelli",
        placa: "",
        diasEntregas: "3,5",
        telefone: "51980187117",
      },
      {
        nome: "Evandro",
        nomeContato: "Evandro",
        placa: "3407",
        diasEntregas: "3,5",
        telefone: "",
      },
      {
        nome: "São José Supermercado",
        nomeContato: "Thiago",
        placa: "",
        diasEntregas: "2,5",
        telefone: "",
      },
      {
        nome: "São José Supermercado",
        nomeContato: "Thiago",
        placa: "",
        diasEntregas: "2,5",
        telefone: "",
      },
      {
        nome: "Júlia Henz",
        nomeContato: "Thiago",
        placa: "2665",
        diasEntregas: "2,3,5",
        telefone: "51996567285",
      },
    ],
  });
  const admin = await prisma.usuarios.create({
    data: {
      senha: "1234",
      usuario: "ralf",
      nome: "Ralf S",
      Perfil: {
        create: {
          nome: "Administrador",
        },
      },
    },
  });
  const usuarioPerfil = await prisma.perfil_Usuario.createMany({
    data: [
      {
        nome: "Vendedor",
      },
      {
        nome: "Produtor",
      },
    ],
  });
  const formaPagamento = await prisma.forma_Pagamento.createMany({
    data: [
      {
        nome: "A Vista",
      },
      {
        nome: "A Prazo",
      },
      {
        nome: "PIX",
      },
      {
        nome: "Bonificação",
      },
      {
        nome: "Troca",
      },
    ],
  });
  const nomesEstoque = await prisma.nome_Estoque.createMany({
    data: [
      {
        nomeEstoque: "MATRIZ",
      },
      {
        nomeEstoque: "CEASA",
      },
    ],
  });

  const categoriaProdutos = [
    {
      categoria: "Bandeja",
      produtos: [
        {
          nome: "Broto Bandeja 125g",
          preco: 4.5,
        },
      ],
    },
    {
      categoria: "Pacote 500g",
      produtos: [
        {
          nome: "Broto 500g",
          preco: 10,
        },
        {
          nome: "Broto Girassol 500g",
          preco: 12,
        },
        {
          nome: "Broto Nabo 500g",
          preco: 12,
        },
      ],
    },
    {
      categoria: "Pacote Quilo",
      produtos: [
        {
          nome: "Broto Quilo",
          preco: 20,
        },
        {
          nome: "Broto Feijão",
          preco: 25,
        },
      ],
    },
    {
      categoria: "Tomate",
      produtos: [
        {
          nome: "Tomate Pacote Quilo",
          preco: 10,
        },
        {
          nome: "Tomate Pacote 2KG",
          preco: 20,
        },
      ],
    },
    {
      categoria: "Tempero",
      produtos: [
        {
          nome: "Tempero Pacote Padrão",
          preco: 2.5,
        },
      ],
    },
  ];

  for (let cadastro of categoriaProdutos) {
    await prisma.categoria_Produto.create({
      data: {
        descricao: cadastro.categoria,
        Produtos: {
          createMany: {
            data: cadastro.produtos,
          },
        },
      },
    });
  }

  await prisma.fluxoCaixa_Categorias.createMany({
    data: [
      {
        descricao: "Vendas",
      },
      {
        descricao: "Recebimentos",
      },
      {
        descricao: "Gastos - Alimentação",
      },
      {
        descricao: "Gastos - Materiais",
      },
      {
        descricao: "Gastos - Produtos",
      },
      {
        descricao: "Gastos - Combustível",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit();
  });
