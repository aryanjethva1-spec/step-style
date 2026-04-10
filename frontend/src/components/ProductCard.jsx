import React, { useContext, useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaEye, FaStar } from 'react-icons/fa';
import { BASE_URL } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
    const { user, brand } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, isInWishlist, removeFromWishlist } = useContext(WishlistContext);
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    
    const currentInWishlist = isInWishlist && isInWishlist(product._id);

    const viewProductHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/product/${product._id}`);
    };

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
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
                alert('Could not add to wishlist. Maybe already added?');
            }
        }
    };

    return (
        <Card 
            className="h-100 shadow-sm border-0 product-card position-relative" 
            style={{ borderRadius: '15px', overflow: 'hidden' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="position-relative overflow-hidden">
                <Link to={`/product/${product._id}`}>
                    <Card.Img 
                        variant="top" 
                        src={product.image?.startsWith('http') ? product.image : `${BASE_URL}${product.image}`} 
                        alt={product.name} 
                        style={{ height: '300px', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                        className={isHovered ? 'scale-110' : ''}
                    />
                </Link>
                
                {product.stock <= 0 && (
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-3 px-3 py-2 fw-bold letter-spacing-1">
                        OUT OF STOCK
                    </Badge>
                )}

                {/* Hover Actions (Quick View, Cart, Wishlist) */}
                <div className={`product-actions position-absolute w-100 d-flex justify-content-center gap-2 pb-3 transition-all ${isHovered ? 'bottom-0 opacity-100' : 'bottom-n100 opacity-0'}`} style={{ zIndex: 10 }}>
                    <Button 
                        variant="light" 
                        className="rounded-circle shadow d-flex align-items-center justify-content-center hover-danger text-dark" 
                        style={{ width: '45px', height: '45px' }}
                        onClick={viewProductHandler}
                        title="Quick View"
                    >
                        <FaEye />
                    </Button>
                    <Button 
                        variant="light" 
                        className={`rounded-circle shadow d-flex align-items-center justify-content-center hover-danger ${currentInWishlist ? 'text-danger' : 'text-dark'}`} 
                        style={{ width: '45px', height: '45px' }}
                        onClick={toggleWishlist}
                        title={currentInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <FaHeart />
                    </Button>
                </div>
            </div>
            
            <Card.Body className="d-flex flex-column text-center pt-4">
                <p className="text-muted small mb-1 text-uppercase fw-bold letter-spacing-1">{product.brandName}</p>
                <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
                    <Card.Title className="fw-bold mb-2 text-truncate">{product.name}</Card.Title>
                </Link>
                <div className="d-flex justify-content-center text-warning mb-2 small">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < (product.rating || 4) ? "text-warning" : "text-muted opacity-25"} />
                    ))}
                </div>
                <div className="mt-auto">
                    <h5 className="text-danger fw-black mb-0">₹{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h5>
                </div>
            </Card.Body>
            <style>{`
                .scale-110 { transform: scale(1.1); }
                .bottom-n100 { bottom: -50px; }
                .opacity-0 { opacity: 0; }
                .opacity-100 { opacity: 1; }
                .transition-all { transition: all 0.3s ease-in-out; }
                .hover-danger:hover { background-color: #dc3545 !important; color: white !important; borderColor: #dc3545 !important; }
                .product-actions { background: linear-gradient(to top, rgba(0,0,0,0.5), transparent); padding-top: 30px; }
                .fw-black { font-weight: 900; }
                .letter-spacing-1 { letter-spacing: 1px; }
            `}</style>
        </Card>
    );
};

export default ProductCard;
