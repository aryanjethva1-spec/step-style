import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaStar, FaArrowLeft, FaHeart, FaTrash } from 'react-icons/fa';
import api, { BASE_URL } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { user, brand } = useContext(AuthContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
    
    const [product, setProduct] = useState({});
    const [qty, setQty] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                const { data: reviewsData } = await api.get(`/products/${id}/reviews`);
                setReviews(reviewsData);
            } catch (error) {
                console.error('Error fetching product', error);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const addToCartHandler = async () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        const success = await addToCart(product._id, qty, product.price, product.brandId, selectedSize);
        if (success) {
            alert('Added to cart!'); // Replace with toast later
        } else {
            if (!user && !brand) {
                alert('Please login to add items to cart');
                navigate(`/login?redirect=/product/${id}`);
            } else {
                alert('Failed to add to cart. Please try again.');
            }
        }
    };

    const currentInWishlist = product ? (isInWishlist && isInWishlist(product._id)) : false;

    const toggleWishlist = async () => {
        if (!user) {
            alert('Please login to use wishlist');
            navigate('/login');
            return;
        }
        
        if (currentInWishlist) {
            await removeFromWishlist(product._id);
        } else {
            const success = await addToWishlist(product._id);
            if (success) {
                alert('Added to wishlist!');
            } else {
                alert('Could not add to wishlist.');
            }
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!rating) {
            alert('Please select a rating');
            return;
        }
        setReviewLoading(true);
        try {
            await api.post(`/products/${id}/reviews`, {
                rating: Number(rating),
                comment,
                name,
                email,
            });
            alert('Review submitted successfully!');
            setRating('');
            setComment('');
            setName('');
            setEmail('');
            // Refetch product immediately to see the updated changes
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
            const { data: reviewsData } = await api.get(`/products/${id}/reviews`);
            setReviews(reviewsData);
        } catch (error) {
            alert(error.response && error.response.data.message ? error.response.data.message : 'Error submitting review');
        }
        setReviewLoading(false);
    };

    const adminDeleteReviewHandler = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review? (Admin Action)')) {
            setReviewLoading(true);
            try {
                await api.delete(`/admin/reviews/${reviewId}`);
                alert('Review deleted successfully!');
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                const { data: reviewsData } = await api.get(`/products/${id}/reviews`);
                setReviews(reviewsData);
            } catch (error) {
                alert(error.response && error.response.data.message ? error.response.data.message : 'Error deleting review');
            }
            setReviewLoading(false);
        }
    };

    const deleteReviewHandler = async () => {
        if (window.confirm('Are you sure you want to delete your review?')) {
            setReviewLoading(true);
            try {
                await api.delete(`/products/${id}/reviews`);
                alert('Review deleted successfully!');
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                const { data: reviewsData } = await api.get(`/products/${id}/reviews`);
                setReviews(reviewsData);
            } catch (error) {
                alert(error.response && error.response.data.message ? error.response.data.message : 'Error deleting review');
            }
            setReviewLoading(false);
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;

    return (
        <Container className="py-5">
            <Link className="btn btn-light mb-4 text-decoration-none rounded-pill shadow-sm" to="/shop">
               <FaArrowLeft className="me-2"/> Back to Shop
            </Link>

            <Row className="g-5">
                {/* Product Image */}
                <Col md={6}>
                    <div className="bg-white rounded-4 shadow-sm p-4 d-flex justify-content-center align-items-center mb-3" style={{ height: '500px' }}>
                        <img src={product.image?.startsWith('http') ? product.image : `${BASE_URL}${product.image}`} alt={product.name} className="img-fluid rounded" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                    </div>
                </Col>

                {/* Product Info */}
                <Col md={6}>
                    <Badge bg="danger" className="mb-2 text-uppercase">{product.category}</Badge>
                    <h2 className="fw-bold mb-1">{product.name}</h2>
                    <p className="text-muted text-uppercase mb-3 fw-semibold">by {product.brandName}</p>

                    <div className="d-flex align-items-center mb-4">
                        <div className="text-warning me-2">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < (product.rating || 4) ? '' : 'text-muted'} />
                            ))}
                        </div>
                        <span className="text-muted small">({reviews.length} Reviews)</span>
                    </div>

                    <h3 className="fw-bold text-danger mb-4">₹{product.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>

                    <p className="text-secondary lh-lg mb-4">{product.description}</p>

                    {/* Stock & Size Selection */}
                    {product.stock > 0 ? (
                        <>
                            {user?.role === 'admin' || brand ? (
                                <div className="alert alert-info py-3 text-center rounded-pill">
                                    <FaShoppingCart className="me-2" />
                                    <strong>{brand ? 'Brand View: Shopping Disabled' : 'Admin View: Shopping Disabled'}</strong>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3">Select Size</h6>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {product.sizes?.map((size, index) => (
                                                <Button 
                                                    key={index}
                                                    variant={selectedSize === size ? 'dark' : 'outline-dark'}
                                                    className="rounded-pill px-4"
                                                    onClick={() => setSelectedSize(size)}
                                                >
                                                    {size}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <Row className="align-items-center mb-4">
                                        <Col xs={4}>
                                            <h6 className="fw-bold mb-2">Quantity</h6>
                                            <Form.Select 
                                                value={qty} 
                                                onChange={(e) => setQty(Number(e.target.value))}
                                                className="rounded-pill shadow-sm"
                                            >
                                                {[...Array(Math.min(product.stock || 0, 5)).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                        <Col xs={8} className="text-end">
                                           <p className="text-success small fw-bold mt-4 mb-0">In Stock: {product.stock}</p>
                                        </Col>
                                    </Row>

                                    <Button 
                                        variant="danger" 
                                        size="lg" 
                                        className="w-100 rounded-pill shadow py-3 fw-bold text-uppercase d-flex justify-content-center align-items-center mb-3"
                                        onClick={addToCartHandler}
                                    >
                                        <FaShoppingCart className="me-2 mb-1" /> Add to Cart
                                    </Button>

                                    <Button 
                                        variant={currentInWishlist ? "danger" : "outline-danger"} 
                                        size="lg" 
                                        className="w-100 rounded-pill py-3 fw-bold text-uppercase d-flex justify-content-center align-items-center hover-scale"
                                        onClick={toggleWishlist}
                                    >
                                        <FaHeart className="me-2 mb-1" /> {currentInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                                    </Button>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="alert alert-secondary py-3 text-center rounded-pill">
                            <strong>Out of Stock</strong>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Customer Reviews Section */}
            <div className="mt-5 pt-5 border-top fade-in-up">
                <h3 className="fw-black fs-3 text-dark mb-4 d-flex align-items-center gap-2">
                    <FaStar className="text-warning mb-1" /> Customer Reviews
                </h3>
                
                <Row className="g-4">
                    {/* Write a Review */}
                    <Col md={12} lg={6}>
                        <div className="bg-light p-4 rounded-4 shadow-sm h-100">
                            {user && reviews.some(r => r.userId?._id === user._id || r.userId === user._id) ? (
                                <>
                                    <h5 className="fw-bold mb-3">Your Review</h5>
                                    <div className="bg-white p-3 rounded-3 shadow-sm mb-3 border-start border-4 border-warning">
                                        <div className="d-flex align-items-center mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} size={14} className={i < reviews.find(r => r.userId?._id === user._id || r.userId === user._id)?.rating ? "text-warning me-1" : "text-muted opacity-25 me-1"} />
                                            ))}
                                        </div>
                                        <p className="mb-0 text-secondary">{reviews.find(r => r.userId?._id === user._id || r.userId === user._id)?.comment}</p>
                                    </div>
                                    <Button 
                                        variant="outline-danger" 
                                        className="rounded-pill px-4 fw-bold w-100"
                                        onClick={deleteReviewHandler}
                                        disabled={reviewLoading}
                                    >
                                        Delete My Review
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <h5 className="fw-bold mb-3">Write a Review</h5>
                                    {brand ? (
                                        <div className="alert alert-info rounded-3">Brand accounts cannot submit product reviews.</div>
                                    ) : (
                                        <Form onSubmit={submitHandler}>
                                            {!user && (
                                                <>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold small text-uppercase letter-spacing-1">Name</Form.Label>
                                                        <Form.Control 
                                                            type="text"
                                                            placeholder="Enter your name"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            className="rounded-3 shadow-sm border-0 py-2"
                                                            required
                                                        />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="fw-semibold small text-uppercase letter-spacing-1">Email</Form.Label>
                                                        <Form.Control 
                                                            type="email"
                                                            placeholder="Enter your email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            className="rounded-3 shadow-sm border-0 py-2"
                                                            required
                                                        />
                                                    </Form.Group>
                                                </>
                                            )}
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-semibold small text-uppercase letter-spacing-1">Rating</Form.Label>
                                                <Form.Select 
                                                    value={rating} 
                                                    onChange={(e) => setRating(Number(e.target.value))}
                                                    className="rounded-3 shadow-sm border-0 py-2"
                                                    required
                                                >
                                                    <option value="">Select a rating...</option>
                                                    <option value="5">5 - Excellent</option>
                                                    <option value="4">4 - Very Good</option>
                                                    <option value="3">3 - Good</option>
                                                    <option value="2">2 - Fair</option>
                                                    <option value="1">1 - Poor</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-4">
                                                <Form.Label className="fw-semibold small text-uppercase letter-spacing-1">Your Comment</Form.Label>
                                                <Form.Control 
                                                    as="textarea" 
                                                    rows={3} 
                                                    value={comment} 
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="What did you think of this product?"
                                                    className="rounded-3 shadow-sm border-0"
                                                    required
                                                ></Form.Control>
                                            </Form.Group>
                                            <Button 
                                                type="submit" 
                                                variant="dark" 
                                                className="rounded-pill px-4 fw-bold shadow-sm"
                                                disabled={reviewLoading}
                                            >
                                                {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                            </Button>
                                        </Form>
                                    )}
                                </>
                            )}
                        </div>
                    </Col>
                    
                    {/* Existing Reviews Column */}
                    <Col md={12} lg={6}>
                        <div className="bg-light p-4 rounded-4 shadow-sm h-100">
                            <h5 className="fw-bold mb-3">Recent Reviews</h5>
                            {reviews.length === 0 ? (
                                <p className="text-muted">No reviews yet. Be the first to review this product!</p>
                            ) : (
                                <div className="d-flex flex-column gap-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {reviews.map(rev => (
                                        <div key={rev._id} className="bg-white p-3 rounded-3 shadow-sm border-start border-4 border-dark">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-bold small">{rev.name || rev.userId?.name || 'Customer'}</span>
                                                <div className="d-flex align-items-center gap-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} size={12} className={i < rev.rating ? "text-warning me-1" : "text-muted opacity-25 me-1"} />
                                                    ))}
                                                    {user?.role === 'admin' && (
                                                        <Button 
                                                            variant="link" 
                                                            className="text-danger p-0 ms-2"
                                                            onClick={() => adminDeleteReviewHandler(rev._id)}
                                                            title="Delete Review (Admin)"
                                                        >
                                                            <FaTrash size={12} />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="mb-0 text-secondary small">{rev.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default ProductDetails;
