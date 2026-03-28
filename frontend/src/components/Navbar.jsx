import React, { useContext, useState } from 'react';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaStore, FaThLarge, FaHeart } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { BASE_URL } from '../services/api';

const NavigationBar = () => {
    const { user, brand, logoutUser, logoutBrand } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

    const closeNav = () => setExpanded(false);

    const handleLogout = async () => {
        closeNav();
        navigate('/');
        if (user) await logoutUser();
        if (brand) await logoutBrand();
    };

    return (
        <Navbar expanded={expanded} onToggle={setExpanded} bg="dark" variant="dark" expand="lg" sticky="top" className="py-3 shadow-sm border-bottom border-danger border-opacity-25">
            <Container>
                <Navbar.Brand as={Link} to="/" onClick={closeNav} className="fw-bold fs-3 letter-spacing-1">
                    <span className="text-danger">Step</span>Style
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {/* Simplified Navbar for Admin */}
                        {user && user.role === 'admin' ? (
                            <>
                                <Nav.Link as={Link} to="/admin/dashboard" onClick={closeNav} className="text-uppercase fw-bold px-4 py-2 nav-hover text-danger border border-danger border-opacity-25 rounded-pill mx-2 bg-danger bg-opacity-10 d-flex align-items-center transition-all">
                                    <FaThLarge className="me-2 mb-1" /> Dashboard
                                </Nav.Link>

                                <NavDropdown
                                    title={<span className="text-uppercase fw-bold px-4 py-2 nav-hover text-white border border-light border-opacity-25 rounded-pill mx-2 bg-white bg-opacity-10 d-inline-block transition-all">View Website</span>}
                                    id="view-website-dropdown"
                                    className="admin-dropdown no-caret"
                                >
                                    <NavDropdown.Item as={Link} to="/" onClick={closeNav}>Home</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/shop" onClick={closeNav}>Shop</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/about" onClick={closeNav}>About Us</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/contact" onClick={closeNav}>Contact</NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown
                                    title={
                                        <div className="d-flex align-items-center gap-2 border border-light border-opacity-25 rounded-pill px-4 py-2 bg-white bg-opacity-10 mx-2 transition-all">
                                            {user.image ? (
                                                <img src={user.image.startsWith('http') ? user.image : `${BASE_URL}${user.image}`} alt="Profile" className="rounded-circle" style={{ width: '22px', height: '22px', objectFit: 'cover' }} />
                                            ) : (
                                                <FaUser className="text-danger" size={14} />
                                            )}
                                            <span className="text-white fw-bold text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>{user.name}</span>
                                        </div>
                                    }
                                    id="admin-profile-nav"
                                    className="admin-dropdown no-caret"
                                    align="end"
                                >
                                    <NavDropdown.Item as={Link} to="/profile" onClick={closeNav}>My Profile</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/change-password" onClick={closeNav}>Security Settings</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout} className="text-danger fw-bold">Logout System</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/" onClick={closeNav} className="text-uppercase fw-semibold px-3 nav-hover">Home</Nav.Link>
                                <Nav.Link as={Link} to="/shop" onClick={closeNav} className="text-uppercase fw-semibold px-3 nav-hover">Shop</Nav.Link>
                                <Nav.Link as={Link} to="/about" onClick={closeNav} className="text-uppercase fw-semibold px-3 nav-hover">About Us</Nav.Link>
                                <Nav.Link as={Link} to="/contact" onClick={closeNav} className="text-uppercase fw-semibold px-3 nav-hover">Contact</Nav.Link>

                                {user && user.role !== 'admin' && (
                                    <>
                                        <Nav.Link as={Link} to="/wishlist" onClick={closeNav} className="position-relative px-3 wishlist-hover">
                                            <FaHeart size={20} className="mb-1 wishlist-icon" />
                                            {wishlist?.products?.length > 0 && (
                                                <span className="position-absolute top-0 mt-1 ms-1 translate-middle badge rounded-pill bg-danger border border-dark border-2 scale-up">
                                                    {wishlist.products.length}
                                                </span>
                                            )}
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/cart" onClick={closeNav} className="position-relative px-3 nav-hover mx-2">
                                            <FaShoppingCart size={20} className="mb-1" />
                                            {cart.quantity > 0 && (
                                                <span className="position-absolute top-0 mt-1 ms-1 translate-middle badge rounded-pill bg-danger border border-dark border-2 scale-up">
                                                    {cart.quantity}
                                                </span>
                                            )}
                                        </Nav.Link>
                                    </>
                                )}

                                {brand && (
                                    <Nav.Link as={Link} to="/brand/dashboard" onClick={closeNav} className="text-uppercase fw-bold px-4 py-2 nav-hover text-danger border border-danger border-opacity-25 rounded-pill mx-2 bg-danger bg-opacity-10 d-flex align-items-center transition-all">
                                        <FaThLarge className="me-2 mb-1" /> Dashboard
                                    </Nav.Link>
                                )}

                                {brand && (
                                    <NavDropdown title={<span><FaStore className="me-2 mb-1 text-danger" /> {brand.brandName}</span>} id="brand-nav" className="ms-3 fw-bold admin-dropdown no-caret">
                                        <NavDropdown.Item as={Link} to="/brand/edit-profile" onClick={closeNav}>Brand Profile</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/brand/change-password" onClick={closeNav}>Change Password</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                )}

                                {user ? (
                                    <NavDropdown
                                        title={
                                            <span className="d-flex align-items-center">
                                                {user.image ? (
                                                    <img src={user.image.startsWith('http') ? user.image : `${BASE_URL}${user.image}`} alt="Profile" className="rounded-circle me-1" style={{ width: '25px', height: '25px', objectFit: 'cover' }} />
                                                ) : (
                                                    <FaUser className="me-2 text-danger" />
                                                )}
                                                {user.name}
                                            </span>
                                        }
                                        id="user-nav"
                                        className="ms-3 fw-bold border-start border-secondary ps-3 admin-dropdown no-caret text-uppercase"
                                    >
                                        <NavDropdown.Item as={Link} to="/profile" onClick={closeNav}>My Profile</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/myorders" onClick={closeNav}>My Orders</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/change-password" onClick={closeNav}>Change Password</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={handleLogout} className="text-danger">Logout</NavDropdown.Item>
                                    </NavDropdown>
                                ) : !brand && (
                                    <div className="d-flex gap-2">
                                        <Link to="/register" onClick={closeNav} className="btn btn-danger rounded-pill px-4 fw-bold transition-all">
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            <style>{`
                .navbar { font-family: 'Outfit', sans-serif; backdrop-filter: blur(10px); }
                .nav-hover:hover { color: #ff4d4d !important; transform: translateY(-1px); }
                .navbar-dark .navbar-nav .nav-link.wishlist-hover:hover,
                .navbar-dark .navbar-nav .nav-link.wishlist-hover:hover .wishlist-icon { color: #ff4d4d !important; }
                .wishlist-hover:hover { transform: translateY(-1px); }
                .wishlist-icon { transition: color 0.3s ease; }
                .letter-spacing-1 { letter-spacing: 1px; }
                .scale-up { animation: scaleUp 0.3s ease-out; }
                @keyframes scaleUp { 
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
                .hover-fill-danger:hover { background-color: #dc3545 !important; color: white !important; }
                .admin-dropdown .dropdown-menu { border-radius: 12px; border: none; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 10px; margin-top: 15px; }
                .admin-dropdown .dropdown-item { border-radius: 8px; padding: 10px 20px; transition: all 0.2s; font-weight: 500; }
                .admin-dropdown .dropdown-item:hover { background-color: #fff5f5; color: #dc3545; transform: translateX(5px); }
                
                /* Remove dropdown arrow */
                .no-caret.dropdown > .dropdown-toggle::after { display: none; }
                .no-caret .dropdown-toggle { padding: 0 !important; border: none !important; }
                
                .transition-all { transition: all 0.3s ease; }
                .nav-link:hover, .dropdown-toggle:hover { opacity: 0.9; }
            `}</style>
        </Navbar>
    );
};

export default NavigationBar;
