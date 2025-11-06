import { IsNotEmpty, IsString, Length, IsOptional, IsArray, IsInt } from 'class-validator'

export class CreateCifraDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome da música é obrigatório.' })
    nomeMusica: string

    @IsString()
    @IsNotEmpty({ message: 'O nome do intérprete/artista é obrigatório.' })
    interprete: string

    @IsString()
    @IsNotEmpty({ message: 'O tom original é obrigatório.' })
    @Length(1, 4, { message: 'O tom deve ser algo como "G", "Am", "Bb".' })
    tomOriginal: string

    @IsString()
    @IsNotEmpty({ message: 'O conteúdo da cifra (ChordPro) não pode ser vazio.' })
    conteudoChordpro: string

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    categoriaIds?: number[]
}