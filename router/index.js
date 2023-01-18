var express = require("express");
const passport = require("passport");
const {
  createAdmin,
  login,
  getMembers,
  createMember,
  deleteMembers,
} = require("../controllers/userController");

var router = express.Router();
router.get("/", (req, res) => {
  res.send("app is running");
});
router.post("/create-admin", createAdmin);
router.post("/createMember", [
  passport.authenticate("jwt", { session: false }),
  passport.isAdmin,
  createMember,
]);
router.post("/login", login);
router.delete("/deletemembers/:id", deleteMembers);
router.get("/getMembers", [
  passport.authenticate("jwt", { session: false }),
  passport.isAdmin,
  getMembers,
]);

module.exports = router;
