import { Module } from '@nestjs/common'
import { CategoriasService } from './categorias.service'
import { CategoriasController } from './categorias.controller'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CategoriasController],
  providers: [CategoriasService],
})

export class CategoriasModule {}
