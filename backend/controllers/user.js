import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sequelize from "../utils/database.js";

export const signup = async (req, res) => {
  console.log("thid")
  console.log(req.body)
  console.log("this")
  const { userName, email, password } = req.body;
const t =  await sequelize.transaction();
  try {
    const find = await User.findOne({ where: { email: email } });
    if (find) {
      return res
        .json({ message: "User already exists, Please Login" });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        userName: userName,
        email: email,
        password: hashPassword,
      },{
        transaction : t 
      });
        await t.commit();
      return res.status(200).json({
        success : true ,
        user : user,
      });
    }
  } catch (err) {
    await t.rollback();
    console.log(err)
    return res.json({ success: false, message: "internal server error" });
  }
};

export const logincheck = async (req, res) => {
  const { email, password } = req.body;
  try {
  const user = await User.findOne({ where: { email: email } });
    // console.log(user)
    if (user) {
      const data = await bcrypt.compare(password, user.password);
      // console.log(data)
      if (data) {
        const username = user.username;
        const id = user.id
        const token = jwt.sign(
          {id:id , userName :username},
          process.env.JWT_SECRET_KEY
          );
          // console.log(token)
        return res.status(200).json({
          success : true,
          message : "User logged in",
          token: token });
      } else {
        return res.status(401).json({
          success : false ,
          message: "Incorrect Password" });
      }
    } else {
      return res.status(500).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({
      success : false,
      message : "Something Went Wrong"
    });
  }
};
