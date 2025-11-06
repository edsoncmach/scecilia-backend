import { IsEmail, IsNotEmpty, IsIn } from 'class-validator'
import { Role } from 'src/auth/role.enum'

export class InviteUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsIn([Role.Coordenador, Role.Musico])
    role: Role
}