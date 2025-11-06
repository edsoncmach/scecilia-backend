import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards, ValidationPipe, Patch, Delete } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CifrasService } from './cifras.service'
import { GetUser } from 'src/auth/get-user.decorator'
import type { UsuarioComContexto } from 'src/auth/jwt.strategy'
import { CreateCifraDto } from './dto/create-cifra.dto'
import { UpdateCifraDto } from './dto/update-cifra.dto'
import { CifraQueryDto } from './dto/cifra-query.dto'
import { Roles } from 'src/auth/roles.decorator'
import { Role } from 'src/auth/role.enum'
import { RolesGuard } from 'src/auth/guards/roles.guard'

@Controller('cifras')
export class CifrasController {
    constructor(private cifrasService: CifrasService) { }

    @Post()
    @Roles(Role.Coordenador)
    createCifra(
        @Body(ValidationPipe) dto: CreateCifraDto,
        @GetUser() usuario: UsuarioComContexto,
    ) {
        return this.cifrasService.createCifra(dto, usuario)
    }

    @Get()
    findMyCifras(
        @GetUser() usuario: UsuarioComContexto,
        @Query(new ValidationPipe({ transform: true })) queryDto: CifraQueryDto
    ) {
        return this.cifrasService.findMyCifras(usuario, queryDto)
    }

    @Get(':id')
    findOneCifra(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() usuario: UsuarioComContexto,
    ) {
        return this.cifrasService.findOneCifra(id, usuario)
    }

    @Patch(':id')
    @Roles(Role.Coordenador)
    updateCifra(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe) dto: UpdateCifraDto,
        @GetUser() usuario: UsuarioComContexto,
    ) {
        return this.cifrasService.updateCifra(id, dto, usuario)
    }

    @Delete(':id')
    @Roles(Role.Coordenador)
    deleteCifra(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() usuario: UsuarioComContexto,
    ) {
        return this.cifrasService.deleteCifra(id, usuario);
    }
}