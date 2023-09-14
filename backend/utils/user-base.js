import User from "../models/user.js";
 const getUserDetails = async (id, message) => {
  console.log(id, message);
  const user = await User.findByPk(id);
  return {
    userId: user.id,
    userName: user.userName,
    message: message,
  };
};
export {getUserDetails};
