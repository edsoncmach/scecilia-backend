/*
  Warnings:

  - You are about to drop the column `role` on the `MembroGrupo` table. All the data in the column will be lost.
  - You are about to drop the column `criadoPorId` on the `categorias` table. All the data in the column will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagTipo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[usuarioId,grupoId]` on the table `MembroGrupo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nome,paroquiaId]` on the table `categorias` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paroquiaId` to the `categorias` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Coordenador', 'Musico');

-- DropForeignKey
ALTER TABLE "public"."Tag" DROP CONSTRAINT "Tag_paroquiaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tag" DROP CONSTRAINT "Tag_tagTipoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."categorias" DROP CONSTRAINT "categorias_criadoPorId_fkey";

-- DropIndex
DROP INDEX "public"."categorias_nome_criadoPorId_key";

-- AlterTable
ALTER TABLE "MembroGrupo" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "igrejaGerenciadaId" INTEGER,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Musico';

-- AlterTable
ALTER TABLE "categorias" DROP COLUMN "criadoPorId",
ADD COLUMN     "paroquiaId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Tag";

-- DropTable
DROP TABLE "public"."TagTipo";

-- CreateIndex
CREATE UNIQUE INDEX "MembroGrupo_usuarioId_grupoId_key" ON "MembroGrupo"("usuarioId", "grupoId");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nome_paroquiaId_key" ON "categorias"("nome", "paroquiaId");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_igrejaGerenciadaId_fkey" FOREIGN KEY ("igrejaGerenciadaId") REFERENCES "Igreja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_paroquiaId_fkey" FOREIGN KEY ("paroquiaId") REFERENCES "Paroquia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
