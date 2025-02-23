const User = require("../models/userModel");

const fetchUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: "User not found!" });
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const signUpUser = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    if (error.keyValue) {
      const key = Object.keys(error.keyValue);
      if (key) {
        return res.status(400).send({
          message: `${error.keyValue[key]} already exists. Please choose different ${key}.`,
        });
      }
    }
    res.status(400).send({ message: error.message });
  }
};

const signInUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);

    if (user.isBlocked) {
      return res.status(403).send({ message: "User is blocked!" });
    }
    
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const signOutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token != req.token);
    req.user.lastSeenAt = new Date();
    await req.user.save();
    res.status(204).send();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const updateMe = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteMe = async (req, res) => {
  try {
    await req.user.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(404).send(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id || req.user.isAdmin) {
      const user = await User.findById(req.params.id);
      user.deleteOne();
      return res.status(204).send();
    }
    return res.status(403).send({ message: "Unauthorized request!" });
  } catch (error) {
    es.status(500).send(error);
  }
};

module.exports = {
  fetchUser,
  signUpUser,
  signInUser,
  signOutUser,
  updateMe,
  deleteMe,
  fetchUsers,
  updateUser,
  deleteUser,
};
