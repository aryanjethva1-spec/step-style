import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Spinner, InputGroup, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaUserPlus, FaStore, FaArrowRight, FaCheckCircle, FaIdCard, FaImage, FaCloudUploadAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import api, { BASE_URL } from '../services/api';
import './Auth.css';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        user,
        brand,
        loginUser,
        loginBrand,
        registerWithOTP,
        registerBrand,
        sendOTP,
        verifyOTP,
        forgotPassword,
        sendResetOTP,
        resetPassword
    } = useContext(AuthContext);

    React.useEffect(() => {
        // Only auto-redirect if coming from somewhere else or intended to login
        const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : null;

        if (user && redirect) {
            navigate(redirect);
        } else if (user && (location.pathname === '/login' || location.pathname === '/register')) {
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/');
        }

        if (brand && (location.pathname === '/login' || location.pathname === '/register')) {
            navigate('/brand/dashboard');
        }
    }, [user, brand, navigate, location]);

    const [isRightPanelActive, setRightPanelActive] = useState(location.pathname === '/register');
    const [isBrand, setIsBrand] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Registration Step Management
    const [regStep, setRegStep] = useState(1); // 1: Credentials, 2: OTP, 3: Details

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register State - Step 1
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPass, setRegPass] = useState('');
    const [regConfirmPass, setRegConfirmPass] = useState('');

    // Register State - Step 2
    const [otp, setOtp] = useState('');

    // Register State - Step 3 (Common)
    // Register State - Step 3 (User)
    const [regContact, setRegContact] = useState('');
    const [regCity, setRegCity] = useState('');
    const [regPincode, setRegPincode] = useState('');
    const [regAddress1, setRegAddress1] = useState('');
    const [regAddress2, setRegAddress2] = useState('');
    const [regState, setRegState] = useState('');
    const [regCountry, setRegCountry] = useState('');
    const [regAddressType, setRegAddressType] = useState('Home');
    const [regLandmark, setRegLandmark] = useState('');
    const [regGender, setRegGender] = useState('Male');

    // Register State - Step 3 (Brand Only)
    const [regOwnerName, setRegOwnerName] = useState('');
    const [regUsername, setRegUsername] = useState('');
    const [regBrandDesc, setRegBrandDesc] = useState('');
    const [regGst, setRegGst] = useState('');
    const [regLogo, setRegLogo] = useState('');

    // Forgot Password State
    const [isForgotPass, setIsForgotPass] = useState(false);
    const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Pass
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');
    const [uploading, setUploading] = useState(false);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await api.post('/upload', formData, config);
            setRegLogo(data.image);
            setUploading(false);
        } catch (error) {
            console.error(error);
            setError('Image upload failed');
            setUploading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = isBrand ? await loginBrand(loginEmail, loginPassword) : await loginUser(loginEmail, loginPassword);
        if (result.success) {
            if (isBrand) {
                navigate('/brand/dashboard');
            } else {
                if (result.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleForgotPassRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const result = await forgotPassword(forgotEmail, isBrand);
        if (result.success) {
            const otpResult = await sendResetOTP(forgotEmail);
            if (otpResult.success) {
                setForgotStep(2);
            } else {
                setError(otpResult.message);
            }
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleForgotOTPVerify = (e) => {
        e.preventDefault();
        if (forgotOtp.length !== 6) return setError('Enter valid 6-digit code');
        setForgotStep(3);
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (newPass !== confirmNewPass) return setError('Passwords do not match');
        if (newPass.length < 6) return setError('Password must be at least 6 characters');

        setLoading(true);
        setError('');
        const result = await resetPassword(forgotEmail, forgotOtp, newPass, isBrand);
        if (result.success) {
            setIsForgotPass(false);
            setForgotStep(1);
            setError('');
            alert('Password reset successful! Please sign in with your new password.');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleInitialSubmit = async (e) => {
        e.preventDefault();
        if (regPass !== regConfirmPass) return setError('Passwords do not match');
        if (regPass.length < 6) return setError('Password must be at least 6 characters');

        setLoading(true);
        setError('');
        const result = await sendOTP(regEmail);
        if (result.success) {
            setRegStep(2);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    const handleOTPVerify = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) return setError('Enter a valid 6-digit OTP');

        setLoading(true);
        setError('');

        const result = await verifyOTP(regEmail, otp);

        if (result.success) {
            setRegStep(3);
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setError('');

        const result = await sendOTP(regEmail);

        if (!result.success) {
            setError(result.message);
        }

        setLoading(false);
    };

    const handleFinalRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let result;
            if (isBrand) {
                const payload = {
                    brandName: regName,
                    email: regEmail,
                    password: regPass,
                    otp,
                    ownerName: regOwnerName,
                    username: regUsername,
                    description: regBrandDesc,
                    gstNo: regGst,
                    logo: regLogo,
                    address: regAddress1,
                    city: regCity,
                    state: regState,
                    pincode: regPincode,
                    country: regCountry,
                    contact: regContact
                };
                result = await registerBrand(payload);
            } else {
                const payload = {
                    name: regName,
                    email: regEmail,
                    password: regPass,
                    otp,
                    image: regLogo,
                    addressLine1: regAddress1,
                    addressLine2: regAddress2,
                    city: regCity,
                    state: regState,
                    pincode: regPincode,
                    country: regCountry,
                    addressType: regAddressType,
                    landmark: regLandmark,
                    contact: regContact,
                    gender: regGender
                };
                result = await registerWithOTP(payload);
            }

            if (result.success) {
                navigate(isBrand ? '/brand/dashboard' : '/');
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>

                {/* Sign Up Section */}
                <div className="form-container sign-up-container p-4 d-flex flex-column justify-content-center">
                    <div className="w-100 scrollable-form px-1 px-lg-3">
                        <div className="text-center mb-4">
                            <h2 className="fw-black mb-1 text-dark">{isBrand ? 'Brand Partner' : 'Join StepStyle'}</h2>
                            <p className="text-muted small">Step {regStep} of 3: {regStep === 1 ? 'Credentials' : regStep === 2 ? 'Verification' : 'Profile Details'}</p>
                        </div>

                        {regStep === 1 && (
                            <div className="d-flex gap-3 mb-4">
                                <div className={`role-toggle-btn ${!isBrand ? 'active' : ''}`} onClick={() => setIsBrand(false)}>
                                    <FaUser /> <span>Customer</span>
                                </div>
                                <div className={`role-toggle-btn ${isBrand ? 'active' : ''}`} onClick={() => setIsBrand(true)}>
                                    <FaStore /> <span>Brand Seller</span>
                                </div>
                            </div>
                        )}

                        {error && isRightPanelActive && <Alert variant="danger" className="py-2 border-0 small shadow-sm mb-4">{error}</Alert>}

                        {/* Registration Steps */}
                        {regStep === 1 && (
                            <Form onSubmit={handleInitialSubmit}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-light border-0"><FaIdCard className="text-muted" /></InputGroup.Text>
                                    <Form.Control type="text" placeholder={isBrand ? "Official Brand Name" : "Your full name"} required value={regName} onChange={(e) => setRegName(e.target.value)} className="bg-light border-0 py-2" />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-light border-0"><FaEnvelope className="text-muted" /></InputGroup.Text>
                                    <Form.Control type="email" placeholder="Work email address" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="bg-light border-0 py-2" />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-light border-0"><FaLock className="text-muted" /></InputGroup.Text>
                                    <Form.Control type="password" placeholder="Create password" required value={regPass} onChange={(e) => setRegPass(e.target.value)} className="bg-light border-0 py-2" />
                                </InputGroup>

                                <InputGroup className="mb-4">
                                    <InputGroup.Text className="bg-light border-0"><FaCheckCircle className="text-muted" /></InputGroup.Text>
                                    <Form.Control type="password" placeholder="Confirm password" required value={regConfirmPass} onChange={(e) => setRegConfirmPass(e.target.value)} className="bg-light border-0 py-2" />
                                </InputGroup>

                                <Button variant="dark" className="w-100 auth-btn-main shadow" type="submit" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : <span>Verify Email <FaArrowRight className="ms-2" /></span>}
                                </Button>
                            </Form>
                        )}

                        {regStep === 2 && (
                            <div className="animate-fade-in text-center">
                                <div className="mb-4">
                                    <div className="p-3 rounded-circle bg-light d-inline-block mb-3">
                                        <FaEnvelope className="text-danger fs-3" />
                                    </div>
                                    <p className="text-muted small">We've sent a 6-digit code to <br /><strong>{regEmail}</strong></p>
                                </div>
                                <Form onSubmit={handleOTPVerify}>
                                    <Form.Control type="text" placeholder="· · · · · ·" maxLength="6" className="text-center fw-bold fs-3 py-3 rounded-4 letter-spacing-10 bg-light mb-4" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                                    <Button variant="danger" className="w-100 auth-btn-main shadow" type="submit">
                                        Verify & Continue
                                    </Button>
                                    <p className="mt-3 small text-muted">Didn't receive code? <span className="text-danger fw-bold cursor-pointer" onClick={handleInitialSubmit}>Resend</span></p>
                                </Form>
                            </div>
                        )}

                        {regStep === 3 && (
                            <Form onSubmit={handleFinalRegister} className="animate-fade-in registration-profile-form">
                                <h5 className="fw-bold mb-3 border-bottom pb-2">{isBrand ? 'Business Profile' : 'Delivery Details'}</h5>
                                <Row className="g-3">
                                    {!isBrand ? (
                                        <>
                                            <Col md={12}>
                                                <Form.Group controlId="userImage" className="mb-2">
                                                    <Form.Label className="small fw-bold text-muted mb-1">
                                                        <FaImage className="me-1" /> Profile Picture
                                                    </Form.Label>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Form.Control
                                                            type="file"
                                                            onChange={uploadFileHandler}
                                                            className="bg-light border-0 py-2 fs-7"
                                                        />
                                                        {uploading && <Spinner animation="border" size="sm" variant="danger" />}
                                                    </div>
                                                    {regLogo && !isBrand && (
                                                        <div className="mt-2 d-flex align-items-center gap-2">
                                                            <img src={regLogo.startsWith('http') ? regLogo : `${BASE_URL}${regLogo}`} alt="Profile" style={{ width: '50px', height: '50px', objectFit: 'cover' }} className="rounded-circle border" />
                                                            <p className="text-success small mb-0 fw-bold"><FaCheckCircle className="me-1" /> Profile Ready</p>
                                                        </div>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Control type="text" placeholder="Full Name (Receiver)" required value={regName} onChange={(e) => setRegName(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={12}>
                                                <Form.Control type="text" placeholder="Phone Number" required value={regContact} onChange={(e) => setRegContact(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={12}>
                                                <Form.Control type="text" placeholder="Address Line 1" required value={regAddress1} onChange={(e) => setRegAddress1(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={12}>
                                                <Form.Control type="text" placeholder="Address Line 2 (Optional)" value={regAddress2} onChange={(e) => setRegAddress2(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={6}>
                                                <Form.Control type="text" placeholder="City" required value={regCity} onChange={(e) => setRegCity(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={6}>
                                                <Form.Control type="text" placeholder="State" required value={regState} onChange={(e) => setRegState(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={6}>
                                                <Form.Control type="text" placeholder="PIN Code" required value={regPincode} onChange={(e) => setRegPincode(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={6}>
                                                <Form.Control type="text" placeholder="Country" required value={regCountry} onChange={(e) => setRegCountry(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={6}>
                                                <Form.Select value={regAddressType} onChange={(e) => setRegAddressType(e.target.value)} className="bg-light border-0 py-2">
                                                    <option value="Home">Home</option>
                                                    <option value="Work">Work</option>
                                                    <option value="Other">Other</option>
                                                </Form.Select>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Select value={regGender} onChange={(e) => setRegGender(e.target.value)} className="bg-light border-0 py-2">
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </Form.Select>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Control type="text" placeholder="Landmark (Optional)" value={regLandmark} onChange={(e) => setRegLandmark(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                        </>
                                    ) : (
                                        <>
                                            <Col md={12}>
                                                <Form.Control type="text" placeholder="Owner Name" required value={regOwnerName} onChange={(e) => setRegOwnerName(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={12}>
                                                <Form.Control type="text" placeholder="Preferred Username" required value={regUsername} onChange={(e) => setRegUsername(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={12}>
                                                <Form.Control type="text" placeholder="Business Phone" required value={regContact} onChange={(e) => setRegContact(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group controlId="logo" className="mb-2">
                                                    <Form.Label className="small fw-bold text-muted mb-1">
                                                        <FaImage className="me-1" /> Brand Logo
                                                    </Form.Label>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Form.Control
                                                            type="file"
                                                            onChange={uploadFileHandler}
                                                            className="bg-light border-0 py-2 fs-7"
                                                        />
                                                        {uploading && <Spinner animation="border" size="sm" variant="danger" />}
                                                    </div>
                                                    {regLogo && (
                                                        <div className="mt-2 d-flex align-items-center gap-2">
                                                            <img src={regLogo.startsWith('http') ? regLogo : `${BASE_URL}${regLogo}`} alt="Brand Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} className="rounded border bg-white" />
                                                            <p className="text-success small mb-0 fw-bold"><FaCheckCircle className="me-1" /> Logo Uploaded</p>
                                                        </div>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Control as="textarea" rows={2} placeholder="Brand Description" required value={regBrandDesc} onChange={(e) => setRegBrandDesc(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={12}>
                                                <Form.Control type="text" placeholder="Business Address" required value={regAddress1} onChange={(e) => setRegAddress1(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={6}>
                                                <Form.Control type="text" placeholder="City" required value={regCity} onChange={(e) => setRegCity(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={6}>
                                                <Form.Control type="text" placeholder="State" required value={regState} onChange={(e) => setRegState(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={6}>
                                                <Form.Control type="text" placeholder="PIN Code" required value={regPincode} onChange={(e) => setRegPincode(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={6}>
                                                <Form.Control type="text" placeholder="Country" required value={regCountry} onChange={(e) => setRegCountry(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                            <Col md={12}>
                                                <Form.Control type="text" placeholder="GST Number (Optional)" value={regGst} onChange={(e) => setRegGst(e.target.value)} className="bg-light border-0 py-2" />
                                            </Col>
                                        </>
                                    )}
                                </Row>

                                <Button variant="danger" className="w-100 auth-btn-main shadow mt-4 py-3 fw-bold" type="submit" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Complete Setup'}
                                </Button>

                                <div className="text-center mt-4 d-lg-none">
                                    <p className="text-muted small">Already have an account? <span className="text-danger fw-bold cursor-pointer" onClick={() => setRightPanelActive(false)}>Sign In</span></p>
                                </div>
                            </Form>
                        )}
                        {!loading && regStep === 1 && (
                            <div className="text-center mt-4 d-lg-none">
                                <p className="text-muted small">Already have an account? <span className="text-danger fw-bold cursor-pointer" onClick={() => setRightPanelActive(false)}>Sign In</span></p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sign In Section */}
                <div className="form-container sign-in-container p-4 p-lg-5 d-flex flex-column justify-content-center">
                    {!isForgotPass ? (
                        <Form onSubmit={handleLogin} className="w-100 animate-fade-in">
                            <div className="text-center mb-4">
                                <h2 className="fw-black mb-1 text-dark">Welcome Back</h2>
                                <p className="text-muted small">Sign in to StepStyle Account</p>
                            </div>

                            <div className="d-flex gap-3 mb-4">
                                <div className={`role-toggle-btn ${!isBrand ? 'active' : ''}`} onClick={() => setIsBrand(false)}>
                                    <FaUser /> <span>User</span>
                                </div>
                                <div className={`role-toggle-btn ${isBrand ? 'active' : ''}`} onClick={() => setIsBrand(true)}>
                                    <FaStore /> <span>Brand</span>
                                </div>
                            </div>

                            {error && !isRightPanelActive && <Alert variant="danger" className="py-2 border-0 small shadow-sm mb-4">{error}</Alert>}

                            <InputGroup className="mb-3">
                                <InputGroup.Text className="bg-light border-0"><FaEnvelope className="text-muted" /></InputGroup.Text>
                                <Form.Control type="email" placeholder="Registered email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="bg-light border-0 py-2" />
                            </InputGroup>

                            <InputGroup className="mb-4">
                                <InputGroup.Text className="bg-light border-0"><FaLock className="text-muted" /></InputGroup.Text>
                                <Form.Control type="password" placeholder="Account password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="bg-light border-0 py-2" />
                            </InputGroup>

                            <Button variant="danger" className="w-100 auth-btn-main shadow mb-3" type="submit" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Sign In Now'}
                            </Button>
                            <div className="text-center">
                                <span className="text-decoration-none text-muted small fw-semibold cursor-pointer" onClick={() => { setIsForgotPass(true); setForgotStep(1); setError(''); }}>Forgot your access details?</span>
                            </div>
                            <div className="text-center mt-4 d-lg-none">
                                <p className="text-muted small">New here? <span className="text-danger fw-bold cursor-pointer" onClick={() => setRightPanelActive(true)}>Create Account</span></p>
                            </div>
                        </Form>
                    ) : (
                        <div className="w-100 animate-fade-in">
                            <div className="text-center mb-4">
                                <h2 className="fw-black mb-1 text-dark">Reset Password</h2>
                                <p className="text-muted small">Step {forgotStep} of 3: {forgotStep === 1 ? 'Verify Email' : forgotStep === 2 ? 'Enter Code' : 'New Password'}</p>
                            </div>

                            {error && <Alert variant="danger" className="py-2 border-0 small shadow-sm mb-4">{error}</Alert>}

                            {forgotStep === 1 && (
                                <Form onSubmit={handleForgotPassRequest}>
                                    <div className="d-flex gap-3 mb-4">
                                        <div className={`role-toggle-btn ${!isBrand ? 'active' : ''}`} onClick={() => setIsBrand(false)}>
                                            <FaUser /> <span>User Account</span>
                                        </div>
                                        <div className={`role-toggle-btn ${isBrand ? 'active' : ''}`} onClick={() => setIsBrand(true)}>
                                            <FaStore /> <span>Brand Account</span>
                                        </div>
                                    </div>
                                    <InputGroup className="mb-4">
                                        <InputGroup.Text className="bg-light border-0"><FaEnvelope className="text-muted" /></InputGroup.Text>
                                        <Form.Control type="email" placeholder="Enter registered email" required value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="bg-light border-0 py-2" />
                                    </InputGroup>
                                    <Button variant="dark" className="w-100 auth-btn-main shadow mb-3" type="submit" disabled={loading}>
                                        {loading ? <Spinner animation="border" size="sm" /> : 'Send Reset Code'}
                                    </Button>
                                </Form>
                            )}

                            {forgotStep === 2 && (
                                <Form onSubmit={handleForgotOTPVerify}>
                                    <p className="text-center text-muted small mb-4">Verification code sent to <br /><strong>{forgotEmail}</strong></p>
                                    <Form.Control type="text" placeholder="· · · · · ·" maxLength="6" className="text-center fw-bold fs-3 py-3 rounded-4 letter-spacing-10 bg-light mb-4" value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} required />
                                    <Button variant="danger" className="w-100 auth-btn-main shadow mb-3" type="submit">
                                        Verify OTP
                                    </Button>
                                </Form>
                            )}

                            {forgotStep === 3 && (
                                <Form onSubmit={handlePasswordReset}>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text className="bg-light border-0"><FaLock className="text-muted" /></InputGroup.Text>
                                        <Form.Control type="password" placeholder="New strong password" required value={newPass} onChange={(e) => setNewPass(e.target.value)} className="bg-light border-0 py-2" />
                                    </InputGroup>
                                    <InputGroup className="mb-4">
                                        <InputGroup.Text className="bg-light border-0"><FaCheckCircle className="text-muted" /></InputGroup.Text>
                                        <Form.Control type="password" placeholder="Confirm new password" required value={confirmNewPass} onChange={(e) => setConfirmNewPass(e.target.value)} className="bg-light border-0 py-2" />
                                    </InputGroup>
                                    <Button variant="danger" className="w-100 auth-btn-main shadow mb-3" type="submit" disabled={loading}>
                                        {loading ? <Spinner animation="border" size="sm" /> : 'Update Password'}
                                    </Button>
                                </Form>
                            )}

                            <div className="text-center">
                                <span className="text-danger small fw-bold cursor-pointer" onClick={() => { setIsForgotPass(false); setError(''); }}>Back to Sign In</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sliding Overlay Container */}
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left p-5">
                            <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80" className="auth-image" alt="Luxury Footwear" />
                            <div className="overlay-content">
                                <h1 className="fw-black display-5 mb-3 text-white">Returning?</h1>
                                <p className="lead mb-5 text-white-50">Log back in to access your orders, wishlist, and personalized recommendations.</p>
                                <Button variant="outline-light" className="rounded-pill px-5 py-3 fw-bold border-2 hover-scale" onClick={() => setRightPanelActive(false)}>SIGN IN INSTEAD</Button>
                            </div>
                        </div>
                        <div className="overlay-panel overlay-right p-5">
                            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80" className="auth-image" alt="Run Performance" />
                            <div className="overlay-content">
                                <h1 className="fw-black display-5 mb-3 text-white">New Here?</h1>
                                <p className="lead mb-5 text-white-50">Create an account to start your footwear journey and unlock exclusive member benefits.</p>
                                <Button variant="outline-light" className="rounded-pill px-5 py-3 fw-bold border-2 hover-scale" onClick={() => setRightPanelActive(true)}>JOIN STEPSTYLE</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Auth;
