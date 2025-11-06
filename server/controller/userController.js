const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function createUser(req, res, next) {
  const { username, email } = req.body;
  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    await prisma.profile.create({
      data: {
        displayName: username,
        bio: "",
        avatarUrl: null,
        user: { connect: { id: user.id } },
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

async function editProfile(req, res) {
  const userId = req.user.id;
  const { displayName, bio } = req.body;
  const avatar = req.file;
  const avatarUrl = avatar?.filename ?? null;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!displayName || displayName.trim() === "")
    return res.status(400).json({ error: "Display name cannot be empty." });

  try {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
    const lastChangeTime = profile.updatedAt ?? profile.createdAt;
    if (lastChangeTime && profile.updatedAt !== profile.createdAt) {
      const elapsed = Date.now() - new Date(lastChangeTime).getTime();
      if (elapsed < COOLDOWN_MS) {
        const nextAllowed = new Date(
          new Date(lastChangeTime).getTime() + COOLDOWN_MS
        );
        return res.status(429).json({
          error: "Profile can only be changed once every 7 days.",
          nextAllowed: nextAllowed.toISOString(),
        });
      }
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        displayName,
        bio,
        ...(avatarUrl && { avatarUrl }),
      },
    });
    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile." });
  }
}

module.exports = {
  createUser,
  editProfile,
};
