const express = require("express");
const router = express.Router();
const { createUser, editProfile } = require("../controller/userController");
const imageUpload = require("../middleware/upload");
const authenticateJWT = require("../middleware/authenticateJWT");

router.post("/api/user", createUser);
router.put(
  "/api/user/edit-profile",
  authenticateJWT,
  imageUpload.single("avatar"),
  editProfile
);

module.exports = router;
