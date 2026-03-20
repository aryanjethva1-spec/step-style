import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup, Image, Modal, Spinner as BSpinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api, { BASE_URL } from '../services/api';

const Checkout = () => {
    const { cart, clearCart, discount, discountPercent } = useContext(CartContext);
    const { user, brand } = useContext(AuthContext);
    const currentUser = user || brand;
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Payment Logic States
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        if (brand) {
            // Brand accounts cannot place orders — redirect them away
            navigate('/shop');
        } else if (!user) {
            navigate('/login');
        } else if (cart.products && cart.products.length === 0) {
            navigate('/cart');
        } else {
            // Pre-fill address from user profile
            setAddress(user.addressLine1 || user.address || '');
            setCity(user.city || '');
            setState(user.state || '');
            setPostalCode(user.pincode || user.postalCode || '');
            setCountry(user.country || 'India');
        }
    }, [user, brand, navigate, cart]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (paymentMethod === 'COD') {
            placeOrderHandler('Pending');
        } else {
            setShowPaymentModal(true);
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayPayment = async () => {
        const res = await loadRazorpay();

        if (!res) {
            setError('Razorpay SDK failed to load. Are you online?');
            return;
        }

        setIsPaying(true);
        try {
            // 1. Create Order on Backend
            const finalAmount = Math.max(0, cart.totalPrice - discount);
            const { data: orderData } = await api.post('/payment/create-order', { amount: finalAmount });

            // 2. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "StepStyle",
                description: "Purchase Payment",
                order_id: orderData.id,
                handler: async (response) => {
                    try {

                        const verifyRes = await api.post('/payment/verify-payment', response);

                        if (verifyRes.data.success) {

                            setPaymentSuccess(true);

                            setTimeout(() => {
                                setShowPaymentModal(false);
                                placeOrderHandler('Completed');
                            }, 1500);

                        }

                    } catch (err) {

                        setError('Payment verification failed');
                        setIsPaying(false);

                    }
                },
                prefill: {
                    name: currentUser?.name || currentUser?.brandName,
                    email: currentUser?.email,
                    contact: currentUser?.contact || currentUser?.phone || ''
                },
                theme: {
                    color: "#dc3545"
                },
                modal: {
                    onhide: () => {
                        setIsPaying(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            setError('Failed to initiate payment');
            setIsPaying(false);
        }
    };

    const placeOrderHandler = async (status) => {
        setLoading(true);
        setError(null);

        try {
            const shippingAddress = `${address}, ${city}, ${state}, ${postalCode}, ${country}`;
            const subtotal = cart.totalPrice || 0;
            const discountFactor = subtotal > 0 ? (subtotal - discount) / subtotal : 1;

            const orderData = {
                orderItems: cart.products.map(item => ({
                    productId: item.productId._id || item.productId,
                    name: item.productId.name || 'Product',
                    quantity: item.quantity,
                    price: item.price * discountFactor, // Apply proportional discount per item
                    brandId: item.brandId,
                    selectedSize: item.selectedSize || '',
                })),
                shippingAddress,
                paymentMethod,
                paymentStatus: status,
                totalPrice: Math.max(0, subtotal - discount),
                discountAmount: discount
            };

            await api.post('/orders', orderData);
            clearCart();
            setLoading(false);
            navigate('/myorders'); // Redirect to user dashboard orders view
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <h2 className="fw-bold mb-4 text-uppercase">Checkout</h2>
            <Row className="g-5">
                <Col md={8}>
                    <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm mb-4">
                        <h4 className="fw-bold mb-4">Shipping Address</h4>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="address">
                                <Form.Label className="small fw-semibold text-uppercase">Address</Form.Label>
                                <Form.Control type="text" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} required className="rounded-pill px-4 py-2" />
                            </Form.Group>

                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="city">
                                        <Form.Label className="small fw-semibold text-uppercase">City</Form.Label>
                                        <Form.Control type="text" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} required className="rounded-pill px-4 py-2" />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="state">
                                        <Form.Label className="small fw-semibold text-uppercase">State</Form.Label>
                                        <Form.Control type="text" placeholder="Enter state" value={state} onChange={(e) => setState(e.target.value)} required className="rounded-pill px-4 py-2" />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3" controlId="postalCode">
                                        <Form.Label className="small fw-semibold text-uppercase">Postal Code</Form.Label>
                                        <Form.Control type="text" placeholder="Enter postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="rounded-pill px-4 py-2" />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-4" controlId="country">
                                <Form.Label className="small fw-semibold text-uppercase">Country</Form.Label>
                                <Form.Control type="text" placeholder="Enter country" value={country} onChange={(e) => setCountry(e.target.value)} required className="rounded-pill px-4 py-2" />
                            </Form.Group>

                            <h4 className="fw-bold my-4">Payment Method</h4>
                            <Form.Group>
                                <Form.Check
                                    type="radio"
                                    label="Cash on Delivery (COD)"
                                    id="cod"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mb-2"
                                />
                                <Form.Check
                                    type="radio"
                                    label="Credit / Debit Card"
                                    id="card"
                                    name="paymentMethod"
                                    value="Card"
                                    checked={paymentMethod === 'Card'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mb-2"
                                />
                                <Form.Check
                                    type="radio"
                                    label="UPI"
                                    id="upi"
                                    name="paymentMethod"
                                    value="UPI"
                                    checked={paymentMethod === 'UPI'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mb-2"
                                />
                            </Form.Group>

                            <Button
                                variant="danger"
                                type="submit"
                                className="w-100 mt-5 py-3 rounded-pill fw-bold text-uppercase shadow"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order' : 'Proceed to Pay'}
                            </Button>
                        </Form>
                    </div>
                </Col>

                <Col md={4}>
                    <Card className="border-0 shadow-sm rounded-4 sticky-top" style={{ top: '100px' }}>
                        <Card.Header className="bg-light border-bottom-0 py-3">
                            <h5 className="fw-bold mb-0">Order Summary</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ListGroup variant="flush">
                                {cart.products.map(item => (
                                    <ListGroup.Item key={item.productId._id || item.productId} className="py-3 px-4 border-bottom">
                                        <Row className="align-items-center">
                                            <Col xs={3}>
                                                <Image src={item.productId.image?.startsWith('http') ? item.productId.image : `${BASE_URL}${item.productId.image}`} fluid rounded />
                                            </Col>
                                            <Col xs={6}>
                                                <div className="fw-semibold text-truncate small">{item.productId.name || 'Product'}</div>
                                                <div className="text-muted small">Qty: {item.quantity}</div>
                                            </Col>
                                            <Col xs={3} className="text-end fw-bold small">
                                                ₹{(item.price * item.quantity).toFixed(2)}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <div className="p-4 bg-light">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Subtotal:</span>
                                    <span className="fw-semibold">₹{cart.totalPrice?.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="d-flex justify-content-between mb-2 text-success">
                                        <span className="fw-bold fs-7">Discount ({discountPercent}%):</span>
                                        <span className="fw-bold fs-7">- ₹{discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                                    <span className="text-muted">Shipping:</span>
                                    <span className="text-success fw-semibold">Free</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="fw-bold fs-5">Total:</span>
                                    <span className="fw-bold fs-5 text-danger">₹{Math.max(0, cart.totalPrice - discount).toFixed(2)}</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Mock Payment Modal */}
            <Modal
                show={showPaymentModal}
                onHide={() => !isPaying && setShowPaymentModal(false)}
                centered
                backdrop="static"
                className="payment-modal"
            >
                <Modal.Body className="p-5 text-center">
                    {!paymentSuccess ? (
                        <>
                            <div className="mb-4">
                                {paymentMethod === 'Card' ? (
                                    <h1 className="display-4 text-primary"><i className="bi bi-credit-card"></i></h1>
                                ) : (
                                    <h1 className="display-4 text-info"><i className="bi bi-qr-code-scan"></i></h1>
                                )}
                            </div>
                            <h4 className="fw-bold mb-3">{paymentMethod} Payment</h4>
                            <p className="text-muted mb-4">You are paying <span className="fw-bold text-dark">₹{Math.max(0, cart.totalPrice - discount).toFixed(2)}</span></p>

                            {isPaying ? (
                                <div className="py-4">
                                    <BSpinner animation="border" variant="danger" className="mb-3" />
                                    <p className="fw-semibold text-danger">Processing Transaction...</p>
                                </div>
                            ) : (
                                <div className="d-grid gap-2">
                                    <Button variant="danger" size="lg" className="rounded-pill fw-bold" onClick={handleRazorpayPayment}>
                                        PAY NOW
                                    </Button>
                                    <Button variant="link" className="text-muted text-decoration-none" onClick={() => setShowPaymentModal(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-4">
                            <div className="mb-4 text-success">
                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                </svg>
                            </div>
                            <h3 className="fw-bold text-success mb-2">Payment Successful!</h3>
                            <p className="text-muted">Redirecting to your orders...</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Checkout;
