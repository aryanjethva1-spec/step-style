import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Badge, Button, Image, ProgressBar, Breadcrumb, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    FaBoxOpen, FaTruck, FaCheckCircle, FaClock, FaTimesCircle, 
    FaShoppingBag, FaSearch, FaChevronRight, FaArrowRight, FaSyncAlt, FaPhone, FaEye
} from 'react-icons/fa';
import api, { BASE_URL } from '../services/api';

import UserLayout from './UserLayout';

const UserDashboard = () => {
    const { user, brand, loading: authLoading } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommended, setRecommended] = useState([]);
    const [cancelling, setCancelling] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading) {
            if (!user && !brand) {
                navigate('/login');
            } else {
                fetchMyOrders();
                fetchRecommended();
            }
        }
    }, [user, brand, authLoading, navigate]);

    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/orders/myorders');
            // Sort by newest first
            const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (error) {
            console.error('Error fetching orders', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecommended = async () => {
        try {
            const { data } = await api.get('/products');
            const shuffled = (data.products || []).sort(() => 0.5 - Math.random());
            setRecommended(shuffled.slice(0, 4));
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            setCancelling(orderId);
            await api.put(`/orders/${orderId}/cancel`);
            fetchMyOrders();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancelling(null);
        }
    };

    const getStatusInfo = (status) => {
        switch(status) {
            case 'Pending': return { variant: 'warning', icon: <FaClock className="me-1" />, progress: 25, label: 'Order Placed' };
            case 'Approved': return { variant: 'info', icon: <FaSyncAlt className="me-1" />, progress: 50, label: 'Processing' };
            case 'Shipped': return { variant: 'primary', icon: <FaTruck className="me-1" />, progress: 75, label: 'In Transit' };
            case 'Delivered': return { variant: 'success', icon: <FaCheckCircle className="me-1" />, progress: 100, label: 'Delivered' };
            case 'Rejected': return { variant: 'danger', icon: <FaTimesCircle className="me-1" />, progress: 0, label: 'Rejected' };
            case 'Cancelled': return { variant: 'secondary', icon: <FaTimesCircle className="me-1" />, progress: 0, label: 'Cancelled' };
            default: return { variant: 'secondary', icon: <FaClock className="me-1" />, progress: 0, label: status };
        }
    }

    const currentUser = user || brand;
    if (!currentUser) return null;

    return (
        <UserLayout title="My Orders">
            <div className="bg-light pb-5 pt-4">
                <Container>
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" style={{ width: '3rem', height: '3rem' }}></div>
                        <h4 className="mt-4 fw-bold text-muted">Retrieving your order history...</h4>
                    </div>
                ) : orders.length === 0 ? (
                    /* 7. Empty Orders State */
                    <div className="bg-white p-5 rounded-4 shadow-sm text-center my-5 fade-in-up border-bottom border-danger border-4">
                        <div className="mb-4">
                            <FaShoppingBag size={100} className="text-danger opacity-25" />
                        </div>
                        <h2 className="fw-black text-dark mb-3">No orders yet!</h2>
                        <p className="text-muted mb-4 lead">You haven't placed any orders yet. Start exploring our latest arrivals.</p>
                        <Button 
                            variant="danger" 
                            size="lg"
                            className="rounded-pill px-5 py-3 text-uppercase fw-bold shadow-sm hover-scale" 
                            onClick={() => navigate('/shop')}
                        >
                            Start Shopping
                        </Button>
                    </div>
                ) : (
                    <Row className="justify-content-center">
                        <Col lg={10}>
                            {/* 3. Orders List Section */}
                            {orders.map((order, idx) => {
                                const statusInfo = getStatusInfo(order.orderStatus);
                                const product = order.productId;
                                const imageUrl = product?.image?.startsWith('http') ? product.image : `${BASE_URL}${product?.image}`;
                                
                                return (
                                    <Card key={order._id} className="border-0 shadow-sm rounded-4 overflow-hidden mb-5 fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                                        <div className="bg-white border-bottom p-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
                                            <div className="d-flex gap-4">
                                                <div>
                                                    <p className="text-muted small fw-bold text-uppercase mb-1">Order ID</p>
                                                    <p className="fw-black mb-0 text-dark">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted small fw-bold text-uppercase mb-1">Order Date</p>
                                                    <p className="fw-black mb-0 text-dark">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted small fw-bold text-uppercase mb-1">Total</p>
                                                    <p className="fw-black mb-0 text-danger">₹{order.totalPrice?.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-md-end">
                                                <Badge bg={statusInfo.variant} className="rounded-pill px-3 py-2 text-uppercase fw-bold shadow-sm mb-2" style={{ fontSize: '12px' }}>
                                                    {statusInfo.icon} {order.orderStatus}
                                                </Badge>
                                                <div className="text-muted small fw-bold">{order.paymentMethod} • {order.paymentStatus}</div>
                                            </div>
                                        </div>

                                        <Card.Body className="p-4 p-md-5">
                                            {/* 4. Ordered Products */}
                                            <Row className="align-items-center mb-5 g-4">
                                                <Col md={2} xs={5}>
                                                    <div className="rounded-4 overflow-hidden bg-light shadow-sm aspect-ratio-1">
                                                        <Image src={imageUrl} className="w-100 h-100 object-fit-cover" />
                                                    </div>
                                                </Col>
                                                <Col md={6} xs={7}>
                                                    <h5 className="fw-black text-dark mb-1">{order.productName}</h5>
                                                    <p className="text-danger fw-bold small mb-2">{order.brandName}</p>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill">Size: {order.selectedSize || 'N/A'}</Badge>
                                                        <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill">Qty: {order.quantity}</Badge>
                                                    </div>
                                                </Col>
                                                <Col md={4} className="text-md-end">
                                                    <p className="text-muted small fw-bold mb-1">Unit Price</p>
                                                    <h4 className="fw-black text-dark">₹{(order.totalPrice / order.quantity).toLocaleString()}</h4>
                                                </Col>
                                            </Row>

                                            {/* 5. Order Status Indicator */}
                                            {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Rejected' && (
                                                <div className="mb-5 px-md-4">
                                                    <div className="d-flex justify-content-between mb-2 small fw-bold text-muted text-uppercase letter-spacing-1">
                                                        <span className={statusInfo.progress >= 25 ? 'text-danger' : ''}>Placed</span>
                                                        <span className={statusInfo.progress >= 50 ? 'text-danger' : ''}>Processing</span>
                                                        <span className={statusInfo.progress >= 75 ? 'text-danger' : ''}>Shipped</span>
                                                        <span className={statusInfo.progress >= 100 ? 'text-success' : ''}>Delivered</span>
                                                    </div>
                                                    <ProgressBar 
                                                        variant={statusInfo.progress === 100 ? "success" : "danger"} 
                                                        now={statusInfo.progress} 
                                                        style={{ height: '8px' }} 
                                                        className="rounded-pill bg-light"
                                                    />
                                                </div>
                                            )}

                                            {/* 6. Action Buttons */}
                                            <div className="d-flex flex-wrap gap-3 justify-content-md-end border-top pt-4">
                                                <Button 
                                                    className="btn-lax-view"
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <FaEye size={12} /> View Details
                                                </Button>
                                                <Button variant="dark" className="rounded-pill px-4 fw-bold text-uppercase small shadow-sm hover-scale" onClick={() => navigate(`/product/${order.productId._id || order.productId}`)}>
                                                    Buy Again
                                                </Button>
                                                {(order.orderStatus === 'Pending' || order.orderStatus === 'Approved') && (
                                                    <Button 
                                                        variant="outline-danger" 
                                                        className="rounded-pill px-4 fw-bold text-uppercase small shadow-sm hover-bg-danger"
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        disabled={cancelling === order._id}
                                                    >
                                                        {cancelling === order._id ? 'Cancelling...' : 'Cancel Order'}
                                                    </Button>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </Col>
                    </Row>
                )}

                {/* Order Detail Modal */}
                <Modal 
                    show={showModal} 
                    onHide={() => setShowModal(false)} 
                    size="lg" 
                    centered 
                    className="order-detail-modal"
                >
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fw-black text-uppercase letter-spacing-1">Order Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 p-md-5">
                        {selectedOrder && (
                            <div className="animate-fade-in">
                                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                                    <div>
                                        <p className="text-muted small fw-bold text-uppercase mb-0">Order ID</p>
                                        <h5 className="fw-black">#{selectedOrder._id.toUpperCase()}</h5>
                                    </div>
                                    <Badge bg={getStatusInfo(selectedOrder.orderStatus).variant} className="rounded-pill px-4 py-2 text-uppercase fw-bold">
                                        {selectedOrder.orderStatus}
                                    </Badge>
                                </div>

                                <Row className="g-4 mb-5">
                                    <Col md={6}>
                                        <h6 className="fw-black text-uppercase small letter-spacing-1 text-danger mb-3">Delivery Address</h6>
                                        <Card className="bg-light border-0 rounded-4 p-3 h-100">
                                            <p className="fw-bold mb-1 text-dark">{selectedOrder.userId.name || 'Customer'}</p>
                                            <p className="text-muted small mb-2">{selectedOrder.address}</p>
                                            <p className="fw-bold small mb-0"><FaPhone size={12} className="me-2" /> {selectedOrder.contact || 'N/A'}</p>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <h6 className="fw-black text-uppercase small letter-spacing-1 text-danger mb-3">Payment Info</h6>
                                        <Card className="bg-light border-0 rounded-4 p-3 h-100">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted small fw-bold">Method:</span>
                                                <span className="fw-bold">{selectedOrder.paymentMethod}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted small fw-bold">Status:</span>
                                                <Badge bg={selectedOrder.paymentStatus === 'Completed' ? 'success' : 'warning'} className="rounded-pill px-2">
                                                    {selectedOrder.paymentStatus}
                                                </Badge>
                                            </div>
                                            <div className="d-flex justify-content-between mt-auto pt-2 border-top">
                                                <span className="text-muted small fw-bold">Total Paid:</span>
                                                <span className="fw-black text-danger fs-5">₹{selectedOrder.totalPrice?.toLocaleString()}</span>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>

                                <h6 className="fw-black text-uppercase small letter-spacing-1 text-danger mb-3">Order Items</h6>
                                <div className="rounded-4 border overflow-hidden">
                                    <div className="p-3 bg-light d-flex align-items-center gap-3">
                                        <div style={{ width: '80px', height: '80px' }} className="rounded-3 overflow-hidden bg-white shadow-sm flex-shrink-0">
                                            <Image 
                                                src={selectedOrder.productId?.image?.startsWith('http') ? selectedOrder.productId.image : `${BASE_URL}${selectedOrder.productId?.image}`} 
                                                className="w-100 h-100 object-fit-cover" 
                                            />
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="fw-black mb-1 text-dark">{selectedOrder.productName}</h6>
                                            <p className="text-muted small mb-0">{selectedOrder.brandName} • Size: {selectedOrder.selectedSize || 'N/A'} • Qty: {selectedOrder.quantity}</p>
                                        </div>
                                        <div className="text-end">
                                            <p className="fw-black text-dark mb-0">₹{selectedOrder.totalPrice?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0">
                        <Button variant="dark" className="rounded-pill px-5 fw-bold" onClick={() => setShowModal(false)}>CLOSE</Button>
                    </Modal.Footer>
                </Modal>

                {/* 8. Recommended Products */}
                {recommended.length > 0 && (
                    <div className="mt-5 pt-5 fade-in-up">
                        <div className="text-center mb-5">
                            <h6 className="text-danger text-uppercase fw-bold letter-spacing-2 mb-2">Picked For You</h6>
                            <h2 className="display-6 fw-black text-dark">Recommended For You</h2>
                        </div>
                        <Row className="g-4">
                            {recommended.map((product) => (
                                <Col lg={3} md={6} key={product._id}>
                                    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-lift p-2">
                                        <div className="overflow-hidden rounded-4" style={{ height: '220px' }}>
                                            <Card.Img 
                                                variant="top" 
                                                src={product.image?.startsWith('http') ? product.image : `${BASE_URL}${product.image}`} 
                                                className="w-100 h-100 object-fit-cover transition-transform" 
                                            />
                                        </div>
                                        <Card.Body className="p-3 text-center">
                                            <h6 className="fw-black mb-2 text-truncate">{product.name}</h6>
                                            <p className="text-danger fw-black mb-3 fs-5">₹{product.price?.toLocaleString()}</p>
                                            <Button variant="danger" size="sm" className="rounded-pill px-4 fw-bold text-uppercase py-2" as={Link} to={`/product/${product._id}`}>
                                                Add to Cart
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}
            </Container>
            </div>
        </UserLayout>
    );
};

export default UserDashboard;
