import Chat from '../models/chat.js'

const  addChat = async (groupchatId, message, userId) => {
  await Chat.create({
    message: message,
    userId: userId,
    groupchatId: groupchatId,
  });
  return;
};

export {addChat} ;