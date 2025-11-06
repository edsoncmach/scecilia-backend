import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	UseGuards,
	ValidationPipe,
	HttpCode,
} from '@nestjs/common'
import { CategoriasService } from './categorias.service'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { AuthGuard } from '@nestjs/passport'
import { GetUser } from 'src/auth/get-user.decorator'
import {type UsuarioComContexto } from 'src/auth/jwt.strategy'
import { Roles } from 'src/auth/roles.decorator'
import { Role } from 'src/auth/role.enum'
import { RolesGuard } from 'src/auth/guards/roles.guard'

@Controller('categorias')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CategoriasController {
	constructor(private readonly categoriasService: CategoriasService) { }

	@Post()
	@Roles(Role.Coordenador, Role.Admin)
	create(
		@Body(ValidationPipe) createCategoriaDto: CreateCategoriaDto,
		@GetUser() usuario: UsuarioComContexto,
	) {
		return this.categoriasService.create(createCategoriaDto, usuario)
	}

	@Get()
	findAll(@GetUser() usuario: UsuarioComContexto) {
		return this.categoriasService.findAll(usuario)
	}

	@Get(':id')
	@Roles(Role.Coordenador, Role.Admin)
	findOne(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() usuario: UsuarioComContexto,
	) {
		return this.categoriasService.findOne(id, usuario)
	}

	@Patch(':id')
	@Roles(Role.Coordenador, Role.Admin)
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body(ValidationPipe) updateCategoriaDto: UpdateCategoriaDto,
		@GetUser() usuario: UsuarioComContexto,
	) {
		return this.categoriasService.update(id, updateCategoriaDto, usuario)
	}

	@Delete(':id')
	@HttpCode(204)
	@Roles(Role.Coordenador, Role.Admin)
	remove(
		@Param('id', ParseIntPipe) id: number,
		@GetUser() usuario: UsuarioComContexto,
	) {
		return this.categoriasService.remove(id, usuario)
	}
}