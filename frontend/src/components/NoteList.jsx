import NoteItem from './NoteItem';

const NoteList = ({ notes, onEdit, onDelete }) => {
    if (notes.length === 0) {
        return (
            <div style={styles.empty}>
                <p style={styles.emptyText}>No notes yet. Create your first note above! 📝</p>
            </div>
        );
    }

    return (
        <div style={styles.list}>
            {notes.map((note) => (
                <NoteItem
                    key={note.id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

const styles = {
    list: {
        display: 'grid',
        gap: '16px'
    },
    empty: {
        background: 'white',
        borderRadius: '12px',
        padding: '60px 20px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    emptyText: {
        fontSize: '18px',
        color: '#718096'
    }
};

export default NoteList;
