import React, { useState, useContext } from 'react';
import { Card, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaLock, FaKey, FaShieldAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import AdminLayout from './AdminLayout';

const AdminChangePassword = () => {
    const { user } = useContext(AuthContext);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            return setError('New passwords do not match');
        }

        if (newPassword.length < 6) {
            return setError('New password must be at least 6 characters long');
        }

        setLoading(true);
        try {
            const { data } = await api.put('/auth/change-password', {
                oldPassword,
                newPassword
            });
            setSuccess(data.message);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error changing password');
        }
        setLoading(false);
    };

    return (
        <AdminLayout title="Security Settings">
            <Row className="justify-content-start">
                <Col md={8} lg={6}>
                    <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                        <Card.Header className="bg-white border-bottom-0 pt-4 px-4 pb-0">
                            <h5 className="fw-bold mb-0">Change Password</h5>
                            <p className="text-muted small">Update your account password regularly to keep it secure.</p>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {error && <Alert variant="danger" className="rounded-3 border-0 small py-2">{error}</Alert>}
                            {success && <Alert variant="success" className="rounded-3 border-0 small py-2">{success}</Alert>}
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Current Password</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><FaKey className="text-muted" /></span>
                                        <Form.Control 
                                            type="password" 
                                            placeholder="Enter current password"
                                            className="bg-light border-0 py-2 ms-1 rounded-end"
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">New Password</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><FaLock className="text-muted" /></span>
                                        <Form.Control 
                                            type="password" 
                                            placeholder="Enter new password"
                                            className="bg-light border-0 py-2 ms-1 rounded-end"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold">Confirm New Password</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><FaShieldAlt className="text-muted" /></span>
                                        <Form.Control 
                                            type="password" 
                                            placeholder="Confirm your new password"
                                            className="bg-light border-0 py-2 ms-1 rounded-end"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Button 
                                    variant="danger" 
                                    type="submit" 
                                    className="w-100 rounded-pill py-2 fw-bold shadow-sm transition-all"
                                    disabled={loading}
                                >
                                    {loading ? <Spinner size="sm" /> : 'Update Password'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    <div className="mt-4 p-4 bg-white rounded-4 shadow-sm border-start border-danger border-5">
                        <h6 className="fw-bold mb-2">Password Requirements</h6>
                        <ul className="text-muted small mb-0 ps-3">
                            <li className="mb-1">Must be at least 6 characters long.</li>
                            <li className="mb-1">Should include a mix of letters and numbers.</li>
                            <li>Avoid using easily guessable information like birthdays.</li>
                        </ul>
                    </div>
                </Col>
            </Row>
        </AdminLayout>
    );
};

export default AdminChangePassword;
