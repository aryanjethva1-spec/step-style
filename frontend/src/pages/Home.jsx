import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { FaStar, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { name: 'Men Shoes', q: 'Men', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa' },
        { name: 'Women Shoes', q: 'Women', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2' },
        { name: 'Sports Shoes', q: 'Sports', img: 'https://images.unsplash.com/photo-1551107699-5f0dc8714e83' },
        { name: 'Casual Shoes', q: 'Casual', img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77' },
        { name: 'Kids Shoes', q: 'Boys', img: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782' }
    ];

    const reviews = [
        { name: 'Sarah M.', text: 'Absolutely love my new running shoes! The comfort is unmatched.', img: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 5 },
        { name: 'James T.', text: 'Fast delivery and the quality is exactly as shown. Highly recommended.', img: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 5 },
        { name: 'Emily R.', text: 'Great selection of styles and sizes. Found exactly what I was looking for.', img: 'https://randomuser.me/api/portraits/women/68.jpg', rating: 4 },
        { name: 'Michael B.', text: 'The customer service is outstanding, and the shoes are incredibly durable.', img: 'https://randomuser.me/api/portraits/men/46.jpg', rating: 5 }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch 16 products to cover both Featured (8) and Trending (8) sections
                const { data } = await api.get('/products?pageNumber=1&pageSize=16&maxPrice=999999');
                setProducts(data.products || []);
            } catch (error) {
                console.error('Error fetching products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const featuredProducts = products.slice(0, 8);
    const trendingSneakers = products.slice(8, 16); // May be empty if not enough products

    return (
        <div style={{ overflowX: 'hidden' }}>
            {/* 2. Hero Section */}
            <div className="bg-dark text-white text-center d-flex align-items-center position-relative" style={{ minHeight: '85vh', background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat fixed' }}>
                <Container className="position-relative z-index-1 fade-in-up">
                    <h1 className="display-1 fw-black mb-3 text-uppercase letter-spacing-1">Step Into <span className="text-danger">Style</span></h1>
                    <p className="lead mb-5 fs-4 fw-light opacity-75">Discover the latest footwear collection crafted for performance and trend.</p>
                    <div className="d-flex gap-3 justify-content-center flex-wrap">
                        <Button variant="danger" size="lg" as={Link} to="/shop" className="px-5 py-3 rounded-pill shadow-lg text-uppercase fw-bold letter-spacing-1 transition-all hover-scale">
                            Shop Now
                        </Button>
                        <Button variant="outline-light" size="lg" as={Link} to="/shop" className="px-5 py-3 rounded-pill shadow-lg text-uppercase fw-bold letter-spacing-1 transition-all hover-scale">
                            Explore Collection
                        </Button>
                    </div>
                </Container>
            </div>

            {/* 3. Categories Section */}
            <Container className="my-5 py-5">
                <div className="text-center mb-5 fade-in-up">
                    <h6 className="text-danger text-uppercase fw-bold letter-spacing-2 mb-2">Collections</h6>
                    <h2 className="fw-black fs-1 text-dark text-uppercase">Shop By Category</h2>
                    <div className="mx-auto bg-danger mt-3 mb-4 rounded" style={{ width: '80px', height: '4px' }}></div>
                </div>
                <Row className="g-4 justify-content-center">
                    {categories.map((cat, index) => (
                        <Col lg={index < 3 ? 4 : 6} md={6} sm={12} key={index} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <Link to={`/shop?category=${cat.q}`} className="text-decoration-none">
                                <Card className="text-white border-0 shadow-sm overflow-hidden category-card" style={{ borderRadius: '20px', height: '300px' }}>
                                    <Card.Img 
                                        src={`${cat.img}?auto=format&fit=crop&w=600&q=80`} 
                                        alt={cat.name} 
                                        style={{ height: '100%', objectFit: 'cover', transition: 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)' }}
                                        className="cat-img"
                                    />
                                    <div className="card-img-overlay d-flex flex-column justify-content-end p-0">
                                        <div className="w-100 p-4" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
                                            <h3 className="card-title mb-1 fw-bold text-uppercase letter-spacing-1">{cat.name}</h3>
                                            <p className="small mb-0 text-white-50 d-flex align-items-center">Explore Now <FaArrowRight className="ms-2 fs-7" /></p>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* 4. Featured Products */}
            <Container className="mb-5 py-4">
                 <div className="text-center mb-5">
                    <h6 className="text-danger text-uppercase fw-bold letter-spacing-2 mb-2">Top Picks</h6>
                    <h2 className="fw-black fs-1 text-dark text-uppercase">Featured Products</h2>
                    <div className="mx-auto bg-danger mt-3 mb-4 rounded" style={{ width: '80px', height: '4px' }}></div>
                </div>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="danger" />
                        <p className="mt-3 text-muted">Loading featured products...</p>
                    </div>
                ) : (
                    <Row className="g-4">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map(product => (
                                <Col lg={3} md={4} sm={6} key={product._id} className="fade-in-up">
                                    <ProductCard product={product} />
                                </Col>
                            ))
                        ) : (
                            <Col><p className="text-center text-muted col-12 py-5">No products available at the moment.</p></Col>
                        )}
                    </Row>
                )}
                <div className="text-center mt-5">
                    <Button variant="outline-dark" as={Link} to="/shop" className="rounded-pill px-5 py-3 fw-bold text-uppercase letter-spacing-1 hover-scale transition-all">
                        View All Products
                    </Button>
                </div>
            </Container>

            {/* 5. Special Offer Banner */}
            <div className="my-5 position-relative" style={{ background: 'linear-gradient(rgba(220, 53, 69, 0.8), rgba(220, 53, 69, 0.9)), url("https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80") center/cover fixed', minHeight: '400px' }}>
                <Container className="h-100 d-flex align-items-center py-5 fade-in-up">
                    <Row className="w-100 align-items-center">
                        <Col lg={7} className="text-white py-5">
                            <Badge bg="white" text="danger" className="px-3 py-2 rounded-pill fw-bold letter-spacing-1 mb-4 text-uppercase">Limited Time</Badge>
                            <h2 className="display-4 fw-black mb-3 text-uppercase letter-spacing-1">Flat 40% Off <br/>On Running Shoes</h2>
                            <p className="lead opacity-75 mb-4">Upgrade your performance with our premium athletic collection. Offer ends soon, don't miss out on these exclusive deals!</p>
                            <Button variant="light" size="lg" as={Link} to="/shop?category=Sports" className="text-danger px-5 py-3 rounded-pill fw-bold text-uppercase letter-spacing-1 shadow hover-scale transition-all">
                                Shop Offer Now
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* 6. Trending Sneakers (Horizontal Scroll) */}
            <Container className="mb-5 py-5 overflow-hidden">
                 <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h6 className="text-danger text-uppercase fw-bold letter-spacing-2 mb-2">Hype Beast</h6>
                        <h2 className="fw-black fs-2 text-dark text-uppercase mb-0">Trending Sneakers</h2>
                    </div>
                    <Link to="/shop" className="text-danger text-decoration-none fw-bold text-uppercase small d-none d-md-block hover-scale">See All <FaArrowRight className="ms-1" /></Link>
                </div>
                
                {loading ? (
                    <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>
                ) : (
                    <div className="d-flex pb-4 custom-scrollbar" style={{ overflowX: 'auto', gap: '1.5rem', mx: '-1rem', padding: '0 1rem' }}>
                        {trendingSneakers.length > 0 ? (
                            trendingSneakers.map(product => (
                                <div key={product._id} style={{ minWidth: '280px', flex: '0 0 auto' }}>
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            featuredProducts.map(product => ( // Fallback to featured if trending is empty
                                <div key={product._id} style={{ minWidth: '280px', flex: '0 0 auto' }}>
                                    <ProductCard product={product} />
                                </div>
                            ))
                        )}
                    </div>
                )}
            </Container>

            {/* 7. Customer Reviews */}
            <div className="bg-light py-5 mb-5 border-top border-bottom border-danger border-opacity-10">
                <Container className="py-4">
                    <div className="text-center mb-5 fade-in-up">
                        <h6 className="text-danger text-uppercase fw-bold letter-spacing-2 mb-2">Testimonials</h6>
                        <h2 className="fw-black fs-1 text-dark text-uppercase">What Customers Say</h2>
                        <div className="mx-auto bg-danger mt-3 mb-4 rounded" style={{ width: '80px', height: '4px' }}></div>
                    </div>
                    <Row className="g-4 justify-content-center">
                        {reviews.map((review, i) => (
                            <Col lg={3} md={6} sm={12} key={i} className="fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <Card className="h-100 border-0 shadow-sm rounded-4 text-center p-4 bg-white review-card">
                                    <div className="mb-3">
                                        <FaQuoteLeft className="text-danger opacity-25 fs-1" />
                                    </div>
                                    <Card.Body className="p-0 d-flex flex-column">
                                        <p className="fst-italic text-muted mb-4 px-2 flex-grow-1">"{review.text}"</p>
                                        <div className="text-warning mb-3">
                                            {[...Array(5)].map((_, idx) => (
                                                <FaStar key={idx} className={idx < review.rating ? "text-warning" : "text-muted opacity-25"} />
                                            ))}
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center flex-column mt-auto pt-3 border-top border-light">
                                            <img src={review.img} alt={review.name} className="rounded-circle mb-2 border border-2 border-danger shadow-sm" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                            <h6 className="fw-bold mb-0 text-dark">{review.name}</h6>
                                            <small className="text-muted text-uppercase" style={{ fontSize: '10px', letterSpacing: '1px' }}>Verified Buyer</small>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* Newsletter */}
            <div className="bg-dark text-white py-5">
                <Container className="text-center py-4 fade-in-up">
                    <h2 className="fw-black mb-3">Join StepStyle VIP</h2>
                    <p className="mb-4 lead opacity-75 d-inline-block" style={{ maxWidth: '600px' }}>Subscribe to our newsletter and get 10% off your first order plus early access to new releases.</p>
                    <Row className="justify-content-center mt-3">
                        <Col md={6}>
                            <div className="input-group input-group-lg shadow-lg">
                                <input type="email" className="form-control rounded-start-pill border-0 ps-4 py-3" placeholder="Enter your email address..." />
                                <button className="btn btn-danger rounded-end-pill px-5 fw-bold text-uppercase letter-spacing-1" type="button">Join Now</button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <style>{`
                .category-card:hover .cat-img { transform: scale(1.1) rotate(1deg) !important; filter: brightness(0.8); }
                .category-card { transition: all 0.3s ease; }
                .category-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15) !important; }
                
                .review-card { transition: all 0.3s ease; top: 0; position: relative; }
                .review-card:hover { top: -10px; box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; }
                
                .custom-scrollbar::-webkit-scrollbar { height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #dc3545; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #c82333; }
                
                .hover-scale:hover { transform: scale(1.05); }
                .fw-black { font-weight: 900; }
                .fs-7 { font-size: 0.85rem; }
            `}</style>
        </div>
    );
};

export default Home;
