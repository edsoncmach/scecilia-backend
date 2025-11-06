-- CreateTable
CREATE TABLE "Comunidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Comunidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paroquia" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "comunidadeId" INTEGER NOT NULL,

    CONSTRAINT "Paroquia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Igreja" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "paroquiaId" INTEGER NOT NULL,

    CONSTRAINT "Igreja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrupoDeMusicos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "igrejaId" INTEGER NOT NULL,

    CONSTRAINT "GrupoDeMusicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembroGrupo" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "grupoId" INTEGER NOT NULL,

    CONSTRAINT "MembroGrupo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagTipo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "TagTipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "paroquiaId" INTEGER NOT NULL,
    "tagTipoId" INTEGER NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cifra" (
    "id" SERIAL NOT NULL,
    "nomeMusica" TEXT NOT NULL,
    "interprete" TEXT NOT NULL,
    "tomOriginal" TEXT NOT NULL,
    "conteudoChordpro" TEXT NOT NULL,
    "paroquiaId" INTEGER NOT NULL,

    CONSTRAINT "Cifra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CifraTag" (
    "id" SERIAL NOT NULL,
    "cifraId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "CifraTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CelebracaoTipo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "CelebracaoTipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "dataEvento" TIMESTAMP(3) NOT NULL,
    "tituloOpcional" TEXT,
    "igrejaId" INTEGER NOT NULL,
    "grupoId" INTEGER NOT NULL,
    "tipoCelebracaoId" INTEGER NOT NULL,
    "urlPdfCelebracao" TEXT,
    "pdfUltimaAtualizacao" TIMESTAMP(3),

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventoCifras" (
    "id" SERIAL NOT NULL,
    "ordem" INTEGER NOT NULL,
    "tomExecucao" TEXT NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "cifraId" INTEGER NOT NULL,

    CONSTRAINT "EventoCifras_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Paroquia" ADD CONSTRAINT "Paroquia_comunidadeId_fkey" FOREIGN KEY ("comunidadeId") REFERENCES "Comunidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Igreja" ADD CONSTRAINT "Igreja_paroquiaId_fkey" FOREIGN KEY ("paroquiaId") REFERENCES "Paroquia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrupoDeMusicos" ADD CONSTRAINT "GrupoDeMusicos_igrejaId_fkey" FOREIGN KEY ("igrejaId") REFERENCES "Igreja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembroGrupo" ADD CONSTRAINT "MembroGrupo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembroGrupo" ADD CONSTRAINT "MembroGrupo_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "GrupoDeMusicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_paroquiaId_fkey" FOREIGN KEY ("paroquiaId") REFERENCES "Paroquia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_tagTipoId_fkey" FOREIGN KEY ("tagTipoId") REFERENCES "TagTipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cifra" ADD CONSTRAINT "Cifra_paroquiaId_fkey" FOREIGN KEY ("paroquiaId") REFERENCES "Paroquia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CifraTag" ADD CONSTRAINT "CifraTag_cifraId_fkey" FOREIGN KEY ("cifraId") REFERENCES "Cifra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CifraTag" ADD CONSTRAINT "CifraTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_igrejaId_fkey" FOREIGN KEY ("igrejaId") REFERENCES "Igreja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "GrupoDeMusicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_tipoCelebracaoId_fkey" FOREIGN KEY ("tipoCelebracaoId") REFERENCES "CelebracaoTipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoCifras" ADD CONSTRAINT "EventoCifras_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventoCifras" ADD CONSTRAINT "EventoCifras_cifraId_fkey" FOREIGN KEY ("cifraId") REFERENCES "Cifra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
