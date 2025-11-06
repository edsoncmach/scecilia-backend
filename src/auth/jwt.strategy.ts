import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtPayload } from './auth.service'
import { Role, Usuario } from '@prisma/client'

export type UsuarioComContexto = Omit<Usuario, 'senhaHash'> & {
    contexto?: {
        grupoId: number
        grupoNome: string
        igrejaId: number
        igrejaNome: string
        paroquiaId: number
        paroquiaNome: string
    }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        const secret = process.env.JWT_SECRET

        if (!secret) {
            throw new Error('JWT_SECRET não está definida no arquivo .env!')
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        })
    }

    async validate(payload: JwtPayload): Promise<UsuarioComContexto> {
        const { email } = payload

        const usuarioDeBanco = await this.prisma.usuario.findUnique({
            where: { email },
        })

        if (!usuarioDeBanco) {
            throw new UnauthorizedException('Token inválido ou usuário não encontrado.')
        }

        const { senhaHash, ...usuarioSemSenha } = usuarioDeBanco

        if (usuarioSemSenha.role === Role.Admin) {
            return usuarioSemSenha
        }

        const membroDe = await this.prisma.membroGrupo.findFirst({
            where: { usuarioId: usuarioDeBanco.id },
            include: {
                grupo: {
                    include: {
                        igreja: {
                            include: {
                                paroquia: true,
                            },
                        },
                    },
                },
            },
        })

        if (membroDe) {
            return {
                ...usuarioSemSenha,
                contexto: {
                    grupoId: membroDe.grupo.id,
                    grupoNome: membroDe.grupo.nome,
                    igrejaId: membroDe.grupo.igreja.id,
                    igrejaNome: membroDe.grupo.igreja.nome,
                    paroquiaId: membroDe.grupo.igreja.paroquia.id,
                    paroquiaNome: membroDe.grupo.igreja.paroquia.nome,
                },
            }
        }

        if (usuarioSemSenha.role === Role.Musico) {
            throw new UnauthorizedException('Músico não associado a nenhum grupo.')
        }

        if (usuarioSemSenha.role === Role.Coordenador) {
            if (!usuarioSemSenha.igrejaGerenciadaId) {
                throw new UnauthorizedException(
                    'Coordenador não associado a nenhuma igreja.',
                )
            }

            const igreja = await this.prisma.igreja.findUnique({
                where: { id: usuarioSemSenha.igrejaGerenciadaId },
                include: { paroquia: true },
            })
            if (!igreja)
                throw new UnauthorizedException('Igreja do Coordenador não encontrada.')

            return {
                ...usuarioSemSenha,
                contexto: {
                    grupoId: 0,
                    grupoNome: 'N/A (Gerenciamento)',
                    igrejaId: igreja.id,
                    igrejaNome: igreja.nome,
                    paroquiaId: igreja.paroquia.id,
                    paroquiaNome: igreja.paroquia.nome,
                },
            }
        }

        throw new UnauthorizedException('Cargo de usuário desconhecido.')
    }
}