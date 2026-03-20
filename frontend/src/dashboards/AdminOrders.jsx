import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Badge, Row, Col, ListGroup, Button, Modal } from 'react-bootstrap';
import { FaEye, FaBoxOpen, FaUser, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import AdminLayout from './AdminLayout';

const AdminOrders = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/');
            } else {
                fetchOrders();
            }
        }
    }, [user, authLoading, navigate]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/orders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders', error);
        }
        setLoading(false);
    };

    if (authLoading || loading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;

    // Group orders by brand
    const groupedOrders = orders.reduce((groups, order) => {
        const brand = order.brandName || 'Unknown Brand';
        if (!groups[brand]) {
            groups[brand] = [];
        }
        groups[brand].push(order);
        return groups;
    }, {});

    return (
        <AdminLayout title="Global Orders Master list">
            <div className="mb-5">
                <p className="text-muted">Viewing all platform orders grouped by brand partner.</p>
            </div>

            {Object.keys(groupedOrders).length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                    <h4 className="text-muted">No orders found on the platform.</h4>
                </div>
            ) : (
                <div className="orders-brand-wise">
                    {Object.entries(groupedOrders).map(([brandName, brandOrders]) => (
                        <Card key={brandName} className="border-0 shadow-sm rounded-4 mb-5 overflow-hidden">
                            <Card.Header className="bg-dark text-white py-3 px-4 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold">{brandName}</h5>
                                <Badge bg="danger" pill className="px-3 py-2">{brandOrders.length} {brandOrders.length === 1 ? 'Order' : 'Orders'}</Badge>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Table hover responsive className="mb-0 align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="px-4 py-3">Order ID</th>
                                            <th className="py-3">Customer</th>
                                            <th className="py-3">Product</th>
                                            <th className="py-3 text-center">Qty</th>
                                            <th className="py-3 text-end">Total Price</th>
                                            <th className="py-3 text-center">Payment</th>
                                            <th className="px-4 py-3 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {brandOrders.map(order => (
                                            <tr key={order._id}>
                                                <td className="px-4 text-muted small">...{order._id.substring(order._id.length - 6)}</td>
                                                <td>
                                                    <div className="fw-semibold">{order.userId?.name || 'Unknown User'}</div>
                                                    <small className="text-muted">{order.userId?.email}</small>
                                                </td>
                                                <td>
                                                    <div className="fw-semibold">{order.productName}</div>
                                                    <small className="text-muted">Size: {order.selectedSize || 'N/A'}</small>
                                                </td>
                                                <td className="text-center fw-bold">{order.quantity}</td>
                                                <td className="text-end fw-bold text-danger">₹{order.totalPrice.toFixed(2)}</td>
                                                <td className="text-center">
                                                    <div className="small fw-bold">{order.paymentMethod}</div>
                                                    <Badge bg={order.paymentStatus === 'Completed' ? 'success' : 'warning'} className="rounded-pill px-2 py-1 text-uppercase" style={{ fontSize: '10px' }}>
                                                        {order.paymentStatus}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 text-center">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        <Button 
                                                            className="btn-lax-view"
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                setShowModal(true);
                                                            }}
                                                        >
                                                            <FaEye size={12} /> View
                                                        </Button>
                                                        <Badge bg={
                                                            order.orderStatus === 'Pending' ? 'warning' :
                                                            order.orderStatus === 'Approved' ? 'dark' :
                                                            order.orderStatus === 'Shipped' ? 'secondary' :
                                                            order.orderStatus === 'Delivered' ? 'success' : 'danger'
                                                        } className="rounded-pill px-3 py-2 text-uppercase small">
                                                            {order.orderStatus}
                                                        </Badge>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-light fw-bold border-top">
                                        <tr>
                                            <td colSpan="5" className="text-end px-4 py-3">Brand Total Revenue:</td>
                                            <td className="text-end px-4 py-3 text-danger">
                                                ₹{brandOrders.reduce((sum, o) => sum + o.totalPrice, 0).toFixed(2)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </Table>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
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
                .fw-black { font-weight: 900; }
                .letter-spacing-1 { letter-spacing: 1px; }
                .order-detail-modal .modal-content { border-radius: 20px; border: none; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                .order-detail-modal .modal-header { padding: 1.5rem 1.5rem 0; }
                .order-detail-modal .modal-body { padding: 1.5rem; }
            `}</style>
        </AdminLayout>
    );
};

export default AdminOrders;
