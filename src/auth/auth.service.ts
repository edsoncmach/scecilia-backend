import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

export interface JwtPayload {
    email: string
}

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async register(dto: RegisterDto) {
        const { email, nome, senha } = dto

        const salt = await bcrypt.genSalt()
        const senhaHash = await bcrypt.hash(senha, salt)

        try {
            const usuario = await this.prisma.usuario.create({
                data: {
                    email: email.toLocaleLowerCase(),
                    nome,
                    senhaHash
                }
            })

            const {senhaHash: _, ...usuarioSemSenha} = usuario
            return usuarioSemSenha
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('O e-mail informado já está em uso.')
            }

            throw new InternalServerErrorException('Erro ao criar usuário.')
        }
    }

    async login(dto: LoginDto): Promise<{ accessToken: string }> {
        const { email, senha } = dto

        const usuario = await this.prisma.usuario.findUnique({
            where: { email: email.toLowerCase() },
        })

        if (
            !usuario ||
            !(await bcrypt.compare(senha, usuario.senhaHash))
        ) {
            throw new UnauthorizedException('Credenciais inválidas.')
        }

        const payload: JwtPayload = { email: usuario.email }
        const accessToken = await this.jwtService.signAsync(payload)

        return { accessToken }
    }
}
