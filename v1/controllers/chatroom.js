// utils
// import makeValidation from '@withvoid/make-validation';
// models
import ChatRoomModel, { CHAT_ROOM_TYPES } from '../models/chatroom.js';
import ChatMessageModel from '../models/chatmessage.js'
import UserModel from '../models/user.js';

export default {
  initiate: async (req, res) => {
    try {
      const { userEmails, type } = req.body;
      const allUserIds = [...userEmails];
      console.log(allUserIds)
      const chatRoom = await ChatRoomModel.initiateChat(allUserIds, type);
      return res.status(200).json({ success: true, chatRoom });
    } catch (error) {
      console.log('error: ' + error)
      return res.status(500).json({ success: false, error: error })
    }
  },
  postMessage: async (req, res) => {
    try {
      const { roomId } = req.params;
      const messagePayload = req.body.message
      console.log(messagePayload)
      const currentLoggedUser = req.user.email;
      const post = await ChatMessageModel.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);
      // global.io.sockets.in(roomId).emit('new message', { message: post });
      return res.status(200).json({ success: true, post });
    } catch (error) {
      console.log("error: " + error)
      return res.status(500).json({ success: false, error: error })
    }
  },
  getRecentConversation: async (req, res) => {
    try {
      const currentLoggedUser = req.user.email;
      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      };
      const rooms = await ChatRoomModel.getChatRoomsByUserId(currentLoggedUser);
      const roomIds = rooms.map(room => room._id);
      const recentConversation = await ChatMessageModel.getRecentConversation(
        roomIds, options, currentLoggedUser
      );
      return res.status(200).json({ success: true, conversation: recentConversation });
    } catch (error) {
      console.log("oops " + error)
      return res.status(500).json({ success: false, error: error })
    }
  },
  getConversationByRoomId: async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
      if (!room) {
        return res.status(400).json({
          success: false,
          message: 'No room exists for this id',
        })
      }
      const users = await UserModel.getUserByIds(room.userEmails);
      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
      };
      const conversation = await ChatMessageModel.getConversationByRoomId(roomId, options);
      return res.status(200).json({
        success: true,
        conversation,
        users,
      });
    } catch (error) {
      console.log("error: " + error)
      return res.status(500).json({ success: false, error });
    }
  },
  markConversationReadByRoomId: async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
      if (!room) {
        return res.status(400).json({
          success: false,
          message: 'No room exists for this id',
        })
      }

      const currentLoggedUser = req.userId;
      const result = await ChatMessageModel.markMessageRead(roomId, currentLoggedUser);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  },
}