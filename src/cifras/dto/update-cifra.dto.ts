import { PartialType } from '@nestjs/mapped-types'
import { CreateCifraDto } from './create-cifra.dto'

export class UpdateCifraDto extends PartialType(CreateCifraDto) {}