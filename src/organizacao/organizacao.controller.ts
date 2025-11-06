import { Body, Controller, Get, Delete, Param, ParseIntPipe, Post, UseGuards, ValidationPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/auth/get-user.decorator'
import { OrganizacaoService } from './organizacao.service'
import { CreateComunidadeDto } from './dto/create-comunidade.dto'
import { CreateParoquiaDto } from './dto/create-paroquia.dto'
import { CreateIgrejaDto } from './dto/create-igreja.dto'
import { CreateGrupoDto } from './dto/create-grupo.dto'
import { InviteUserDto } from './dto/invite-user.dto'
import type { UsuarioComContexto } from 'src/auth/jwt.strategy'
import { Roles } from 'src/auth/roles.decorator'
import { Role } from 'src/auth/role.enum'
import { RolesGuard } from 'src/auth/guards/roles.guard'


@Controller('organizacao')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrganizacaoController {
    constructor(
        private organizacaoService: OrganizacaoService
    ) { }

    @Post('comunidade')
    @Roles(Role.Admin)
    createComunidade(@Body(ValidationPipe) dto: CreateComunidadeDto) {
        return this.organizacaoService.createComunidade(dto)
    }

    @Post('paroquia')
    @Roles(Role.Admin)
    createParoquia(@Body(ValidationPipe) dto: CreateParoquiaDto) {
        return this.organizacaoService.createParoquia(dto)
    }

    @Post('igreja')
    @Roles(Role.Admin)
    createIgreja(@Body(ValidationPipe) dto: CreateIgrejaDto) {
        return this.organizacaoService.createIgreja(dto)
    }

    @Post('grupo')
    @Roles(Role.Coordenador)
    createGrupo(@Body(ValidationPipe) dto: CreateGrupoDto, @GetUser() usuario: UsuarioComContexto) {
        return this.organizacaoService.createGrupo(dto, usuario)
    }

    @Post('grupo/:id/membros')
    @Roles(Role.Coordenador)
    addUserToGroup(
        @Param('id', ParseIntPipe) groupId: number,
        @Body(ValidationPipe) dto: InviteUserDto,
        @GetUser() usuario: UsuarioComContexto
    ) {
        return this.organizacaoService.addUserToGroup(usuario, groupId, dto)
    }

    @Get('grupo/:id/membros')
    async findMembersByGroup(
        @Param('id', ParseIntPipe) groupId: number,
        @GetUser() usuario: UsuarioComContexto,
    ) {
        return this.organizacaoService.findMembersByGroup(groupId, usuario)
    }

    @Delete('grupo/:groupId/membros/:userId')
    async removeMemberFromGroup(
        @Param('groupId', ParseIntPipe) groupId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @GetUser() usuario: UsuarioComContexto,
    ) {
        return this.organizacaoService.removeMemberFromGroup(groupId, userId, usuario)
    }

    @Get('comunidade')
    findComunidades() {
        return this.organizacaoService.findComunidades()
    }

    @Get('comunidade/:id/paroquias')
    findParoquias(@Param('id', ParseIntPipe) id: number) {
        return this.organizacaoService.findParoquiasByComunidade(id)
    }

    @Get('paroquia/:id/igrejas')
    findIgrejas(@Param('id', ParseIntPipe) id: number) {
        return this.organizacaoService.findIgrejasByParoquia(id)
    }

    @Get('igreja/:id/grupos')
    findGrupos(@Param('id', ParseIntPipe) id: number) {
        return this.organizacaoService.findGruposByIgreja(id)
    }
}