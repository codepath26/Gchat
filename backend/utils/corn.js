import ArchiveChat from '../models/archiveChat.js'
import Chat from '../models/chat';
 const moveChatToArchive = async () => {
  const chats = await Chat.findAll();
  chats.forEach(async (chat) => {
    await ArchiveChat.create({
      message: chat.message,
      userId: chat.userId,
      groupchatId: chat.groupchatId,
    });
  });
  await Chat.destroy({
    where: {},
    truncate: true,
  });
};

export {moveChatToArchive}
