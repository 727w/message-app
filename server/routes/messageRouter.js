const express = require("express");
const router = express.Router();
const { addMessage, getDirectMessages, getGroupMessages, createGroup } = require("../controller/messageController");
const authenticateJWT = require("../middleware/authenticateJWT");

// Apply authentication middleware to all message routes
router.use(authenticateJWT);

router.post("/api/new/messages", addMessage);
router.post("/api/new/group", createGroup);
router.get("/api/direct-messages/:receiverId", getDirectMessages);
router.get("/api/group-messages/:groupId", getGroupMessages);

module.exports = router;
