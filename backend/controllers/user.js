import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const find = await User.findOne({ where: { email: email } });
    if (find) {
      return res
        .status(402)
        .json({ message: "User already exists, Please Login" });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username: username,
        email: email,
        password: hashPassword,
      });

      return res.status(200).json(user);
    }
  } catch (err) {
    return res.status(500).json({ err: err, message: "internal server error" });
  }
};

export const logincheck = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    console.log(user)
    if (user) {
      const data = await bcrypt.compare(password, user.password);
      console.log(data)
      if (data) {
        const username = user.username;
        const id = user.id
        const token = jwt.sign(
          { username, id, email },
          process.env.JWT_SECRET_KEY
          );
          console.log(token)
        return res.status(201).json({ data: data, token: token });
      } else {
        return res.status(401).json({ message: "Incorrect Password" });
      }
    } else {
      return res.sataus(401).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
