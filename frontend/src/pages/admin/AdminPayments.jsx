import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { Search, CreditCard, DollarSign, Download, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import './AdminDashboard.css';

const AdminPayments = () => {
    const { showToast } = useToast();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            // We derive payments from orders for now
            const response = await api.get('/orders');
            setTransactions(response.data.orders);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            showToast('Failed to load payments', 'error');
        } finally {
            setLoading(false);
        }
    };

    const downloadTranscript = () => {
        const data = filteredTransactions.map(t => {
            const status = getPaymentStatus(t.status);
            return {
                'Transaction ID': `TXT-${t.id.toString().padStart(6, '0')}`,
                'Date': new Date(t.created_at).toLocaleDateString(),
                'Payer': t.delivery_name,
                'Order ID': t.id,
                'Method': t.payment_method,
                'Status': status,
                'Amount': status === 'Failed' ? 0 : parseFloat(t.total_price)
            };
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transactions");
        XLSX.writeFile(wb, `nappy_garde_transactions_${new Date().toISOString().split('T')[0]}.xlsx`);

        showToast('Transcript downloaded as Excel', 'success');
    };

    const getPaymentStatus = (orderStatus) => {
        if (orderStatus === 'Delivered') return 'Success';
        if (orderStatus === 'Cancelled') return 'Failed';
        return 'Pending';
    };

    const filteredTransactions = transactions.filter(t =>
        t.id.toString().includes(searchTerm) ||
        t.delivery_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = transactions.reduce((sum, t) => {
        if (t.status === 'Delivered') return sum + parseFloat(t.total_price);
        return sum;
    }, 0);

    const pendingRevenue = transactions.reduce((sum, t) => {
        if (t.status !== 'Delivered' && t.status !== 'Cancelled') return sum + parseFloat(t.total_price);
        return sum;
    }, 0);

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;

    return (
        <div>
            <header className="admin-page-header payments-header">
                <div>
                    <h1 className="admin-page-title">Payments</h1>
                    <p style={{ color: '#86868b', fontSize: 14, marginTop: 4 }}>Transaction history & financials</p>
                </div>
                <div className="payments-stats">
                    <div>
                        <div style={{ fontSize: 13, color: '#86868b' }}>Pending</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#f5a623' }}>LKR {pendingRevenue.toLocaleString()}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 13, color: '#86868b' }}>Realized Revenue</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#1d1d1f' }}>LKR {totalRevenue.toLocaleString()}</div>
                    </div>
                </div>
            </header>

            <div className="payments-controls">
                {/* Search */}
                <div className="payments-search-container">
                    <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#86868b' }} />
                    <input
                        type="text"
                        placeholder="Search by Transaction ID or Payer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="payments-search-input"
                    />
                </div>

                <button
                    onClick={downloadTranscript}
                    className="view-btn download-btn"
                >
                    <Download size={16} />
                    Download Excel
                </button>
            </div>

            <div className="content-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table className="orders-table">
                        <thead>
                            <tr style={{ background: '#f9f9fa' }}>
                                <th style={{ paddingLeft: 32 }}>Transaction ID</th>
                                <th>Date</th>
                                <th>Payer</th>
                                <th>Method</th>
                                <th>Payment Status</th>
                                <th style={{ paddingRight: 32, textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map(t => {
                                const status = getPaymentStatus(t.status);
                                return (
                                    <tr key={t.id}>
                                        <td style={{ paddingLeft: 32, fontFamily: 'monospace', fontWeight: 500, color: '#1d1d1f' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <FileText size={14} color="#86868b" />
                                                TXT-{t.id.toString().padStart(6, '0')}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: 14 }}>{new Date(t.created_at).toLocaleDateString()}</div>
                                            <div style={{ fontSize: 12, color: '#86868b' }}>{new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{t.delivery_name}</div>
                                            <div style={{ fontSize: 12, color: '#86868b' }}>Order #{t.id}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <div style={{
                                                    background: '#f5f5f7',
                                                    borderRadius: 4,
                                                    padding: 4,
                                                    display: 'flex'
                                                }}>
                                                    <CreditCard size={14} color="#1d1d1f" />
                                                </div>
                                                {t.payment_method}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${status === 'Success' ? 'delivered' : status === 'Failed' ? 'cancelled' : 'pending'}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td style={{ paddingRight: 32, textAlign: 'right', fontWeight: 600, color: status === 'Failed' ? '#86868b' : '#1d1d1f' }}>
                                            {status === 'Failed' ? 'LKR 0.00' : `LKR ${parseFloat(t.total_price).toLocaleString()}`}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPayments;
