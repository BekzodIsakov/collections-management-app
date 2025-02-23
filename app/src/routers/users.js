const express = require("express");
const User = require("../models/userModel");
const checkAuth = require("../middlewares/checkAuth");
const checkIsAdmin = require("../middlewares/checkIsAdmin");
const router = express.Router();
const users = require("../controllers/users");

router.post("/users/signup", users.signUpUser);
router.post("/users/signin", users.signInUser);

router.get("/users/:id", users.fetchUser);
router.patch("/users/:id", checkAuth, checkIsAdmin, users.updateUser);

router.get("/users/me", checkAuth, (req, res) => {
  res.send(req.user);
});


// router.patch("/users/me", checkAuth, checkIsAdmin);

router.patch("/users/me", checkAuth, checkIsAdmin, users.updateMe);

router.delete("/users/me", checkAuth, checkIsAdmin, users.deleteMe);

router.post("/users/signout", checkAuth, users.signOutUser);

router.get("/users", checkAuth, checkIsAdmin, users.fetchUsers);


router.delete("/users/:id", checkAuth, users.deleteUser);

module.exports = router;
