import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { useToast } from '../../context/ToastContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingCart, Clock } from 'lucide-react';
import './AdminDashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF52DE'];

const AdminAnalytics = () => {
    const { showToast } = useToast();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/analytics/dashboard');
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            showToast('Failed to load analytics', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-container"><div className="loading-spinner"></div></div>;
    if (!data) return <div className="admin-error">No data available</div>;

    const { stats, revenueData, statusData } = data;

    return (
        <div>
            <header className="admin-page-header">
                <div>
                    <h1 className="admin-page-title">Analytics</h1>
                    <p style={{ color: '#86868b', fontSize: 14, marginTop: 4 }}>
                        Platform performance insights
                    </p>
                </div>
            </header>

            {/* KPI Cards */}
            <div className="stats-grid" style={{ marginBottom: 32 }}>
                <div className="stat-card">
                    <div className="stat-icon-bg purple">
                        <DollarSign color="#af52de" />
                    </div>
                    <div>
                        <div className="stat-label">Total Revenue</div>
                        <div className="stat-value">LKR {parseFloat(stats.total_revenue).toLocaleString()}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-bg blue">
                        <ShoppingCart color="#0071e3" />
                    </div>
                    <div>
                        <div className="stat-label">Total Orders</div>
                        <div className="stat-value">{stats.total_orders}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-bg orange">
                        <Clock color="#ff9500" />
                    </div>
                    <div>
                        <div className="stat-label">Pending Orders</div>
                        <div className="stat-value">{stats.pending_orders}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-bg green">
                        <TrendingUp color="#34c759" />
                    </div>
                    <div>
                        <div className="stat-label">Conversion Rate</div>
                        <div className="stat-value">2.4%</div>
                        {/* Mock for now as we don't track visits yet */}
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="analytics-grid-responsive">
                {/* Revenue Trend */}
                <div className="content-card">
                    <div className="card-header">
                        <h3>Revenue (Last 7 Days)</h3>
                    </div>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f7" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#86868b', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#86868b', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(val) => `LKR ${val}`}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#0071e3', strokeWidth: 1 }}
                                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#0071e3"
                                    strokeWidth={3}
                                    dot={{ fill: '#fff', stroke: '#0071e3', strokeWidth: 2, r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status */}
                <div className="content-card">
                    <div className="card-header">
                        <h3>Order Status</h3>
                    </div>
                    <div style={{ height: 300, width: '100%' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 8 }} />
                                <Legend layout="vertical" verticalAlign="middle" align="right" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
