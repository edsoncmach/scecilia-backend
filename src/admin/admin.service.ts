import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UsuarioComContexto } from 'src/auth/jwt.strategy'
import { Role } from 'src/auth/role.enum'
import { PromoteUserDto } from './dto/promote-user.dto'

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService
    ) { }

    async findAllUsuarios(adminUser: UsuarioComContexto) {
        return this.prisma.usuario.findMany({
            where: {
                id: {
                    not: adminUser.id
                }
            },
            select: {
                id: true,
                email: true,
                nome: true,
                role: true,
                igrejaGerenciada: {
                    select: {
                        id: true,
                        nome: true
                    }
                }
            },
            orderBy: {
                nome: 'asc'
            }
        })
    }

    async promoteUser(userId: number, dto: PromoteUserDto) {
        const { role, igrejaGerenciadaId } = dto

        const usuario = await this.prisma.usuario.findUnique({
            where: { id: userId }
        })

        if (!usuario) {
            throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`)
        }

        if (role === Role.Coordenador && !igrejaGerenciadaId) {
            throw new BadRequestException(
                'Para promover a Coordenador, você deve fornecer uma igrejaGerenciadaId.'
            )
        }

        let finalIgrejaId: number | null = null
        if (role === Role.Coordenador) {
            finalIgrejaId = igrejaGerenciadaId!
        }

        try {
            const usuarioAtualizado = await this.prisma.usuario.update({
                where: { id: userId },
                data: {
                    role: role,
                    igrejaGerenciadaId: finalIgrejaId
                }
            })

            const { senhaHash, ...usuarioSemSenha } = usuarioAtualizado

            return usuarioSemSenha
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`A Igreja com ID ${igrejaGerenciadaId} não foi encontrada.`)
            }
            throw new InternalServerErrorException('Erro ao atualizar usuário.')
        }
    }

    async findTodasComunidades() {
        return this.prisma.comunidade.findMany({
            orderBy: { nome: 'asc' }
        })
    }

    async findTodasParoquias() {
        return this.prisma.paroquia.findMany({
            orderBy: { nome: 'asc' },
            include: { comunidade: { select: { nome: true } } }
        })
    }

    async findTodasIgrejas() {
        return this.prisma.igreja.findMany({
            orderBy: { nome: 'asc' },
            include: { paroquia: { select: { nome: true } } }
        })
    }

    async getAdminStats() {
        const [userCount, paroquiaCount, igrejaCount, grupoCount, cifraCount] =
            await this.prisma.$transaction([
                this.prisma.usuario.count(),
                this.prisma.paroquia.count(),
                this.prisma.igreja.count(),
                this.prisma.grupoDeMusicos.count(),
                this.prisma.cifra.count(),
            ]);

        return {
            usuarios: userCount,
            paroquias: paroquiaCount,
            igrejas: igrejaCount,
            grupos: grupoCount,
            cifras: cifraCount,
        };
    }
}
