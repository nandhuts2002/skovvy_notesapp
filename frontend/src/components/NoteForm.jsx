import { useState } from 'react';

const NoteForm = ({ onSubmit, initialData = null, onCancel = null }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({ title: false, content: false });

    const getTitleError = () => {
        if (!touched.title) return '';
        if (!title.trim()) return 'Title is required';
        return '';
    };

    const getContentError = () => {
        if (!touched.content) return '';
        if (!content.trim()) return 'Content is required';
        return '';
    };

    const isFieldValid = (field) => {
        if (!touched[field]) return null;
        if (field === 'title') return title.trim().length > 0;
        if (field === 'content') return content.trim().length > 0;
        return false;
    };

    const isFormValid = () => {
        return title.trim() && content.trim();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setTouched({ title: true, content: true });

        if (!isFormValid()) {
            setError('Please fill in all fields');
            return;
        }

        onSubmit({ title: title.trim(), content: content.trim() });

        if (!initialData) {
            setTitle('');
            setContent('');
            setTouched({ title: false, content: false });
        }
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        setError('');
    };

    const titleError = getTitleError();
    const contentError = getContentError();

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.inputGroup}>
                <label style={styles.label}>Title</label>
                <div style={styles.inputWrapper}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => handleBlur('title')}
                        placeholder="Note title"
                        style={{
                            ...styles.input,
                            ...(titleError ? styles.inputError : {}),
                            ...(isFieldValid('title') ? styles.inputSuccess : {})
                        }}
                    />
                    {isFieldValid('title') && (
                        <span style={styles.checkIcon}>✓</span>
                    )}
                </div>
                {titleError && <span style={styles.errorText}>{titleError}</span>}
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>Content</label>
                <div style={styles.inputWrapper}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onBlur={() => handleBlur('content')}
                        placeholder="Start writing..."
                        rows="6"
                        style={{
                            ...styles.textarea,
                            ...(contentError ? styles.inputError : {}),
                            ...(isFieldValid('content') ? styles.inputSuccess : {})
                        }}
                    />
                    {isFieldValid('content') && (
                        <span style={{ ...styles.checkIcon, top: '16px' }}>✓</span>
                    )}
                </div>
                {contentError && <span style={styles.errorText}>{contentError}</span>}
                {content && (
                    <div style={styles.charCount}>{content.length} characters</div>
                )}
            </div>

            <div style={styles.actions}>
                <button
                    type="submit"
                    disabled={!isFormValid()}
                    style={{
                        ...styles.submitBtn,
                        ...(!isFormValid() && styles.buttonDisabled)
                    }}
                >
                    {initialData ? 'Save' : 'Create'}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel} style={styles.cancelBtn}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

const styles = {
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    error: {
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#dc2626',
        padding: '10px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '500'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#334155',
        marginBottom: '2px'
    },
    inputWrapper: {
        position: 'relative'
    },
    input: {
        width: '100%',
        padding: '12px 14px',
        paddingRight: '40px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        fontSize: '15px',
        fontWeight: '500',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#0f172a',
        transition: 'all 0.2s',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    textarea: {
        width: '100%',
        padding: '12px 14px',
        paddingRight: '40px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        fontSize: '14px',
        resize: 'vertical',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#0f172a',
        lineHeight: '1.6',
        transition: 'all 0.2s'
    },
    inputError: {
        borderColor: '#f87171',
        background: '#fef2f2'
    },
    inputSuccess: {
        borderColor: '#34d399',
        background: '#f0fdf4'
    },
    checkIcon: {
        position: 'absolute',
        right: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#10b981',
        fontSize: '18px',
        fontWeight: 'bold',
        pointerEvents: 'none'
    },
    errorText: {
        color: '#dc2626',
        fontSize: '12px',
        fontWeight: '500',
        marginTop: '4px'
    },
    charCount: {
        fontSize: '12px',
        color: '#94a3b8',
        textAlign: 'right',
        fontWeight: '500'
    },
    actions: {
        display: 'flex',
        gap: '10px',
        marginTop: '6px'
    },
    submitBtn: {
        flex: 1,
        padding: '11px 18px',
        borderRadius: '7px',
        border: 'none',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
        color: 'white',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 1px 3px rgba(139, 92, 246, 0.2)'
    },
    buttonDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed'
    },
    cancelBtn: {
        padding: '11px 18px',
        borderRadius: '7px',
        border: '1px solid #e5e7eb',
        background: 'white',
        color: '#64748b',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s'
    }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  input:focus, textarea:focus {
    border-color: #8b5cf6 !important;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.08) !important;
  }
  
  .submitBtn:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3) !important;
  }
  
  .cancelBtn:hover {
    background: #f8fafc !important;
    border-color: #cbd5e0 !important;
  }
`;
if (document.getElementById('note-form-styles')) {
    document.getElementById('note-form-styles').remove();
}
styleSheet.id = 'note-form-styles';
document.head.appendChild(styleSheet);

export default NoteForm;
