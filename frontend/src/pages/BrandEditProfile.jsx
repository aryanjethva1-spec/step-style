import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert, Spinner, Image } from 'react-bootstrap';
import { FaStore, FaUser, FaPhone, FaMapMarkerAlt, FaFileAlt, FaCamera, FaCheckCircle, FaIdCard, FaCity, FaGlobe } from 'react-icons/fa';
import BrandLayout from '../dashboards/BrandLayout';
import { AuthContext } from '../context/AuthContext';
import api, { BASE_URL } from '../services/api';

const BrandEditProfile = () => {
    const { brand, setBrand } = useContext(AuthContext);

    const [form, setForm] = useState({
        brandName: '',
        ownerName: '',
        username: '',
        contact: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        gstNo: '',
        description: '',
        logo: '',
    });

    const [logoPreview, setLogoPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Fetch full brand profile on mount
    useEffect(() => {
        const fetchFull = async () => {
            try {
                const { data } = await api.get('/brand/profile-full');
                setForm({
                    brandName: data.brandName || '',
                    ownerName: data.ownerName || '',
                    username: data.username || '',
                    contact: data.contact || '',
                    address: data.address || '',
                    city: data.city || '',
                    state: data.state || '',
                    pincode: data.pincode || '',
                    country: data.country || '',
                    gstNo: data.gstNo || '',
                    description: data.description || '',
                    logo: data.logo || '',
                });
                setLogoPreview(data.logo || '');
            } catch {
                // Fallback to auth context values
                if (brand) {
                    setForm(f => ({
                        ...f,
                        brandName: brand.brandName || '',
                        logo: brand.logo || '',
                    }));
                    setLogoPreview(brand.logo || '');
                }
            }
        };
        fetchFull();
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('image', file);
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const url = data.image || data.url || data.path;
            setForm(prev => ({ ...prev, logo: url }));
            setLogoPreview(url);
        } catch {
            setError('Logo upload failed. Please try again.');
        }
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!form.brandName.trim()) return setError('Brand name is required.');
        setLoading(true);
        try {
            const { data } = await api.put('/brand/profile', form);
            setSuccess(data.message || 'Profile updated successfully!');
            // Update auth context
            if (setBrand) {
                setBrand(prev => ({ ...prev, brandName: data.brandName, logo: data.logo }));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        }
        setLoading(false);
    };

    const logoSrc = logoPreview
        ? (logoPreview.startsWith('http') ? logoPreview : `${BASE_URL}${logoPreview}`)
        : null;

    return (
        <BrandLayout title="Edit Brand Profile">
            <Row className="justify-content-center">
                <Col xl={9} lg={10}>

                    {/* Logo Card */}
                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center gap-4 flex-wrap">
                                <div className="position-relative">
                                    {logoSrc ? (
                                        <Image
                                            src={logoSrc}
                                            roundedCircle
                                            style={{ width: 90, height: 90, objectFit: 'cover', border: '3px solid #dc3545' }}
                                        />
                                    ) : (
                                        <div className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                                             style={{ width: 90, height: 90, border: '3px solid #dc3545' }}>
                                            <FaStore className="text-danger" size={36} />
                                        </div>
                                    )}
                                    <label htmlFor="logo-upload"
                                           className="position-absolute bottom-0 end-0 bg-danger text-white rounded-circle d-flex align-items-center justify-content-center shadow"
                                           style={{ width: 28, height: 28, cursor: 'pointer' }}>
                                        {uploading ? <Spinner animation="border" size="sm" /> : <FaCamera size={12} />}
                                        <input id="logo-upload" type="file" accept="image/*" className="d-none" onChange={handleLogoUpload} />
                                    </label>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0">{form.brandName || 'Your Brand'}</h5>
                                    <p className="text-muted small mb-1">{brand?.email}</p>
                                    <span className={`badge rounded-pill px-3 py-1 ${brand?.status === 'approved' ? 'bg-success' : brand?.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                                        {brand?.status}
                                    </span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {error && <Alert variant="danger" className="rounded-3 border-0 shadow-sm">{error}</Alert>}
                    {success && (
                        <Alert variant="success" className="rounded-3 border-0 shadow-sm d-flex align-items-center gap-2">
                            <FaCheckCircle /> {success}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        {/* Brand Info */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                                <h6 className="fw-bold text-uppercase text-muted" style={{ letterSpacing: '1px', fontSize: '11px' }}>
                                    <FaStore className="me-2 text-danger" /> Brand Information
                                </h6>
                                <hr className="mt-2 mb-0" />
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-muted">Brand Name *</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><FaStore className="text-muted" /></span>
                                                <Form.Control
                                                    type="text"
                                                    name="brandName"
                                                    value={form.brandName}
                                                    onChange={handleChange}
                                                    placeholder="Brand Name"
                                                    className="bg-light border-0 py-2"
                                                    required
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-muted">Username</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><FaUser className="text-muted" /></span>
                                                <Form.Control
                                                    type="text"
                                                    name="username"
                                                    value={form.username}
                                                    onChange={handleChange}
                                                    placeholder="@username"
                                                    className="bg-light border-0 py-2"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-muted">Description</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0 align-items-start pt-2"><FaFileAlt className="text-muted" /></span>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    name="description"
                                                    value={form.description}
                                                    onChange={handleChange}
                                                    placeholder="Tell customers about your brand..."
                                                    className="bg-light border-0 py-2"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Owner & Contact */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                                <h6 className="fw-bold text-uppercase text-muted" style={{ letterSpacing: '1px', fontSize: '11px' }}>
                                    <FaUser className="me-2 text-danger" /> Owner & Contact
                                </h6>
                                <hr className="mt-2 mb-0" />
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-muted">Owner Name</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><FaUser className="text-muted" /></span>
                                                <Form.Control
                                                    type="text"
                                                    name="ownerName"
                                                    value={form.ownerName}
                                                    onChange={handleChange}
                                                    placeholder="Full owner name"
                                                    className="bg-light border-0 py-2"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-muted">Contact Number</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><FaPhone className="text-muted" /></span>
                                                <Form.Control
                                                    type="tel"
                                                    name="contact"
                                                    value={form.contact}
                                                    onChange={handleChange}
                                                    placeholder="+91 XXXXX XXXXX"
                                                    className="bg-light border-0 py-2"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-muted">GST Number</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><FaIdCard className="text-muted" /></span>
                                                <Form.Control
                                                    type="text"
                                                    name="gstNo"
                                                    value={form.gstNo}
                                                    onChange={handleChange}
                                                    placeholder="GST Registration No."
                                                    className="bg-light border-0 py-2"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Address */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Header className="bg-white border-0 pt-4 px-4 pb-0">
                                <h6 className="fw-bold text-uppercase text-muted" style={{ letterSpacing: '1px', fontSize: '11px' }}>
                                    <FaMapMarkerAlt className="me-2 text-danger" /> Address Details
                                </h6>
                                <hr className="mt-2 mb-0" />
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Row className="g-3">
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-muted">Street Address</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><FaMapMarkerAlt className="text-muted" /></span>
                                                <Form.Control
                                                    type="text"
                                                    name="address"
                                                    value={form.address}
                                                    onChange={handleChange}
                                                    placeholder="Street address"
                                                    className="bg-light border-0 py-2"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-muted">City</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><FaCity className="text-muted" /></span>
                                                <Form.Control
                                                    type="text"
                                                    name="city"
                                                    value={form.city}
                                                    onChange={handleChange}
                                                    placeholder="City"
                                                    className="bg-light border-0 py-2"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-muted">State</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="state"
                                                value={form.state}
                                                onChange={handleChange}
                                                placeholder="State"
                                                className="bg-light border-0 py-2"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-muted">Pincode</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="pincode"
                                                value={form.pincode}
                                                onChange={handleChange}
                                                placeholder="Pincode"
                                                className="bg-light border-0 py-2"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label className="small fw-bold text-uppercase text-muted">Country</Form.Label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-0"><FaGlobe className="text-muted" /></span>
                                                <Form.Control
                                                    type="text"
                                                    name="country"
                                                    value={form.country}
                                                    onChange={handleChange}
                                                    placeholder="Country"
                                                    className="bg-light border-0 py-2"
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <div className="d-flex justify-content-end gap-3">
                            <Button
                                type="submit"
                                variant="danger"
                                className="rounded-pill px-5 py-2 fw-bold shadow-sm"
                                disabled={loading || uploading}
                            >
                                {loading ? <><Spinner animation="border" size="sm" className="me-2" />Saving...</> : 'Save Changes'}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </BrandLayout>
    );
};

export default BrandEditProfile;
