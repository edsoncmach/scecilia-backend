import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, ValidationPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CelebracoesService } from './celebracoes.service'
import { CreateCelebracaoTipoDto } from './dto/create-celebracao-tipo.dto'
import { GetUser } from 'src/auth/get-user.decorator'
import type { UsuarioComContexto } from 'src/auth/jwt.strategy'
import { CreateCelebracaoDto } from './dto/create-celebracao.dto'
import { SetCelebracaoCifrasDto } from './dto/set-celebracao-cifras.dto'
import { Roles } from 'src/auth/roles.decorator'
import { Role } from 'src/auth/role.enum'
import { RolesGuard } from 'src/auth/guards/roles.guard'

@Controller('celebracoes')
export class CelebracoesController {
    constructor(private celebracoesService: CelebracoesService) { }

    @Post('tipos')
    @Roles(Role.Coordenador)
    createTipo(@Body(ValidationPipe) dto: CreateCelebracaoTipoDto) {
        return this.celebracoesService.createCelebracaoTipo(dto)
    }

    @Get('tipos')
    findTipos() {
        return this.celebracoesService.findCelebracaoTipos()
    }

    @Post()
    @Roles(Role.Coordenador)
    createCelebracao(
        @Body(ValidationPipe) dto: CreateCelebracaoDto,
        @GetUser() usuario: UsuarioComContexto
    ) {
        return this.celebracoesService.createCelebracao(dto, usuario)
    }

    @Get('minhas')
    findMinhasCelebracoes(@GetUser() usuario: UsuarioComContexto) {
        return this.celebracoesService.findMinhasCelebracoes(usuario)
    }

    @Post(':id/setlist')
    @Roles(Role.Coordenador)
    setCelebracaoCifras(
        @Param('id', ParseIntPipe) eventoId: number,
        @Body(ValidationPipe) dto: SetCelebracaoCifrasDto,
        @GetUser() usuario: UsuarioComContexto
    ) {
        return this.celebracoesService.setCelebracaoCifras(eventoId, dto, usuario)
    }

    @Get(':id')
    findOneCelebracao(
        @Param('id', ParseIntPipe) eventoId: number,
        @GetUser() usuario: UsuarioComContexto
    ) {
        return this.celebracoesService.findOneCelebracao(eventoId, usuario)
    }
}