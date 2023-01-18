const userModal = require("../modals/user");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.createAdmin = async function createAdmin(req, res) {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  let user = await userModal.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
    role: "admin",
  });
  return res.status(200).json({
    success: true,
    message: "signup as admin succesfully",
    user: user,
  });
};

module.exports.createMember = async function createMember(req, res) {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  if (!req.isAdmin) {
    return res.send("Only Admin Can Make the Members");
  }
  const user = await userModal.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPass,
    role: "member",
  });
  return res.status(200).json({
    success: true,
    message: "signup succesfully",
    user,
  });
};

module.exports.login = async function login(req, res) {
  let user = await userModal.findOne({ email: req.body.email });
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json("wrong password");
  }

  let jwtToken = jwt.sign(
    {
      userId: user["_id"],
    },
    "secret",
    { expiresIn: 60 * 60 * 60 }
  );
  return res.status(200).json({
    success: true,
    data: {
      jwtToken: jwtToken,
      user: user,
      isAdmin: user.role == "admin",
    },
  });
};

module.exports.getMembers = function getMembers(req, res) {
  try {
    userModal.find({ role: { $eq: "member" } }, function (err, users) {
      var userCollection = [];
      users.forEach(function (user) {
        userCollection.push(user);
      });
      res.status(200).json({ massage: "members list", users: userCollection });
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.deleteMembers = async function deleteMembers(req, res) {
  try {
    await userModal.findByIdAndDelete(req.params.id);
    res.status(200).json({ massage: "member delete" });
  } catch (err) {
    console.log(err);
  }
};
