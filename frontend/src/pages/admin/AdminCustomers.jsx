import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { Search, Mail, Phone, Calendar } from 'lucide-react';
import './AdminDashboard.css';

const AdminCustomers = () => {
    const { showToast } = useToast();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/users');
            setCustomers(response.data.users);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
            showToast('Failed to load customers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

    return (
        <div>
            <header className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Customers</h1>
                    <p style={{ color: '#86868b', fontSize: 14, marginTop: 4 }}>
                        {customers.length} registered customers
                    </p>
                </div>

            </header>

            <div className="global-search-container mb-24">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="global-search-input"
                />
            </div>

            <div className="content-card">
                <div className="table-responsive">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Contact</th>
                                <th>Joined</th>
                                <th>Orders</th>
                                <th>Total Spent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => (
                                <tr key={customer.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 40, height: 40,
                                                borderRadius: '50%',
                                                background: '#0071e3',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 600,
                                                fontSize: 16
                                            }}>
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{customer.name}</div>
                                                <div style={{ fontSize: 12, color: '#86868b' }}>ID: #{customer.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                                                <Mail size={14} color="#86868b" />
                                                {customer.email}
                                            </div>
                                            {customer.phone && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                                                    <Phone size={14} color="#86868b" />
                                                    {customer.phone}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{new Date(customer.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className="badge" style={{ background: '#e5e5ea', color: '#1d1d1f' }}>
                                            {customer.order_count} Orders
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        LKR {parseFloat(customer.total_spent).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomers;
