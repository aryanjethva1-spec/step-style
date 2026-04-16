import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Image, Badge, Spinner, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import api, { BASE_URL } from '../services/api';
import {
    FaUser, FaEnvelope, FaPhone, FaVenusMars, FaShieldAlt,
    FaMapMarkerAlt, FaEdit, FaPlus, FaShoppingBag,
    FaHeart, FaStar, FaCamera, FaCheckCircle, FaExclamationCircle, FaTimes, FaSave
} from 'react-icons/fa';

import UserLayout from '../dashboards/UserLayout';

const Profile = () => {
    const { user, brand, updateProfile, loading: authLoading } = useContext(AuthContext);
    const { wishlist } = useContext(WishlistContext);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [gender, setGender] = useState('Male');
    const [image, setImage] = useState('');

    // Address fields
    const [addressLine1, setAddressLine1] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [country, setCountry] = useState('India');

    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderCount, setOrderCount] = useState(0);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    useEffect(() => {
        if (!authLoading && !user && !brand) {
            navigate('/login');
        }
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setImage(user.image || '');
            setContact(user.contact || '');
            setGender(user.gender || 'Male');
            setAddressLine1(user.addressLine1 || '');
            setCity(user.city || '');
            setState(user.state || '');
            setPincode(user.pincode || '');
            setCountry(user.country || 'India');
            fetchOrderStats();
        }
    }, [user, authLoading]);

    const fetchOrderStats = async () => {
        try {
            const { data } = await api.get('/orders/myorders');
            setOrderCount(data.length);
        } catch (err) {
            console.error('Error fetching order stats');
        }
    };

    const handleCancelEdit = () => {
        // Reset form fields back to current user data
        if (user) {
            setName(user.name || '');
            setContact(user.contact || '');
            setGender(user.gender || 'Male');
            setImage(user.image || '');
        }
        setIsEditing(false);
        setError(null);
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };
            const { data } = await api.post('/upload', formData, config);
            setImage(data.image);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Image upload failed');
            setUploading(false);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const res = await updateProfile({
            name,
            image,
            gender,
            contact,
            addressLine1,
            city,
            state,
            pincode,
            country
        });

        setLoading(false);
        if (res.success) {
            setMessage('Profile updated successfully');
            setIsEditing(false);
            setTimeout(() => setMessage(null), 3000);
        } else {
            setError(res.message);
        }
    };

    const handleEditAddress = () => {
        setIsEditingAddress(true);
        setShowAddressModal(true);
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await updateProfile({
            ...user,
            addressLine1,
            city,
            state,
            pincode,
            country
        });
        setLoading(false);
        if (res.success) {
            setMessage('Address updated successfully');
            setShowAddressModal(false);
            setTimeout(() => setMessage(null), 3000);
        } else {
            setError(res.message);
        }
    };


    const profileImageSrc = image
        ? (image.startsWith('http') ? image : `${BASE_URL}${image}`)
        : 'https://via.placeholder.com/150';

    if (authLoading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;

    return (
        <UserLayout title="My Profile">
            <div className="bg-light pb-5 pt-4">
                <Container>
                    {message && <Alert variant="success" className="rounded-4 border-0 shadow-sm mb-4 fade-in">{message}</Alert>}
                    {error && <Alert variant="danger" className="rounded-4 border-0 shadow-sm mb-4 fade-in">{error}</Alert>}

                    <Row className="g-4">
                        {/* Left Column: Stats & Security */}
                        {user?.role !== 'admin' && !brand && (
                            <Col lg={4} className="order-lg-2">
                                {/* Account Statistics */}
                                <div className="mb-4 fade-in-right">
                                    <h5 className="fw-black text-uppercase border-start border-danger border-4 ps-3 mb-4 letter-spacing-1">Activity</h5>
                                    <Row className="g-3">
                                        <Col xs={6}>
                                            <Card className="border-0 shadow-sm rounded-4 text-center p-3 h-100 bg-white">
                                                <div className="mb-2 text-danger opacity-75"><FaShoppingBag size={24} /></div>
                                                <h3 className="fw-black mb-0">{orderCount}</h3>
                                                <p className="text-muted small fw-bold text-uppercase mb-0">Orders</p>
                                            </Card>
                                        </Col>
                                        <Col xs={6}>
                                            <Card className="border-0 shadow-sm rounded-4 text-center p-3 h-100 bg-white">
                                                <div className="mb-2 text-danger opacity-75"><FaHeart size={24} /></div>
                                                <h3 className="fw-black mb-0">{wishlist?.products?.length || 0}</h3>
                                                <p className="text-muted small fw-bold text-uppercase mb-0">Wishlist</p>
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>

                                {/* Profile Security Section */}
                                <div className="fade-in-right" style={{ animationDelay: '0.2s' }}>
                                    <h5 className="fw-black text-uppercase border-start border-danger border-4 ps-3 mb-4 letter-spacing-1">Security Status</h5>
                                    <Card className="border-0 shadow-sm rounded-4 mb-4">
                                        <Card.Body className="p-4">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-light p-2 rounded-circle text-muted"><FaShieldAlt size={20} /></div>
                                                    <div>
                                                        <p className="fw-bold mb-0 small text-uppercase">Email Verification</p>
                                                        <p className="text-muted small mb-0">{email}</p>
                                                    </div>
                                                </div>
                                                <Badge bg="success" className="rounded-pill px-3 py-2 fw-bold text-uppercase" style={{ fontSize: '10px' }}>
                                                    <FaCheckCircle className="me-1" /> Verified
                                                </Badge>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>
                        )}

                        {/* Right Column: Profile Info & Addresses */}
                        <Col lg={user?.role === 'admin' || brand ? 12 : 8} className="order-lg-1">
                            <div className="mb-5 fade-in-left">
                                {/* Section header with Edit Profile button */}
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-black text-uppercase border-start border-danger border-4 ps-3 mb-0 letter-spacing-1">Personal Details</h5>
                                    {!isEditing && (
                                        <Button
                                            variant="danger"
                                            className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <FaEdit /> Edit Profile
                                        </Button>
                                    )}
                                </div>

                                <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                                    <Card.Body className="p-4 p-md-5">
                                        {/* ── VIEW MODE ── */}
                                        {!isEditing ? (
                                            <div>
                                                {/* Avatar */}
                                                <div className="text-center mb-5">
                                                    <Image
                                                        src={profileImageSrc}
                                                        roundedCircle
                                                        className="border border-4 border-white shadow-lg"
                                                        style={{ width: '130px', height: '130px', objectFit: 'cover' }}
                                                    />
                                                </div>

                                                <Row className="g-4">
                                                    <Col md={6}>
                                                        <p className="small fw-black text-uppercase text-muted letter-spacing-1 mb-1">Full Name</p>
                                                        <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-4 py-3">
                                                            <FaUser className="text-muted" />
                                                            <span className="fw-bold">{name || '—'}</span>
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <p className="small fw-black text-uppercase text-muted letter-spacing-1 mb-1">Email Address</p>
                                                        <div className="d-flex align-items-center gap-2 bg-white rounded-pill px-4 py-3 border">
                                                            <FaEnvelope className="text-muted" />
                                                            <span className="fw-bold opacity-75">{email || '—'}</span>
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <p className="small fw-black text-uppercase text-muted letter-spacing-1 mb-1">Phone Number</p>
                                                        <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-4 py-3">
                                                            <FaPhone className="text-muted" />
                                                            <span className="fw-bold">{contact || '—'}</span>
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <p className="small fw-black text-uppercase text-muted letter-spacing-1 mb-1">Gender</p>
                                                        <div className="d-flex align-items-center gap-2 bg-light rounded-pill px-4 py-3">
                                                            <FaVenusMars className="text-muted" />
                                                            <span className="fw-bold">{gender || '—'}</span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ) : (
                                            /* ── EDIT MODE ── */
                                            <Form onSubmit={submitHandler}>
                                                {/* Profile Photo */}
                                                <div className="text-center mb-5">
                                                    <div className="position-relative d-inline-block">
                                                        <Image
                                                            src={profileImageSrc}
                                                            roundedCircle
                                                            className="border border-4 border-white shadow-lg"
                                                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                                        />
                                                        <label htmlFor="profile-upload" className="position-absolute bottom-0 end-0 bg-danger text-white rounded-circle p-3 cursor-pointer shadow hover-scale" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <FaCamera />
                                                            <input type="file" id="profile-upload" hidden onChange={uploadFileHandler} />
                                                        </label>
                                                    </div>
                                                    {uploading && <div className="mt-3"><Spinner animation="border" size="sm" variant="danger" /> <small className="fw-bold text-danger ms-2">Uploading...</small></div>}
                                                </div>

                                                <Row className="g-4">
                                                    <Col md={6}>
                                                        <Form.Group controlId="name">
                                                            <Form.Label className="small fw-black text-uppercase text-muted letter-spacing-1">Full Name</Form.Label>
                                                            <div className="input-group">
                                                                <span className="input-group-text bg-light border-0 rounded-start-pill ps-4 text-muted"><FaUser /></span>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Enter your name"
                                                                    value={name}
                                                                    onChange={(e) => setName(e.target.value)}
                                                                    className="rounded-end-pill px-3 py-3 border-0 bg-light fw-bold"
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId="email">
                                                            <Form.Label className="small fw-black text-uppercase text-muted letter-spacing-1">Email Address</Form.Label>
                                                            <div className="input-group opacity-75">
                                                                <span className="input-group-text bg-white border-0 rounded-start-pill ps-4 text-muted"><FaEnvelope /></span>
                                                                <Form.Control
                                                                    type="email"
                                                                    value={email}
                                                                    disabled
                                                                    className="rounded-end-pill px-3 py-3 border-0 bg-white fw-bold"
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId="contact">
                                                            <Form.Label className="small fw-black text-uppercase text-muted letter-spacing-1">Phone Number</Form.Label>
                                                            <div className="input-group">
                                                                <span className="input-group-text bg-light border-0 rounded-start-pill ps-4 text-muted"><FaPhone /></span>
                                                                <Form.Control
                                                                    type="text"
                                                                    placeholder="Your mobile number"
                                                                    value={contact}
                                                                    onChange={(e) => setContact(e.target.value)}
                                                                    className="rounded-end-pill px-3 py-3 border-0 bg-light fw-bold"
                                                                />
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group controlId="gender">
                                                            <Form.Label className="small fw-black text-uppercase text-muted letter-spacing-1">Gender</Form.Label>
                                                            <div className="input-group">
                                                                <span className="input-group-text bg-light border-0 rounded-start-pill ps-4 text-muted"><FaVenusMars /></span>
                                                                <Form.Select
                                                                    value={gender}
                                                                    onChange={(e) => setGender(e.target.value)}
                                                                    className="rounded-end-pill px-3 py-3 border-0 bg-light fw-bold shadow-none"
                                                                >
                                                                    <option value="Male">Male</option>
                                                                    <option value="Female">Female</option>
                                                                </Form.Select>
                                                            </div>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <div className="d-flex justify-content-end gap-3 mt-5">
                                                    <Button
                                                        variant="outline-secondary"
                                                        type="button"
                                                        className="rounded-pill px-4 py-3 fw-bold d-flex align-items-center gap-2"
                                                        onClick={handleCancelEdit}
                                                        disabled={loading}
                                                    >
                                                        <FaTimes /> Cancel
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        type="submit"
                                                        className="rounded-pill px-5 py-3 fw-black text-uppercase letter-spacing-1 shadow hover-scale d-flex align-items-center gap-2"
                                                        disabled={loading}
                                                    >
                                                        {loading ? <Spinner animation="border" size="sm" /> : <><FaSave /> Save Changes</>}
                                                    </Button>
                                                </div>
                                            </Form>
                                        )}
                                    </Card.Body>
                                </Card>
                            </div>

                            {/* Saved Address Section */}
                            {user?.role !== 'admin' && !brand && (
                                <div className="fade-in-left" style={{ animationDelay: '0.2s' }}>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="fw-black text-uppercase border-start border-danger border-4 ps-3 mb-0 letter-spacing-1">Saved Address</h5>
                                    </div>

                                    <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden border-start border-danger border-4">
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-danger bg-opacity-10 text-danger p-3 rounded-4"><FaMapMarkerAlt size={24} /></div>
                                                    <div>
                                                        <h6 className="fw-black text-dark mb-1">{name || 'Default Recipient'}</h6>
                                                        <p className="text-muted small fw-bold mb-0"><FaPhone className="me-2" />{contact || 'No contact added'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-light p-3 rounded-4 mb-4">
                                                <p className="mb-1 fw-bold text-dark">{addressLine1 || 'No address line 1 saved'}</p>
                                                <p className="text-muted small mb-0">{city ? `${city}, ${state} - ${pincode}` : 'Address details incomplete'}</p>
                                                <p className="text-muted small mb-0">{country}</p>
                                            </div>

                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-dark"
                                                    className="rounded-pill px-3 fw-bold text-uppercase small flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2"
                                                    onClick={handleEditAddress}
                                                >
                                                    <FaEdit /> Edit Address
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>

                {/* Address Edit/Add Modal */}
                <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered size="lg">
                    <Modal.Header closeButton className="border-0">
                        <Modal.Title className="fw-black text-uppercase">
                            {addressLine1 ? 'Update Address' : 'Add New Address'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-4 p-md-5">
                        <Form onSubmit={handleAddressSubmit}>
                            <Row className="g-4">
                                <Col md={12}>
                                    <Form.Group controlId="modalAddress">
                                        <Form.Label className="small fw-black text-uppercase text-muted">Address Line</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="House No, Street, Area"
                                            value={addressLine1}
                                            onChange={(e) => setAddressLine1(e.target.value)}
                                            required
                                            className="rounded-4 px-4 py-3 border-0 bg-light fw-bold"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="modalCity">
                                        <Form.Label className="small fw-black text-uppercase text-muted">City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="City"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            required
                                            className="rounded-pill px-4 py-3 border-0 bg-light fw-bold"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="modalState">
                                        <Form.Label className="small fw-black text-uppercase text-muted">State</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="State"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            required
                                            className="rounded-pill px-4 py-3 border-0 bg-light fw-bold"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="modalPincode">
                                        <Form.Label className="small fw-black text-uppercase text-muted">Pincode</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="PIN Code"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            required
                                            className="rounded-pill px-4 py-3 border-0 bg-light fw-bold"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="text-end mt-5">
                                <Button
                                    variant="outline-dark"
                                    className="rounded-pill px-4 py-3 fw-bold me-3 text-uppercase"
                                    onClick={() => setShowAddressModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    type="submit"
                                    className="rounded-pill px-5 py-3 fw-black text-uppercase shadow-sm"
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Save Address'}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>

            </div>
        </UserLayout>
    );
};

export default Profile;
