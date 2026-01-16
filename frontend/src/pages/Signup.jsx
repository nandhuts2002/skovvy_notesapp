import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false });

    const { signup } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateConfirmPassword = () => {
        return confirmPassword && password === confirmPassword;
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

    const getConfirmPasswordError = () => {
        if (!touched.confirmPassword) return '';
        if (!confirmPassword) return 'Please confirm your password';
        if (!validateConfirmPassword()) return 'Passwords do not match';
        return '';
    };

    const getPasswordStrength = () => {
        if (!password) return null;
        const length = password.length;
        if (length < 6) return { level: 'weak', color: '#e74c3c', width: '33%' };
        if (length < 10) return { level: 'medium', color: '#f39c12', width: '66%' };
        return { level: 'strong', color: '#16a085', width: '100%' };
    };

    const isFieldValid = (field) => {
        if (!touched[field]) return null;
        if (field === 'email') return email && validateEmail(email);
        if (field === 'password') return password && validatePassword(password);
        if (field === 'confirmPassword') return validateConfirmPassword();
        return false;
    };

    const isFormValid = () => {
        return email && password && confirmPassword &&
            validateEmail(email) && validatePassword(password) && validateConfirmPassword();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setTouched({ email: true, password: true, confirmPassword: true });

        if (!isFormValid()) {
            setError('Please fix the errors before submitting');
            return;
        }

        setLoading(true);

        try {
            await signup(email, password);
            addToast('Account created! Welcome 🎉', 'success');
            setTimeout(() => navigate('/notes'), 500);
        } catch (err) {
            setError(err.message || 'Failed to create account');
            addToast(err.message || 'Failed to create account', 'error');
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
    const confirmPasswordError = getConfirmPasswordError();
    const passwordStrength = getPasswordStrength();

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logo}>
                        <span style={styles.nLetter}>N</span>otes App
                    </div>
                    <h1 style={styles.title}>Create account</h1>
                    <p style={styles.subtitle}>Get started with your notes</p>
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
                                minLength={6}
                                style={{
                                    ...styles.input,
                                    ...(passwordError ? styles.inputError : {}),
                                    ...(isFieldValid('password') ? styles.inputSuccess : {})
                                }}
                                placeholder="At least 6 characters"
                            />
                            {isFieldValid('password') && (
                                <span style={styles.checkIcon}>✓</span>
                            )}
                        </div>
                        {passwordError && <span style={styles.errorText}>{passwordError}</span>}

                        {password && passwordStrength && (
                            <div style={styles.strengthContainer}>
                                <div style={styles.strengthBar}>
                                    <div style={{
                                        ...styles.strengthFill,
                                        width: passwordStrength.width,
                                        background: passwordStrength.color
                                    }}></div>
                                </div>
                                <span style={{ ...styles.strengthText, color: passwordStrength.color }}>
                                    {passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)} password
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <div style={styles.inputWrapper}>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onBlur={() => handleBlur('confirmPassword')}
                                onFocus={() => setError('')}
                                required
                                style={{
                                    ...styles.input,
                                    ...(confirmPasswordError ? styles.inputError : {}),
                                    ...(isFieldValid('confirmPassword') ? styles.inputSuccess : {})
                                }}
                                placeholder="Re-enter password"
                            />
                            {isFieldValid('confirmPassword') && (
                                <span style={styles.checkIcon}>✓</span>
                            )}
                        </div>
                        {confirmPasswordError && <span style={styles.errorText}>{confirmPasswordError}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isFormValid()}
                        style={{
                            ...styles.button,
                            ...((loading || !isFormValid()) && styles.buttonDisabled)
                        }}
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <div style={styles.footer}>
                    Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
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
    strengthContainer: {
        marginTop: '10px'
    },
    strengthBar: {
        height: '4px',
        background: '#e0e0e0',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '6px'
    },
    strengthFill: {
        height: '100%',
        transition: 'all 0.3s',
        borderRadius: '2px'
    },
    strengthText: {
        fontSize: '13px',
        fontWeight: '600'
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
if (document.getElementById('signup-styles')) {
    document.getElementById('signup-styles').remove();
}
styleSheet.id = 'signup-styles';
document.head.appendChild(styleSheet);

export default Signup;
