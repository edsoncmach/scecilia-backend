import { IsIn, IsNotEmpty, IsString } from 'class-validator'

export class JoinGrupoDto {
    @IsString()
    @IsIn(['Coordenador', 'Musico'], { message: 'A função deve ser "Coordenador" ou "Musico".' })
    @IsNotEmpty({ message: 'A função (role) é obrigatória.' })
    role: string
}