import { prisma } from "../src/lib/prisma"

async function main() {
  const email = "allan@sklarow.blog.br"
  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  })
  console.log("Updated user:", user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 