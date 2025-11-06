import { Module } from '@nestjs/common'
import { CelebracoesController } from './celebracoes.controller'
import { CelebracoesService } from './celebracoes.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
	imports: [
		PrismaModule,
		AuthModule
	],
	controllers: [CelebracoesController],
	providers: [CelebracoesService],
})

export class CelebracoesModule { }