import { prisma } from "../src/lib/prisma"

async function main() {
  const email = "allan@sklarow.blog.br" // Your email from the logs
  
  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  })
  
  console.log("User role updated:", user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 