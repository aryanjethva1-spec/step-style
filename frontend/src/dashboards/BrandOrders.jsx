import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Badge, Button, InputGroup, Form, Alert, Modal, Row, Col, ListGroup } from 'react-bootstrap';
import { FaClipboardList, FaSearch, FaCheck, FaTruck, FaTimes, FaInbox, FaBoxOpen, FaEye, FaUser, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import BrandLayout from './BrandLayout';

const BrandOrders = () => {
    const { brand, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    useEffect(() => {
        if (!authLoading && !brand) {
            navigate('/');
        }
        if (!authLoading && brand) {
            fetchOrders();
        }
    }, [brand, authLoading, navigate]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/brand/orders/${brand._id}`);
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching brand orders', error);
        }
        setLoading(false);
    };

    const updateStatus = async (orderId, status) => {
        try {
            await api.put(`/brand/orders/update/${orderId}`, { orderStatus: status });
            setStatusMsg({ type: 'success', text: `Order ${status.toLowerCase()} successfully.` });
            fetchOrders();
        } catch (error) {
            const msg = error.response?.data?.message || 'Error updating order';
            setStatusMsg({ type: 'danger', text: msg });
        }
        setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
    };

    const filteredOrders = orders.filter(o => 
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.userId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <Badge bg="warning" className="bg-opacity-10 text-warning border border-warning border-opacity-25 rounded-pill px-3 py-2 fw-semibold">PENDING</Badge>;
            case 'Approved': return <Badge bg="info" className="bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill px-3 py-2 fw-semibold">APPROVED</Badge>;
            case 'Shipped': return <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3 py-2 fw-semibold">SHIPPED</Badge>;
            case 'Delivered': return <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-3 py-2 fw-semibold">DELIVERED</Badge>;
            case 'Cancelled': return <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill px-3 py-2 fw-semibold">CANCELLED</Badge>;
            default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">{status}</Badge>;
        }
    };

    return (
        <BrandLayout title="Brand Orders">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <Card.Header className="bg-white border-0 p-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <h5 className="fw-bold mb-0 d-flex align-items-center">
                            <FaInbox className="text-danger me-2" />
                            Incoming Orders <span className="ms-2 badge bg-light text-dark fw-normal" style={{ fontSize: '0.7rem' }}>{filteredOrders.length} Total Sales</span>
                        </h5>
                        <InputGroup className="max-width-md shadow-sm rounded-pill" style={{ maxWidth: '400px' }}>
                            <InputGroup.Text className="bg-white border-0 ps-3">
                                <FaSearch className="text-muted" />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Order ID, product or customer..."
                                className="border-0 shadow-none ps-1 py-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </div>
                    {statusMsg.text && (
                        <Alert
                            variant={statusMsg.type}
                            className="mx-4 mb-0 mt-3 rounded-3 border-0 small fw-semibold d-flex align-items-center gap-2"
                            onClose={() => setStatusMsg({ type: '', text: '' })}
                            dismissible
                        >
                            {statusMsg.type === 'success' ? <FaCheck /> : <FaTimes />} {statusMsg.text}
                        </Alert>
                    )}
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0 text-muted small text-uppercase">Order ID</th>
                                <th className="py-3 border-0 text-muted small text-uppercase">Customer</th>
                                <th className="py-3 border-0 text-muted small text-uppercase">Product</th>
                                <th className="py-3 border-0 text-muted small text-uppercase text-center">Qty</th>
                                <th className="py-3 border-0 text-muted small text-uppercase text-center">Amount</th>
                                <th className="py-3 border-0 text-muted small text-uppercase text-center">Status</th>
                                <th className="px-4 py-3 border-0 text-muted small text-uppercase text-end">Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="spinner-border text-danger"></div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <p className="text-muted mb-0">No specific brand orders found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order._id} className="transition-all hover-bg-light">
                                        <td className="px-4">
                                            <div className="small fw-bold text-muted text-uppercase">#{order._id.substring(order._id.length - 8)}</div>
                                            <div className="small text-muted">{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-dark">{order.userId?.name || 'Unknown'}</div>
                                            <div className="small text-muted">{order.userId?.email || '--'}</div>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-danger">{order.productName}</div>
                                            <div className="small text-muted">Size: {order.selectedSize || '—'}</div>
                                        </td>
                                        <td className="text-center">
                                            <span className="fw-bold">{order.quantity}</span>
                                            <div className="small text-muted">units</div>
                                        </td>
                                        <td className="text-center fw-bold text-dark">₹{order.totalPrice.toLocaleString()}</td>
                                        <td className="text-center">
                                            {getStatusBadge(order.orderStatus)}
                                        </td>
                                        <td className="px-4 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button 
                                                    className="btn-lax-view"
                                                    onClick={() => handleViewOrder(order)}
                                                >
                                                    <FaEye size={12} /> View
                                                </Button>

                                                {order.orderStatus === 'Pending' && (
                                                    <>
                                                        <Button 
                                                            variant="success" 
                                                            size="sm" 
                                                            className="rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
                                                            onClick={() => updateStatus(order._id, 'Approved')}
                                                        >
                                                            <FaCheck size={10} /> Approve
                                                        </Button>
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm" 
                                                            className="rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
                                                            onClick={() => updateStatus(order._id, 'Cancelled')}
                                                        >
                                                            <FaTimes size={10} />
                                                        </Button>
                                                    </>
                                                )}
                                                {order.orderStatus === 'Approved' && (
                                                    <Button 
                                                        variant="dark" 
                                                        size="sm" 
                                                        className="rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
                                                        onClick={() => updateStatus(order._id, 'Shipped')}
                                                    >
                                                        <FaTruck size={10} /> Mark Shipped
                                                    </Button>
                                                )}
                                                {order.orderStatus === 'Shipped' && (
                                                    <Button 
                                                        variant="success" 
                                                        size="sm" 
                                                        className="rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
                                                        onClick={() => updateStatus(order._id, 'Delivered')}
                                                    >
                                                        <FaCheck size={10} /> Mark Delivered
                                                    </Button>
                                                )}
                                                {order.orderStatus === 'Delivered' && (
                                                    <Badge bg="success" className="bg-opacity-10 text-success px-3 py-2 rounded-pill">COMPLETED</Badge>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Order Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="order-detail-modal">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-black text-uppercase letter-spacing-1">
                        Order Details <small className="text-muted ms-2 fw-normal" style={{ fontSize: '0.9rem' }}>#{selectedOrder?._id}</small>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedOrder && (
                        <Row className="g-4">
                            <Col md={7}>
                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase text-danger small mb-3 letter-spacing-1 d-flex align-items-center">
                                        <FaBoxOpen className="me-2" /> Product Information
                                    </h6>
                                    <Card className="border-0 bg-light rounded-4 overflow-hidden">
                                        <Card.Body className="p-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h5 className="fw-black mb-1">{selectedOrder.productName}</h5>
                                                    <p className="text-muted mb-0 small">Brand: {selectedOrder.brandName}</p>
                                                    <p className="text-muted mb-0 small">Size: {selectedOrder.selectedSize || 'N/A'}</p>
                                                </div>
                                                <div className="text-end">
                                                    <div className="fw-black fs-4 text-danger">₹{selectedOrder.totalPrice.toLocaleString()}</div>
                                                    <div className="small text-muted">{selectedOrder.quantity} Unit(s)</div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>

                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase text-danger small mb-3 letter-spacing-1 d-flex align-items-center">
                                        <FaUser className="me-2" /> Customer Details
                                    </h6>
                                    <ListGroup variant="flush" className="rounded-4 border overflow-hidden">
                                        <ListGroup.Item className="d-flex justify-content-between py-3">
                                            <span className="text-muted small fw-bold text-uppercase">Name</span>
                                            <span className="fw-bold">{selectedOrder.userId?.name || 'Unknown'}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between py-3">
                                            <span className="text-muted small fw-bold text-uppercase">Email</span>
                                            <span className="fw-bold">{selectedOrder.userId?.email || '--'}</span>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="d-flex justify-content-between py-3">
                                            <span className="text-muted small fw-bold text-uppercase">User ID</span>
                                            <span className="small text-muted">#{selectedOrder.userId?._id || 'N/A'}</span>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </div>
                            </Col>

                            <Col md={5}>
                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase text-danger small mb-3 letter-spacing-1 d-flex align-items-center">
                                        <FaMapMarkerAlt className="me-2" /> Delivery Address
                                    </h6>
                                    <Card className="border-0 bg-light rounded-4">
                                        <Card.Body className="p-3">
                                            <p className="mb-0 fw-semibold text-dark" style={{ lineHeight: '1.6' }}>
                                                {selectedOrder.address || 'Address not provided'}
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </div>

                                <div className="mb-4">
                                    <h6 className="fw-bold text-uppercase text-danger small mb-3 letter-spacing-1 d-flex align-items-center">
                                        <FaCreditCard className="me-2" /> Payment & Status
                                    </h6>
                                    <div className="bg-white border rounded-4 p-3 shadow-sm">
                                        <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                            <span className="text-muted small fw-bold text-uppercase">Method</span>
                                            <Badge bg="dark" className="rounded-pill px-3">{selectedOrder.paymentMethod}</Badge>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                            <span className="text-muted small fw-bold text-uppercase">Payment State</span>
                                            <span className={`fw-bold ${selectedOrder.paymentStatus === 'Completed' ? 'text-success' : 'text-warning'}`}>
                                                {selectedOrder.paymentStatus}
                                            </span>
                                        </div>

                                        <div className="bg-light p-3 rounded-3 mt-4">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted small fw-bold">Base Total:</span>
                                                <span className="fw-bold">₹{(selectedOrder.totalPrice + (selectedOrder.discountAmount || 0)).toLocaleString()}</span>
                                            </div>
                                            {selectedOrder.discountAmount > 0 && (
                                                <div className="d-flex justify-content-between mb-2 text-danger">
                                                    <span className="small fw-bold">Discount Applied:</span>
                                                    <span className="fw-bold">- ₹{selectedOrder.discountAmount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="d-flex justify-content-between border-top pt-2 mt-2">
                                                <span className="text-dark fw-black">Final Amount:</span>
                                                <span className="fw-black text-danger fs-5">₹{selectedOrder.totalPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="text-muted small fw-bold text-uppercase">Order Status</span>
                                            {getStatusBadge(selectedOrder.orderStatus)}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-muted small text-end mt-2">
                                    Ordered on: {new Date(selectedOrder.createdAt).toLocaleString()}
                                </div>
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="dark" className="rounded-pill px-4 fw-bold" onClick={() => setShowModal(false)}>
                        Close Details
                    </Button>
                </Modal.Footer>
            </Modal>

            <style>{`
                .hover-bg-light:hover { background-color: rgba(0,0,0,0.01); }
                .transition-all { transition: all 0.2s ease; }
                .fw-black { font-weight: 900; }
                .letter-spacing-1 { letter-spacing: 1px; }
                .order-detail-modal .modal-content { border-radius: 20px; border: none; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                .order-detail-modal .modal-header { padding: 1.5rem 1.5rem 0; }
                .order-detail-modal .modal-body { padding: 1.5rem; }
            `}</style>
        </BrandLayout>
    );
};

export default BrandOrders;
