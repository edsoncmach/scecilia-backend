import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateParoquiaDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome da paróquia não pode ser vazio.' })
    nome: string

    @IsNumber()
    @IsNotEmpty({ message: 'A paróquia precisa estar ligada a uma comunidade.' })
    comunidadeId: number
}