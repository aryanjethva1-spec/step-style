import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Image, Card, Alert, Table, Form, InputGroup, Breadcrumb, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaTrash, FaArrowLeft, FaBan, FaMinus, FaPlus, 
    FaLock, FaTruck, FaUndo, FaTag, FaShoppingBag, FaArrowRight 
} from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api, { BASE_URL } from '../services/api';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, discount: discountAmount, discountPercent, applyDiscount } = useContext(CartContext);
    const { user, brand } = useContext(AuthContext);
    const navigate = useNavigate();
    const [recommended, setRecommended] = useState([]);
    const [promoCode, setPromoCode] = useState('');
    const [promoError, setPromoError] = useState('');
    const promoApplied = discountPercent > 0;

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const { data } = await api.get('/products');
                const shuffled = (data.products || []).sort(() => 0.5 - Math.random());
                setRecommended(shuffled.slice(0, 4));
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };
        fetchRecommended();
    }, []);

    const handleQuantityChange = (productId, currentQty, delta, size) => {
        const newQty = currentQty + delta;
        if (newQty >= 1) {
            updateQuantity(productId, newQty, size);
        }
    };

    const checkoutHandler = () => {
        if (!user) {
            navigate('/login?redirect=/checkout');
        } else {
            navigate('/checkout');
        }
    };

    const handleApplyPromo = () => {
        if (promoCode.trim().toUpperCase() === 'LAX123') {
            if (!promoApplied) {
                // Generate a random discount percentage between 10% and 30%
                const randomPercent = Math.floor(Math.random() * 21) + 10;
                applyDiscount(randomPercent);
                setPromoError('');
            } else {
                setPromoError('Promo code already applied');
            }
        } else {
            setPromoError('Invalid promo code');
            applyDiscount(0);
        }
    };

    const calculateSubtotal = () => cart.totalPrice || 0;
    const shipping = 0; 
    const subtotal = calculateSubtotal();
    const total = Math.max(0, subtotal + shipping - discountAmount);

    return (
        <div className="bg-light pb-5">
            {/* 2. Page Header / Hero Section */}
            <div className="position-relative text-white py-5 mb-5" style={{ 
                background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1920&q=80") center/cover no-repeat',
                minHeight: '250px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Container className="text-center fade-in-up">
                    <h1 className="display-4 fw-black text-uppercase letter-spacing-2 mb-2">Shopping Cart</h1>
                    <p className="lead fw-light opacity-75">Review your items before checkout</p>
                </Container>
            </div>

            <Container>
                {/* Brand account notice */}
                {brand && (
                    <Alert variant="warning" className="rounded-4 border-0 shadow-sm mb-5 d-flex align-items-center gap-3 p-4">
                        <FaBan className="text-warning fs-3 flex-shrink-0" />
                        <div>
                            <h6 className="fw-bold mb-1 text-dark">Shopping Disabled for Brand Accounts</h6>
                            <p className="mb-0 small opacity-75 text-dark">Brand accounts cannot place orders. Please use a customer account to shop.</p>
                        </div>
                    </Alert>
                )}

                {cart.products && cart.products.length === 0 ? (
                    /* 6. Empty Cart State */
                    <div className="bg-white p-5 rounded-4 shadow-sm text-center my-5 fade-in-up border-bottom border-danger border-4">
                        <div className="mb-4">
                            <FaShoppingBag size={100} className="text-danger opacity-25" />
                        </div>
                        <h2 className="fw-black text-dark mb-3">Your cart is empty</h2>
                        <p className="text-muted mb-4 lead">Looks like you haven't added anything to your cart yet.</p>
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
                    <Row className="g-5">
                        {/* 3. Cart Items Section */}
                        <Col lg={8}>
                            <div className="bg-white rounded-4 shadow-sm overflow-hidden p-0 mb-4 fade-in-left">
                                <div className="d-none d-md-block p-4 bg-dark text-white fw-bold text-uppercase small letter-spacing-1">
                                    <Row className="align-items-center">
                                        <Col md={6}>Product Details</Col>
                                        <Col md={2} className="text-center">Price</Col>
                                        <Col md={2} className="text-center">Quantity</Col>
                                        <Col md={2} className="text-end">Total</Col>
                                    </Row>
                                </div>
                                <div className="p-0">
                                    {cart.products.map((item, idx) => {
                                        const product = item.productId;
                                        const imageUrl = product?.image?.startsWith('http') ? product.image : `${BASE_URL}${product?.image}`;
                                        return (
                                            <div key={`${product?._id}-${item.selectedSize}`} className="p-4 border-bottom product-row transition-all hover-bg-light">
                                                <Row className="align-items-center g-3">
                                                    <Col md={6} xs={12}>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="rounded-3 overflow-hidden bg-light shadow-sm" style={{ width: '80px', minWidth: '80px', height: '80px' }}>
                                                                <Image src={imageUrl} className="w-100 h-100 object-fit-cover" />
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <Link to={`/product/${product?._id}`} className="text-decoration-none text-dark">
                                                                    <h6 className="fw-black mb-1 text-truncate">{product?.name || 'Loading...'}</h6>
                                                                </Link>
                                                                <p className="text-danger fw-bold small mb-1">{product?.brandName}</p>
                                                                {item.selectedSize && <Badge bg="light" text="dark" className="border">Size: {item.selectedSize}</Badge>}
                                                                <div className="d-md-none mt-2 d-flex justify-content-between align-items-center">
                                                                    <span className="fw-black">₹{item.price?.toLocaleString()}</span>
                                                                    <Button variant="link" className="text-danger p-0" onClick={() => removeFromCart(product?._id, item.selectedSize)}>
                                                                        <FaTrash />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={2} className="text-center d-none d-md-block">
                                                        <span className="fw-black text-dark">₹{item.price?.toLocaleString()}</span>
                                                    </Col>
                                                    <Col md={2} xs={12} className="text-center">
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <InputGroup className="w-auto shadow-sm rounded-pill overflow-hidden border">
                                                                <Button variant="white" className="border-0 px-2 btn-sm hover-bg-danger hover-text-white" onClick={() => handleQuantityChange(product?._id, item.quantity, -1, item.selectedSize)}>
                                                                    <FaMinus size={10} />
                                                                </Button>
                                                                <Form.Control 
                                                                    readOnly 
                                                                    value={item.quantity} 
                                                                    className="text-center bg-white border-0 px-1 fw-bold" 
                                                                    style={{ width: '40px', fontSize: '0.9rem' }} 
                                                                />
                                                                <Button variant="white" className="border-0 px-2 btn-sm hover-bg-danger hover-text-white" onClick={() => handleQuantityChange(product?._id, item.quantity, 1, item.selectedSize)}>
                                                                    <FaPlus size={10} />
                                                                </Button>
                                                            </InputGroup>
                                                        </div>
                                                    </Col>
                                                    <Col md={2} xs={12} className="text-end d-flex d-md-block justify-content-between align-items-center">
                                                        <span className="d-md-none text-muted small fw-bold">Item Total:</span>
                                                        <div>
                                                            <span className="fw-black text-danger fs-5 d-block">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                            <Button variant="link" className="text-danger d-none d-md-inline-block p-0 mt-1" onClick={() => removeFromCart(product?._id, item.selectedSize)}>
                                                                <small className="fw-bold">Remove</small>
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <Button 
                                variant="outline-dark" 
                                className="rounded-pill px-4 fw-bold text-uppercase transition-all hover-translate-x shadow-sm"
                                onClick={() => navigate('/shop')}
                            >
                                <FaArrowLeft className="me-2" /> Continue Shopping
                            </Button>
                        </Col>

                        {/* 4. Cart Summary Section */}
                        <Col lg={4}>
                            <div className="mb-4 fade-in-right">
                                <Card className="border-0 shadow-lg rounded-4 overflow-hidden mb-4">
                                    <div className="bg-dark text-white p-4">
                                        <h4 className="fw-black mb-0 text-uppercase letter-spacing-1">Order Summary</h4>
                                    </div>
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between mb-3">
                                            <span className="text-muted fw-bold small text-uppercase">Subtotal</span>
                                            <span className="fw-black">₹{calculateSubtotal().toLocaleString()}</span>
                                        </div>
                                        <div className={`d-flex justify-content-between mb-3 ${discountAmount > 0 ? 'text-success' : 'text-muted opacity-50'}`}>
                                            <span className="fw-bold small text-uppercase">Discount {promoApplied && `(LAX123 - ${discountPercent}%)`}</span>
                                            <span className="fw-black">- ₹{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span className="text-muted fw-bold small text-uppercase">Shipping</span>
                                            <span className="fw-black text-success">FREE</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-4">
                                            <span className="text-muted fw-bold small text-uppercase">Estimated Tax</span>
                                            <span className="fw-black">Included</span>
                                        </div>
                                        <hr className="my-4 opacity-10" />
                                        <div className="d-flex justify-content-between mb-4">
                                            <h4 className="fw-black text-dark mb-0">Total</h4>
                                            <h4 className="fw-black text-danger mb-0">₹{total.toLocaleString()}</h4>
                                        </div>

                                        {/* 5. Promo Code Section */}
                                        <div className="mb-4">
                                            <InputGroup className={`bg-light rounded-pill p-1 border shadow-sm group-custom ${promoError ? 'border-danger' : promoApplied ? 'border-success' : ''}`}>
                                                <Form.Control 
                                                    placeholder="Enter Promo Code" 
                                                    className="bg-transparent border-0 rounded-pill px-3 shadow-none fw-bold text-uppercase"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value)}
                                                    disabled={promoApplied}
                                                />
                                                <Button 
                                                    variant={promoApplied ? "success" : "danger"} 
                                                    className="rounded-pill px-4 fw-bold text-uppercase py-2"
                                                    onClick={handleApplyPromo}
                                                >
                                                    {promoApplied ? "Applied" : "Apply"}
                                                </Button>
                                            </InputGroup>
                                            {promoError && <small className="text-danger fw-bold ms-3 mt-1 d-block">{promoError}</small>}
                                            {promoApplied && <small className="text-success fw-bold ms-3 mt-1 d-block">Promo applied!</small>}
                                        </div>

                                        <Button 
                                            variant="dark" 
                                            className="w-100 py-3 rounded-pill fw-black text-uppercase shadow-lg hover-scale mb-3 d-flex align-items-center justify-content-center"
                                            onClick={checkoutHandler}
                                            disabled={brand}
                                        >
                                            Proceed to Checkout <FaArrowRight className="ms-3" />
                                        </Button>
                                        <p className="text-center text-muted small mb-0 px-2 fw-bold">
                                            Taxes and shipping calculated at checkout
                                        </p>
                                    </Card.Body>
                                </Card>

                                {/* 8. Secure Checkout Banner */}
                                <div className="bg-white rounded-4 shadow-sm p-4 d-flex justify-content-around text-center fade-in-up">
                                    <div className="trust-icon">
                                        <FaLock className="text-success mb-2 fs-4" />
                                        <p className="small fw-bold text-muted mb-0">Secure</p>
                                    </div>
                                    <div className="trust-icon">
                                        <FaTruck className="text-primary mb-2 fs-4" />
                                        <p className="small fw-bold text-muted mb-0">Fast Ship</p>
                                    </div>
                                    <div className="trust-icon">
                                        <FaUndo className="text-danger mb-2 fs-4" />
                                        <p className="small fw-bold text-muted mb-0">30d Return</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}
            </Container>

            {/* 7. Recommended Products Section */}
            {recommended.length > 0 && cart.products?.length > 0 && (
                <Container className="py-5 mt-5">
                    <div className="text-center mb-5">
                        <h6 className="text-danger text-uppercase fw-bold letter-spacing-2 mb-2">Picked For You</h6>
                        <h2 className="display-6 fw-black text-dark">You May Also Like</h2>
                    </div>
                    <Row className="g-4">
                        {recommended.map((product) => (
                            <Col lg={3} md={6} key={product._id} className="fade-in-up">
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
                                            View Details
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            )}

            <style>{`
                .fw-black { font-weight: 900; }
                .letter-spacing-1 { letter-spacing: 1px; }
                .letter-spacing-2 { letter-spacing: 2px; }
                
                .product-row { transition: all 0.3s; border-left: 0px solid transparent; }
                .product-row:hover { background-color: #f8f9fa; border-left: 4px solid #dc3545; }
                
                .hover-scale { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
                .hover-scale:hover { transform: scale(1.05); }

                .hover-lift { transition: all 0.3s; }
                .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important; }
                .hover-lift:hover .transition-transform { transform: scale(1.1); }
                
                .hover-translate-x { transition: all 0.3s; }
                .hover-translate-x:hover { transform: translateX(-5px); }

                .hover-bg-danger:hover { background-color: #dc3545 !important; }
                .hover-text-white:hover { color: white !important; }
                
                .group-custom input::placeholder { color: #ccc; font-weight: 400; }
                
                .breadcrumb-light .breadcrumb-item + .breadcrumb-item::before { color: rgba(255,255,255,0.3); }

                .fade-in-up { animation: fadeInUp 0.8s ease-out both; }
                .fade-in-left { animation: fadeInLeft 0.8s ease-out both; }
                .fade-in-right { animation: fadeInRight 0.8s ease-out both; }

                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes fadeInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
            `}</style>
        </div>
    );
};

export default Cart;
