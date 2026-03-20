import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Badge, Button, Spinner } from 'react-bootstrap';
import { FaCheck, FaTimes, FaBuilding } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api, { BASE_URL } from '../services/api';
import AdminLayout from './AdminLayout';

const BrandApprovals = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [pendingBrands, setPendingBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/');
            } else {
                fetchBrandsData();
            }
        }
    }, [user, authLoading, navigate]);

    const fetchBrandsData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/brand-requests');
            setPendingBrands(data);
        } catch (error) {
            console.error('Error fetching brand requests', error);
        }
        setLoading(false);
    };

    const handleAction = async (brandId, status) => {
        setActionLoading(brandId);
        try {
            await api.put(`/admin/brands/${brandId}`, { status });
            setPendingBrands(prev => prev.filter(b => b._id !== brandId));
            alert(`Brand ${status} successfully!`);
        } catch (error) {
            alert(`Error updating brand status`);
        }
        setActionLoading(null);
    };

    if (authLoading || !user) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

    return (
        <AdminLayout title="Brand Approvals">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <p className="text-muted mb-0">Review and approve new brand registrations on the platform.</p>
                <Badge bg="danger" pill className="px-3 py-2 fs-6">
                    {pendingBrands.length} Requests Pending
                </Badge>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="danger" />
                        </div>
                    ) : pendingBrands.length === 0 ? (
                        <div className="text-center py-5 px-4">
                            <div className="display-1 text-muted opacity-25 mb-3"><FaBuilding /></div>
                            <h4 className="text-muted fw-bold">No pending approval requests</h4>
                            <p className="text-muted small">All brand registrations have been processed.</p>
                            <Button onClick={() => navigate('/admin/dashboard')} variant="outline-danger" className="rounded-pill px-4 mt-2">
                                Back to Dashboard
                            </Button>
                        </div>
                    ) : (
                        <Table hover responsive className="mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="px-4 py-3">Logo</th>
                                    <th className="py-3">Brand Name</th>
                                    <th className="py-3">Owner</th>
                                    <th className="py-3">Contact Email</th>
                                    <th className="py-3">GST No.</th>
                                    <th className="px-4 py-3 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingBrands.map(brand => (
                                    <tr key={brand._id}>
                                        <td className="px-4 py-3">
                                            <div className="bg-white rounded p-1 border shadow-sm" style={{ width: '55px', height: '55px' }}>
                                                <img 
                                                    src={brand.logo?.startsWith('http') ? brand.logo : `${BASE_URL}${brand.logo}`} 
                                                    alt={brand.brandName} 
                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-dark">{brand.brandName}</div>
                                            <div className="small text-muted">{brand.city}, {brand.country}</div>
                                        </td>
                                        <td>{brand.ownerName || 'N/A'}</td>
                                        <td>{brand.email}</td>
                                        <td><Badge bg="secondary" className="fw-normal bg-opacity-75">{brand.gstNo || 'Not Provided'}</Badge></td>
                                        <td className="px-4 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Button 
                                                    variant="success" 
                                                    size="sm" 
                                                    className="rounded-pill px-3 py-1 shadow-sm d-flex align-items-center"
                                                    onClick={() => handleAction(brand._id, 'approved')}
                                                    disabled={actionLoading === brand._id}
                                                >
                                                    {actionLoading === brand._id ? <Spinner size="sm" /> : <><FaCheck className="me-1" /> Approve</>}
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    size="sm" 
                                                    className="rounded-pill px-3 py-1 shadow-sm d-flex align-items-center"
                                                    onClick={() => handleAction(brand._id, 'rejected')}
                                                    disabled={actionLoading === brand._id}
                                                >
                                                    {actionLoading === brand._id ? <Spinner size="sm" /> : <><FaTimes className="me-1" /> Reject</>}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <div className="mt-4 p-4 bg-white rounded-4 shadow-sm border-start border-danger border-5">
                <h5 className="fw-bold mb-2">Notice for Administrators</h5>
                <p className="text-muted small mb-0">
                    Approving a brand allows them to list products in the store and process orders. 
                    Please ensure the GST number and business details have been verified before granting access.
                </p>
            </div>
        </AdminLayout>
    );
};

export default BrandApprovals;
