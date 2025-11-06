import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

@Injectable()
export class AppService {
	constructor(
		private prisma: PrismaService
	) {}

	async getHello() {
		const comunidades = await this.prisma.comunidade.findMany()

		return {
			message: 'Servidor rodando e conectado ao banco!',
			comunidades: comunidades
		}
	}
}
