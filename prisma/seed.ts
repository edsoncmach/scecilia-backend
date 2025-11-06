import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('Iniciando o script de seed do Super Usuário...')

    const salt = await bcrypt.genSalt()
    const senhaHash = await bcrypt.hash('admin123', salt)

    const admin = await prisma.usuario.create({
        data: {
            email: 'admin@scecilia.com',
            nome: 'Administrador do Sistema',
            senhaHash: senhaHash,
            role: Role.Admin
        }
    })

    console.log(`Usuário Admin criado: ${admin.email} (senha: admin123)`)
    console.log('---')
    console.log('O banco de dados está pronto.')
    console.log('Use este usuário para logar e cadastrar as Comunidades, Paróquias, Igrejas e os Coordenadores.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })