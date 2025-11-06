import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCelebracaoTipoDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome do tipo é obrigatório (ex: Missa, Retiro).' })
    nome: string
}