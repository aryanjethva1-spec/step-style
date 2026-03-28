import React, { useContext, useEffect, useState } from 'react';
import { Container, Nav, Button, Offcanvas } from 'react-bootstrap';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaShoppingBag, FaUserCircle, FaLock, FaSignOutAlt, FaBars, FaTimes, FaHome } from 'react-icons/fa';

const UserLayout = ({ children, title }) => {
    const { user, brand, loading: authLoading, logoutUser, logoutBrand } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (!authLoading && !user && !brand) {
            navigate('/login');
        }
    }, [user, brand, authLoading, navigate]);

    // Close offcanvas when route changes
    useEffect(() => {
        setShowMenu(false);
    }, [location.pathname]);

    const menuItems = [
        ...(user?.role !== 'admin' ? [{ path: '/myorders', icon: <FaShoppingBag />, label: 'My Orders' }] : []),
        { path: '/profile', icon: <FaUserCircle />, label: 'My Profile' },
        { path: '/change-password', icon: <FaLock />, label: 'Security Setting' },
        { path: '/', icon: <FaHome />, label: 'Back to Shop' },
    ];

    const handleLogout = async () => {
        navigate('/');
        if (user) await logoutUser();
        if (brand) await logoutBrand();
    };

    if (authLoading) return <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>;
    if (!user && !brand) return null;

    const currentUser = user || brand;

    const SidebarContent = () => (
        <div className="p-4 d-flex flex-column min-vh-100">
            <div className="text-center border-bottom border-light border-opacity-25 pb-4 mb-4">
                <div className="bg-white rounded-circle d-inline-flex p-3 mb-2 shadow-sm">
                    {currentUser.image ? (
                        <img 
                            src={currentUser.image.startsWith('http') ? currentUser.image : `http://localhost:5000${currentUser.image}`} 
                            alt="Profile" 
                            className="rounded-circle" 
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                        />
                    ) : (
                        <FaUserCircle className="text-danger fs-4" />
                    )}
                </div>
                <h4 className="fw-bold mb-0 text-truncate px-2">{currentUser.name || currentUser.brandName}</h4>
                <small className="opacity-75 text-uppercase" style={{ fontSize: '10px', letterSpacing: '1px' }}>Customer Account</small>
            </div>

            <Nav className="flex-column gap-2 mb-auto user-nav">
                {menuItems.map((item) => (
                    <Nav.Item key={item.path}>
                        <Nav.Link
                            as={Link}
                            to={item.path}
                            className={`d-flex align-items-center rounded-3 p-3 transition-all ${location.pathname === item.path ? 'active-link' : ''}`}
                        >
                            <span className="me-3 fs-5 d-flex">{item.icon}</span>
                            <span className="fw-semibold">{item.label}</span>
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>

            <div className="mt-4 pt-4 border-top border-light border-opacity-25 pb-5">
                <Button
                    variant="light"
                    className="w-100 fw-bold rounded-pill p-3 shadow-sm border-0 text-danger d-flex align-items-center justify-content-center gap-2 mb-5"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt /> Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="user-wrapper d-flex flex-column flex-md-row min-vh-100 bg-light">
            {/* Mobile Top Bar */}
            <div className="d-md-none bg-dark text-white px-3 py-2 d-flex align-items-center justify-content-between sticky-top shadow" style={{ zIndex: 1020, top: '76px' }}>
                <div className="d-flex align-items-center gap-2 text-truncate pe-3">
                    <FaUserCircle size={20} className="text-danger" />
                    <span className="fw-bold text-truncate">{currentUser.name || currentUser.brandName}</span>
                </div>
                <Button variant="link" className="text-white p-1" onClick={() => setShowMenu(true)}>
                    <FaBars size={22} />
                </Button>
            </div>

            {/* Mobile Offcanvas Sidebar */}
            <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="start" className="bg-dark text-white" style={{ maxWidth: '280px' }}>
                <Offcanvas.Header className="border-bottom border-light border-opacity-25">
                    <Offcanvas.Title className="fw-bold">Account Menu</Offcanvas.Title>
                    <Button variant="link" className="text-white ms-auto p-0" onClick={() => setShowMenu(false)}>
                        <FaTimes size={20} />
                    </Button>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                    <SidebarContent />
                </Offcanvas.Body>
            </Offcanvas>

            {/* Desktop Sidebar */}
            <aside className="user-sidebar bg-dark text-white shadow-lg d-none d-md-flex flex-column"
                   style={{
                       flex: '0 0 280px',
                       minWidth: '280px',
                       maxWidth: '280px',
                       height: 'calc(100vh - 80px)',
                       position: 'sticky',
                       top: '80px',
                       zIndex: 1000,
                       overflowY: 'auto'
                   }}>
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow-1 p-0 overflow-auto" style={{ overflowX: 'hidden', minWidth: 0 }}>
                <Container fluid className="p-0">
                    {title && (
                        <div className="d-flex align-items-center gap-3 p-4 p-md-5 pb-0">
                            <div className="bg-danger rounded-pill" style={{ width: '6px', height: '36px' }}></div>
                            <h1 className="fw-bold mb-0 text-dark" style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', letterSpacing: '-0.5px' }}>{title}</h1>
                        </div>
                    )}
                    <div className="content-body">
                        {children}
                    </div>
                </Container>
            </main>

            <style>{`
                .user-nav .nav-link {
                    color: rgba(255, 255, 255, 0.8) !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 12px !important;
                }
                .user-nav .nav-link:hover {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                    transform: translateX(4px);
                    color: white !important;
                }
                .user-nav .nav-link.active-link {
                    background-color: #dc3545 !important;
                    color: white !important;
                    font-weight: 700 !important;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
                }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </div>
    );
};

export default UserLayout;
