import { useState } from 'react';
import NoteForm from './NoteForm';

const NoteItem = ({ note, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleEdit = (updatedNote) => {
        onEdit(note.id, updatedNote);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete(note.id);
        setShowDeleteConfirm(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getPreview = (content) => {
        const maxLength = 100;
        if (content.length <= maxLength) return content;

        const truncated = content.substring(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');

        if (lastSpace > 80) {
            return truncated.substring(0, lastSpace) + '...';
        }
        return truncated + '...';
    };

    if (isEditing) {
        return (
            <div style={styles.card}>
                <NoteForm
                    initialData={note}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <div style={styles.card}>
            {showDeleteConfirm && (
                <div style={styles.confirmOverlay}>
                    <p style={styles.confirmText}>Delete this note?</p>
                    <div style={styles.confirmActions}>
                        <button onClick={handleDelete} style={styles.deleteBtn}>
                            Delete
                        </button>
                        <button onClick={() => setShowDeleteConfirm(false)} style={styles.cancelBtn}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div style={styles.header}>
                <h3 style={styles.title}>{note.title}</h3>
                <span style={styles.date}>{formatDate(note.updated_at)}</span>
            </div>

            <p style={styles.preview}>{getPreview(note.content)}</p>

            <div style={styles.actions}>
                <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
                    Edit
                </button>
                <button onClick={() => setShowDeleteConfirm(true)} style={styles.deleteActionBtn}>
                    Delete
                </button>
            </div>
        </div>
    );
};

const styles = {
    card: {
        background: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s',
        position: 'relative',
        border: '1px solid #f1f5f9'
    },
    confirmOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 10
    },
    confirmText: {
        fontSize: '15px',
        fontWeight: '500',
        color: '#0f172a',
        marginBottom: '20px'
    },
    confirmActions: {
        display: 'flex',
        gap: '10px'
    },
    deleteBtn: {
        padding: '10px 20px',
        borderRadius: '7px',
        border: 'none',
        background: '#dc2626',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    cancelBtn: {
        padding: '10px 20px',
        borderRadius: '7px',
        border: '1px solid #e5e7eb',
        background: 'white',
        color: '#64748b',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
        gap: '16px'
    },
    title: {
        fontSize: '17px',
        fontWeight: '600',
        color: '#0f172a',
        margin: 0,
        flex: 1,
        lineHeight: '1.4',
        letterSpacing: '-0.2px'
    },
    date: {
        fontSize: '12px',
        color: '#94a3b8',
        whiteSpace: 'nowrap',
        fontWeight: '500'
    },
    preview: {
        fontSize: '14px',
        color: '#64748b',
        lineHeight: '1.6',
        marginBottom: '16px',
        minHeight: '44px'
    },
    actions: {
        display: 'flex',
        gap: '8px',
        paddingTop: '14px',
        borderTop: '1px solid #f1f5f9'
    },
    editBtn: {
        flex: 1,
        padding: '9px 16px',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
        background: 'white',
        color: '#475569',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    deleteActionBtn: {
        flex: 1,
        padding: '9px 16px',
        borderRadius: '6px',
        border: '1px solid #e5e7eb',
        background: 'white',
        color: '#dc2626',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s'
    }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
    border-color: #e5e7eb !important;
  }
  
  .editBtn:hover {
    background: #f8fafc !important;
    border-color: #cbd5e0 !important;
  }
  
  .deleteActionBtn:hover {
    background: #fef2f2 !important;
    border-color: #fecaca !important;
  }
  
  .deleteBtn:hover {
    background: #b91c1c !important;
  }
  
  .cancelBtn:hover {
    background: #f8fafc !important;
    border-color: #cbd5e0 !important;
  }
`;
if (document.getElementById('note-item-styles')) {
    document.getElementById('note-item-styles').remove();
}
styleSheet.id = 'note-item-styles';
document.head.appendChild(styleSheet);

export default NoteItem;
