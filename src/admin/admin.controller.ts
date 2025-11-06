import { Controller, Get, UseGuards, Patch, Param, ParseIntPipe, Body, ValidationPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/auth/guards/roles.guard'
import { Role } from 'src/auth/role.enum'
import { Roles } from 'src/auth/roles.decorator'
import { AdminService } from './admin.service'
import { GetUser } from 'src/auth/get-user.decorator'
import { type UsuarioComContexto } from 'src/auth/jwt.strategy'
import { PromoteUserDto } from './dto/promote-user.dto'

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.Admin)
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ) { }

    @Get('usuarios')
    findAllUsuarios(@GetUser() adminUser: UsuarioComContexto) {
        return this.adminService.findAllUsuarios(adminUser)
    }

    @Patch('usuarios/:id')
    promoteUser(
        @Param('id', ParseIntPipe) userId: number,
        @Body(ValidationPipe) dto: PromoteUserDto,
    ) {
        return this.adminService.promoteUser(userId, dto)
    }

    @Get('comunidades')
    findTodasComunidades() {
        return this.adminService.findTodasComunidades()
    }

    @Get('paroquias')
    findTodasParoquias() {
        return this.adminService.findTodasParoquias()
    }

    @Get('igrejas')
    findTodasIgrejas() {
        return this.adminService.findTodasIgrejas()
    }

    @Get('stats')
    getAdminStats() {
        return this.adminService.getAdminStats();
    }
}
