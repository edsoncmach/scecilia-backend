import { IsOptional, IsString } from 'class-validator'

export class CifraQueryDto {
    @IsOptional()
    @IsString()
    categoriaIds?: string

    @IsOptional()
    @IsString()
    search?: string
}