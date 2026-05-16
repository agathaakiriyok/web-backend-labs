import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, name: true, password: true } });

  for (const user of users) {
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      console.log(`[SKIP] ${user.name} — already hashed`);
      continue;
    }

    const hashed = await bcrypt.hash(user.password, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    console.log(`[OK]   ${user.name} — rehashed (was: "${user.password}")`);
  }

  console.log('\nDone.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
