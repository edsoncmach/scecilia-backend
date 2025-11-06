import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateCelebracaoDto {
    @IsDateString({}, { message: 'A data deve estar no formato ISO 8601 (ex: 2025-12-25T19:00:00.000Z)' })
    @IsNotEmpty({ message: 'A data e hora são obrigatórias.' })
    dataEvento: string

    @IsNumber()
    @IsNotEmpty({ message: 'Você precisa definir o tipo de celebração (ex: o ID de "Missa").' })
    tipoCelebracaoId: number

    @IsNumber()
    @IsNotEmpty({ message: 'Você precisa definir a igreja onde o evento ocorrerá.' })
    igrejaId: number

    @IsString()
    @IsOptional()
    tituloOpcional?: string;
}