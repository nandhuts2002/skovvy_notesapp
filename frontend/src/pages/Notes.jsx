import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    const { user, logout } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        if (selectedNote) {
            const changed = editTitle !== selectedNote.title || editContent !== selectedNote.content;
            setHasChanges(changed);
        }
    }, [editTitle, editContent, selectedNote]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/notes');
            setNotes(response.data);
        } catch (err) {
            addToast('Failed to load notes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async () => {
        if (!editTitle.trim() || !editContent.trim()) {
            addToast('Please fill in all fields', 'error');
            return;
        }

        try {
            const response = await api.post('/api/notes', {
                title: editTitle.trim(),
                content: editContent.trim()
            });
            setNotes([response.data, ...notes]);
            setSelectedNote(response.data);
            setEditTitle(response.data.title);
            setEditContent(response.data.content);
            setIsCreating(false);
            setHasChanges(false);
            addToast('Note created ✨', 'success');
        } catch (err) {
            addToast('Failed to create note', 'error');
        }
    };

    const handleSaveChanges = async () => {
        if (!selectedNote || !editTitle.trim() || !editContent.trim()) {
            addToast('Please fill in all fields', 'error');
            return;
        }

        try {
            const response = await api.put(`/api/notes/${selectedNote.id}`, {
                title: editTitle.trim(),
                content: editContent.trim()
            });
            setNotes(notes.map(n => n.id === selectedNote.id ? response.data : n));
            setSelectedNote(response.data);
            setEditTitle(response.data.title);
            setEditContent(response.data.content);
            setHasChanges(false);
            addToast('Note saved ✓', 'success');
        } catch (err) {
            addToast('Failed to save note', 'error');
        }
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm('Delete this note?')) return;

        try {
            await api.delete(`/api/notes/${id}`);
            setNotes(notes.filter(n => n.id !== id));
            if (selectedNote?.id === id) {
                setSelectedNote(null);
                setEditTitle('');
                setEditContent('');
            }
            addToast('Note deleted', 'info');
        } catch (err) {
            addToast('Failed to delete note', 'error');
        }
    };

    const selectNote = (note) => {
        setSelectedNote(note);
        setEditTitle(note.title);
        setEditContent(note.content);
        setIsCreating(false);
        setHasChanges(false);
    };

    const startNewNote = () => {
        setIsCreating(true);
        setSelectedNote(null);
        setEditTitle('');
        setEditContent('');
        setHasChanges(false);
    };

    const cancelEdit = () => {
        if (isCreating) {
            setIsCreating(false);
            setEditTitle('');
            setEditContent('');
        } else if (selectedNote) {
            setEditTitle(selectedNote.title);
            setEditContent(selectedNote.content);
            setHasChanges(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getPreview = (content) => {
        const maxLength = 100;
        if (content.length <= maxLength) return content;
        const truncated = content.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 80) return truncated.substring(0, lastSpace) + '...';
        return truncated + '...';
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader}>
                    <h1 style={styles.appTitle}><span style={styles.nLetter}>N</span>otes App</h1>
                </div>

                <button onClick={startNewNote} style={styles.createBtn}>
                    <span style={styles.plusIcon}>+</span>
                    Create Note
                </button>

                <div style={styles.navItem}>
                    <span style={styles.navIcon}>📄</span>
                    Notes
                </div>
            </div>

            {/* Main Content */}
            <div style={styles.main}>
                <div style={styles.topBar}>
                    <h2 style={styles.pageTitle}>Notes App</h2>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>

                <div style={styles.notesList}>
                    <div style={styles.notesHeader}>
                        <span style={styles.totalNotes}>Total notes: {notes.length}</span>
                    </div>

                    {loading ? (
                        <div style={styles.loadingState}>Loading...</div>
                    ) : notes.length === 0 ? (
                        <div style={styles.emptyState}>No notes yet. Create your first note!</div>
                    ) : (
                        notes.map(note => (
                            <div
                                key={note.id}
                                onClick={() => selectNote(note)}
                                style={{
                                    ...styles.noteCard,
                                    ...(selectedNote?.id === note.id ? styles.noteCardActive : {})
                                }}
                            >
                                <div style={styles.noteCardHeader}>
                                    <h3 style={styles.noteCardTitle}>{note.title}</h3>
                                    <div style={styles.noteActions}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                selectNote(note);
                                            }}
                                            style={styles.iconBtn}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteNote(note.id);
                                            }}
                                            style={styles.iconBtn}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                <p style={styles.noteCardPreview}>{getPreview(note.content)}</p>
                                <span style={styles.noteCardDate}>{formatDate(note.updated_at)}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel - Note Detail */}
            <div style={styles.rightPanel}>
                {(selectedNote || isCreating) ? (
                    <>
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Note title"
                            style={styles.detailTitle}
                        />
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="Start writing..."
                            style={styles.detailContent}
                        />
                        <div style={styles.detailActions}>
                            <button onClick={cancelEdit} style={styles.cancelBtn}>
                                Cancel
                            </button>
                            <button
                                onClick={isCreating ? handleCreateNote : handleSaveChanges}
                                style={styles.saveBtn}
                                disabled={!editTitle.trim() || !editContent.trim()}
                            >
                                {isCreating ? 'Create Note' : 'Save Changes'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={styles.emptyDetail}>
                        <p style={styles.emptyDetailText}>Select a note to view or edit</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
        background: '#f5f5f5'
    },
    sidebar: {
        width: '240px',
        background: '#2c3e50',
        color: 'white',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    sidebarHeader: {
        marginBottom: '8px'
    },
    appTitle: {
        fontSize: '20px',
        fontWeight: '600',
        margin: 0,
        color: 'white'
    },
    nLetter: {
        color: '#1abc9c'
    },
    createBtn: {
        background: '#16a085',
        color: 'white',
        border: 'none',
        padding: '12px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s'
    },
    plusIcon: {
        fontSize: '18px',
        fontWeight: '300'
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 12px',
        borderRadius: '6px',
        background: 'rgba(255, 255, 255, 0.1)',
        fontSize: '14px',
        fontWeight: '500'
    },
    navIcon: {
        fontSize: '16px'
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        overflow: 'hidden'
    },
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 24px',
        borderBottom: '1px solid #e0e0e0'
    },
    pageTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#2c3e50',
        margin: 0
    },
    logoutBtn: {
        padding: '8px 16px',
        background: 'transparent',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#555',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    notesList: {
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px'
    },
    notesHeader: {
        marginBottom: '16px'
    },
    totalNotes: {
        fontSize: '14px',
        color: '#666',
        fontWeight: '500'
    },
    loadingState: {
        textAlign: 'center',
        padding: '40px',
        color: '#999'
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px',
        color: '#999'
    },
    noteCard: {
        background: '#f8f9fa',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    noteCardActive: {
        background: 'white',
        borderColor: '#16a085',
        boxShadow: '0 2px 8px rgba(22, 160, 133, 0.1)'
    },
    noteCardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
    },
    noteCardTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2c3e50',
        margin: 0,
        flex: 1
    },
    noteActions: {
        display: 'flex',
        gap: '4px'
    },
    iconBtn: {
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        padding: '4px',
        opacity: 0.6,
        transition: 'opacity 0.2s'
    },
    noteCardPreview: {
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.5',
        margin: '0 0 8px 0'
    },
    noteCardDate: {
        fontSize: '12px',
        color: '#999'
    },
    rightPanel: {
        width: '380px',
        background: 'white',
        borderLeft: '1px solid #e0e0e0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column'
    },
    detailTitle: {
        fontSize: '24px',
        fontWeight: '600',
        border: 'none',
        outline: 'none',
        marginBottom: '16px',
        padding: '8px 0',
        color: '#2c3e50',
        fontFamily: 'inherit'
    },
    detailContent: {
        flex: 1,
        border: 'none',
        outline: 'none',
        resize: 'none',
        fontSize: '15px',
        lineHeight: '1.6',
        color: '#555',
        background: '#f8f9fa',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontFamily: 'inherit'
    },
    detailActions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
    },
    cancelBtn: {
        padding: '10px 20px',
        background: '#e0e0e0',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#555',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    saveBtn: {
        padding: '10px 20px',
        background: '#16a085',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    emptyDetail: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    emptyDetailText: {
        color: '#999',
        fontSize: '15px'
    }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .createBtn:hover {
    background: #138d75 !important;
  }
  
  .logoutBtn:hover {
    background: #f5f5f5 !important;
  }
  
  .noteCard:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08) !important;
  }
  
  .iconBtn:hover {
    opacity: 1 !important;
  }
  
  .cancelBtn:hover {
    background: #d5d5d5 !important;
  }
  
  .saveBtn:hover {
    background: #138d75 !important;
  }
  
  .saveBtn:disabled {
    opacity: 0.5;
    cursor: not-allowed !important;
  }
`;
if (document.getElementById('notes-styles')) {
    document.getElementById('notes-styles').remove();
}
styleSheet.id = 'notes-styles';
document.head.appendChild(styleSheet);

export default Notes;
