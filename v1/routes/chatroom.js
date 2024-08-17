import express from 'express';
// controllers
import chatRoom from '../controllers/chatroom.js';
import { check } from "express-validator";

const router = express.Router();

router
  .get('/', chatRoom.getRecentConversation)
  .get('/:roomId', chatRoom.getConversationByRoomId)
  .post('/initiate', chatRoom.initiate)
  .post('/:roomId/message', check('message')
  .not()
  .isEmpty(),
  chatRoom.postMessage)
  .put('/:roomId/mark-read', chatRoom.markConversationReadByRoomId)

export default router;