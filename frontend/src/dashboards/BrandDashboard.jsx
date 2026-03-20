import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import BrandLayout from './BrandLayout';

const BrandDashboard = () => {
    const { brand, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        productsCount: 0,
        ordersCount: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !brand) {
            navigate('/');
        }
        if (!authLoading && brand) {
            fetchStats();
        }
    }, [brand, authLoading, navigate]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [productRes, orderRes] = await Promise.all([
                api.get(`/products/brand/${brand._id}`),
                api.get(`/brand/orders/${brand._id}`)
            ]);
            
            const productsCount = productRes.data.products?.length || 0;
            const ordersCount = orderRes.data?.length || 0;
            const revenue = orderRes.data
                ? orderRes.data
                    .filter(o => ['Approved', 'Shipped', 'Delivered'].includes(o.orderStatus))
                    .reduce((acc, curr) => acc + curr.totalPrice, 0)
                : 0;

            setStats({ productsCount, ordersCount, revenue });
        } catch (error) {
            console.error('Error fetching brand stats', error);
        }
        setLoading(false);
    };

    if (authLoading || loading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;

    return (
        <BrandLayout title="Dashboard Overview">
            <Row className="g-4 mb-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 text-center p-4 h-100 transition-all hover-shadow bg-white">
                        <h1 className="display-4 fw-bold text-dark">{stats.productsCount}</h1>
                        <p className="text-muted text-uppercase fw-bold mb-0" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Total Products</p>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 text-center p-4 h-100 transition-all hover-shadow bg-white">
                        <h1 className="display-4 fw-bold text-danger">{stats.ordersCount}</h1>
                        <p className="text-muted text-uppercase fw-bold mb-0" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Total Orders</p>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 text-center p-4 h-100 transition-all hover-shadow bg-white">
                        {brand?.status === 'pending' ? (
                            <h1 className="display-5 fw-bold text-warning">Not Approved</h1>
                        ) : stats.productsCount > 0 ? (
                            <h1 className="display-4 fw-bold text-success">Active</h1>
                        ) : (
                            <h1 className="display-4 fw-bold text-success">Activate</h1>
                        )}
                        <p className="text-muted text-uppercase fw-bold mb-0" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Store Status</p>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-5">
                <Col md={12}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-shadow bg-white">
                        <div className="d-flex flex-column flex-md-row">
                            <div className="bg-success text-white p-4 d-flex align-items-center justify-content-center" style={{ minWidth: '120px' }}>
                                <h1 className="mb-0">₹</h1>
                            </div>
                            <div className="p-4 flex-grow-1 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                                <div>
                                    <p className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Financial Performance</p>
                                    <h3 className="fw-bold text-dark mb-0">Total Brand Revenue</h3>
                                </div>
                                <div className="text-md-end mt-3 mt-md-0">
                                    <h1 className="display-4 fw-bold text-success mb-0">₹{stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h1>
                                    <p className="text-muted small fw-semibold mb-0">Earnings from approved orders</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <style>{`
                .hover-shadow:hover {
                    box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important;
                    transform: translateY(-5px);
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
            `}</style>
        </BrandLayout>
    );
};

export default BrandDashboard;
