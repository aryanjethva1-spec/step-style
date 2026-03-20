import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Badge, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import AdminLayout from './AdminLayout';
import { FaEye, FaTrash, FaSearch } from 'react-icons/fa';

const AdminUsers = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/');
            } else {
                fetchUsers();
            }
        }
    }, [user, authLoading, navigate]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
        setLoading(false);
    };

    const deleteUserHandler = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/admin/users/${userId}`);
                fetchUsers();
            } catch (error) {
                alert('Error deleting user');
            }
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    if (authLoading || loading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;

    const customers = users.filter(u => 
        u.role !== 'admin' && 
        (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout title="User Management">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Header className="bg-white py-3 border-0">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h5 className="mb-0 fw-bold text-muted text-uppercase small">Global Customer List</h5>
                            <Badge bg="danger" pill className="mt-1 px-3 py-2">{customers.length} Total Customers</Badge>
                        </div>
                        <div className="search-box" style={{ maxWidth: '300px' }}>
                            <InputGroup className="bg-light rounded-pill border-0 overflow-hidden shadow-sm">
                                <InputGroup.Text className="bg-transparent border-0 ps-3">
                                    <FaSearch className="text-muted" />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="bg-transparent border-0 shadow-none py-2"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3">User ID</th>
                                <th className="py-3">Name</th>
                                <th className="py-3">Email</th>
                                <th className="py-3">Joined</th>
                                <th className="px-4 py-3 text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length > 0 ? customers.map(u => (
                                <tr key={u._id}>
                                    <td className="px-4 text-muted small">...{u._id.substring(u._id.length - 6)}</td>
                                    <td className="fw-semibold">{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Button 
                                                className="btn-lax-view" 
                                                onClick={() => handleViewUser(u)}
                                            >
                                                <FaEye size={12} /> View
                                            </Button>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm" 
                                                className="rounded-pill px-3" 
                                                onClick={() => deleteUserHandler(u._id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">No customers found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* User Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="md">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    {selectedUser && (
                        <div className="user-info">
                            <div className="d-flex flex-column align-items-center mb-4">
                                <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center mb-2" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                    {selectedUser.name.charAt(0).toUpperCase()}
                                </div>
                                <h4 className="fw-bold mb-0">{selectedUser.name}</h4>
                                <Badge bg="light" text="dark" pill className="border mt-1">{selectedUser.role.toUpperCase()}</Badge>
                            </div>
                            
                            <div className="details-grid p-3 bg-light rounded-4">
                                <div className="detail-item mb-3">
                                    <label className="text-muted small text-uppercase fw-bold d-block">Full Email Address</label>
                                    <div className="fw-semibold">{selectedUser.email}</div>
                                </div>
                                <div className="detail-item mb-3">
                                    <label className="text-muted small text-uppercase fw-bold d-block">User ID</label>
                                    <code className="bg-white px-2 py-1 rounded border small">{selectedUser._id}</code>
                                </div>
                                <div className="detail-item mb-3">
                                    <label className="text-muted small text-uppercase fw-bold d-block">Account Created</label>
                                    <div className="fw-semibold">
                                        {new Date(selectedUser.createdAt).toLocaleDateString(undefined, { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                                <div className="detail-item">
                                    <label className="text-muted small text-uppercase fw-bold d-block">Last Updated</label>
                                    <div className="fw-semibold">{new Date(selectedUser.updatedAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="dark" className="rounded-pill px-4" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};

export default AdminUsers;
