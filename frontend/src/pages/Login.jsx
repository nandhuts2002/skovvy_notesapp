import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });

    const { login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const getEmailError = () => {
        if (!touched.email) return '';
        if (!email) return 'Email is required';
        if (!validateEmail(email)) return 'Please enter a valid email address';
        return '';
    };

    const getPasswordError = () => {
        if (!touched.password) return '';
        if (!password) return 'Password is required';
        if (!validatePassword(password)) return 'Password must be at least 6 characters';
        return '';
    };

    const isFieldValid = (field) => {
        if (!touched[field]) return null;
        if (field === 'email') return email && validateEmail(email);
        if (field === 'password') return password && validatePassword(password);
        return false;
    };

    const isFormValid = () => {
        return email && password && validateEmail(email) && validatePassword(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setTouched({ email: true, password: true });

        if (!isFormValid()) {
            setError('Please fix the errors before submitting');
            return;
        }

        setLoading(true);

        try {
            await login(email, password);
            addToast('Welcome back! 🎉', 'success');
            setTimeout(() => navigate('/notes'), 500);
        } catch (err) {
            setError(err.message || 'Failed to log in');
            addToast(err.message || 'Failed to log in', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
        setError('');
    };

    const emailError = getEmailError();
    const passwordError = getPasswordError();

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logo}>
                        <span style={styles.nLetter}>N</span>otes App
                    </div>
                    <h1 style={styles.title}>Welcome back</h1>
                    <p style={styles.subtitle}>Sign in to your account</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <div style={styles.inputWrapper}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => handleBlur('email')}
                                onFocus={() => setError('')}
                                required
                                style={{
                                    ...styles.input,
                                    ...(emailError ? styles.inputError : {}),
                                    ...(isFieldValid('email') ? styles.inputSuccess : {})
                                }}
                                placeholder="name@company.com"
                            />
                            {isFieldValid('email') && (
                                <span style={styles.checkIcon}>✓</span>
                            )}
                        </div>
                        {emailError && <span style={styles.errorText}>{emailError}</span>}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.inputWrapper}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => handleBlur('password')}
                                onFocus={() => setError('')}
                                required
                                style={{
                                    ...styles.input,
                                    ...(passwordError ? styles.inputError : {}),
                                    ...(isFieldValid('password') ? styles.inputSuccess : {})
                                }}
                                placeholder="••••••••"
                            />
                            {isFieldValid('password') && (
                                <span style={styles.checkIcon}>✓</span>
                            )}
                        </div>
                        {passwordError && <span style={styles.errorText}>{passwordError}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isFormValid()}
                        style={{
                            ...styles.button,
                            ...((loading || !isFormValid()) && styles.buttonDisabled)
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div style={styles.footer}>
                    Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ecf0f1',
        padding: '20px'
    },
    card: {
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e0e0e0'
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px'
    },
    logo: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '20px'
    },
    nLetter: {
        color: '#16a085'
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '8px',
        margin: '0 0 8px 0'
    },
    subtitle: {
        fontSize: '15px',
        color: '#7f8c8d',
        margin: 0
    },
    error: {
        background: '#fee',
        border: '1px solid #fcc',
        color: '#c33',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        fontWeight: '500'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '4px'
    },
    inputWrapper: {
        position: 'relative'
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        paddingRight: '40px',
        borderRadius: '8px',
        border: '2px solid #e0e0e0',
        fontSize: '15px',
        transition: 'all 0.2s',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#2c3e50',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    inputError: {
        borderColor: '#e74c3c',
        background: '#fee'
    },
    inputSuccess: {
        borderColor: '#16a085',
        background: '#eafaf7'
    },
    checkIcon: {
        position: 'absolute',
        right: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#16a085',
        fontSize: '18px',
        fontWeight: 'bold'
    },
    errorText: {
        color: '#e74c3c',
        fontSize: '13px',
        fontWeight: '500',
        marginTop: '4px'
    },
    button: {
        width: '100%',
        padding: '14px',
        borderRadius: '8px',
        border: 'none',
        background: '#16a085',
        color: 'white',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginTop: '8px'
    },
    buttonDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed'
    },
    footer: {
        marginTop: '28px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#7f8c8d'
    },
    link: {
        color: '#16a085',
        textDecoration: 'none',
        fontWeight: '600'
    }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  input:focus {
    border-color: #16a085 !important;
    box-shadow: 0 0 0 3px rgba(22, 160, 133, 0.1) !important;
  }
  
  button:not(:disabled):hover {
    background: #138d75 !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(22, 160, 133, 0.3) !important;
  }
  
  button:not(:disabled):active {
    transform: translateY(0);
  }
  
  a:hover {
    color: #138d75 !important;
    text-decoration: underline;
  }
`;
if (document.getElementById('login-styles')) {
    document.getElementById('login-styles').remove();
}
styleSheet.id = 'login-styles';
document.head.appendChild(styleSheet);

export default Login;
