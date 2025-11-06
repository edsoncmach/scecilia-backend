/*
  Warnings:

  - You are about to drop the column `paroquiaId` on the `Cifra` table. All the data in the column will be lost.
  - Added the required column `gruposDeMusicosId` to the `Cifra` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Cifra" DROP CONSTRAINT "Cifra_paroquiaId_fkey";

-- AlterTable
ALTER TABLE "Cifra" DROP COLUMN "paroquiaId",
ADD COLUMN     "gruposDeMusicosId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Cifra" ADD CONSTRAINT "Cifra_gruposDeMusicosId_fkey" FOREIGN KEY ("gruposDeMusicosId") REFERENCES "GrupoDeMusicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
