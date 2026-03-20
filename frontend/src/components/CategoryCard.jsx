import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category, image, index }) => {
    return (
        <Col md={3} sm={6}>
            <Link to={`/shop?category=${category}`} className="text-decoration-none">
                <Card className="text-white border-0 shadow-sm overflow-hidden category-card" style={{ borderRadius: '15px' }}>
                    <Card.Img 
                        src={image} 
                        alt={category} 
                        style={{ height: '280px', objectFit: 'cover', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        className="cat-img"
                    />
                    <div className="card-img-overlay d-flex align-items-end p-0">
                        <div className="w-100 bg-dark bg-opacity-75 p-3 text-center" style={{ backdropFilter: 'blur(8px)', borderTop: '2px solid #dc3545' }}>
                            <h5 className="card-title m-0 fw-bold text-uppercase letter-spacing-1">{category}</h5>
                            <p className="small mb-0 opacity-75 mt-1">Explore Collection</p>
                        </div>
                    </div>
                </Card>
            </Link>
            <style>{`
                .category-card:hover .cat-img { transform: scale(1.15) rotate(2deg); filter: brightness(0.8); }
                .category-card { transition: all 0.3s ease; }
                .category-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(220, 53, 69, 0.2) !important; }
                .letter-spacing-1 { letter-spacing: 1px; }
            `}</style>
        </Col>
    );
};

export default CategoryCard;
