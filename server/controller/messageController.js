const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addMessage(req, res) {
  const { type, targetId } = req.body;

  const messageData = {
    senderId: req.user.id,
    content: req.body.content,
    imageUrl: req.body.imageUrl ?? null,
    receiverId: type === "direct" ? targetId : null,
    groupId: type === "group" ? targetId : null,
  };

  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: "Unauthorized: senderId missing" });
  }

  try {
    const newMsg = await prisma.message.create({
      data: messageData,
    });
    return res.status(201).json(newMsg);
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ error });
  }
}

async function getDirectMessages(req, res) {
  const ownerId = req.user?.id;
  if (!ownerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { receiverId } = req.params;
  if (req.user.id === receiverId) {
    return res
      .status(400)
      .json({ error: "Cannot retrieve messages with yourself" });
  }
  try {
    const contact = await prisma.contact.findUnique({
      where: {
        ownerId_contactId: {
          ownerId,
          contactId: receiverId,
        },
      },
    });

    const isBlocked = contact?.blocked === true;
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId },
          ...(isBlocked ? [] : [{ senderId: receiverId, receiverId: ownerId }]),
        ],
      },
      orderBy: { createdAt: "asc" },
    });
    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving messages" });
  }
}

async function createGroup(req, res) {
  const { name, memberId } = req.body;
  const memberIds = Array.from(new Set([...memberId, req.user.id.toString()]));
  const image = req.file;
  const imagePath = image?.filename;
  if (
    !name ||
    !memberIds ||
    !Array.isArray(memberIds) ||
    memberIds.length === 0
  ) {
    return res.status(400).json({ error: "Invalid group data" });
  }
  try {
    const newGroup = await prisma.group.create({
      data: {
        name,
        avatarUrl: imagePath ?? null,
        members: {
          create: memberIds.map((userId) => ({
            user: { connect: { id: userId } },
            role: userId === req.user.id.toString() ? "ADMIN" : "MEMBER",
          })),
        },
      },
      include: { members: true },
    });
    return res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function getGroupMessages(req, res) {
  try {
    const { groupId } = req.params;
    const messages = await prisma.message.findMany({
      where: { groupId: groupId },
      orderBy: { createdAt: "asc" },
    });
    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving messages" });
  }
}

module.exports = {
  addMessage,
  getDirectMessages,
  createGroup,
  getGroupMessages,
};
