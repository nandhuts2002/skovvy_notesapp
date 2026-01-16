import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote
} from '../controllers/notes.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// Notes CRUD routes
router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
