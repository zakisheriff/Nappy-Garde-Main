import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';

const Login = () => {
    const { login, register, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/account');
        }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLoginMode) {
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    if (result.user.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                } else {
                    setError(result.error);
                }
            } else {
                // Validation
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }

                const result = await register(
                    formData.name,
                    formData.email,
                    formData.phone,
                    formData.password
                );
                if (result.success) {
                    navigate('/');
                } else {
                    setError(result.error);
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page page">
            <div className="login-container">
                <div className="login-card card-glass">
                    <h1 className="login-title">
                        {isLoginMode ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="login-subtitle">
                        {isLoginMode
                            ? 'Sign in to access your account'
                            : 'Join Nappy Garde today'}
                    </p>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="login-form">
                        {!isLoginMode && (
                            <>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="form-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingRight: '40px' }}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {!isLoginMode && (
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        className="form-input"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        style={{ paddingRight: '40px' }}
                                    />
                                    {/* Using same toggle for confirm password for simplicity, or we could add specific one */}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Please wait...' : isLoginMode ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="login-toggle">
                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setError('');
                                setFormData({
                                    name: '',
                                    email: '',
                                    phone: '',
                                    password: '',
                                    confirmPassword: '',
                                });
                            }}
                        >
                            {isLoginMode
                                ? "Don't have an account? Sign up"
                                : 'Already have an account? Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
