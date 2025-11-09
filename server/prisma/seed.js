const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {

  // create users & profiles
  const pass = await bcrypt.hash("password123", 10);
  const u1 = await prisma.user.create({
    data: { username: "Amba", email: "amba.tukam@email.com", password: pass },
  });
  const u2 = await prisma.user.create({
    data: { username: "gurt", email: "gurt@email.com", password: pass },
  });

  await prisma.profile.create({
    data: {
      displayName: "Amba",
      bio: "Hello I'm Amba",
      avatarUrl: null, // filename stored in DB
      user: { connect: { id: u1.id } },
    },
  });

  await prisma.profile.create({
    data: {
      displayName: "Gurt",
      bio: "Hello I'm Gurt",
      avatarUrl: null,
      user: { connect: { id: u2.id } },
    },
  });

  // example message with image (imageUrl should match filename placed in public/images)
  await prisma.message.create({
    data: {
      senderId: u1.id,
      receiverId: u2.id,
      content: "Here is an image",
      imageUrl: null,
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
