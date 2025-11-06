import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateGrupoDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome do grupo não pode ser vazio.' })
    nome: string

    @IsNumber()
    @IsNotEmpty({ message: 'O grupo precisa estar ligado a uma igreja.' })
    igrejaId: number
}