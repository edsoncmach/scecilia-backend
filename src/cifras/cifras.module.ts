import { Module } from '@nestjs/common'
import { CifrasController } from './cifras.controller'
import { CifrasService } from './cifras.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
	imports: [
		PrismaModule,
		AuthModule
	],
	controllers: [CifrasController],
	providers: [CifrasService],
})

export class CifrasModule {}