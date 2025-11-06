import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateIgrejaDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome da igreja não pode ser vazio.' })
    nome: string

    @IsString()
    @IsIn(['Matriz', 'Capela'], { message: 'O tipo deve ser "Matriz" ou "Capela".' })
    tipo: string

    @IsNumber()
    @IsNotEmpty({ message: 'A igreja precisa estar ligada a uma paróquia.' })
    paroquiaId: number
}