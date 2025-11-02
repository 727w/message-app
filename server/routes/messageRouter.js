const express = require("express");
const router = express.Router();
const { addMessage, getDirectMessages, getGroupMessages, createGroup } = require("../controller/messageController");
const authenticateJWT = require("../middleware/authenticateJWT");
const imageUpload = require("../middleware/upload");

router.use(authenticateJWT);

router.post("/api/new/messages", imageUpload.single("image"), addMessage);
router.post("/api/new/group", createGroup);
router.get("/api/direct-messages/:receiverId", getDirectMessages);
router.get("/api/group-messages/:groupId", getGroupMessages);

module.exports = router;
