const express = require("express");
const router = express.Router();
const { addMessage, getDirectMessages, getGroupMessages } = require("../controller/messageController");
const authenticateJWT = require("../middleware/authenticateJWT");

// Apply authentication middleware to all message routes
router.use(authenticateJWT);

router.post("/api/new/messages", addMessage);
router.get("/api/direct-messages", getDirectMessages);
router.get("/api/group-messages/:groupId", getGroupMessages);

module.exports = router;
