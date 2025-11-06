import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import type { UsuarioComContexto } from 'src/auth/jwt.strategy'
import { CreateCelebracaoTipoDto } from './dto/create-celebracao-tipo.dto'
import { CreateCelebracaoDto } from './dto/create-celebracao.dto'
import { SetCelebracaoCifrasDto } from './dto/set-celebracao-cifras.dto'

@Injectable()
export class CelebracoesService {
    constructor(
        private prisma: PrismaService
    ) { }

    private async getGrupoDoUsuario(usuario: UsuarioComContexto) {
        const membroDe = await this.prisma.membroGrupo.findFirst({
            where: { usuarioId: usuario.id }
        })
        if (!membroDe) {
            throw new ForbiddenException(
                'Você não pertence a nenhum grupo de música.'
            )
        }
        return membroDe.grupoId
    }

    private async checkPermissaoEvento(
        eventoId: number,
        usuario: UsuarioComContexto
    ) {
        const evento = await this.prisma.evento.findUnique({
            where: { id: eventoId },
            select: { grupoId: true }
        })

        if (!evento) {
            throw new NotFoundException('Celebração não encontrada.')
        }

        const grupoIdUsuario = await this.getGrupoDoUsuario(usuario)

        if (evento.grupoId !== grupoIdUsuario) {
            throw new ForbiddenException(
                'Você não tem permissão para editar esta celebração.'
            )
        }
    }

    createCelebracaoTipo(dto: CreateCelebracaoTipoDto) {
        return this.prisma.celebracaoTipo.create({
            data: dto
        })
    }

    findCelebracaoTipos() {
        return this.prisma.celebracaoTipo.findMany({
            orderBy: { nome: 'asc' },
        })
    }

    async createCelebracao(dto: CreateCelebracaoDto, usuario: UsuarioComContexto,) {
        if (!usuario.contexto) {
            throw new ForbiddenException('Sua conta não está associada a um contexto de grupo/paróquia.')
        }

        const grupoId = usuario.contexto.grupoId

        try {
            return await this.prisma.evento.create({
                data: {
                    dataEvento: new Date(dto.dataEvento),
                    tituloOpcional: dto.tituloOpcional,
                    igreja: {
                        connect: { id: dto.igrejaId }
                    },
                    tipoCelebracao: {
                        connect: { id: dto.tipoCelebracaoId }
                    },
                    grupo: {
                        connect: { id: grupoId }
                    }
                }
            })
        } catch (error) {
            console.error("FALHA AO CRIAR CELEBRAÇÃO (Prisma):", error)

            throw new InternalServerErrorException(
                'Erro ao criar celebração. Verifique os IDs.'
            )
        }
    }

    async setCelebracaoCifras(
        eventoId: number,
        dto: SetCelebracaoCifrasDto,
        usuario: UsuarioComContexto
    ) {
        await this.checkPermissaoEvento(eventoId, usuario)

        const dadosParaCriar = dto.cifras.map((cifra) => ({
            eventoId: eventoId,
            cifraId: cifra.cifraId,
            tomExecucao: cifra.tomExecucao,
            ordem: cifra.ordem
        }))

        try {
            return await this.prisma.$transaction(async (tx) => {
                await tx.eventoCifras.deleteMany({
                    where: { eventoId: eventoId }
                })

                await tx.eventoCifras.createMany({
                    data: dadosParaCriar
                })

                return { message: 'Setlist atualizado com sucesso!' }
            })
        } catch (error) {
            throw new InternalServerErrorException(
                'Erro ao salvar o setlist. Verifique os IDs das cifras.'
            )
        }
    }

    async findMinhasCelebracoes(usuario: UsuarioComContexto) {
        const meusGrupos = await this.prisma.membroGrupo.findMany({
            where: { usuarioId: usuario.id },
            select: { grupoId: true }
        })
        const meusGrupoIds = meusGrupos.map((m) => m.grupoId)

        return this.prisma.evento.findMany({
            where: {
                grupoId: {
                    in: meusGrupoIds
                },
                dataEvento: {
                    gte: new Date()
                }
            },
            orderBy: {
                dataEvento: 'asc'
            },
            include: {
                igreja: { select: { nome: true } },
                tipoCelebracao: { select: { nome: true } }
            }
        })
    }

    async findOneCelebracao(
        eventoId: number,
        usuario: UsuarioComContexto
    ) {

        const evento = await this.prisma.evento.findUnique({
            where: { id: eventoId }
        })
        if (!evento) {
            throw new NotFoundException('Celebração não encontrada.')
        }

        return this.prisma.evento.findUnique({
            where: { id: eventoId },
            include: {
                igreja: true,
                tipoCelebracao: true,
                grupo: { select: { nome: true } },
                cifras: {
                    orderBy: { ordem: 'asc' },
                    include: {
                        cifra: true
                    }
                }
            }
        })
    }
}