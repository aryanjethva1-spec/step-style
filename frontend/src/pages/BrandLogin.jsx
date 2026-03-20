import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const BrandLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { loginBrand } = useContext(AuthContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        const result = await loginBrand(email, password);
        if (result.success) {
            navigate('/brand/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                   <div className="bg-white p-5 rounded-4 shadow-lg border-top border-5 border-danger">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-dark mb-1">Brand Portal</h2>
                            <p className="text-muted small text-uppercase fw-semibold">Seller Authentication</p>
                        </div>

                        {error && <div className="alert alert-danger rounded-pill text-center">{error}</div>}

                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-4" controlId="email">
                                <Form.Label className="fw-semibold small text-uppercase">Work Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="partner@brand.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="py-3 rounded-pill bg-light border-0"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-5" controlId="password">
                                <Form.Label className="fw-semibold small text-uppercase">Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your seller password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="py-3 rounded-pill bg-light border-0"
                                    required
                                />
                            </Form.Group>

                            <Button variant="danger" type="submit" className="w-100 py-3 rounded-pill fw-bold text-uppercase mb-4 shadow">
                                Access Dashboard
                            </Button>
                        </Form>
                   </div>
                </Col>
            </Row>
        </Container>
    );
};

export default BrandLogin;
