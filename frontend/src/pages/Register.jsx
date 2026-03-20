import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const { registerUser, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (user) {
            navigate(redirect === '/myorders' ? '/' : redirect);
        }
    }, [user, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        
        if(password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const result = await registerUser(name, email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
         <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={12} lg={10}>
                   <div className="bg-white rounded-4 shadow-lg overflow-hidden d-flex flex-column flex-md-row">
                       
                       <div className="w-100 w-md-50 p-5 p-md-5 d-flex flex-column justify-content-center order-2 order-md-1">
                            <div className="text-center mb-5">
                                <h1 className="fw-bold fs-2"><span className="text-danger">Step</span>Style</h1>
                                <p className="text-muted">Create a new account</p>
                            </div>

                            {error && <div className="alert alert-danger rounded-pill text-center">{error}</div>}

                            <Form onSubmit={submitHandler}>
                                <Form.Group className="mb-4" controlId="name">
                                    <Form.Label className="fw-semibold small text-uppercase">Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="py-3 rounded-pill"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="email">
                                    <Form.Label className="fw-semibold small text-uppercase">Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="py-3 rounded-pill"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="password">
                                    <Form.Label className="fw-semibold small text-uppercase">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="py-3 rounded-pill"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-5" controlId="confirmPassword">
                                    <Form.Label className="fw-semibold small text-uppercase">Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="py-3 rounded-pill"
                                        required
                                    />
                                </Form.Group>

                                <Button variant="danger" type="submit" className="w-100 py-3 rounded-pill fw-bold text-uppercase mb-4 shadow">
                                    Sign Up
                                </Button>

                                <div className="text-center text-muted">
                                    Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-dark fw-bold text-decoration-none">Sign In</Link>
                                </div>
                            </Form>
                       </div>

                       {/* Image Side */}
                       <div className="w-100 w-md-50 d-none d-md-block order-1 order-md-2" style={{
                           background: 'url("https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1000") center/cover',
                           minHeight: '600px'
                       }}>
                           <div className="h-100 w-100 bg-dark bg-opacity-50 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center">
                               <h2 className="fw-bold mb-3">Join the Community</h2>
                               <p className="lead">Create an account to track your orders, save items to your wishlist, and check out faster.</p>
                           </div>
                       </div>

                   </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
