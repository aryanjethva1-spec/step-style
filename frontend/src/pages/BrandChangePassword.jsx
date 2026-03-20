import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert, Spinner, InputGroup, ProgressBar } from 'react-bootstrap';
import { FaLock, FaKey, FaShieldAlt, FaEye, FaEyeSlash, FaCheck, FaTimes, FaInfoCircle, FaShieldVirus } from 'react-icons/fa';
import BrandLayout from '../dashboards/BrandLayout';
import api from '../services/api';

const BrandChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Password strength logic
    const [strength, setStrength] = useState(0);
    const [strengthLabels] = useState(['Very Weak', 'Weak', 'Good', 'Strong', 'Very Strong']);
    const [strengthColors] = useState(['danger', 'warning', 'info', 'primary', 'success']);

    const calculateStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        setStrength(score);
    };

    useEffect(() => {
        calculateStrength(newPassword);
    }, [newPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            return setError('New passwords do not match.');
        }
        if (newPassword.length < 8) {
            return setError('Password must be at least 8 characters long.');
        }

        setLoading(true);
        try {
            const { data } = await api.put('/brand/change-password', { oldPassword, newPassword });
            setSuccess(data.message || 'Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Current password is incorrect.');
        }
        setLoading(false);
    };

    return (
        <BrandLayout title="Change Password">
            <div className="fade-in-up">
                <Row className="justify-content-center">
                    <Col xl={6} lg={8} md={10}>
                        {/* Page Header within Layout - Optional if Layout already has title */}
                        <div className="text-center mb-5">
                            <h2 className="fw-black text-uppercase letter-spacing-2 text-dark">Change Password</h2>
                            <p className="text-muted fw-bold">Update your brand account password securely</p>
                        </div>

                        <Card className="border-0 shadow-lg rounded-4 overflow-hidden mb-5">
                            <Card.Body className="p-4 p-md-5">
                                {error && (
                                    <Alert variant="danger" className="rounded-4 border-0 shadow-sm mb-4 d-flex align-items-center gap-2">
                                        <FaTimes /> {error}
                                    </Alert>
                                )}
                                {success && (
                                    <Alert variant="success" className="rounded-4 border-0 shadow-sm mb-4 d-flex align-items-center gap-2 text-success">
                                        <FaCheck /> {success}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit}>
                                    {/* Current Password */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-black text-uppercase text-muted letter-spacing-1">Current Password</Form.Label>
                                        <InputGroup className="bg-light rounded-pill overflow-hidden border-0">
                                            <InputGroup.Text className="bg-transparent border-0 ps-4 text-muted">
                                                <FaKey />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type={showOld ? 'text' : 'password'}
                                                placeholder="Enter current password"
                                                className="bg-transparent border-0 py-3 shadow-none fw-bold"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                required
                                            />
                                            <Button 
                                                variant="link" 
                                                className="text-muted pe-4 shadow-none border-0" 
                                                onClick={() => setShowOld(!showOld)}
                                            >
                                                {showOld ? <FaEyeSlash /> : <FaEye />}
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>

                                    {/* New Password */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-black text-uppercase text-muted letter-spacing-1">New Password</Form.Label>
                                        <InputGroup className="bg-light rounded-pill overflow-hidden border-0 mb-2">
                                            <InputGroup.Text className="bg-transparent border-0 ps-4 text-muted">
                                                <FaLock />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type={showNew ? 'text' : 'password'}
                                                placeholder="Enter new password"
                                                className="bg-transparent border-0 py-3 shadow-none fw-bold"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                            <Button 
                                                variant="link" 
                                                className="text-muted pe-4 shadow-none border-0" 
                                                onClick={() => setShowNew(!showNew)}
                                            >
                                                {showNew ? <FaEyeSlash /> : <FaEye />}
                                            </Button>
                                        </InputGroup>
                                        
                                        {/* Strength Indicator */}
                                        {newPassword && (
                                            <div className="px-2 mt-2">
                                                <div className="d-flex justify-content-between mb-1">
                                                    <small className="fw-bold text-muted text-uppercase" style={{ fontSize: '10px' }}>Security Strength</small>
                                                    <small className={`fw-black text-uppercase text-${strengthColors[strength]}`} style={{ fontSize: '10px' }}>{strengthLabels[strength]}</small>
                                                </div>
                                                <ProgressBar 
                                                    now={(strength / 4) * 100} 
                                                    variant={strengthColors[strength]} 
                                                    className="rounded-pill"
                                                    style={{ height: '5px' }}
                                                />
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* Confirm Password */}
                                    <Form.Group className="mb-5">
                                        <Form.Label className="small fw-black text-uppercase text-muted letter-spacing-1">Confirm New Password</Form.Label>
                                        <InputGroup className="bg-light rounded-pill overflow-hidden border-0 mb-2">
                                            <InputGroup.Text className="bg-transparent border-0 ps-4 text-muted">
                                                <FaShieldAlt />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type={showConfirm ? 'text' : 'password'}
                                                placeholder="Repeat new password"
                                                className="bg-transparent border-0 py-3 shadow-none fw-bold"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <Button 
                                                variant="link" 
                                                className="text-muted pe-4 shadow-none border-0" 
                                                onClick={() => setShowConfirm(!showConfirm)}
                                            >
                                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                            </Button>
                                        </InputGroup>
                                        {confirmPassword && newPassword !== confirmPassword && (
                                            <small className="text-danger fw-bold ms-3"><FaTimes className="me-1" /> Passwords match</small>
                                        )}
                                    </Form.Group>

                                    <Button
                                        type="submit"
                                        variant="danger"
                                        className="w-100 rounded-pill py-3 fw-black text-uppercase letter-spacing-1 shadow hover-scale"
                                        disabled={loading}
                                    >
                                        {loading ? <Spinner animation="border" size="sm" className="me-2" /> : 'Update Password'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>

                        {/* Security Tips Section */}
                        <div className="mb-4">
                            <h5 className="fw-black text-uppercase border-start border-danger border-4 ps-3 mb-4 letter-spacing-1 text-dark">Security Tips</h5>
                            <Row className="g-3">
                                <Col md={4}>
                                    <div className="bg-white p-3 rounded-4 shadow-sm h-100 text-center border-bottom border-3 border-danger">
                                        <div className="text-danger mb-2"><FaInfoCircle /></div>
                                        <small className="d-block fw-bold text-muted">Use at least 8 characters</small>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="bg-white p-3 rounded-4 shadow-sm h-100 text-center border-bottom border-3 border-danger">
                                        <div className="text-danger mb-2"><FaShieldVirus /></div>
                                        <small className="d-block fw-bold text-muted">UpperCase, LowerCase & Numbers</small>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="bg-white p-3 rounded-4 shadow-sm h-100 text-center border-bottom border-3 border-danger">
                                        <div className="text-danger mb-2"><FaLock /></div>
                                        <small className="d-block fw-bold text-muted">Avoid common passwords</small>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>

            <style jsx="true">{`
                .fw-black { font-weight: 900; }
                .letter-spacing-1 { letter-spacing: 1px; }
                .letter-spacing-2 { letter-spacing: 2px; }
                .hover-scale { transition: all 0.3s ease; }
                .hover-scale:hover { transform: scale(1.02); }
                .fade-in-up { animation: fadeInUp 0.8s ease-out both; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </BrandLayout>
    );
};

export default BrandChangePassword;
