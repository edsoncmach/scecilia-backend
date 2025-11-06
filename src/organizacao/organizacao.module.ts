import { Module } from '@nestjs/common'
import { OrganizacaoController } from './organizacao.controller'
import { OrganizacaoService } from './organizacao.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
	imports: [
		PrismaModule,
		AuthModule
	],
	controllers: [OrganizacaoController],
	providers: [OrganizacaoService]
})

export class OrganizacaoModule { }
