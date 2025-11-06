/*
  Warnings:

  - You are about to drop the `CifraTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CifraTag" DROP CONSTRAINT "CifraTag_cifraId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CifraTag" DROP CONSTRAINT "CifraTag_tagId_fkey";

-- DropTable
DROP TABLE "public"."CifraTag";

-- CreateTable
CREATE TABLE "cifra_categorias" (
    "id" SERIAL NOT NULL,
    "cifraId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "cifra_categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoPorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cifra_categorias_cifraId_categoriaId_key" ON "cifra_categorias"("cifraId", "categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nome_criadoPorId_key" ON "categorias"("nome", "criadoPorId");

-- AddForeignKey
ALTER TABLE "cifra_categorias" ADD CONSTRAINT "cifra_categorias_cifraId_fkey" FOREIGN KEY ("cifraId") REFERENCES "Cifra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cifra_categorias" ADD CONSTRAINT "cifra_categorias_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
