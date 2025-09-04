import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';

const router = Router();
const controller = new SessionController();

// Admin Session Management
router.get('/', controller.listSessions); // list all sessions with optional filter
router.get('/:id', controller.getSession); // get session by ID
router.delete('/:id', controller.deleteSession); // delete session by ID
router.delete('/user/:userId', controller.deleteUserSessions); // delete all sessions of a user

export default router;
