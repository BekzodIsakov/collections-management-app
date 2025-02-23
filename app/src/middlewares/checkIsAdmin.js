const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const checkIsAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).send({ message: "Unauthorizated request!" });
  }

  next();
};

module.exports = checkIsAdmin;
