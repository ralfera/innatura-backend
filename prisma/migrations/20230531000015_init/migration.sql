-- CreateTable
CREATE TABLE `Perfil_Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `usuario` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NULL,
    `idPerfil` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuarios_usuario_key`(`usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Clientes` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `placa` VARCHAR(191) NULL,
    `nomeContato` VARCHAR(191) NULL,
    `tipo` VARCHAR(191) NULL DEFAULT 'padrao',
    `telefone` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,
    `diasEntregas` VARCHAR(191) NULL,
    `tabelaPreco` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vendas` (
    `id` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataVencimento` DATETIME(3) NULL,
    `dataPagamento` DATETIME(3) NULL,
    `valorVenda` DOUBLE NOT NULL,
    `saldoAPagar` DOUBLE NULL DEFAULT 0,
    `idCliente` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'aberto',
    `idFormaPagamento` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemVenda` (
    `id` VARCHAR(191) NOT NULL,
    `idVenda` VARCHAR(191) NOT NULL,
    `idProduto` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `valor` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Forma_Pagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produtos` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `idCategoria` INTEGER NOT NULL,
    `preco` DOUBLE NOT NULL,
    `imagem` VARCHAR(191) NULL DEFAULT 'null',
    `quantidadeEstoque` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria_Produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nome_Estoque` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomeEstoque` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movimentacao_Estoque` (
    `id` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idProduto` VARCHAR(191) NOT NULL,
    `movimento` VARCHAR(191) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `observacao` VARCHAR(191) NULL,
    `idVenda` VARCHAR(191) NULL,
    `nomeEstoqueId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FluxoCaixa_Categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FluxoCaixa` (
    `id` VARCHAR(191) NOT NULL,
    `data` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `movimento` ENUM('e', 's') NOT NULL,
    `valor` DOUBLE NOT NULL,
    `desconto` DOUBLE NULL DEFAULT 0,
    `descricao` VARCHAR(191) NULL,
    `idVenda` VARCHAR(191) NULL,
    `caixaId` VARCHAR(191) NULL,
    `fluxoCaixa_CategoriasId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedidos` (
    `id` VARCHAR(191) NOT NULL,
    `dataAbertura` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'aberto',
    `dataEntrega` DATETIME(3) NULL DEFAULT '0001-01-01T00:00:00+00:00',
    `vendasId` VARCHAR(191) NULL,
    `clientesId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemPedido` (
    `id` VARCHAR(191) NOT NULL,
    `produtosId` VARCHAR(191) NULL,
    `pedidosId` VARCHAR(191) NULL,
    `quantidade` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Caixa` (
    `id` VARCHAR(191) NOT NULL,
    `dataAbertura` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataFechamento` DATETIME(3) NULL,
    `valorAbertura` DOUBLE NOT NULL,
    `valorFechamento` DOUBLE NOT NULL DEFAULT 0,
    `valorAtual` DOUBLE NOT NULL,
    `status` ENUM('aberto', 'fechado') NOT NULL DEFAULT 'aberto',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_idPerfil_fkey` FOREIGN KEY (`idPerfil`) REFERENCES `Perfil_Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vendas` ADD CONSTRAINT `Vendas_idCliente_fkey` FOREIGN KEY (`idCliente`) REFERENCES `Clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vendas` ADD CONSTRAINT `Vendas_idFormaPagamento_fkey` FOREIGN KEY (`idFormaPagamento`) REFERENCES `Forma_Pagamento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemVenda` ADD CONSTRAINT `ItemVenda_idVenda_fkey` FOREIGN KEY (`idVenda`) REFERENCES `Vendas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemVenda` ADD CONSTRAINT `ItemVenda_idProduto_fkey` FOREIGN KEY (`idProduto`) REFERENCES `Produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produtos` ADD CONSTRAINT `Produtos_idCategoria_fkey` FOREIGN KEY (`idCategoria`) REFERENCES `Categoria_Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movimentacao_Estoque` ADD CONSTRAINT `Movimentacao_Estoque_idProduto_fkey` FOREIGN KEY (`idProduto`) REFERENCES `Produtos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movimentacao_Estoque` ADD CONSTRAINT `Movimentacao_Estoque_idVenda_fkey` FOREIGN KEY (`idVenda`) REFERENCES `Vendas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Movimentacao_Estoque` ADD CONSTRAINT `Movimentacao_Estoque_nomeEstoqueId_fkey` FOREIGN KEY (`nomeEstoqueId`) REFERENCES `Nome_Estoque`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FluxoCaixa` ADD CONSTRAINT `FluxoCaixa_idVenda_fkey` FOREIGN KEY (`idVenda`) REFERENCES `Vendas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FluxoCaixa` ADD CONSTRAINT `FluxoCaixa_caixaId_fkey` FOREIGN KEY (`caixaId`) REFERENCES `Caixa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FluxoCaixa` ADD CONSTRAINT `FluxoCaixa_fluxoCaixa_CategoriasId_fkey` FOREIGN KEY (`fluxoCaixa_CategoriasId`) REFERENCES `FluxoCaixa_Categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedidos` ADD CONSTRAINT `Pedidos_vendasId_fkey` FOREIGN KEY (`vendasId`) REFERENCES `Vendas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedidos` ADD CONSTRAINT `Pedidos_clientesId_fkey` FOREIGN KEY (`clientesId`) REFERENCES `Clientes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemPedido` ADD CONSTRAINT `ItemPedido_produtosId_fkey` FOREIGN KEY (`produtosId`) REFERENCES `Produtos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemPedido` ADD CONSTRAINT `ItemPedido_pedidosId_fkey` FOREIGN KEY (`pedidosId`) REFERENCES `Pedidos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
