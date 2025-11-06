import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { OrganizacaoModule } from './organizacao/organizacao.module'
import { CifrasModule } from './cifras/cifras.module'
import { CelebracoesModule } from './celebracoes/celebracoes.module'
import { CategoriasModule } from './categorias/categorias.module'
import { RolesGuard } from './auth/guards/roles.guard'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { AdminModule } from './admin/admin.module'

@Module({
	imports: [
		PrismaModule,
		AuthModule,
		OrganizacaoModule,
		CifrasModule,
		CelebracoesModule,
		CategoriasModule,
		AdminModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard
		}
	]
})

export class AppModule {}
