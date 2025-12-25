import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Lock, Save } from 'lucide-react';
import './AdminDashboard.css';

const AdminSettings = () => {
    const { user, updateProfile } = useAuth();
    const { showToast } = useToast();

    // Profile State
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profileData);
            showToast('Profile updated successfully', 'success');
        } catch (error) {
            showToast('Failed to update profile', 'error');
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('New passwords do not match', 'error');
            return;
        }

        try {
            await api.put('/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            showToast('Password changed successfully', 'success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            showToast(error.response?.data?.error || 'Failed to change password', 'error');
        }
    };

    return (
        <div>
            <header className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Settings</h1>
                    <p style={{ color: '#86868b', fontSize: 14, marginTop: 4 }}>
                        Manage your account and security
                    </p>
                </div>
            </header>

            <div className="grid-2">
                {/* Profile Settings */}
                <div className="content-card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <User size={20} color="#0071e3" />
                            <h3>Profile Information</h3>
                        </div>
                    </div>
                    <form onSubmit={handleProfileUpdate}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={profileData.name}
                                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid-2" style={{ gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={profileData.email}
                                    disabled
                                    style={{ background: '#f5f5f7', cursor: 'not-allowed' }}
                                />
                                <small style={{ color: '#86868b', fontSize: 12 }}>Email cannot be changed</small>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={profileData.phone}
                                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Save size={16} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Settings */}
                <div className="content-card" style={{ marginTop: 24 }}>
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, }}>
                            <Lock size={20} color="#ff3b30" />
                            <h3>Security</h3>
                        </div>
                    </div>
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={passwordData.currentPassword}
                                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid-2" style={{ gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={passwordData.newPassword}
                                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={passwordData.confirmPassword}
                                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Save size={16} />
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
