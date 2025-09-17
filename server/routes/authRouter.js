const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  getCurrentUser,
} = require("../controller/authController");

router.post("/api/auth/login", login);
router.post("/api/auth/logout", logout);
router.get("/api/auth/current-user", getCurrentUser);

module.exports = router;
