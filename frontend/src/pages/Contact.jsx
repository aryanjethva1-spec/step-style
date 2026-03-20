import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Breadcrumb, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, 
    FaClock, FaCheckCircle, FaExclamationCircle, 
    FaQuestionCircle, FaArrowRight 
} from 'react-icons/fa';
import api from '../services/api';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        setError('');
        
        try {
            await api.post('/contact', formData);
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTimeout(() => setStatus(''), 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
            setStatus('error');
        }
    };

    const faqData = [
        { q: "How long does delivery take?", a: "Standard delivery typically takes 3-5 business days. Express options are available at checkout." },
        { q: "Can I return a product?", a: "Yes, we have a 30-day return policy for unworn items in their original packaging." },
        { q: "How can I track my order?", a: "Once your order ships, you will receive an email with a tracking link and ID." },
        { q: "Do you offer international shipping?", a: "Currently, we offer shipping across all major cities in India." }
    ];

    return (
        <div className="bg-light">
            {/* 2. Hero Section */}
            <div className="position-relative text-white py-5 mb-5" style={{ 
                background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80") center/cover no-repeat',
                minHeight: '350px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Container className="text-center fade-in-up">
                    <h1 className="display-3 fw-black text-uppercase letter-spacing-2 mb-3">Contact Us</h1>
                    <p className="lead fw-light opacity-75 fs-4">We would love to hear from you</p>
                </Container>
            </div>

            {/* 3. Contact Information Section */}
            <Container className="py-5 mb-5 mt-n5 position-relative z-index-10">
                <Row className="g-4">
                    {[
                        { icon: <FaMapMarkerAlt />, title: "Our Store", detail: "123 Shoe Plaza, Main Street, Surat, Gujarat, India" },
                        { icon: <FaPhone />, title: "Call Us", detail: "+91 98765 43210" },
                        { icon: <FaEnvelope />, title: "Email Us", detail: "support@stepstyle.com" },
                        { icon: <FaClock />, title: "Opening Hours", detail: "Mon - Sat: 9 AM - 9 PM" }
                    ].map((info, idx) => (
                        <Col lg={3} md={6} key={idx} className="fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <Card className="h-100 border-0 shadow-sm text-center p-4 rounded-4 hover-lift">
                                <div className="bg-danger text-white rounded-circle p-3 d-inline-block mb-3 mx-auto shadow-sm">
                                    {React.cloneElement(info.icon, { size: 25 })}
                                </div>
                                <h5 className="fw-black text-dark mb-2">{info.title}</h5>
                                <p className="text-muted small mb-0">{info.detail}</p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* 4. Contact Form Section */}
            <Container className="py-5 mb-5">
                <Row className="g-5 align-items-center">
                    <Col lg={7} className="fade-in-left">
                        <div className="bg-white p-5 rounded-4 shadow-lg border-bottom border-danger border-4">
                            <h2 className="fw-black text-dark mb-2">Send us a Message</h2>
                            <p className="text-muted mb-4">Have specific queries? Drop us a line below.</p>
                            
                            <Form onSubmit={handleSubmit}>
                                <Row g={3}>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-uppercase opacity-75">Full Name</Form.Label>
                                            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="bg-light border-0 py-3 px-4 rounded-3 shadow-none focus-danger" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-uppercase opacity-75">Email Address</Form.Label>
                                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required className="bg-light border-0 py-3 px-4 rounded-3 shadow-none focus-danger" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row g={3}>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-uppercase opacity-75">Phone Number</Form.Label>
                                            <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" required className="bg-light border-0 py-3 px-4 rounded-3 shadow-none focus-danger" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-uppercase opacity-75">Subject</Form.Label>
                                            <Form.Control type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Refund Inquiry" required className="bg-light border-0 py-3 px-4 rounded-3 shadow-none focus-danger" />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-uppercase opacity-75">Message</Form.Label>
                                    <Form.Control as="textarea" rows={4} name="message" value={formData.message} onChange={handleChange} placeholder="Type your message here..." required className="bg-light border-0 py-3 px-4 rounded-3 shadow-none focus-danger" />
                                </Form.Group>

                                <Button variant="danger" type="submit" className="px-5 py-3 fw-bold text-uppercase rounded-pill shadow-sm hover-scale w-100 w-md-auto" disabled={status === 'Sending...'}>
                                    {status === 'Sending...' ? 'Sending...' : (
                                        <>Send Message <FaPaperPlane className="ms-2" /></>
                                    )}
                                </Button>

                                {status === 'success' && (
                                    <div className="mt-4 p-3 bg-success bg-opacity-10 text-success rounded-3 text-center fw-bold animate-fade-in border border-success border-opacity-25">
                                        <FaCheckCircle className="me-2" /> Message sent successfully! We'll be in touch soon.
                                    </div>
                                )}
                                {status === 'error' && (
                                    <div className="mt-4 p-3 bg-danger bg-opacity-10 text-danger rounded-3 text-center fw-bold animate-fade-in border border-danger border-opacity-25">
                                        <FaExclamationCircle className="me-2" /> {error}
                                    </div>
                                )}
                            </Form>
                        </div>
                    </Col>
                    <Col lg={5} className="fade-in-right mt-5 mt-lg-0">
                        <div className="position-relative">
                            <img 
                                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80" 
                                alt="Style Store" 
                                className="img-fluid rounded-4 shadow-lg w-100"
                            />
                            <div className="position-absolute bottom-0 start-0 bg-danger text-white p-4 rounded-end shadow-sm d-none d-md-block" style={{ marginBottom: '10%' }}>
                                <h3 className="fw-black mb-0">Visit Us</h3>
                                <p className="mb-0 small opacity-75">Experience quality in person</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* 5. Google Map Section */}
            <div className="py-5 mb-5 bg-white shadow-sm overflow-hidden">
                <iframe 
                    title="Store Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.52982230407!2d72.75745184288607!3d21.15934029961608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1710500000000!5m2!1sen!2sin" 
                    width="100%" 
                    height="450" 
                    style={{ border: 0, filter: 'grayscale(100%) invert(90%)' }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            {/* 6. FAQ Section */}
            <Container className="py-5 mb-5">
                <div className="text-center mb-5">
                    <h6 className="text-danger text-uppercase fw-bold letter-spacing-2 mb-3">Questions?</h6>
                    <h2 className="display-5 fw-black text-dark mb-2">Frequently Asked Questions</h2>
                </div>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Accordion defaultActiveKey="0" className="border-0 shadow-sm rounded-4 overflow-hidden custom-accordion">
                            {faqData.map((faq, idx) => (
                                <Accordion.Item eventKey={idx.toString()} key={idx} className="border-0 border-bottom">
                                    <Accordion.Header className="py-2">
                                        <FaQuestionCircle className="text-danger me-2" /> 
                                        <span className="fw-bold">{faq.q}</span>
                                    </Accordion.Header>
                                    <Accordion.Body className="text-secondary bg-light">
                                        {faq.a}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </Col>
                </Row>
            </Container>

            {/* 7. Call to Action Section */}
            <div className="py-5 bg-danger text-white">
                <Container className="py-4 text-center">
                    <h2 className="display-4 fw-black mb-4">Find Your Perfect Pair Today</h2>
                    <Button variant="outline-light" size="lg" className="rounded-pill px-5 py-3 fw-bold text-uppercase border-2 hover-bg-white" as={Link} to="/shop">
                        Shop Now <FaArrowRight className="ms-2" />
                    </Button>
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

                .focus-danger:focus {
                    background: white !important;
                    box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.1);
                    border: 1px solid rgba(220, 53, 69, 0.3) !important;
                }

                .custom-accordion .accordion-button:not(.collapsed) {
                    background-color: transparent;
                    color: #dc3545;
                    box-shadow: none;
                }
                .custom-accordion .accordion-button:focus {
                    box-shadow: none;
                    border-color: rgba(0,0,0,0.125);
                }

                .hover-bg-white:hover {
                    background-color: white !important;
                    color: #dc3545 !important;
                }

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

export default Contact;
