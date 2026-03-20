import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-danger border-opacity-25" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <Container>
                <Row className="gy-4">
                    <Col lg={4} md={6}>
                        <h3 className="fw-bold mb-3 ls-1"><span className="text-danger">Step</span>Style</h3>
                        <p className="text-light opacity-75 pe-lg-5 lh-lg" style={{ fontSize: '0.95rem' }}>
                            Your ultimate destination for premium footwear. We bring you the latest trends and timeless classics from top brands worldwide. Quality and comfort in every step.
                        </p>
                    </Col>
                    <Col lg={2} md={6} xs={6}>
                        <h6 className="text-uppercase fw-bold mb-4 text-danger small" style={{ letterSpacing: '1px' }}>Shop</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="/shop" className="text-decoration-none text-light opacity-75 footer-link transition-all">Men's Shoes</a></li>
                            <li className="mb-2"><a href="/shop" className="text-decoration-none text-light opacity-75 footer-link transition-all">Women's Shoes</a></li>
                            <li className="mb-2"><a href="/shop" className="text-decoration-none text-light opacity-75 footer-link transition-all">Kids' Shoes</a></li>
                            <li className="mb-2"><a href="/shop" className="text-decoration-none text-light opacity-75 footer-link transition-all">Sale</a></li>
                        </ul>
                    </Col>
                    <Col lg={2} md={6} xs={6}>
                        <h6 className="text-uppercase fw-bold mb-4 text-danger small" style={{ letterSpacing: '1px' }}>Support</h6>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="/contact" className="text-decoration-none text-light opacity-75 footer-link transition-all">Contact Us</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-light opacity-75 footer-link transition-all">Shipping & Returns</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-light opacity-75 footer-link transition-all">FAQ</a></li>
                            <li className="mb-2"><a href="#" className="text-decoration-none text-light opacity-75 footer-link transition-all">Track Order</a></li>
                        </ul>
                    </Col>
                    <Col lg={4} md={6}>
                        <h6 className="text-uppercase fw-bold mb-4 text-danger small" style={{ letterSpacing: '1px' }}>Stay Connected</h6>
                        <p className="text-light opacity-75 mb-4 small">Subscribe to our newsletter for exclusive offers, new arrivals, and style updates.</p>
                        <div className="d-flex gap-3 mb-4">
                            <a href="#" className="text-white bg-dark border border-secondary border-opacity-50 p-2 rounded-circle hover-bg-danger transition-all d-flex shadow-sm"><FaFacebook size={18} /></a>
                            <a href="#" className="text-white bg-dark border border-secondary border-opacity-50 p-2 rounded-circle hover-bg-danger transition-all d-flex shadow-sm"><FaTwitter size={18} /></a>
                            <a href="#" className="text-white bg-dark border border-secondary border-opacity-50 p-2 rounded-circle hover-bg-danger transition-all d-flex shadow-sm"><FaInstagram size={18} /></a>
                        </div>
                    </Col>
                </Row>
                <hr className="my-4 border-light border-opacity-10" />
                <div className="d-flex justify-content-between align-items-center flex-wrap pb-2">
                    <p className="mb-0 text-light opacity-50 small">&copy; {new Date().getFullYear()} StepStyle. All rights reserved.</p>
                    <div className="d-flex gap-4 small mt-2 mt-md-0">
                        <a href="#" className="text-decoration-none text-light opacity-50 footer-link transition-all">Privacy Policy</a>
                        <a href="#" className="text-decoration-none text-light opacity-50 footer-link transition-all">Terms of Service</a>
                    </div>
                </div>
            </Container>
            <style>{`
                .footer-link:hover { color: #dc3545 !important; opacity: 1 !important; transform: translateX(3px); }  
                .hover-bg-danger:hover { background-color: #dc3545 !important; border-color: #dc3545 !important; transform: translateY(-3px); } 
                .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .ls-1 { letter-spacing: 1px; }
            `}</style>
        </footer>
    );
};

export default Footer;
