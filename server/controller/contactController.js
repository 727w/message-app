const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addContact(req, res) {
  const { email } = req.body;
  const ownerId = req.user?.id;

  if (!ownerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Cari user berdasarkan email
    const contactUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!contactUser) {
      return res.status(404).json({ error: "User with that email not found" });
    }

    if (contactUser.id === ownerId) {
      return res
        .status(400)
        .json({ error: "You cannot add yourself as a contact" });
    }

    // Cek apakah kontak sudah ada
    const existing = await prisma.contact.findUnique({
      where: {
        ownerId_contactId: {
          ownerId,
          contactId: contactUser.id,
        },
      },
    });

    if (existing) {
      return res.status(409).json({ error: "Contact already exists" });
    }

    // Tambahkan kontak
    const newContact = await prisma.contact.create({
      data: {
        owner: { connect: { id: ownerId } },
        contact: { connect: { id: contactUser.id } },
      },
      include: { contact: true },
    });

    return res.status(201).json(newContact);
  } catch (error) {
    console.error("Error adding contact by email:", error);
    return res.status(500).json({ error: "Failed to add contact" });
  }
}

async function getContacts(req, res) {
  const ownerId = req.user?.id;

  if (!ownerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const contacts = await prisma.contact.findMany({
      where: { ownerId },
      include: { contact: true },
    });
    return res.status(200).json(contacts);
  } catch (error) {
    console.error("Error retrieving contacts:", error);
    return res.status(500).json({ error: "Failed to retrieve contacts" });
  }
}

async function blockContact(req, res) {
  const ownerId = req.user?.id;
  const { contactId } = req.params;
  if (!ownerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!contactId) {
    return res.status(400).json({ error: "Contact ID is required" });
  }
  try {
    const contact = await prisma.contact.findUnique({
      where: {
        ownerId_contactId: {
          ownerId,
          contactId: contactId,
        },
      },
    });
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    const updatedContact = await prisma.contact.update({
      where: { id: contact.id },
      data: { blocked: true },
      include: { contact: true },
    });
    return res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error blocking contact:", error);
    return res.status(500).json({ error: "Failed to block contact" });
  }
}

async function unblockContact(req, res) {
  const ownerId = req.user?.id;
  const { contactId } = req.params;
  if (!ownerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!contactId) {
    return res.status(400).json({ error: "Contact ID is required" });
  }
  try {
    const contact = await prisma.contact.findUnique({
      where: {
        ownerId_contactId: {
          ownerId,
          contactId: contactId,
        },
      },
    });
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    const updatedContact = await prisma.contact.update({
      where: { id: contact.id },
      data: { blocked: false },
      include: { contact: true },
    });
    return res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error unblocking contact:", error);
    return res.status(500).json({ error: "Failed to unblock contact" });
  }
}

async function removeContact(req, res) {
  const ownerId = req.user?.id;
  const { contactId } = req.params;

  if (!ownerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!contactId) {
    return res.status(400).json({ error: "Contact ID is required" });
  }

  try {
    const contact = await prisma.contact.findUnique({
      where: {
        ownerId_contactId: {
          ownerId,
          contactId: contactId,
        },
      },
    });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    await prisma.contact.delete({
      where: { id: contact.id },
    });

    return res.status(200).json({ message: "Contact removed successfully" });
  } catch (error) {
    console.error("Error removing contact:", error);
    return res.status(500).json({ error: "Failed to remove contact" });
  }
}

module.exports = { addContact, getContacts, blockContact, unblockContact, removeContact };
