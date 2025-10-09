const express = require("express");
const router = express.Router();
const {
  addContact,
  getContacts,
  removeContact,
  blockContact,
  unblockContact,
} = require("../controller/contactController");
const authenticateJWT = require("../middleware/authenticateJWT");

router.use(authenticateJWT);

router.post("/api/new/contact", addContact);
router.get("/api/contacts", getContacts);
router.delete("/api/remove/contacts/:contactId", removeContact);
router.patch("/api/contacts/:contactId/block", blockContact);
router.patch("/api/contacts/:contactId/unblock", unblockContact);

module.exports = router;
