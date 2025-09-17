const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function createUser(req, res, next) {
  const { username, email } = req.body;
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });
  } catch (error) {
    if (error.code == "P2002") {
      next(new Error(409, "This username is already taken."));
    }
    next(error);
  }
  return res.status(201).json({ message: "User created successfully." });
}

module.exports = {
  createUser,
};
