import { Injectable, InternalServerErrorException, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UsuarioComContexto } from 'src/auth/jwt.strategy'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'

@Injectable()
export class CategoriasService {
	constructor(
		private prisma: PrismaService
	) { }

	async create(dto: CreateCategoriaDto, usuario: UsuarioComContexto) {
		if (!usuario.contexto) {
			throw new ForbiddenException('Apenas usuários de paróquia (Coordenadores/Músicos) podem criar categorias.')
		}

		const paroquiaId = usuario.contexto.paroquiaId

		try {
			return await this.prisma.categoria.create({
				data: {
					nome: dto.nome,
					paroquiaId: paroquiaId
				}
			})
		} catch (error) {
			if (error.code === 'P2002') {
				throw new ConflictException(`Sua paróquia já possui uma categoria com o nome "${dto.nome}".`)
			}

			throw new InternalServerErrorException('Erro ao criar a categoria.')
		}
	}

	async findAll(usuario: UsuarioComContexto) {
		if (!usuario.contexto) {
			return []
		}

		const paroquiaId = usuario.contexto.paroquiaId

		try {
			return await this.prisma.categoria.findMany({
				//where: { paroquiaId: paroquiaId },
				orderBy: { nome: 'asc' }
			})
		} catch (error) {
			throw new InternalServerErrorException('Erro ao buscar as categorias.')
		}
	}

	async findOne(id: number, usuario: UsuarioComContexto) {
		if (!usuario.contexto) {
			throw new ForbiddenException('Acesso negado.')
		}

		const categoria = await this.prisma.categoria.findUnique({
			where: { id: id }
		})

		if (!categoria) {
			throw new NotFoundException(`Categoria com ID ${id} não encontrada.`)
		}

		if (categoria.paroquiaId !== usuario.contexto.paroquiaId) {
			throw new ForbiddenException(
				'Você não tem permissão para acessar esta categoria.'
			)
		}

		return categoria
	}

	async update(
		id: number,
		dto: UpdateCategoriaDto,
		usuario: UsuarioComContexto,
	) {
		await this.findOne(id, usuario)

		try {
			return await this.prisma.categoria.update({
				where: { id: id },
				data: dto
			})
		} catch (error) {
			if (error.code === 'P2002') {
				throw new ConflictException(
					`Você já possui outra categoria com o nome "${dto.nome}".`
				)
			}
			throw new InternalServerErrorException('Erro ao atualizar a categoria.')
		}
	}

	async remove(id: number, usuario: UsuarioComContexto) {
		await this.findOne(id, usuario)

		try {
			await this.prisma.categoria.delete({
				where: { id: id }
			})
			return { message: `Categoria ${id} removida com sucesso.` }
		} catch (error) {
			throw new InternalServerErrorException('Erro ao remover a categoria.')
		}
	}
}