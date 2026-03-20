import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { loginUser, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already logged in
    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (user) {
            navigate(redirect === '/myorders' ? '/' : redirect);
        }
    }, [user, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        const result = await loginUser(email, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={12} lg={10} className="position-relative">
                   <div className="bg-white rounded-4 shadow-lg overflow-hidden d-flex flex-column flex-md-row">
                       
                       {/* Image Side */}
                       <div className="w-100 w-md-50 d-none d-md-block" style={{
                           background: 'url("https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1000") center/cover',
                           minHeight: '600px'
                       }}>
                           <div className="h-100 w-100 bg-dark bg-opacity-50 d-flex flex-column justify-content-center align-items-center text-white p-5 text-center">
                               <h2 className="fw-bold mb-3">Welcome Back!</h2>
                               <p className="lead">Sign in to continue your footwear journey with StepStyle.</p>
                           </div>
                       </div>

                       {/* Form Side */}
                       <div className="w-100 w-md-50 p-5 p-md-5 d-flex flex-column justify-content-center">
                            <div className="text-center mb-5">
                                <h1 className="fw-bold fs-2"><span className="text-danger">Step</span>Style</h1>
                                <p className="text-muted">Login to your account</p>
                            </div>

                            {error && <div className="alert alert-danger rounded-pill text-center">{error}</div>}

                            <Form onSubmit={submitHandler}>
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

                                <Form.Group className="mb-5" controlId="password">
                                    <Form.Label className="d-flex justify-content-between fw-semibold small text-uppercase">
                                        Password
                                        <a href="#" className="text-danger text-decoration-none">Forgot password?</a>
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="py-3 rounded-pill"
                                        required
                                    />
                                </Form.Group>

                                <Button variant="dark" type="submit" className="w-100 py-3 rounded-pill fw-bold text-uppercase mb-4 shadow-sm btn-hover-dark">
                                    Sign In
                                </Button>

                                <div className="text-center text-muted">
                                    New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-danger fw-bold text-decoration-none">Create an Account</Link>
                                </div>
                                
                                <hr className="my-4" />
                                
                                <div className="text-center">
                                     <Link to="/brand/login" className="text-secondary small text-decoration-none">Are you a Brand Seller? Login here</Link>
                                </div>
                            </Form>
                       </div>

                   </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
