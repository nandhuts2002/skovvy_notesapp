import { supabase } from '../supabaseClient.js';

/**
 * Create a new note
 * POST /api/notes
 */
export const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.userId;

        // Validate input
        if (!title || !content) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Title and content are required'
            });
        }

        // Insert note with user_id from JWT
        const { data, error } = await supabase
            .from('notes')
            .insert([
                {
                    user_id: userId,
                    title: title.trim(),
                    content: content.trim()
                }
            ])
            .select()
            .single();

        if (error) {
            throw error;
        }

        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create note'
        });
    }
};

/**
 * Get all notes for authenticated user
 * GET /api/notes
 */
export const getNotes = async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch all notes for this user, sorted by updated_at DESC
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', userId)
            .order('updated_at', { ascending: false });

        if (error) {
            throw error;
        }

        res.status(200).json(data || []);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch notes'
        });
    }
};

/**
 * Get a single note by ID
 * GET /api/notes/:id
 */
export const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    error: 'Not Found',
                    message: 'Note not found'
                });
            }
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch note'
        });
    }
};

/**
 * Update a note
 * PUT /api/notes/:id
 */
export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const userId = req.userId;

        // Validate input
        if (!title || !content) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Title and content are required'
            });
        }

        // Check if note exists and belongs to user
        const { data: existingNote, error: fetchError } = await supabase
            .from('notes')
            .select('id')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (fetchError || !existingNote) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Note not found or access denied'
            });
        }

        // Update note
        const { data, error } = await supabase
            .from('notes')
            .update({
                title: title.trim(),
                content: content.trim(),
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update note'
        });
    }
};

/**
 * Delete a note
 * DELETE /api/notes/:id
 */
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        // Check if note exists and belongs to user
        const { data: existingNote, error: fetchError } = await supabase
            .from('notes')
            .select('id')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (fetchError || !existingNote) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Note not found or access denied'
            });
        }

        // Delete note
        const { error } = await supabase
            .from('notes')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete note'
        });
    }
};
