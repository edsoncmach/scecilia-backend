import { Type } from 'class-transformer'
import { IsArray, IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

class CifraNoSetlistDto {
    @IsInt()
    cifraId: number

    @IsString()
    @IsNotEmpty()
    tomExecucao: string

    @IsInt()
    ordem: number
}

export class SetCelebracaoCifrasDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CifraNoSetlistDto) 
    cifras: CifraNoSetlistDto[]
}