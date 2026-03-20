import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Breadcrumb, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaTrash, FaShoppingCart, FaHeart, FaStar, 
    FaArrowRight, FaShoppingBag, FaSearch, FaEye 
} from 'react-icons/fa';
import { WishlistContext } from '../context/WishlistContext';
import api, { BASE_URL } from '../services/api';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useContext(WishlistContext);
    const navigate = useNavigate();
    const [recommended, setRecommended] = useState([]);

    const products = wishlist.products || [];

    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const { data } = await api.get('/products');
                // Just take 4 random products for recommendation
                const shuffled = (data.products || []).sort(() => 0.5 - Math.random());
                setRecommended(shuffled.slice(0, 4));
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };
        fetchRecommended();
    }, []);

    // Removed handleAddToCart function as per requirement

    return (
        <div className="bg-light pb-5">
            {/* 2. Page Header / Hero Section */}
            <div className="position-relative text-white py-5 mb-5" style={{ 
                background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1920&q=80") center/cover no-repeat',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Container className="text-center fade-in-up">
                    <h1 className="display-4 fw-black text-uppercase letter-spacing-2 mb-3">My Wishlist</h1>
                    <p className="lead fw-light opacity-75">Save your favorite footwear and shop later</p>
                </Container>
            </div>

            {/* 3. Wishlist Products Section */}
            <Container className="mb-5">
                {products.length === 0 ? (
                    /* 4. Empty Wishlist State */
                    <div className="bg-white p-5 rounded-4 shadow-sm text-center my-5 fade-in-up">
                        <div className="mb-4">
                            <FaHeart className="text-danger opacity-25 animate-heart-beat" size={100} />
                        </div>
                        <h2 className="fw-black text-dark mb-3">Your wishlist is empty</h2>
                        <p className="text-muted mb-4 lead">Seems like you haven't found anything you love yet. Start exploring our latest collection!</p>
                        <Button 
                            variant="danger" 
                            size="lg"
                            className="rounded-pill px-5 py-3 text-uppercase fw-bold shadow-sm hover-scale" 
                            onClick={() => navigate('/shop')}
                        >
                            <FaSearch className="me-2" /> Explore Products
                        </Button>
                    </div>
                ) : (
                    <Row className="g-4">
                        {products.map((item, idx) => {
                            const product = item.productId;
                            if (!product) return null;
                            
                            const imageUrl = product.image?.startsWith('http') ? product.image : `${BASE_URL}${product.image}`;
                            
                            return (
                                <Col lg={3} md={4} sm={6} key={product._id} className="fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <Card className="h-100 shadow-sm border-0 product-card-hover rounded-4 overflow-hidden position-relative">
                                        {/* Remove Button */}
                                        <div className="position-absolute top-0 end-0 m-3 z-index-10">
                                            <Button 
                                                variant="white" 
                                                className="rounded-circle shadow-sm p-2 text-danger action-btn"
                                                onClick={() => removeFromWishlist(product._id)}
                                                title="Remove"
                                            >
                                                <FaTrash size={14} />
                                            </Button>
                                        </div>

                                        <div className="overflow-hidden bg-light" style={{ height: '240px' }}>
                                            <Link to={`/product/${product._id}`}>
                                                <Card.Img 
                                                    variant="top" 
                                                    src={imageUrl} 
                                                    className="w-100 h-100 object-fit-cover transition-transform" 
                                                />
                                            </Link>
                                        </div>

                                        <Card.Body className="d-flex flex-column p-4">
                                            <div className="mb-2 d-flex justify-content-between align-items-center">
                                                <Badge bg="danger" className="text-uppercase fw-bold p-1 px-2" style={{ fontSize: '0.65rem' }}>{product.brandName}</Badge>
                                                <div className="text-warning small">
                                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="opacity-25" />
                                                </div>
                                            </div>
                                            <Link to={`/product/${product._id}`} className="text-decoration-none">
                                                <h6 className="fw-black text-dark text-truncate mb-1">{product.name}</h6>
                                            </Link>
                                            <div className="d-flex align-items-center mb-3">
                                                <h5 className="text-danger fw-black mb-0">₹{product.price?.toLocaleString()}</h5>
                                                {product.oldPrice && (
                                                    <small className="text-muted text-decoration-line-through ms-2">₹{product.oldPrice?.toLocaleString()}</small>
                                                )}
                                            </div>
                                            
                                            <Button 
                                                variant="dark" 
                                                className="w-100 mt-auto rounded-pill fw-bold text-uppercase d-flex align-items-center justify-content-center py-2 shadow-sm button-hover-scale"
                                                as={Link}
                                                to={`/product/${product._id}`}
                                            >
                                                <FaEye className="me-2" /> View Product
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>

            {/* 6. Recommended Products Section */}
            {recommended.length > 0 && (
                <Container className="py-5">
                    <div className="text-center mb-5">
                        <h6 className="text-danger text-uppercase fw-bold letter-spacing-2 mb-2">Picked For You</h6>
                        <h2 className="display-6 fw-black text-dark">Recommended For You</h2>
                    </div>
                    <Row className="g-4">
                        {recommended.map((product) => (
                            <Col lg={3} md={6} key={product._id}>
                                <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-lift">
                                    <div className="overflow-hidden" style={{ height: '200px' }}>
                                        <Card.Img 
                                            variant="top" 
                                            src={product.image?.startsWith('http') ? product.image : `${BASE_URL}${product.image}`} 
                                            className="w-100 h-100 object-fit-cover" 
                                        />
                                    </div>
                                    <Card.Body className="p-3 text-center">
                                        <h6 className="fw-bold mb-2 text-truncate">{product.name}</h6>
                                        <p className="text-danger fw-black mb-3">₹{product.price?.toLocaleString()}</p>
                                        <Button 
                                            className="btn-lax-view" 
                                            as={Link} 
                                            to={`/product/${product._id}`}
                                        >
                                            <FaEye size={12} /> View Details
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            )}

            {/* 7. Promotional Banner */}
            <div className="py-5 mb-5">
                <Container>
                    <div className="bg-dark text-white p-5 rounded-4 shadow-lg position-relative overflow-hidden" 
                        style={{ background: 'linear-gradient(45deg, #000, #333)' }}>
                        <Row className="align-items-center position-relative z-index-10">
                            <Col md={8}>
                                <h1 className="display-4 fw-black mb-2 text-uppercase">Get 20% OFF</h1>
                                <p className="lead mb-4 opacity-75">On your next purchase. Use code: <span className="text-danger fw-bold">STEP20</span></p>
                                <Button variant="danger" size="lg" className="rounded-pill px-5 py-3 fw-bold text-uppercase hover-bg-white" as={Link} to="/shop">
                                    Shop Now <FaArrowRight className="ms-2" />
                                </Button>
                            </Col>
                            <Col md={4} className="text-end d-none d-md-block">
                                <FaShoppingBag size={150} className="opacity-10 rotate-12" />
                            </Col>
                        </Row>
                        {/* Decorative circle */}
                        <div className="position-absolute top-0 end-0 bg-danger opacity-10 rounded-circle" style={{ width: '400px', height: '400px', marginRight: '-200px', marginTop: '-200px' }}></div>
                    </div>
                </Container>
            </div>

            <style jsx="true">{`
                .fw-black { font-weight: 900; }
                .letter-spacing-2 { letter-spacing: 2px; }
                .z-index-10 { z-index: 10; }
                .rotate-12 { transform: rotate(-12deg); }
                
                .product-card-hover { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
                .product-card-hover:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
                .product-card-hover:hover .transition-transform { transform: scale(1.1); }
                
                .action-btn { transition: all 0.2s; opacity: 0; transform: translateX(10px); }
                .product-card-hover:hover .action-btn { opacity: 1; transform: translateX(0); }
                .action-btn:hover { background: #dc3545 !important; color: white !important; }

                .hover-scale:hover { transform: scale(1.05); }
                .hover-lift:hover { transform: translateY(-5px); }
                .hover-bg-white:hover { background-color: white !important; color: #dc3545 !important; border-color: white !important; }

                .breadcrumb-light .breadcrumb-item + .breadcrumb-item::before { color: rgba(255,255,255,0.3); }
                
                .animate-heart-beat { animation: heartBeat 2s infinite; }
                @keyframes heartBeat {
                    0% { transform: scale(1); }
                    14% { transform: scale(1.1); }
                    28% { transform: scale(1); }
                    42% { transform: scale(1.1); }
                    70% { transform: scale(1); }
                }

                .fade-in-up { animation: fadeInUp 0.8s ease-out both; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Wishlist;
