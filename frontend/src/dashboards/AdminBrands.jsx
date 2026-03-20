import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Badge, Button, Modal, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api, { BASE_URL } from '../services/api';
import AdminLayout from './AdminLayout';
import { FaEye, FaTrash, FaSearch, FaGlobe, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaIdCard, FaUser } from 'react-icons/fa';

const AdminBrands = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                navigate('/');
            } else {
                fetchBrands();
            }
        }
    }, [user, authLoading, navigate]);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/brands');
            setBrands(data);
        } catch (error) {
            console.error('Error fetching brands', error);
        }
        setLoading(false);
    };

    const deleteBrand = async (brandId) => {
        if(window.confirm('Are you sure you want to delete this brand?')) {
            try {
                await api.delete(`/admin/brands/${brandId}`);
                fetchBrands();
            } catch (error) {
                alert('Error deleting brand');
            }
        }
    }

    const handleViewBrand = (brand) => {
        setSelectedBrand(brand);
        setShowModal(true);
    };

    if (authLoading || loading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;

    const filteredBrands = brands.filter(b => 
        b.brandName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Brand Management">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Header className="bg-white py-3 border-0">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h5 className="mb-0 fw-bold text-muted text-uppercase small">Partner Brands List</h5>
                            <Badge bg="danger" pill className="mt-1 px-3 py-2">{filteredBrands.length} Total Partners</Badge>
                        </div>
                        <div className="search-box" style={{ maxWidth: '300px' }}>
                            <InputGroup className="bg-light rounded-pill border-0 overflow-hidden shadow-sm">
                                <InputGroup.Text className="bg-transparent border-0 ps-3">
                                    <FaSearch className="text-muted" />
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by brand name or email..."
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
                                <th className="px-4 py-3">Brand Name</th>
                                <th className="py-3">Email</th>
                                <th className="py-3">Status</th>
                                <th className="py-3">Joined</th>
                                <th className="px-4 py-3 text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBrands.length > 0 ? filteredBrands.map(b => (
                                <tr key={b._id}>
                                    <td className="px-4 d-flex align-items-center gap-3 py-3">
                                        <div className="bg-white rounded p-1 border shadow-sm" style={{ width: '45px', height: '45px' }}>
                                            <img 
                                                src={b.logo?.startsWith('http') ? b.logo : `${BASE_URL}${b.logo}`} 
                                                alt={b.brandName} 
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                            />
                                        </div>
                                        <span className="fw-bold text-dark">{b.brandName}</span>
                                    </td>
                                    <td>{b.email}</td>
                                    <td>
                                        <Badge bg="success" className="rounded-pill px-3 py-2 text-uppercase text-dark small fw-bold">
                                            {b.status}
                                        </Badge>
                                    </td>
                                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Button 
                                                className="btn-lax-view" 
                                                onClick={() => handleViewBrand(b)}
                                            >
                                                <FaEye size={12} /> View
                                            </Button>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm" 
                                                className="rounded-pill px-3" 
                                                onClick={() => deleteBrand(b._id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">No brands found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Brand Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold fs-4">Brand Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-3">
                    {selectedBrand && (
                        <div className="brand-profile">
                            <Row className="mb-4">
                                <Col md={4} className="text-center">
                                    <div className="bg-white rounded-4 p-3 border shadow-sm mb-3 mx-auto" style={{ width: '150px', height: '150px' }}>
                                        <img 
                                            src={selectedBrand.logo?.startsWith('http') ? selectedBrand.logo : `${BASE_URL}${selectedBrand.logo}`} 
                                            alt={selectedBrand.brandName} 
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                        />
                                    </div>
                                    <h4 className="fw-bold text-dark mb-1">{selectedBrand.brandName}</h4>
                                    <Badge bg="success" pill className="px-3 py-2 text-uppercase mb-3">Verified Partner</Badge>
                                </Col>
                                <Col md={8}>
                                    <div className="p-4 bg-light rounded-4 h-100">
                                        <h5 className="fw-bold border-bottom pb-2 mb-3">About Brand</h5>
                                        <p className="text-muted mb-4">{selectedBrand.description || 'No description provided.'}</p>
                                        
                                        <Row className="g-3">
                                            <Col sm={6}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="bg-white p-2 rounded shadow-sm"><FaEnvelope className="text-danger" /></div>
                                                    <div>
                                                        <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '10px' }}>Email Address</small>
                                                        <span className="fw-semibold small">{selectedBrand.email}</span>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="bg-white p-2 rounded shadow-sm"><FaUser className="text-danger" /></div>
                                                    <div>
                                                        <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '10px' }}>Owner Name</small>
                                                        <span className="fw-semibold small">{selectedBrand.ownerName || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="bg-white p-2 rounded shadow-sm"><FaPhoneAlt className="text-danger" /></div>
                                                    <div>
                                                        <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '10px' }}>Contact Number</small>
                                                        <span className="fw-semibold small">{selectedBrand.contact || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="bg-white p-2 rounded shadow-sm"><FaIdCard className="text-danger" /></div>
                                                    <div>
                                                        <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '10px' }}>GST Number</small>
                                                        <span className="fw-semibold small">{selectedBrand.gstNo || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>

                            <div className="p-4 bg-dark text-white rounded-4 shadow-sm border-0 mt-4">
                                <h5 className="fw-bold border-bottom border-secondary pb-2 mb-3 d-flex align-items-center gap-2">
                                    <FaMapMarkerAlt /> Business Address
                                </h5>
                                <div className="row g-3">
                                    <div className="col-md-12 mb-2">
                                        <div className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '10px' }}>Street Address</div>
                                        <div className="fw-semibold">{selectedBrand.address || 'N/A'}</div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '10px' }}>City</div>
                                        <div>{selectedBrand.city || 'N/A'}</div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '10px' }}>State</div>
                                        <div>{selectedBrand.state || 'N/A'}</div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '10px' }}>Pincode</div>
                                        <div>{selectedBrand.pincode || 'N/A'}</div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '10px' }}>Country</div>
                                        <div>{selectedBrand.country || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 bg-light rounded-bottom-4 mt-3">
                    <Button variant="outline-dark" className="rounded-pill px-4" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </AdminLayout>
    );
};

export default AdminBrands;
