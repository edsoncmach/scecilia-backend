import { IsEnum, IsInt, IsOptional } from 'class-validator'
import { Role } from 'src/auth/role.enum'

export class PromoteUserDto {
    @IsEnum(Role)
    role: Role

    @IsInt()
    @IsOptional()
    igrejaGerenciadaId?: number | null
}