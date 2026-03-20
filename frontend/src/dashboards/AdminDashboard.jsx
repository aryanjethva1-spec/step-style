import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/');
            } else {
                fetchDashboardData();
            }
        }
    }, [user, authLoading, navigate]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/stats');
            setStats(data);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
        }
        setLoading(false);
    };

    if (authLoading || loading || !user) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;

    return (
        <AdminLayout title="Platform Overview">
            <Row className="g-4 mb-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm rounded-4 text-center p-4 h-100 d-flex justify-content-center transition-all hover-shadow">
                        <h1 className="display-4 fw-bold text-dark">{stats.totalUsers || 0}</h1>
                        <p className="text-muted text-uppercase fw-semibold mb-0" style={{ fontSize: '0.8rem' }}>Total Customers</p>
                        {stats.allUsers > stats.totalUsers && (
                            <small className="text-info" style={{ fontSize: '0.7rem' }}>({stats.allUsers} records)</small>
                        )}
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm rounded-4 text-center p-4 h-100 d-flex justify-content-center transition-all hover-shadow">
                        <h1 className="display-4 fw-bold text-dark">{stats.totalBrands || 0}</h1>
                        <p className="text-muted text-uppercase fw-semibold mb-0" style={{ fontSize: '0.8rem' }}>Partner Brands</p>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm rounded-4 text-center p-4 h-100 d-flex justify-content-center transition-all hover-shadow">
                        <h1 className="display-4 fw-bold text-danger">{stats.totalOrders || 0}</h1>
                        <p className="text-muted text-uppercase fw-semibold mb-0" style={{ fontSize: '0.8rem' }}>Total Orders</p>
                    </Card>
                </Col>
                <Col md={3}>
                    <Link to="/admin/approvals" style={{ textDecoration: 'none' }}>
                        <Card className="border-0 shadow-sm rounded-4 text-center p-4 h-100 d-flex justify-content-center transition-all hover-shadow bg-danger text-white">
                            <h1 className="display-4 fw-bold">{stats.totalApprovalRequests || 0}</h1>
                            <p className="text-white text-uppercase fw-semibold mb-0" style={{ fontSize: '0.8rem' }}>Approval Requests</p>
                        </Card>
                    </Link>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col md={12}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-shadow bg-white">
                        <div className="d-flex flex-column flex-md-row">
                            <div className="bg-success text-white p-4 d-flex align-items-center justify-content-center" style={{ minWidth: '120px' }}>
                                <h2 className="mb-0">₹</h2>
                            </div>
                            <div className="p-4 flex-grow-1 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                                <div>
                                    <p className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Platform Financial Overview</p>
                                    <h3 className="fw-bold text-dark mb-0">Total Administrative Revenue</h3>
                                </div>
                                <div className="text-md-end mt-3 mt-md-0">
                                    <h1 className="display-4 fw-bold text-success mb-0">₹{(stats.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>
                                    <p className="text-muted small fw-semibold mb-0">Commission calculated from all processed orders</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <style>{`
                .hover-shadow:hover {
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                    transform: translateY(-5px);
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
            `}</style>
        </AdminLayout>
    );
};

export default AdminDashboard;
