import { Body, Controller, Post, ValidationPipe, Get, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from './get-user.decorator'
import type { Usuario} from '@prisma/client'
import { Public } from './public.decorator'

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Public()
    @Post('register')
    async register(@Body(ValidationPipe) dto: RegisterDto) {
        return this.authService.register(dto)
    }

    @Public()
    @Post('login')
    async login(@Body(ValidationPipe) dto: LoginDto) {
        return this.authService.login(dto)
    }

    @Get('profile')
    @UseGuards(AuthGuard())
    getProfile(@GetUser() usuario: Usuario) {
        return {
            message: `Você está logado como: ${usuario.nome}` ,
            usuario: usuario
        }
    }
}