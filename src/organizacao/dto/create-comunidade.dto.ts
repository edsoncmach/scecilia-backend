import { IsNotEmpty, IsString } from 'class-validator'

export class CreateComunidadeDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome da comunidade não pode ser vazio.' })
    nome: string
}