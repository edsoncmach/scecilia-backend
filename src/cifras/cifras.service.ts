import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import type { UsuarioComContexto } from 'src/auth/jwt.strategy'
import { CreateCifraDto } from './dto/create-cifra.dto'
import { UpdateCifraDto } from './dto/update-cifra.dto'
import { CifraQueryDto } from './dto/cifra-query.dto'
import { Role } from 'src/auth/role.enum'

@Injectable()
export class CifrasService {
    constructor(
        private prisma: PrismaService
    ) { }

    private async getContextoDoUsuario(usuario: UsuarioComContexto) {
        if (!usuario.contexto) {
            throw new ForbiddenException('Sua conta não está associada a um contexto de grupo/paróquia.')
        }

        if (usuario.role === Role.Coordenador && usuario.contexto.grupoId === 0) {
            throw new ForbiddenException(
                'Acesso negado. Você precisa criar seu primeiro grupo em "Gerenciar Grupos" antes de poder adicionar cifras.',
            )
        }

        return usuario.contexto
    }

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

    private async validarECriarConexoes(
        categoriaIds: number[] | undefined,
        paroquiaId: number
    ) {
        if (!categoriaIds || categoriaIds.length === 0) {
            return undefined
        }

        const categoriasExistentes = await this.prisma.categoria.findMany({
            where: {
                id: { in: categoriaIds },
                paroquiaId: paroquiaId
            },
            select: { id: true }
        })

        if (categoriasExistentes.length !== categoriaIds.length) {
            throw new ForbiddenException(
                'Um ou mais IDs de categoria são inválidos ou não pertencem à sua paróquia.'
            )
        }

        return {
            create: categoriaIds.map((id) => ({
                categoria: {
                    connect: { id: id }
                }
            }))
        }
    }

    async createCifra(dto: CreateCifraDto, usuario: UsuarioComContexto) {
        const contexto = await this.getContextoDoUsuario(usuario)

        const categoriasParaConectar = await this.validarECriarConexoes(
            dto.categoriaIds,
            contexto.paroquiaId
        )

        try {
            const novaCifra = await this.prisma.cifra.create({
                data: {
                    nomeMusica: dto.nomeMusica,
                    interprete: dto.interprete,
                    tomOriginal: dto.tomOriginal,
                    conteudoChordpro: dto.conteudoChordpro,
                    gruposDeMusicos: {
                        connect: { id: contexto.grupoId }
                    },
                    categoriasEmUso: categoriasParaConectar
                }
            })
            return novaCifra
        } catch (error) {
            console.error('Erro ao criar cifra:', error)
            throw new InternalServerErrorException('Erro ao salvar a cifra no banco.')
        }
    }

    async findMyCifras(usuario: UsuarioComContexto, queryDto: CifraQueryDto) {
        const contexto = await this.getContextoDoUsuario(usuario)
        const meusGrupoIds = [contexto.grupoId]

        let categoriaFiltro: object = {}
        if (queryDto.categoriaIds) {
            const ids = queryDto.categoriaIds.split(',').map(id => parseInt(id.trim(), 10))

            if (ids.length > 0) {
                categoriaFiltro = {
                    categoriasEmUso: {
                        some: {
                            categoriaId: { in: ids }
                        }
                    }
                }
            }
        }

        let searchFiltro: object = {};
        if (queryDto.search) {
            searchFiltro = {
                OR: [
                    {
                        nomeMusica: {
                            contains: queryDto.search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        interprete: {
                            contains: queryDto.search,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        }

        return this.prisma.cifra.findMany({
            where: {
                gruposDeMusicosId: {
                    in: meusGrupoIds
                },
                ...categoriaFiltro,
                ...searchFiltro
            },
            include: {
                categoriasEmUso: {
                    select: {
                        categoria: {
                            select: { id: true, nome: true }
                        }
                    }
                }
            },
            orderBy: { nomeMusica: 'asc' }
        })
    }

    async findOneCifra(id: number, usuario: UsuarioComContexto) {
        const contexto = await this.getContextoDoUsuario(usuario)

        const cifra = await this.prisma.cifra.findUnique({
            where: { id: id },
            include: {
                categoriasEmUso: {
                    select: {
                        categoriaId: true
                    }
                }
            }
        })

        if (!cifra) {
            throw new NotFoundException('Cifra não encontrada.')
        }

        if (cifra.gruposDeMusicosId !== contexto.grupoId) {
            throw new ForbiddenException('Você não tem permissão para ver esta cifra.')
        }

        return cifra
    }

    async updateCifra(id: number, dto: UpdateCifraDto, usuario: UsuarioComContexto) {
        const contexto = await this.getContextoDoUsuario(usuario)
        await this.findOneCifra(id, usuario)

        if (dto.categoriaIds !== undefined) {
            await this.validarECriarConexoes(dto.categoriaIds, contexto.paroquiaId)

            await this.prisma.$transaction([
                this.prisma.cifraCategoria.deleteMany({
                    where: { cifraId: id }
                }),
                this.prisma.cifraCategoria.createMany({
                    data: dto.categoriaIds.map((catId) => ({
                        cifraId: id,
                        categoriaId: catId
                    }))
                })
            ])
        }

        const { categoriaIds, ...dadosCifra } = dto

        try {
            const cifraAtualizada = await this.prisma.cifra.update({
                where: { id: id },
                data: dadosCifra,
            });
            return cifraAtualizada;
        } catch (error) {
            throw new InternalServerErrorException('Erro ao atualizar a cifra.')
        }
    }

    async deleteCifra(id: number, usuario: UsuarioComContexto) {
        await this.findOneCifra(id, usuario)

        try {
            await this.prisma.cifraCategoria.deleteMany({
                where: { id: id }
            })

            await this.prisma.cifra.delete({
                where: { id: id },
            })

            return { message: `Cifra ${id} removida com sucesso.` }
        } catch (error) {
            throw new InternalServerErrorException('Erro ao remover a cifra.')
        }
    }
}