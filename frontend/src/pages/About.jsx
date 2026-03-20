import React from 'react';
import { Container, Row, Col, Card, Button, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
    FaHistory, FaBullseye, FaEye, FaGem, FaTshirt, 
    FaTag, FaShippingFast, FaCheckCircle, FaStar, 
    FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn 
} from 'react-icons/fa';

const About = () => {
    const teamMembers = [
        { name: "Arjun Sharma", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop" },
        { name: "Priya Patel", role: "Lead Designer", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop" },
        { name: "Rahul Verma", role: "Marketing Manager", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop" }
    ];

    const stats = [
        { count: "5000+", label: "Happy Customers" },
        { count: "1000+", label: "Products" },
        { count: "50+", label: "Brands" },
        { count: "24/7", label: "Customer Support" }
    ];

    const testimonials = [
        { name: "Anil Kapoor", text: "The comfort level of the sneakers I bought is just unmatched. Highly recommended!", rating: 5, photo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&h=150&auto=format&fit=crop" },
        { name: "Sneha Reddy", text: "Finally found a place that offers both style and affordability. My favorite shoe store!", rating: 5, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&auto=format&fit=crop" },
        { name: "Vikram Singh", text: "Fast delivery and premium quality. The packaging was also very professional.", rating: 4, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&h=150&auto=format&fit=crop" }
    ];

    return (
        <div className="bg-light">
            {/* 1. Hero Banner */}
            <div className="position-relative text-white py-5 mb-5" style={{ 
                background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Container className="text-center fade-in-up">
                    <h1 className="display-3 fw-black text-uppercase letter-spacing-2 mb-3">About Our Brand</h1>
                    <p className="lead fw-light opacity-75 fs-4">Step Into Comfort, Style, and Quality</p>
                </Container>
            </div>

            {/* 3. Our Story Section */}
            <Container className="py-5 mb-5">
                <Row className="align-items-center g-5">
                    <Col lg={6} className="fade-in-left">
                        <div className="position-relative">
                            <img 
                                src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80" 
                                alt="Footwear Craftsmanship" 
                                className="img-fluid rounded-4 shadow-lg w-100"
                            />
                            <div className="position-absolute bottom-0 start-0 bg-danger text-white p-4 rounded-end shadow-sm d-none d-md-block" style={{ marginBottom: '10%' }}>
                                <h4 className="fw-black mb-0">Est. 2015</h4>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} className="fade-in-right">
                        <h6 className="text-danger text-uppercase fw-bold letter-spacing-2 mb-3">The Journey</h6>
                        <h2 className="display-5 fw-black text-dark mb-4">Our Story</h2>
                        <p className="lead text-secondary mb-4">
                            "Our journey started with a simple goal – to provide stylish, comfortable, and affordable footwear for everyone. We believe the right pair of shoes can boost confidence and complete your style."
                        </p>
                        <p className="text-muted mb-0">
                            What began as a small passion project in a humble workshop has grown into a leading destination for shoe enthusiasts. Our commitment to premium craftsmanship and customer satisfaction remains at the heart of everything we do. We meticulously select every material and refine every design to ensure you never have to choose between looking good and feeling great.
                        </p>
                    </Col>
                </Row>
            </Container>

            {/* 4. Our Mission & Vision */}
            <div className="bg-white py-5 mb-5 shadow-sm">
                <Container className="py-5">
                    <Row className="g-4">
                        <Col md={6} className="fade-in-up">
                            <Card className="h-100 border-0 bg-light p-4 rounded-4 hover-lift">
                                <Card.Body>
                                    <div className="bg-danger text-white rounded-circle p-3 d-inline-block mb-4 shadow">
                                        <FaBullseye size={35} />
                                    </div>
                                    <h3 className="fw-black mb-3">Our Mission</h3>
                                    <p className="text-muted fs-5 lh-lg">
                                        To empower individuals through premium footwear that blends innovation with timeless style. We are committed to delivering unmatched quality and exceptional customer service, ensuring every step you take is supported by excellence.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <Card className="h-100 border-0 bg-dark text-white p-4 rounded-4 hover-lift">
                                <Card.Body>
                                    <div className="bg-white text-danger rounded-circle p-3 d-inline-block mb-4 shadow">
                                        <FaEye size={35} />
                                    </div>
                                    <h3 className="fw-black mb-3">Our Vision</h3>
                                    <p className="text-white-50 fs-5 lh-lg">
                                        To become the world's most trusted footwear brand, recognized for modern designs and sustainable practices. We aim to redefine the footwear industry by setting new standards in comfort and fashion-forward aesthetics.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* 5. Why Choose Us Section */}
            <Container className="py-5 mb-5 text-center">
                <h6 className="text-danger text-uppercase fw-bold letter-spacing-2 mb-3">Core Excellence</h6>
                <h2 className="display-5 fw-black text-dark mb-5">Why Choose Us</h2>
                <Row className="g-4 mt-2">
                    {[
                        { icon: <FaGem />, title: "Premium Quality Shoes", desc: "Handpicked materials for durability and unmatched comfort." },
                        { icon: <FaTshirt />, title: "Latest Fashion Trends", desc: "Always stay ahead with our modern and stylish collections." },
                        { icon: <FaTag />, title: "Affordable Prices", desc: "Premium footwear experience without the premium price tag." },
                        { icon: <FaShippingFast />, title: "Fast Delivery", desc: "Express shipping that brings your favorite pairs to your doorstep." }
                    ].map((feature, idx) => (
                        <Col lg={3} md={6} key={idx} className="fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <Card className="h-100 border-0 bg-white p-4 rounded-4 feature-card shadow-sm hover-lift">
                                <div className="text-danger mb-4 mx-auto feature-icon-wrapper">
                                    {React.cloneElement(feature.icon, { size: 45 })}
                                </div>
                                <h5 className="fw-black mb-3">{feature.title}</h5>
                                <p className="text-muted small mb-0">{feature.desc}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* 6. Meet Our Team */}
            <div className="bg-white py-5 mb-5">
                <Container className="py-5">
                    <div className="text-center mb-5">
                        <h6 className="text-danger text-uppercase fw-bold letter-spacing-2 mb-3">Our Experts</h6>
                        <h2 className="display-5 fw-black text-dark mb-2">Meet Our Team</h2>
                    </div>
                    <Row className="g-4">
                        {teamMembers.map((member, idx) => (
                            <Col lg={4} md={6} key={idx} className="fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <Card className="border-0 bg-light rounded-4 overflow-hidden team-card shadow-sm text-center p-4 hover-lift">
                                    <Card.Body>
                                        <div className="team-img-wrapper mb-4 mx-auto">
                                            <Card.Img variant="top" src={member.image} className="rounded-circle shadow-sm" />
                                        </div>
                                        <h4 className="fw-black mb-1">{member.name}</h4>
                                        <p className="text-danger fw-bold small text-uppercase mb-4">{member.role}</p>
                                        <div className="d-flex justify-content-center gap-3">
                                            <div className="social-icon"><FaFacebookF /></div>
                                            <div className="social-icon"><FaTwitter /></div>
                                            <div className="social-icon"><FaInstagram /></div>
                                            <div className="social-icon"><FaLinkedinIn /></div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* 7. Statistics Section */}
            <div className="bg-danger text-white py-5 mb-5">
                <Container className="py-4">
                    <Row className="text-center g-4">
                        {stats.map((stat, idx) => (
                            <Col md={3} sm={6} key={idx}>
                                <h1 className="display-4 fw-black mb-2">{stat.count}</h1>
                                <p className="text-uppercase fw-bold small letter-spacing-2 opacity-75">{stat.label}</p>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            {/* 8. Customer Testimonials */}
            <Container className="py-5 mb-5">
                <div className="text-center mb-5">
                    <h6 className="text-danger text-uppercase fw-bold letter-spacing-2 mb-3">Wall of Love</h6>
                    <h2 className="display-5 fw-black text-dark mb-2">Customer Testimonials</h2>
                </div>
                <Row className="g-4">
                    {testimonials.map((t, idx) => (
                        <Col lg={4} md={6} key={idx} className="fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <Card className="h-100 border-0 bg-white p-4 rounded-4 shadow-sm hover-lift testimonial-card">
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-4">
                                        <img src={t.photo} alt={t.name} className="rounded-circle me-3 shadow-sm" width="60" height="60" />
                                        <div>
                                            <h6 className="fw-black mb-0">{t.name}</h6>
                                            <div className="text-warning">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} size={12} className={i < t.rating ? "me-1" : "text-muted opacity-25 me-1"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <i className="text-muted d-block mb-0 fs-5">"{t.text}"</i>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* 9. Call to Action Section */}
            <div className="py-5">
                <Container>
                    <div className="bg-dark rounded-5 overflow-hidden position-relative p-5 shadow-lg text-center text-white fade-in-up">
                        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-25 bg-danger" style={{ clipPath: 'polygon(0 0, 30% 0, 70% 100%, 0% 100%)' }}></div>
                        <div className="position-relative z-index-1 py-4">
                            <h2 className="display-4 fw-black text-uppercase mb-3">Find Your Perfect Pair Today</h2>
                            <p className="lead mb-5 opacity-75">Join thousands of happy walkers and upgrade your style game now.</p>
                            <Button variant="danger" size="lg" className="rounded-pill px-5 py-3 fw-bold text-uppercase shadow hover-scale" as={Link} to="/shop">Shop Now</Button>
                        </div>
                    </div>
                </Container>
            </div>

            <style>{`
                .fw-black { font-weight: 900; }
                .letter-spacing-2 { letter-spacing: 2px; }
                .breadcrumb-light .breadcrumb-item + .breadcrumb-item::before { color: rgba(255,255,255,0.3); }
                
                .hover-lift { transition: all 0.3s ease; }
                .hover-lift:hover { transform: translateY(-10px); }
                .hover-scale { transition: all 0.3s ease; }
                .hover-scale:hover { transform: scale(1.05); }

                .feature-icon-wrapper {
                    width: 90px; height: 90px;
                    display: flex; align-items: center; justify-content: center;
                    background: #f8f9fa; border-radius: 50%;
                    transition: all 0.3s ease;
                }
                .feature-card:hover .feature-icon-wrapper {
                    background: #dc3545; color: white !important;
                    transform: rotateY(360deg);
                }

                .team-img-wrapper {
                    width: 150px; height: 150px;
                    padding: 5px; border: 2px solid #dc3545;
                    border-radius: 50%;
                }
                .team-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }

                .social-icon {
                    width: 35px; height: 35px;
                    background: white; color: #dc3545;
                    border-radius: 50%; display: flex;
                    align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s ease;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .social-icon:hover { background: #dc3545; color: white; transform: translateY(-3px); }

                .testimonial-card i::before { content: open-quote; font-size: 3rem; position: absolute; top: 10px; right: 20px; color: #dc3545; opacity: 0.1; }

            `}</style>
        </div>
    );
};

export default About;

