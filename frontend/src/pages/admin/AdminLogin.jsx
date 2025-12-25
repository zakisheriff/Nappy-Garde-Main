import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import './AdminLogin.css';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Strict Admin Check
        if (formData.email !== 'admin@nappygarde.com') {
            setError('Access Denied: You are not authorized to access the Admin Panel.');
            setLoading(false);
            return;
        }

        const result = await login(formData.email, formData.password);

        if (result.success) {
            if (result.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                setError('Access Denied: User is not an administrator.');
            }
        } else {
            setError(result.error || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <h1 className="admin-login-title">Admin Access</h1>
                <p className="admin-login-subtitle">Sign in to manage Nappy Garde</p>

                {error && <div className="admin-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="admin-input"
                            placeholder="admin@nappygarde.com"
                            required
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="admin-input"
                                placeholder="••••••••"
                                required
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#86868b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="admin-submit-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
