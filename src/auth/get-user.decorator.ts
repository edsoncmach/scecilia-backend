import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UsuarioComContexto } from './jwt.strategy'

export const GetUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): UsuarioComContexto => {
        const request = ctx.switchToHttp().getRequest()

        return request.user
    }
)