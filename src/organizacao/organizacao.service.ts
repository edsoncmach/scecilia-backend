import { Injectable, InternalServerErrorException, ForbiddenException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import type { UsuarioComContexto } from 'src/auth/jwt.strategy'
import { CreateComunidadeDto } from './dto/create-comunidade.dto'
import { CreateParoquiaDto } from './dto/create-paroquia.dto'
import { CreateIgrejaDto } from './dto/create-igreja.dto'
import { CreateGrupoDto } from './dto/create-grupo.dto'
import { InviteUserDto } from './dto/invite-user.dto'
import { Role } from 'src/auth/role.enum'

@Injectable()
export class OrganizacaoService {
    constructor(private prisma: PrismaService) { }

    createComunidade(dto: CreateComunidadeDto) {
        return this.prisma.comunidade.create({ data: dto })
    }
    createParoquia(dto: CreateParoquiaDto) {
        return this.prisma.paroquia.create({ data: dto })
    }
    createIgreja(dto: CreateIgrejaDto) {
        return this.prisma.igreja.create({ data: dto })
    }

    async createGrupo(dto: CreateGrupoDto, usuario: UsuarioComContexto) {
        if (usuario.role !== Role.Coordenador) {
            throw new ForbiddenException('Apenas Coordenadores podem criar grupos.')
        }
        if (usuario.igrejaGerenciadaId !== dto.igrejaId) {
            throw new ForbiddenException('Você só pode criar grupos para a sua própria igreja.')
        }

        const novoGrupo = await this.prisma.grupoDeMusicos.create({
            data: {
                nome: dto.nome,
                igrejaId: dto.igrejaId,
            },
        })

        await this.prisma.membroGrupo.upsert({
            where: {
                usuarioId_grupoId: {
                    usuarioId: usuario.id,
                    grupoId: novoGrupo.id
                }
            },
            update: {},
            create: {
                usuarioId: usuario.id,
                grupoId: novoGrupo.id,
            }
        })

        return novoGrupo
    }

    async addUserToGroup(
        usuarioCoordenador: UsuarioComContexto,
        groupId: number,
        dto: InviteUserDto
    ) {

        const igrejaGerenciada = usuarioCoordenador.igrejaGerenciadaId
        if (!igrejaGerenciada) {
            throw new ForbiddenException('Acesso negado. Sua conta de coordenador não está vinculada a uma igreja.')
        }

        const grupoDoCoordenador = await this.prisma.grupoDeMusicos.findFirst({
            where: {
                id: groupId,
                igrejaId: igrejaGerenciada
            },
        })
        if (!grupoDoCoordenador) {
            throw new ForbiddenException('Acesso negado. Você não gerencia este grupo.')
        }

        const usuarioConvidado = await this.prisma.usuario.findUnique({
            where: { email: dto.email },
        })
        if (!usuarioConvidado) {
            throw new NotFoundException(`Usuário com email '${dto.email}' não encontrado.`)
        }
        if (usuarioConvidado.role !== Role.Musico) {
            throw new ForbiddenException('Você só pode convidar usuários com o cargo de "Músico".')
        }

        const jaMembro = await this.prisma.membroGrupo.findUnique({
            where: {
                usuarioId_grupoId: {
                    usuarioId: usuarioConvidado.id,
                    grupoId: groupId,
                },
            },
        })

        if (jaMembro) {
            return { message: `Usuário '${dto.email}' já é membro deste grupo.` }
        }

        const novoMembro = await this.prisma.membroGrupo.create({
            data: {
                usuarioId: usuarioConvidado.id,
                grupoId: groupId,
            },
        })
        return { message: `Usuário '${dto.email}' adicionado ao grupo.`, membro: novoMembro }
    }

    async findMembersByGroup(
        groupId: number,
        usuarioCoordenador: UsuarioComContexto,
    ) {
        const igrejaIdGerenciada = usuarioCoordenador.igrejaGerenciadaId
        if (!igrejaIdGerenciada) {
            throw new ForbiddenException('Sua conta de Coordenador não está vinculada a uma igreja.')
        }

        const grupo = await this.prisma.grupoDeMusicos.findFirst({
            where: {
                id: groupId,
                igrejaId: igrejaIdGerenciada,
            }
        })

        if (!grupo) {
            throw new ForbiddenException('Este grupo não existe ou não pertence à sua igreja.')
        }

        return this.prisma.membroGrupo.findMany({
            where: { grupoId: groupId },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: {
                usuario: { nome: 'asc' }
            }
        })
    }

    async removeMemberFromGroup(
        groupId: number,
        membroIdToRemove: number,
        usuarioCoordenador: UsuarioComContexto,
    ) {
        await this.findMembersByGroup(groupId, usuarioCoordenador);

        if (membroIdToRemove === usuarioCoordenador.id) {
            throw new ForbiddenException('Você não pode remover a si mesmo de um grupo. Peça a outro Coordenador ou Admin.')
        }

        try {
            await this.prisma.membroGrupo.delete({
                where: {
                    usuarioId_grupoId: {
                        usuarioId: membroIdToRemove,
                        grupoId: groupId
                    }
                }
            })
            return { message: 'Membro removido com sucesso.' }
        } catch (error) {
            throw new InternalServerErrorException('Erro ao remover membro.')
        }
    }

    findComunidades() {
        return this.prisma.comunidade.findMany()
    }

    findParoquiasByComunidade(comunidadeId: number) {
        return this.prisma.paroquia.findMany({ where: { comunidadeId } })
    }

    findIgrejasByParoquia(paroquiaId: number) {
        return this.prisma.igreja.findMany({ where: { paroquiaId } })
    }

    findGruposByIgreja(igrejaId: number) {
        return this.prisma.grupoDeMusicos.findMany({ where: { igrejaId } })
    }
}