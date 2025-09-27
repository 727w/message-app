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
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: req.params.receiverId },
          { senderId: req.params.receiverId, receiverId: req.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving messages" });
  }
}

async function getGroupMessages(req, res) {
  try {
    const { groupId } = req.params;
    const messages = await prisma.message.findMany({
      where: { groupId: groupId },
      orderBy: { createdAt: "asc" },
    });
    return messages;
  } catch (error) {
    res.status(500).json({ error: "Error retrieving messages" });
  }
}

module.exports = {
  addMessage,
  getDirectMessages,
  getGroupMessages,
};
